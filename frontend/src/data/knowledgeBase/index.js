/**
 * Knowledge Base Registry
 * 
 * Auto-imports all *.json files in this directory using Vite's
 * import.meta.glob. Each state's data is keyed by its `id` field
 * (e.g. "andhra-pradesh", "goa").
 * 
 * Usage:
 *   import { getStateKnowledge } from '../data/knowledgeBase';
 *   const data = getStateKnowledge('andhra-pradesh');
 */

const modules = import.meta.glob('./*.json', { eager: true });

const knowledgeBase = {};

for (const path in modules) {
  const data = modules[path].default || modules[path];
  if (data && data.id) {
    knowledgeBase[data.id] = data;
  }
}

/**
 * Get structured knowledge base data for a state by its slug/id.
 * @param {string} stateId — e.g. "andhra-pradesh"
 * @returns {object|null}
 */
export function getStateKnowledge(stateId) {
  return knowledgeBase[stateId] || null;
}

export default knowledgeBase;
