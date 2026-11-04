# Physical-to-digital fidelity plan

Source of truth: the owner's **Games Rules.pdf** and supplied original 35 navigation circuit card fronts.

## Verified as stated in the physical rulebook
- Board: 6 × 6 sectors
- Navigation deck: 35 cards, each with four routes between eight endpoints
- Up to eight alien escapee tokens
- Three cards initially dealt to each player
- Players choose perimeter launch coordinates in turn order before the first circuit is installed
- Install a selected card in the empty sector next to the active token, in any quarter-turn orientation
- Active token moves, then all other tokens adjacent to the newly installed circuit follow their extended routes
- Only forced moves may deliberately send the current token over the galaxy edge
- Two-player game: active player alone draws one replacement circuit
- Three-plus player game: group download starts with active player and proceeds clockwise, filling hands up to three while possible
- Priority Override Module is claimed on an attempted empty-pile download and modifies the next download order once cards become available
- Captured aliens' remaining hand cards return to the draw pile, with a possible salvage exchange by the active player in three-plus player games
- Colliding alien routes eliminate both aliens
- Victory: last surviving alien; tie cases when all installed or everyone remaining eliminated simultaneously

## Engineering separation
1. **Card data**: manually audited image-to-endpoint pairs (four disjoint pairs on every card).
2. **Navigation geometry**: deterministic calculation of rotated ports and cross-cell movement. Code and automated checks under `engine/` and `tests/`.
3. **Game rules**: play sequencing, collisions, draws, priority, salvage, tie cases; to be implemented and tested independently.
4. **UI**: original supplied board and tile art, mobile card rotation and placement preview, animated saucer movement.
5. **Multiplayer**: shared authoritative match state, room codes, synchronized turns, reconnects; not yet implemented.

## Current limitations (2026-11-04)
- **The 35 physical tile connection maps have NOT been visually checked one by one**; do not declare gameplay fully accurate.
- Navigation test module has been committed but is **not yet integrated into the playable `index.html`**. The prototype currently uses separate provisional mappings.
- Automated workflow was created; its first successful GitHub Actions run is not yet confirmed.
- Physical-rule edge cases, especially Priority Override, card exchange and collision behavior, are not fully validated.
- The currently committed playable prototype uses placeholder graphics rather than the original tile faces and alien art.
- Private repository does not imply an accessible public game URL.

## Acceptance tests before calling the game faithful
- Inspect all 35 card artworks and record 4 reciprocal port pairs each.
- Rotate each card through all four orientations: each of eight endpoints must lead back to its reciprocal endpoint.
- Trace routes through existing tiles until the first empty sector, board exit, collision, or other rule-defined end.
- Cross-check representative moves against an actual physical setup: same cards and orientation => same final positions.
- Run rulebook scenarios for two-player and three-plus-player draw rules, capture and salvage, Priority Override, and all tie cases.
- Playtest on narrow phones and large screens before adding real-time multiplayer.
