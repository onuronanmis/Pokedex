let nextId = 1;
let visibleIds = [];
let activeIds = [];
let activeType = '';
let activeSearch = '';
let searchIds = [];
let searchListCache = null;
let currentPokemonId = null;
let isShiny = false;
let isLoading = false;
let dialogToken = 0;
const $ = id => document.getElementById(id);

function init() {
    applyStaticTexts();
    buildTypeMenu(); 
    initEvents(); 
    applyType('all');
}

function setLoading(value) {
    isLoading = value;
    $('loadingIndicator').hidden = !value;
    $('loadMoreButton').disabled = value;
    $('searchButton').disabled = value;
}

function showError(message) {
    $('notFoundContainer').innerHTML = `<p class="not-found" data-id="not-found">${escapeHtml(message)}</p>`;
}

function clearResults() {
    visibleIds = [];
    $('pokemonList').innerHTML = '';
    $('notFoundContainer').innerHTML = '';
}

function updateCounter() {
    $('pokemonCounter').textContent = `${visibleIds.length} ${translateText('counter')}`;
    $('loadMoreButton').hidden = activeSearch ? visibleIds.length >= searchIds.length : (activeType ? visibleIds.length >= activeIds.length : nextId > 1025);
}

function renderPokemon(pokemonList) {
    $('pokemonList').insertAdjacentHTML('beforeend',pokemonList.map(cardTemplate).join(''));
    visibleIds.push(...pokemonList.map(p=>p.id));
    updateCounter();
}

async function fetchBatch(ids) {
    const results = await Promise.allSettled(ids.map(getPokemon));
    const successes = results.filter(r=>r.status==='fulfilled').map(r=>r.value);
    if (successes.length !== ids.length) showError(translateText('partialError'));
    await Promise.all(successes.map(localizePokemon));
    return successes;
}

async function loadMorePokemon() {
    if (isLoading) return;
    const ids = nextBatchIds();
    if (!ids.length) { updateCounter(); return; }
    setLoading(true);
    try { renderPokemon(await fetchBatch(ids)); if (!activeSearch && !activeType) nextId += ids.length; }
    catch { showError(translateText('loadFailed')); }
    finally { setLoading(false); updateCounter(); }
}

function nextBatchIds() {
    if (activeSearch) return searchIds.slice(visibleIds.length, visibleIds.length + PAGE_SIZE);
    if (activeType) return activeIds.slice(visibleIds.length, visibleIds.length + PAGE_SIZE);
    return Array.from({length: Math.min(PAGE_SIZE, 1026-nextId)}, (_, i) => nextId+i);
}

async function searchPokemon(event) {
    if (event) event.preventDefault();
    if (isLoading) return;
    const query = $('searchInput').value.trim().toLowerCase();
    if (query && query.length < 3) { showError(translateText('minLetters')); return; }
    clearResults(); nextId = 1; activeSearch = query; searchIds = [];
    if (!query) { await applyType(activeType); return; }
    await runSearch(query);
}

async function getSearchList() {
    if (!searchListCache) searchListCache = fetchJson(`${API_BASE}/pokemon?limit=2000`);
    try { return (await searchListCache).results; }
    catch (error) { searchListCache = null; throw error; }
}

async function runSearch(query) {
    setLoading(true);
    try { searchIds = getMatchingIds(await getSearchList(), query); }
    catch { showError(translateText('searchFailed')); setLoading(false); return; }
    setLoading(false);
    if (!searchIds.length) { showError(translateText('noMatch')); updateCounter(); return; }
    await loadMorePokemon();
}

function getMatchingIds(list, query) {
    return list.filter(p => p.name.includes(query))
        .map(p => Number(p.url.split('/').filter(Boolean).pop()))
        .filter(id => id <= 1025);
}

function buildTypeMenu() {
    $('typeOptions').innerHTML = ['all',...TYPES].map(type=>`<button type="button" class="type-option" data-type="${type}" aria-pressed="false" style="background:${TYPE_COLORS[type]||'#3b83d6'}">${translateType(type)[0].toUpperCase()+translateType(type).slice(1)}</button>`).join('');
}

function toggleTypeMenu(force) {
    const open = typeof force==='boolean'?force:$('typeMenu').hidden;
    $('typeMenu').hidden = !open;
    $('menuButton').setAttribute('aria-expanded',String(open));
}

async function applyType(type) {
    if (isLoading) return;
    activeType = type === 'all' ? '' : type;
    activeSearch = ''; searchIds = []; $('searchInput').value = ''; clearResults(); nextId = 1;
    updateFilterState();
    if (!activeType) { activeIds=[]; await loadMorePokemon(); return; }
    await loadTypeResults();
}

function updateFilterState() {
    $('activeFilter').hidden = !activeType;
    $('activeFilter').textContent = activeType ? `${translateText('filteredBy')} ${translateType(activeType).toUpperCase()}` : '';
    document.querySelectorAll('[data-type]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.type === (activeType||'all'))));
}

async function loadTypeResults() {
    setLoading(true);
    try { activeIds=await getTypeIds(activeType); renderPokemon(await fetchBatch(activeIds.slice(0,PAGE_SIZE))); }
    catch { showError(translateText('typeFailed')); }
    finally { setLoading(false); updateCounter(); }
}

function closeDialog() {
    $('pokemonDialog').close(); document.body.classList.remove('dialog-open');
    currentPokemonId=null; dialogToken++;
}

async function openPokemonDialog(id) {
    const token=++dialogToken; currentPokemonId=id; isShiny=false;
    if (!$('pokemonDialog').open) $('pokemonDialog').showModal();
    document.body.classList.add('dialog-open');
    $('dialogContent').innerHTML=`<div class="loading-indicator">${translateText('loadingDetails')}</div>`;
    try { const pokemon=await getPokemon(id); await localizePokemon(pokemon); if(token!==dialogToken)return; renderDialog(pokemon); await loadEvolutions(pokemon,token); }
    catch { if(token===dialogToken) $('dialogContent').innerHTML=`<p class="not-found">${translateText('detailsFailed')}</p><button data-id="close-dialog-button" class="close-dialog-button">${translateText('close')}</button>`; }
}

function renderDialog(pokemon) {
    $('dialogContent').innerHTML=dialogTemplate(pokemon,isShiny);
    const index=visibleIds.indexOf(pokemon.id);
    document.querySelector('[data-id="prev-button"]').disabled=index<=0;
    document.querySelector('[data-id="next-button"]').disabled=index<0||index>=visibleIds.length-1;
}

async function loadEvolutions(pokemon,token) {
    try { const species=await getSpecies(pokemon.id); const chain=await getEvolution(species.evolution_chain.url); const nodes=evolutionNodes(chain.chain); const evolutions=await Promise.all(nodes.map(n=>getPokemon(n.name).then(localizePokemon))); if(token===dialogToken && $('evolutionContent')) $('evolutionContent').innerHTML=evolutionTemplate(evolutions, artwork(pokemon)); }
    catch { if(token===dialogToken && $('evolutionContent')) $('evolutionContent').textContent=translateText('evolutionFailed'); }
}

function navigateDialog(direction) {
    const index=visibleIds.indexOf(currentPokemonId);
    const id=visibleIds[index+direction];
    if (index < 0 || index + direction < 0 || index + direction >= visibleIds.length) return;
    if(id)openPokemonDialog(id);
}

function handleDialogClick(event) {
    if(event.target===$('pokemonDialog'))closeDialog();
    if(event.target.closest('[data-id="close-dialog-button"]'))closeDialog();
    if(event.target.closest('[data-id="prev-button"]'))navigateDialog(-1);
    if(event.target.closest('[data-id="next-button"]'))navigateDialog(1);
    if(event.target.closest('#shinyToggle'))toggleShiny();
}

async function toggleShiny() {
    const id = currentPokemonId;
    const pokemon = await getPokemon(id);
    if (id !== currentPokemonId) return;
    const shinyAvailable = Boolean(pokemon.sprites.other?.['official-artwork']?.front_shiny || pokemon.sprites.front_shiny);
    isShiny = !isShiny && shinyAvailable;
    const image = document.querySelector('[data-id="dialog-image"]');
    image.src = artwork(pokemon, isShiny);
    image.alt = `${isShiny ? 'Shiny ' : ''}${getDisplayName(pokemon)}`;
    $('shinyToggle').textContent = isShiny ? translateText('shinyArtwork') : translateText('normalArtwork');
    $('shinyToggle').setAttribute('aria-pressed', String(isShiny));
}

function handleImageError(event) {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || !image.dataset.fallback) return;
    const fallback = image.dataset.fallback;
    delete image.dataset.fallback;
    if (fallback && image.src !== fallback) image.src = fallback;
}

function initEvents() {
    $('searchForm').addEventListener('submit',searchPokemon);
    document.addEventListener('error', handleImageError, true);
    $('menuButton').addEventListener('click',()=>toggleTypeMenu());
    $('typeOptions').addEventListener('click',event=>{const b=event.target.closest('[data-type]');if(b){toggleTypeMenu(false);applyType(b.dataset.type);}});
    $('pokemonList').addEventListener('click',event=>{const b=event.target.closest('[data-pokemon-id]');if(b)openPokemonDialog(Number(b.dataset.pokemonId));});
    $('pokemonDialog').addEventListener('click',handleDialogClick);
    $('pokemonDialog').addEventListener('close',()=>{document.body.classList.remove('dialog-open');currentPokemonId=null;dialogToken++;});
    $('backToTop').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
    document.addEventListener('click',event=>{if(!event.target.closest('.menu-wrap'))toggleTypeMenu(false);});
}


