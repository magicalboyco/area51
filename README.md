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
