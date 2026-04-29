const Destination = require('../models/Destination');
const AuditLog = require('../models/AuditLog');

exports.getDestinations = async (req, res, next) => {
  try {
    const { state } = req.query;
    const filter = state ? { state: state.toLowerCase() } : {};
    const destinations = await Destination.find(filter).sort({ createdAt: -1 });
    console.log("Total destinations:", destinations.length);
    res.json({ success: true, message: 'Destinations retrieved successfully', data: destinations });
  } catch (error) {
    next(error);
  }
};

exports.getDestinationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Try slug-based id first, then MongoDB ObjectId
    let dest = await Destination.findOne({ id });
    if (!dest && id.match(/^[0-9a-fA-F]{24}$/)) {
      dest = await Destination.findById(id);
    }
    if (!dest) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.json({ success: true, data: dest });
  } catch (error) {
    next(error);
  }
};

// NOTE: createDestination, updateDestination, deleteDestination are defined
// at the bottom of this file with proper local disk + Cloudinary dual-mode support.

exports.importTripura = async (req, res, next) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Read from the bundled data directory inside backend/
    const filePath = path.resolve(__dirname, '../../data/tripura_destinations.json');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Tripura JSON file not found in backend/data/' });
    }
    
    const rawData = fs.readFileSync(filePath, 'utf8');
    const destinations = JSON.parse(rawData);
    const toSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    let inserted = 0;
    let updated = 0;

    for (const dest of destinations) {
      const id = `${toSlug(dest.name)}-tripura`;
      const doc = {
        id,
        name: dest.name,
        state: 'tripura',
        district: dest.district || '',
        description: dest.description || '',
        whyFamous: Array.isArray(dest.highlights) ? dest.highlights.join(' | ') : '',
        location: dest.district ? `${dest.district}, Tripura` : 'Tripura',
        rating: 4.5,
      };

      const result = await Destination.findOneAndUpdate(
        { id },
        { $set: doc },
        { upsert: true, new: true }
      );

      if (result.createdAt && result.updatedAt &&
          result.createdAt.getTime() === result.updatedAt.getTime()) {
        inserted++;
      } else {
        updated++;
      }
    }
    
    res.json({ success: true, count: destinations.length, inserted, updated, message: 'Imported successfully' });
  } catch (error) {
    next(error);
  }
};

exports.importAiDestinations = async (req, res, next) => {
  try {
    const { state, batchId, importScriptVersion, destinations, dryRun } = req.body;
    
    if (!state || !destinations || !Array.isArray(destinations)) {
      return res.status(400).json({ success: false, message: 'Invalid payload structured. Need state and destinations array.' });
    }

    const results = {
      state,
      batchId,
      generated: destinations.length,
      inserted: 0,
      merged: 0,
      skippedDuplicates: 0,
      flaggedForReview: 0,
      failed: 0,
      dryRun: !!dryRun
    };

    // Idempotency: Bypass identical batches safely
    if (batchId && !dryRun) {
       const existingBatch = await Destination.findOne({ 'aiMetadata.generationBatch': batchId, state: state.toLowerCase() });
       if (existingBatch) {
         console.warn(`[API] AI Batch [${batchId}] previously parsed. Bypassing idempotently.`);
         return res.json({ success: true, message: 'Chunk already processed', ...results, skippedDuplicates: destinations.length });
       }
    }

    // Token math extraction mapping
    const getTokens = (str) => {
      if (!str) return new Set();
      return new Set(str.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2));
    };

    const normalize = (str) => str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

    // Haversine vector tracking logic
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      if (!lat1 || !lon1 || !lat2 || !lon2) return null;
      const R = 6371; 
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    };

    const existingDestinations = await Destination.find({ state: state.toLowerCase() });

    for (const dest of destinations) {
      if (!dest.name || !dest.primaryCategory) {
        results.failed++;
        continue;
      }

      let isDuplicate = false;
      let reviewFlagged = false;
      let dedupConfidence = 100;
      let mergeTarget = null;

      const destNameNorm = normalize(dest.name);
      const destTokens = getTokens(dest.name);
      const destAliases = Array.isArray(dest.aliases) ? dest.aliases.map(normalize) : [];
      const canonSlug = destNameNorm + normalize(state) + normalize(dest.city) + normalize(dest.primaryCategory);

      // Deep cross-reference safety loops
      for (const existing of existingDestinations) {
        let similarityScore = 0;
        const existNameNorm = normalize(existing.name);
        const existCanonSlug = existNameNorm + normalize(existing.state) + normalize(existing.city) + normalize(existing.primaryCategory);
        const existAliases = Array.isArray(existing.aliases) ? existing.aliases.map(normalize) : [];

        // 1. Direct structural match
        if (destNameNorm === existNameNorm || canonSlug === existCanonSlug) {
           similarityScore += 90;
        }

        // 2. Alias integration
        if (existAliases.includes(destNameNorm) || destAliases.includes(existNameNorm)) {
           similarityScore += 80;
        }

        // 3. Token math fuzzy intersection parsing
        const existTokens = getTokens(existing.name);
        if (destTokens.size > 0 && existTokens.size > 0) {
           const intersection = new Set([...destTokens].filter(x => existTokens.has(x)));
           if (intersection.size === destTokens.size || intersection.size === existTokens.size) {
              similarityScore += 70;
           } else if (intersection.size >= 2) {
              similarityScore += 40;
           }
        }

        // 4. Geo-Distance safety validation (High priority match)
        if (dest.coordinates?.lat && existing.coordinates?.lat) {
           const dist = calculateDistance(dest.coordinates.lat, dest.coordinates.lng, existing.coordinates.lat, existing.coordinates.lng);
           if (dist !== null && dist <= 2.0) {
              similarityScore += 50; 
           } else if (dist !== null && dist < 10.0) {
              similarityScore += 20;
           }
        }

        if (similarityScore >= 90) {
          isDuplicate = true;
          mergeTarget = existing;
          dedupConfidence = similarityScore;
          break; // Stop checking further, it's a confirmed clone
        } else if (similarityScore >= 60) {
          isDuplicate = false;
          reviewFlagged = true; // Unsafe insert, flags for strict human review natively
          if (similarityScore > dedupConfidence || dedupConfidence === 100) dedupConfidence = similarityScore;
        } else {
          if (similarityScore > dedupConfidence || dedupConfidence === 100) dedupConfidence = similarityScore;
        }
      }

      if (isDuplicate) {
        // Safe Merge override logic
        if (!dryRun && mergeTarget) {
           let updatedFields = [];
           
           if (!mergeTarget.primaryCategory && dest.primaryCategory) { mergeTarget.primaryCategory = dest.primaryCategory; updatedFields.push('primaryCategory'); }
           if (!mergeTarget.coordinates && dest.coordinates) { mergeTarget.coordinates = dest.coordinates; updatedFields.push('coordinates'); }
           
           if (updatedFields.length > 0) {
             mergeTarget.reviewHistory.push({ action: 'merged', notes: `AI metadata enriched fields: ${updatedFields.join(', ')}` });
             mergeTarget.mergeMetadata = { mergedFields: updatedFields, mergedAt: new Date() };
             await mergeTarget.save();
             results.merged++;
             
             await AuditLog.create({
                type: 'merged-enrichment',
                batchId,
                destinationName: dest.name,
                reason: `Injected missing structural fields natively: ${updatedFields.join(', ')}`,
                score: dedupConfidence,
                metadata: { destinationId: mergeTarget.id }
             });
             
           } else {
             results.skippedDuplicates++;
             await AuditLog.create({
                type: 'skipped-duplicate',
                batchId,
                destinationName: dest.name,
                reason: `100% Structural Deduplication block triggered. Dropping node automatically.`,
                score: dedupConfidence,
                metadata: { targetSkippedAgainst: mergeTarget.id }
             });
           }
        } else {
           results.skippedDuplicates++;
        }
        continue; // Critical loop break
      }

      const toSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const baseId = `${toSlug(dest.name)}-${toSlug(state)}`;
      
      // Enforce `pending-review` strictly for ALL injected AI batches
      const finalStatus = 'pending-review';

      const newDoc = {
        id: baseId,
        name: dest.name,
        state: state.toLowerCase(),
        district: dest.city || dest.district || '',
        city: dest.city || '',
        location: dest.city ? `${dest.city}, ${state}` : state,
        description: dest.description || '',
        whyFamous: dest.highlights ? (Array.isArray(dest.highlights) ? dest.highlights.join(' | ') : dest.highlights) : '',
        rating: typeof dest.rating === 'number' ? dest.rating : 4.5,
        primaryCategory: dest.primaryCategory || '',
        secondaryCategories: dest.secondaryCategories || [],
        aliases: dest.aliases || [],
        coordinates: dest.coordinates || null,
        status: finalStatus,
        dedupConfidenceScore: dedupConfidence === 100 ? 0 : dedupConfidence, // Clean defaults 0 if no overlapping vectors matched
        source: 'ai-generated',
        aiMetadata: {
           generationBatch: batchId,
           generatedAt: new Date(),
           importScriptVersion: importScriptVersion || 'v1'
        }
      };

      if (!dryRun) {
          const created = new Destination(newDoc);
          await created.save();
          if (reviewFlagged) results.flaggedForReview++;
          else results.inserted++;
          existingDestinations.push(created);
      } else {
          if (reviewFlagged) results.flaggedForReview++;
          else results.inserted++;
          existingDestinations.push({ name: dest.name, state: state.toLowerCase() }); 
      }
    }

    res.status(200).json({ success: true, ...results });
  } catch (error) {
    next(error);
  }
};

// --- ADMIN REVIEW DASHBOARD ROUTES ---

exports.approveDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminUser = req.user?.username || req.user?.id || 'Admin Panel';
    let dest = await Destination.findOneAndUpdate(
       { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] }, 
       { 
         status: 'published',
         $push: { reviewHistory: { action: 'approved', by: adminUser, notes: 'Manually verified via Review Dashboard.' } }
       }, 
       { new: true }
    );
    if (!dest) return res.status(404).json({ success: false, message: 'Destination not found' });
    res.json({ success: true, message: 'Approved cleanly', data: dest });
  } catch (error) {
    next(error);
  }
};

exports.rejectDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminUser = req.user?.username || req.user?.id || 'Admin Panel';
    // Soft Delete Implementation: Protects database integrity locally!
    let dest = await Destination.findOneAndUpdate(
       { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
       { 
         status: 'rejected',
         $push: { reviewHistory: { action: 'rejected', by: adminUser, notes: 'Manually soft-deleted via Review Dashboard.' } }
       },
       { new: true }
    );
    if (!dest) return res.status(404).json({ success: false, message: 'Destination not found' });
    res.json({ success: true, message: 'Destination successfully soft-deleted (Rejected).' });
  } catch (error) {
    next(error);
  }
};

exports.bulkApprove = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) return res.status(400).json({ success: false, message: 'Invalid payload.' });
    
    const adminUser = req.user?.username || req.user?.id || 'Admin Panel';
    const existingTargets = await Destination.find({ $or: [{ id: { $in: ids } }, { _id: { $in: ids.filter(i => i.match(/^[0-9a-fA-F]{24}$/)) } }] });
    const foundIds = existingTargets.map(t => t.id);
    const missingIds = ids.filter(id => !foundIds.includes(id));
    
    await Destination.updateMany(
      { id: { $in: foundIds } }, 
      { 
        status: 'published',
        $push: { reviewHistory: { action: 'approved', by: adminUser, notes: 'Bulk verification system flow.' } }
      }
    );
    res.json({ 
       success: true, 
       totalRequested: ids.length,
       successCount: foundIds.length,
       failedCount: missingIds.length,
       failedIds: missingIds,
       message: `Bulk operation finished: ${foundIds.length} approved, ${missingIds.length} missing.` 
    });
  } catch (error) {
    next(error);
  }
};

exports.bulkReject = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) return res.status(400).json({ success: false, message: 'Invalid payload.' });
    
    const adminUser = req.user?.username || req.user?.id || 'Admin Panel';
    const existingTargets = await Destination.find({ $or: [{ id: { $in: ids } }, { _id: { $in: ids.filter(i => i.match(/^[0-9a-fA-F]{24}$/)) } }] });
    const foundIds = existingTargets.map(t => t.id);
    const missingIds = ids.filter(id => !foundIds.includes(id));

    await Destination.updateMany(
      { id: { $in: foundIds } }, 
      { 
        status: 'rejected',
        $push: { reviewHistory: { action: 'rejected', by: adminUser, notes: 'Bulk soft-delete execution.' } }
      }
    );
    res.json({ 
       success: true, 
       totalRequested: ids.length,
       successCount: foundIds.length,
       failedCount: missingIds.length,
       failedIds: missingIds,
       message: `Bulk soft-reject finished: ${foundIds.length} disabled safely.` 
    });
  } catch (error) {
    next(error);
  }
};

exports.rollbackBatch = async (req, res, next) => {
  try {
    const { batchId } = req.body;
    if (!batchId) return res.status(400).json({ success: false, message: 'Invalid generationBatch key.' });

    // Restrict purge: only erase nodes explicitly flagged AI-generated, tagged inside the identical batch, and NOT actively 'published'
    const rollbackFilter = { 
       'aiMetadata.generationBatch': batchId,
       'source': 'ai-generated',
       $or: [{ status: 'pending-review' }, { status: 'rejected' }]
    };
    
    // Count exact target models affected for auditing traces
    const targetCount = await Destination.countDocuments(rollbackFilter);

    // Physical purge mapping executed
    const deletionResult = await Destination.deleteMany(rollbackFilter);
    
    const adminUser = req.user?.username || req.user?.id || 'Admin Panel';
    
    await AuditLog.create({
       type: 'rollback-batch',
       batchId,
       destinationName: 'ALL_NODES',
       reason: `Administrative physical wipe of batch executed by ${adminUser}. Erased exactly ${targetCount} unprotected entities.`,
       score: 0,
       metadata: { deletedCount: deletionResult.deletedCount, protectedMatches: 0 }
    });
    
    res.json({ success: true, message: `Batch ${batchId} safely rolled back! ${deletionResult.deletedCount} physical non-published AI nodes purged.` });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// MANUAL CMS PUBLISHING ROUTES (Admin Panel)
// ==========================================

exports.createDestination = async (req, res, next) => {
  try {
    const data = { ...req.body, source: 'manual', status: 'published' };
    
    // Auto-generate a fallback slug mapping if missing
    if (!data.id && data.name) {
      const statePart = data.state || 'india';
      data.id = `${data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${statePart.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    }

    // Safely capture Cloudinary stream arrays or process local path redirects
    if (req.file) {
      if (req.file.path && req.file.path.startsWith('http')) {
        data.image = req.file.path; // Cloudinary secure URL
      } else if (req.file.filename) {
        data.image = `/images/destinations/${req.file.filename}`; // Direct Native mapping bypassing the OS path string 
      }
    }

    // Force unique ID safely, fail normally if duplicated
    const existing = await Destination.findOne({ id: data.id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A destination with this mapped ID or Name already exists.' });
    }

    const newDest = await Destination.create(data);
    res.status(201).json({ success: true, message: 'Destination successfully published!', data: newDest });
  } catch (err) {
    next(err);
  }
};

exports.updateDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Prevent invalid reviewHistory from overriding and crashing validation
    if ('reviewHistory' in updateData && !Array.isArray(updateData.reviewHistory)) {
      delete updateData.reviewHistory;
    }

    // Capture newest Cloudinary replacement natively or Local paths
    if (req.file) {
      console.log('Incoming Uploaded File:', req.file);
      if (req.file.path && req.file.path.startsWith('http')) {
        updateData.image = req.file.path; 
      } else if (req.file.filename) {
        updateData.image = `/images/destinations/${req.file.filename}`;
      }
      console.log('Mapped Image Update Value:', updateData.image);
    }

    const updated = await Destination.findOneAndUpdate(
      { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Destination not found in database.' });
    }

    res.json({ success: true, message: 'Destination successfully updated!', data: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Destination.findOneAndDelete({
       $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    });

    if (!deleted) {
       return res.status(404).json({ success: false, message: 'Destination target already missing.' });
    }

    res.json({ success: true, message: 'Destination physically wiped from framework.' });
  } catch (err) {
    next(err);
  }
};
