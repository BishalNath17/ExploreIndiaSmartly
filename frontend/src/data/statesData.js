import statesJson from './json/states.json';
import mapEmbedsJson from './json/stateMapEmbeds.json';

export const stateImages = statesJson.reduce((acc, state) => {
  acc[state.id] = state.image;
  return acc;
}, {});

export const statesData = statesJson;
export const stateMapEmbeds = mapEmbedsJson;
