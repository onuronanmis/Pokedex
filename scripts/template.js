function artwork(pokemon, shiny = false) {
    const art = pokemon.sprites.other['official-artwork'];
    return (shiny ? art.front_shiny : art.front_default) || pokemon.sprites.front_default || '';
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function typeBadges(pokemon) {
    return pokemon.types.map(item => /*html*/`      
       <span class="type-badge" style="--badge-color:${TYPE_COLORS[item.type.name]}">${item.type.name}</span>`).join('');
}

function cardTemplate(pokemon) {
    const name = escapeHtml(pokemon.name);
    const color = TYPE_COLORS[pokemon.types[0].type.name];
    return /*html*/`       
    <li class="pokemon-list-item">
        <button class="pokemon-card" data-id="card" data-pokemon-id="${pokemon.id}" style="--type-color:${color}" aria-label="Open ${name} details">
            <span class="card-top">
                <span class="card-number">#${String(pokemon.id).padStart(4,'0')}</span>
                <span aria-hidden="true">✦</span>
            </span>
                <img data-id="card-image" class="card-image" src="${artwork(pokemon)}" alt="${name}" loading="lazy"><span class="card-name">${name}</span><span class="type-badges">${typeBadges(pokemon)}</span>
        </button>
    </li>`;
}

function dialogTemplate(pokemon, shiny) {
    const name = escapeHtml(pokemon.name);
    const color = TYPE_COLORS[pokemon.types[0].type.name];
    return /*html*/`
    <div class="dialog-inner" data-id="overlay-pokemon-name" style="--type-color:${color}">${dialogHeader(pokemon,name)}${dialogHero(pokemon,name,shiny)}
         <section class="detail-section">
            <h3>Evolution Chain</h3>
            <div id="evolutionContent" class="dialog-status">Loading evolutions...</div>
        </section>${dialogNavigation()}
    </div>`;
}

function dialogHeader(pokemon,name) {
    return /*html*/`
    <div class="dialog-header">
         <div><span class="dialog-id">#${String(pokemon.id).padStart(4,'0')}</span><h2>${name}</h2></div>
        <button data-id="close-dialog-button" class="close-dialog-button" aria-label="Close Pokémon details">✕</button>
    </div>`;
}

function dialogHero(pokemon,name,shiny) {
    const normal = artwork(pokemon);
    return /*html*/`
    <div class="dialog-hero">
        <div class="dialog-art"><img data-id="dialog-image" class="dialog-image" src="${artwork(pokemon,shiny)}" data-fallback="${normal}" alt="${shiny?'Shiny ':''}${name}"></div>
        <div class="dialog-facts"><div class="type-badges">${typeBadges(pokemon)}</div>${dialogFacts(pokemon)}
        <button id="shinyToggle" class="sprite-toggle" aria-pressed="${shiny}" aria-label="Toggle shiny artwork">${shiny?'✨ Shiny':'✦ Normal'} artwork</button></div>
    </div>`;
}

function dialogFacts(pokemon) {
    const abilities = pokemon.abilities.map(a=>escapeHtml(a.ability.name)).join(', ');
    return /*html*/`
    <div class="fact-row">
        <div><span class="fact-label">HEIGHT</span>${pokemon.height/10} m</div>
        <div><span class="fact-label">WEIGHT</span>${pokemon.weight/10} kg</div>
    </div><div><span class="fact-label">ABILITIES</span>${abilities}</div>`;
}

function dialogNavigation() {
    return /*html*/`
    <div class="dialog-nav">
        <button data-id="prev-button" class="nav-button" aria-label="Previous Pokémon">← Previous</button>
        <button data-id="next-button" class="nav-button" aria-label="Next Pokémon">Next →</button>
    </div>`;
}

function evolutionNodes(chain) {
    const nodes = []; let current = chain;
    while (current) { nodes.push(current.species); current = current.evolves_to[0]; }
    return nodes;
}

function evolutionTemplate(pokemonList, fallback) {
    return `<div class="evolution-list">
     ${pokemonList.map((p,i)=>`${i?
        '<span class="evolution-arrow" aria-hidden="true">→</span>':''}
        <div class="evolution-item">
        <img src="${artwork(p) || fallback}" data-fallback="${fallback}" alt="${escapeHtml(p.name)}" loading="lazy"><span>${escapeHtml(p.name)}</span></div>`).join('')}</div>`;
}
