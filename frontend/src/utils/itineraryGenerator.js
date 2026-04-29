
import { calculateBudget } from './budgetCalculator';
import { API_URL } from '../config/api';

/**
 * Shuffle an array safely.
 */
const shuffleArray = (array) => [...array].sort(() => 0.5 - Math.random());

/**
 * Generate a basic day-by-day travel plan based on state and days.
 *
 * @param {{ stateSlug: string, days: number, style: 'budget'|'standard'|'premium' }} params
 * @returns {Array<{ day: number, title: string, description: string, locations: Array<object>, costs: object }>}
 */
export const generateItinerary = async ({ stateSlug, days, style }) => {
  if (!stateSlug || !days) return [];

  // Fetch live destinations array dynamically mapped to the state
  let stateDestinations = [];
  try {
    const res = await fetch(`${API_URL}/destinations`);
    const json = await res.json();
    if (json.success && json.data) {
       stateDestinations = json.data.filter(d => d.state === stateSlug || (d.state && d.state.toLowerCase().replace(/[^a-z0-9]+/g, '-') === stateSlug));
    }
  } catch (err) {
    console.error('Itinerary Gen destination fetch failed:', err);
  }

  // Randomly shuffle destinations for variety
  const mixedPlaces = [
    ...shuffleArray(stateDestinations),
  ];

  // We need roughly 2 places per day max if possible
  const totalPlacesNeeded = Math.min(days * 2, mixedPlaces.length);
  const selectedPlaces = mixedPlaces.slice(0, Math.max(days, totalPlacesNeeded));

  // Get base budget calculation for 1 person for the trip
  const budget = calculateBudget({ stateSlug, days, travelers: 1, style });

  // Generate the day-by-day array
  const itinerary = [];
  let placeIndex = 0;

  for (let i = 1; i <= days; i++) {
    // Distribute places: usually 1-2 per day depending on availability
    const placesForToday = [];
    if (placeIndex < selectedPlaces.length) {
      placesForToday.push(selectedPlaces[placeIndex++]);
    }
    // Add a second place if we have enough left proportionally
    if (placeIndex < selectedPlaces.length && selectedPlaces.length - placeIndex >= days - i) {
      placesForToday.push(selectedPlaces[placeIndex++]);
    }

    // Determine a dynamic title/description
    let title = `Day ${i}: Local Exploration`;
    let description = 'Spend the day discovering local culture and food.';

    if (i === 1) {
      title = `Day 1: Arrival & Acclimatization`;
      if (placesForToday.length > 0) {
        description = `Arrive, settle in, and gently explore ${placesForToday[0].name}.`;
      }
    } else if (i === days) {
      title = `Day ${days}: Final Highlights & Departure`;
      description = 'Wrap up your trip with some souvenir shopping and final sightseeing before heading home.';
    } else if (placesForToday.length > 0) {
      const names = placesForToday.map(p => p.name).join(' and ');
      title = `Day ${i}: Discovering ${names}`;
      description = `A full day dedicated to experiencing the best of ${names}.`;
    }

    // Allocate rough daily budget numbers (the actual math is simple division for this mock, 
    // but in a real app, day 1 transport might be higher for flights etc.)
    const dailyCosts = {
      stay: budget.perDay.stay,
      food: budget.perDay.food,
      transport: budget.perDay.transport,
      sightseeing: budget.perDay.sightseeing,
      extras: budget.perDay.extras,
      total: budget.perDayTotal,
    };

    itinerary.push({
      day: i,
      title,
      description,
      locations: placesForToday,
      costs: dailyCosts,
    });
  }

  return itinerary;
};
