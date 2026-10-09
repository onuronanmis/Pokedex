const PAGE_SIZE = 20;
const API_BASE = 'https://pokeapi.co/api/v2';
const pokemonCache = new Map();
const speciesCache = new Map();
const evolutionCache = new Map();
const typeCache = new Map();
const TYPE_COLORS = {normal:'#8d96a0',fire:'#ef7847',water:'#4b91db',electric:'#e9b832',grass:'#56aa79',ice:'#70c8d1',fighting:'#cb6158',poison:'#a467c1',ground:'#c69b5b',flying:'#869ed8',psychic:'#e574a5',bug:'#8aa74b',rock:'#a99b72',ghost:'#7468ac',dragon:'#6365c8',dark:'#596072',steel:'#759aa7',fairy:'#d98eb8'};
const TYPES = Object.keys(TYPE_COLORS);
async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API request failed (${response.status})`);
    return response.json();
}

async function getPokemon(id) {
    const key = String(id).toLowerCase();
    if (!pokemonCache.has(key)) pokemonCache.set(key, fetchJson(`${API_BASE}/pokemon/${key}`));
    try { return await pokemonCache.get(key); }
    catch (error) { pokemonCache.delete(key); throw error; }
}

async function getSpecies(id) {
    if (!speciesCache.has(id)) speciesCache.set(id, fetchJson(`${API_BASE}/pokemon-species/${id}`));
    try { return await speciesCache.get(id); }
    catch (error) { speciesCache.delete(id); throw error; }
}

async function getEvolution(url) {
    if (!evolutionCache.has(url)) evolutionCache.set(url, fetchJson(url));
    try { return await evolutionCache.get(url); }
    catch (error) { evolutionCache.delete(url); throw error; }
}

async function getTypeIds(type) {
    if (!typeCache.has(type)) typeCache.set(type, fetchJson(`${API_BASE}/type/${type}`));
    try { return (await typeCache.get(type)).pokemon.map(item => Number(item.pokemon.url.split('/').filter(Boolean).pop())).filter(id => id <= 1025).sort((a,b)=>a-b); }
    catch (error) { typeCache.delete(type); throw error; }
}
