# Escape Area 51 — Joy Haus

A mobile-friendly browser adaptation in progress of the original physical board game.

## Current build

Open [index.html](./index.html) in a browser-capable HTML preview, or host the repository using a static-site host. Because this repository is **private**, it does not automatically give you a publicly accessible GitHub Pages game URL. The current source is a self-contained HTML file with no build step.

This commit provides an **early solo playtest prototype**:
- 6 × 6 navigation grid
- 35 provisional navigation circuit definitions
- 2–8 players, with one human and computer opponents
- Three-card hand; selection and quarter-turn rotation
- Path movement, basic elimination, turn sequence, and provisional round-ending logic
- Touch-friendly responsive interface

## Limitations and work remaining

**Not yet a rules-accurate or art-complete adaptation.** The navigation card path definitions must be checked against all 35 physical cards. The current cards are code-drawn placeholders, **not the uploaded original illustrated tile artwork**. The original character artwork and board surround are also not yet integrated in this self-contained commit.

Draw / recycling / override rules, collisions, ties, and special cases require tests against the supplied physical rulebook. This build has **not been fully browser-playtested**.

Private rooms, real-time updates between phones, reconnection, and multiplayer server are **not implemented**. These will need a shared server or comparable real-time backend; a static HTML page alone cannot synchronize turn-based matches across devices.

## Development plan

1. Confirm tile-by-tile connections and rulebook edge cases.
2. Integrate the user's original illustrated tiles, board, and alien art.
3. Test solo play on multiple mobile browsers and correct rules deviations.
4. Implement online rooms with server-authoritative moves, reconnects, and turn synchronization.
5. Set up a deliberate deployment and access model for playtesters.

The physical-game rules and artwork remain the creative source of truth. Do not reinterpret the game rules merely to match this incomplete prototype.


## Solo bot milestone — November 4, 2026

A first-generation bot decision module now lives at `engine/bot.js` and is connected to the prototype's automated computer turns in `index.html`.

- Enumerates every card currently in the bot's hand and all four orientations.
- Uses provisional board simulation to avoid voluntary elimination whenever possible.
- Favors moves that eliminate competitors and positions with more adjacent free sectors.
- Breaks equally scored options randomly so repeated matches are not completely identical.
- Has automated unit tests under `tests/bot.test.js`.

**Difficulty modes are intentionally deferred.** The current candidate-move and capture evaluation still depends on provisional tile pairings and simplified collision / rule handling. Before adding easy/medium/hard, correct and verify the 35 card connection maps, complete the rules engine, and run real browser playtests. Bot-choice tests pass in GitHub Actions, but this does not yet prove a bug-free complete match.

**Hosting:** no public play URL has been configured or verified for this private repository.


## Physical rulebook download milestone — November 4, 2026

The shared `engine/rules.js` now implements and unit-tests:
- Two-player active-player-only replacement draw
- Three-or-more-player clockwise group downloads (replenish to three while possible)
- Priority Override Module assignment on an attempted empty draw
- Priority-first group draw on the next opportunity
- Recycling captured players' remaining hand cards to the backup pile
- Passing an Override Module held by an eliminated pilot to the next eligible pilot

The solo HTML prototype now imports this rule module and calls it for turn replenishment and captured-hand recycling. The matching `tests/rules.test.js` passed in GitHub Actions on the committed version.

Still unimplemented: optional Salvage Bonus exchange before recycling, simultaneous-path collision detection as defined by the physical rules, complete tie handling, and audited physical art/path data. Do not treat the alpha as rules-complete until these are addressed.
