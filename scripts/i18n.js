const LANGUAGE_KEY = 'pokedexLanguage';
let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || 'en';

const UI_TEXTS = {
    en: {
        searchPlaceholder: 'Search Pokémon...', searchButton: 'Search', typesButton: 'Types',
        typeMenuTitle: 'FILTER BY TYPE', loadMore: 'Load More (20) ↓', loading: 'Loading Pokémon...',
        backToTop: '↑ Back to Top', languageButton: 'Deutsch', counter: 'Pokémon shown',
        filteredBy: 'Filtered by:', minLetters: 'Enter at least 3 letters.', noMatch: 'No matching Pokémon found.',
        searchFailed: 'Search failed. Check your connection.', partialError: 'Some Pokémon could not be loaded. Try again.',
        loadFailed: 'Loading failed. Please try again.', typeFailed: 'Type filter failed. Please try again.',
        loadingDetails: 'Loading details...', detailsFailed: 'Could not load Pokémon details.', close: 'Close',
        height: 'HEIGHT', weight: 'WEIGHT', abilities: 'ABILITIES', evolutionChain: 'Evolution Chain',
        loadingEvolutions: 'Loading evolutions...', evolutionFailed: 'Evolution information unavailable.',
        previous: '← Previous', next: 'Next →', shinyArtwork: '✨ Shiny artwork', normalArtwork: '✦ Normal artwork', all: 'All'
    },
    de: {
        searchPlaceholder: 'Englischen Namen suchen...', searchButton: 'Suchen', typesButton: 'Typen',
        typeMenuTitle: 'NACH TYP FILTERN', loadMore: 'Mehr laden (20) ↓', loading: 'Pokémon werden geladen...',
        backToTop: '↑ Nach oben', languageButton: 'English', counter: 'Pokémon angezeigt',
        filteredBy: 'Gefiltert nach:', minLetters: 'Bitte mindestens 3 Buchstaben eingeben.', noMatch: 'Kein passendes Pokémon gefunden.',
        searchFailed: 'Suche fehlgeschlagen. Prüfe deine Verbindung.', partialError: 'Einige Pokémon konnten nicht geladen werden. Versuche es erneut.',
        loadFailed: 'Laden fehlgeschlagen. Bitte versuche es erneut.', typeFailed: 'Typfilter fehlgeschlagen. Bitte versuche es erneut.',
        loadingDetails: 'Details werden geladen...', detailsFailed: 'Pokémon-Details konnten nicht geladen werden.', close: 'Schließen',
        height: 'GRÖSSE', weight: 'GEWICHT', abilities: 'FÄHIGKEITEN', evolutionChain: 'Entwicklungsreihe',
        loadingEvolutions: 'Entwicklungen werden geladen...', evolutionFailed: 'Keine Entwicklungsdaten verfügbar.',
        previous: '← Zurück', next: 'Weiter →', shinyArtwork: '✨ Shiny-Artwork', normalArtwork: '✦ Normales Artwork', all: 'Alle'
    }
};

const TYPE_NAMES_DE = {normal:'Normal',fire:'Feuer',water:'Wasser',electric:'Elektro',grass:'Pflanze',ice:'Eis',fighting:'Kampf',poison:'Gift',ground:'Boden',flying:'Flug',psychic:'Psycho',bug:'Käfer',rock:'Gestein',ghost:'Geist',dragon:'Drache',dark:'Unlicht',steel:'Stahl',fairy:'Fee'};

function translateText(key) {
    return UI_TEXTS[currentLanguage][key];
}

function translateType(type) {
    if (type === 'all') return translateText('all');
    return currentLanguage === 'de' ? TYPE_NAMES_DE[type] : type;
}

function applyStaticTexts() {
    document.documentElement.lang = currentLanguage;
    document.querySelectorAll('[data-i18n]').forEach(element => element.textContent = translateText(element.dataset.i18n));
    $('searchInput').placeholder = translateText('searchPlaceholder');
}
