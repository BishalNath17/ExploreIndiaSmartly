const fetch = require('node-fetch'); // Native fetch inside Node 18+ natively

async function runRollback() {
  const BATCH_ID = process.argv[2] || 'seed-batch-v1-002';
  const API_URL = 'http://127.0.0.1:5000/api/v1/admin/destinations/rollback';

  console.log(`\n======================================`);
  console.log(`🧹 AI ROLLBACK TOOL`);
  console.log(`Target Batch: ${BATCH_ID}`);
  console.log(`======================================\n`);

  try {
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dummy-admin-token'
      },
      body: JSON.stringify({ batchId: BATCH_ID })
    });

    const json = await resp.json();
    
    if (json.success) {
      console.log(`✅ ROLLBACK SUCCESS:`);
      console.log(json.message);
    } else {
      console.log(`❌ ROLLBACK FAILED:`);
      console.log(json.message);
    }
  } catch(e) {
    console.error(`💥 Execution Error:`, e.message);
  }
}

runRollback();
