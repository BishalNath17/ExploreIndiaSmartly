/**
 * Hotel Search Controller
 * Proxies requests to RapidAPI Booking.com endpoint.
 * Keeps API key safe on the server — never exposed to the frontend.
 */

/**
 * Helper — build RapidAPI fetch options
 */
const getHeaders = () => ({
  'x-rapidapi-key': process.env.RAPIDAPI_KEY,
  'x-rapidapi-host': process.env.RAPIDAPI_HOST || 'booking-com15.p.rapidapi.com',
});

// Map states or broad regions to explicit searchable cities for Booking.com
const STATE_FALLBACK_MAP = {
  'tripura': 'Agartala',
  'sikkim': 'Gangtok',
  'meghalaya': 'Shillong',
  'manipur': 'Imphal',
  'mizoram': 'Aizawl',
  'nagaland': 'Kohima',
  'arunachal pradesh': 'Tawang',
  'arunachal': 'Tawang',
  'assam': 'Guwahati',
  'andaman': 'Port Blair',
  'andaman and nicobar': 'Port Blair',
  'lakshadweep': 'Kavaratti',
};

const BASE_FALLBACK_HOTELS = [
  {
    name: 'Taj Signature Resort & Spa',
    price: 12499,
    rating: 9.6,
    reviewCount: 428,
    reviewWord: 'Exceptional',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stars: 5,
    location: 'Premium Zone'
  },
  {
    name: 'The Heritage Boutique Hotel',
    price: 5200,
    rating: 8.8,
    reviewCount: 156,
    reviewWord: 'Excellent',
    image: 'https://images.unsplash.com/photo-1542314831-c6a4d14b4cc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stars: 4,
    location: 'City Center'
  },
  {
    name: 'Nature Eco Retreat',
    price: 3800,
    rating: 9.1,
    reviewCount: 89,
    reviewWord: 'Wonderful',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stars: 3,
    location: 'Scenic View'
  },
  {
    name: 'Backpacker Central Hostel',
    price: 999,
    rating: 8.2,
    reviewCount: 312,
    reviewWord: 'Very Good',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stars: 0,
    location: 'Downtown'
  }
];

// Generate a large fallback dataset of 60 items so pagination "Load More" functionality is fully retained in UI
const FALLBACK_HOTELS = Array.from({ length: 60 }).map((_, i) => {
  const base = BASE_FALLBACK_HOTELS[i % 4];
  const priceVariation = Math.floor(Math.random() * 2000) - 1000;
  return {
    id: `fb-${i + 1}`,
    name: `${base.name} ${i > 3 ? `(Annex ${Math.floor(i/4)})` : ''}`,
    price: `₹${(base.price + priceVariation).toLocaleString('en-IN')}`,
    rating: (Math.max(6.0, base.rating - (Math.random() * 1.5))).toFixed(1),
    reviewCount: Math.floor(base.reviewCount + (Math.random() * 500)),
    reviewWord: base.reviewWord,
    image: base.image,
    stars: base.stars,
    location: base.location
  };
});

/**
 * Step 1: Resolve a city name to a Booking.com dest_id + search_type.
 */
const resolveDestination = async (city) => {
  const host = process.env.RAPIDAPI_HOST || 'booking-com15.p.rapidapi.com';
  
  // Normalize and check against state fallback map
  const normalizedInput = city.trim().toLowerCase();
  const searchCity = STATE_FALLBACK_MAP[normalizedInput] || city.trim();

  const url = `https://${host}/api/v1/hotels/searchDestination?query=${encodeURIComponent(searchCity)}`;
  console.log(`[hotel] resolveDestination → Originally "${city}", querying "${searchCity}"`);

  const res = await fetch(url, { method: 'GET', headers: getHeaders() });
  const json = await res.json();

  if (!json?.data?.length) {
    return { errorRaw: json };
  }

  // Prefer the first result (most relevant)
  const top = json.data[0];
  return {
    dest_id: top.dest_id,
    search_type: top.search_type,
    name: top.name || city,
    label: top.label || city,
  };
};

/**
 * Step 2: Fetch hotels for a resolved dest_id.
 */
const fetchHotels = async (dest_id, search_type, arrival, departure, page = '1') => {
  const params = new URLSearchParams({
    dest_id,
    search_type,
    arrival_date: arrival,
    departure_date: departure,
    adults: '2',
    room_qty: '1',
    currency_code: 'INR',
    languagecode: 'en-us',
    page_number: page,
  });

  const host = process.env.RAPIDAPI_HOST || 'booking-com15.p.rapidapi.com';
  const url = `https://${host}/api/v1/hotels/searchHotels?${params}`;
  console.log('[hotel] fetchHotels →', url);

  const res = await fetch(url, { method: 'GET', headers: getHeaders() });
  return res.json();
};

/**
 * GET /api/v1/hotels/search?city=Delhi
 *
 * Public endpoint consumed by the React frontend.
 */
exports.searchHotels = async (req, res) => {
  try {
    const { city, page_number } = req.query;
    const page = page_number || '1';

    if (!city || !city.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a city name.',
      });
    }

    const apiKey = process.env.RAPIDAPI_KEY;

    // Verify API key is configured
    if (!apiKey) {
      console.error('[hotel] RAPIDAPI_KEY is missing from environment variables');
      return res.status(500).json({
        success: false,
        message: 'Hotel search service is not configured. Please add RAPIDAPI_KEY to your environment.',
      });
    }

    // Step 1 — resolve city → dest_id
    const destination = await resolveDestination(city);
    
    // Check if the RapidAPI quota is exceeded or API returned a hard error.
    if (destination && destination.errorRaw && destination.errorRaw.message && destination.errorRaw.message.includes('exceeded')) {
      console.warn(`[hotel] RapidAPI Quota Exceeded. Returning graceful UI fallback hotels for "${city}" (Page ${page}).`);
      
      // Simulate real pagination mathematically over the mock dataset
      const pageIndex = parseInt(page, 10);
      const limit = 20;
      const startIndex = (pageIndex - 1) * limit;
      const paginatedMock = FALLBACK_HOTELS.slice(startIndex, startIndex + limit);
      const hasNextPage = (startIndex + limit) < FALLBACK_HOTELS.length;

      return res.status(200).json({
        success: true,
        city: STATE_FALLBACK_MAP[city.trim().toLowerCase()] || city.trim(),
        dest_id: 'fallback-quota',
        count: paginatedMock.length,
        page: pageIndex,
        hasMore: hasNextPage,
        quotaExceeded: true,
        isFallback: true,
        data: paginatedMock,
      });
    }

    if (!destination || destination.errorRaw) {
      return res.status(404).json({
        success: false,
        message: `Could not find destination "${city}". Please try another city.`,
        rapidApiDebug: destination?.errorRaw
      });
    }

    // Build dates — tomorrow + day after
    const today = new Date();
    const arrival = new Date(today);
    arrival.setDate(today.getDate() + 1);
    const departure = new Date(today);
    departure.setDate(today.getDate() + 2);

    const fmt = (d) => d.toISOString().split('T')[0]; // YYYY-MM-DD

    // Step 2 — search hotels
    const hotelsData = await fetchHotels(
      destination.dest_id,
      destination.search_type,
      fmt(arrival),
      fmt(departure),
      page
    );

    // Normalise the response for the frontend
    const hotels = (hotelsData?.data?.hotels || []).map((h) => ({
      id: h.hotel_id || h.property?.id,
      name: h.property?.name || 'Unknown Hotel',
      price: h.property?.priceBreakdown?.grossPrice?.value
        ? `₹${Math.round(h.property.priceBreakdown.grossPrice.value)}`
        : null,
      rating: h.property?.reviewScore || null,
      reviewCount: h.property?.reviewCount || 0,
      reviewWord: h.property?.reviewScoreWord || '',
      image: h.property?.photoUrls?.[0]
        ? h.property.photoUrls[0].replace('square60', 'square600')
        : null,
      checkIn: h.property?.checkinDate || fmt(arrival),
      checkOut: h.property?.checkoutDate || fmt(departure),
      url: h.property?.url || null,
      stars: h.property?.propertyClass || 0,
      location: h.property?.wishlistName || '',
    }));

    console.log(`[hotel] Found ${hotels.length} hotels for "${city}" on page ${page}`);

    res.status(200).json({
      success: true,
      city: destination.name,
      dest_id: destination.dest_id,
      count: hotels.length,
      page: parseInt(page, 10),
      hasMore: hotels.length === 20, // Booking.com usually returns 20 per page via this endpoint
      data: hotels,
    });
  } catch (error) {
    console.error('[hotel] searchHotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while searching for hotels. Please try again later.',
    });
  }
};
