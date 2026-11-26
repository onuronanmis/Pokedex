# 🔴 Pokédex

🇩🇪 [Deutsch](#deutsch) | 🇬🇧 [English](#english)

**Live:** https://pokedex.onur-onanmis.de

## Deutsch

Eine responsive Pokédex-Web-App in Vanilla JavaScript, entstanden als Projekt der Developer Akademie. Alle Daten kommen live von der [PokéAPI](https://pokeapi.co/).

### Features

- Pokémon-Karten mit Artwork, Nummer und Typ-Badges
- Weitere Pokémon in 20er-Schritten nachladen
- Suche nach Namen (ab 3 Buchstaben)
- Filter nach Pokémon-Typ
- Detailansicht mit Größe, Gewicht, Fähigkeiten und Entwicklungsreihe
- **Shiny-Modus:** Umschalten auf das Shiny-Artwork in der Detailansicht
- Vor- und Zurückblättern direkt in der Detailansicht
- Ladeanzeige, Fehlermeldungen und Back-to-Top-Button
- Responsives Design für Desktop, Tablet und Smartphone

### Bedienung

| Aktion | Funktion |
|---|---|
| Karte anklicken | Detailansicht öffnen |
| ☰ Types | Nach Typ filtern |
| Suchfeld + Search | Pokémon nach Namen suchen |
| Load More | 20 weitere Pokémon laden |
| ← Previous / Next → | Vorheriges / nächstes Pokémon in der Detailansicht |
| Esc oder Klick daneben | Detailansicht schließen |

### Technik

- HTML5 (natives `<dialog>`-Element)
- CSS (responsiv, aufgeteilt in Standards, Karten und Overlay)
- Vanilla JavaScript (async/await, Fetch API)
- [PokéAPI](https://pokeapi.co/) als Datenquelle

### Starten

Repository klonen und `index.html` im Browser öffnen, zum Beispiel mit der VS-Code-Erweiterung Live Server.

### Credits

- Pokémon-Daten und Artworks: [PokéAPI](https://pokeapi.co/)
- Header- und Hintergrundbilder: erstellt mit ChatGPT (KI)
- Pokémon © Nintendo, Game Freak, The Pokémon Company

---

## English

A responsive Pokédex web app built with vanilla JavaScript as a Developer Akademie project. All data is loaded live from the [PokéAPI](https://pokeapi.co/).

### Features

- Pokémon cards with artwork, number and type badges
- Load more Pokémon in batches of 20
- Search by name (at least 3 letters)
- Filter by Pokémon type
- Detail view with height, weight, abilities and evolution chain
- **Shiny mode:** switch to the shiny artwork in the detail view
- Browse to the previous or next Pokémon inside the detail view
- Loading indicator, error messages and back-to-top button
- Responsive design for desktop, tablet and mobile

### Controls

| Action | Function |
|---|---|
| Click a card | Open detail view |
| ☰ Types | Filter by type |
| Search field + Search | Search Pokémon by name |
| Load More | Load 20 more Pokémon |
| ← Previous / Next → | Previous / next Pokémon in the detail view |
| Esc or click outside | Close detail view |

### Tech

- HTML5 (native `<dialog>` element)
- CSS (responsive, split into standards, cards and overlay)
- Vanilla JavaScript (async/await, Fetch API)
- [PokéAPI](https://pokeapi.co/) as data source

### Getting Started

Clone the repository and open `index.html` in your browser, for example with the VS Code extension Live Server.

### Credits

- Pokémon data and artwork: [PokéAPI](https://pokeapi.co/)
- Header and background images: created with ChatGPT (AI)
- Pokémon © Nintendo, Game Freak, The Pokémon Company
