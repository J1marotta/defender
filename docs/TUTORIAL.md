# Interactive Game Dev Tutorial (TypeScript + Pixi + ECS)

You already write TS. Great. This tutorial is about learning **game architecture by feel**: making real features, seeing where things live, and building a complete vertical slice you can keep extending.

You will add **3 features** that map to what good games need:

1. **A playable shell** (menu + input-aware UI + game states)
2. **A satisfying core loop** (enemies + collisions + score + juice + sound)
3. **Long-term stickiness** (upgrades + save + sprite sheet animations)

No fake TODO project at the end — if you complete the steps, you have a real playable prototype.

---

## Before you start

Run the game:

```bash
npm install
npm run dev
```

Live tutorial controls while the game is running:

- **Keyboard**: `H` show/hide tutorial, `[` / `]` move between steps, `M` mark current step complete
- **Controller**: `Y` show/hide, D-Pad left/right move steps, `B` mark complete

Then skim these files once to build a mental map:

- `src/core/engine.core.ts` → game bootstrap, per-frame loop, HUD
- `src/core/components.core.ts` → ECS component schema (data only)
- `src/gameplay/player-movement.system.ts` → movement logic
- `src/gameplay/weapon.system.ts` → firing/scoring/combo updates
- `src/input/input-state.input.ts` → keyboard + gamepad unification
- `src/meta/meta-store.meta.ts` and `src/content/*.data.ts` → persistence + balance data

---

## How to use this tutorial (interactive mode)

For each feature:

- Read the **Mission**.
- Follow the **Build steps** one by one.
- Pause at each **Checkpoint** and test in-game.
- Use **Hints** only when blocked.
- Finish with **Stretch goals** if you want extra mastery.

Try this loop while implementing:

1. Make one tiny code change.
2. Run and test immediately.
3. Write 1 sentence in your own notes: “What changed?” and “Where did it live?”

That reflection is what teaches you to recognize which part of the code does what.

---

# Feature 1 — Menu + Input-Mode-Aware UI + Game States

## Mission
Build a start/pause flow that feels like a game instead of a raw sandbox, and automatically changes prompts depending on whether the player is using keyboard/mouse or controller.

This teaches: **state management**, **UI ownership**, **input abstraction**.

## Build steps

1. **Add a game phase model**
   - Introduce a `GamePhase` type (example phases: `menu`, `playing`, `paused`, `gameOver`).
   - Store current phase in engine context.
   - Keep transitions explicit (small helper function > random inline assignments).

2. **Gate systems by phase**
   - In the ticker loop, run gameplay systems only in `playing`.
   - Keep rendering/UI updates active in non-playing phases.

3. **Create menu UI layer**
   - Add a Pixi text block or container for title + controls + “Press X to Start”.
   - Show/hide this layer based on game phase.

4. **Pause support**
   - Add pause toggle from both keyboard and controller.
   - Freeze movement/combat when paused.
   - Show pause overlay with resume hint.

5. **Input-mode-aware prompts**
   - Track “last active input mode” (`keyboardMouse` vs `controller`).
   - Swap UI prompt text accordingly:
     - Keyboard example: `Press Enter to Start`
     - Controller example: `Press A to Start`

## Checkpoints

- **Checkpoint A:** Title screen appears before gameplay starts.
- **Checkpoint B:** Start action transitions cleanly into gameplay.
- **Checkpoint C:** Pause works and fully freezes action.
- **Checkpoint D:** Prompt text changes when you touch gamepad stick/button.

## Hints (use only if needed)

- `input-state.input.ts` already centralizes device data; extend this instead of checking raw key/gamepad state everywhere.
- Keep phase transitions in one place so debugging “why did game unpause?” is easy.
- If pause toggles too fast, implement a “just pressed” action flag rather than level-triggered booleans.

## Stretch goals

- Animate menu text (alpha pulse / subtle scale).
- Add “Hold to pause” accessibility setting.
- Add separate prompts for “controller connected but inactive.”

---

# Feature 2 — Enemy Loop + Collisions + Score + Juice + Sound

## Mission
Make the game feel alive: things spawn, collide, explode, and reward the player with feedback.

This teaches: **entity lifecycle**, **collision systems**, **game feel**, **feedback loops**.

## Build steps

1. **Add enemy entities/components**
   - Add at least: position/velocity/hitbox/health/tag.
   - Decide whether to reuse existing components or add enemy-specific data.

2. **Add projectile entities**
   - Right now firing updates score only; make firing spawn projectile entities.
   - Track projectile lifetime so old bullets are cleaned up.

3. **Enemy spawner system**
   - Spawn enemies over time (timer-based).
   - Start simple: one archetype with horizontal drift + slight vertical variance.

4. **Collision system**
   - Detect projectile-enemy overlap.
   - On collision: apply damage, remove projectile, destroy enemy at 0 HP.

5. **Scoring and combo integration**
   - Move score gain to “successful hit/kill” events, not button presses.
   - Keep combo/multiplier logic, but tie it to combat outcomes.

6. **Add juice (minimum 3)**
   - Screen shake on enemy kill.
   - Hit flash / brief color tint on impacted entities.
   - Floating score text or small pop effect.

7. **Add sound hooks**
   - Fire SFX, hit SFX, kill SFX.
   - Keep an abstraction layer (`audio.play('fire')`) so assets can be swapped later.

## Checkpoints

- **Checkpoint A:** Enemies spawn continuously.
- **Checkpoint B:** Bullets visibly travel and get cleaned up.
- **Checkpoint C:** Collisions remove enemies and increase score.
- **Checkpoint D:** At least 3 juice effects active.
- **Checkpoint E:** Core SFX play at the correct moments.

## Hints (use only if needed)

- Keep collision in its own system; don’t bury overlap checks in movement code.
- For shake, use a short-lived camera offset value that decays to zero each frame.
- Use free temporary assets now, but structure IDs so replacing with paid pack is a data change, not a refactor.

## Stretch goals

- Add player damage + temporary invulnerability flash.
- Add enemy variants via data (speed, HP, score value).
- Add kill streak callouts (“Rampage”, etc.).

---

# Feature 3 — Upgrades + Save Game + Sprite Sheet Animations

## Mission
Create progression and polish so players want to come back.

This teaches: **meta systems**, **persistence boundaries**, **data-driven balancing**, **animation pipelines**.

## Build steps

1. **Run rewards + end state**
   - Define run end condition (timer, HP depletion, or boss wave).
   - Convert run score into persistent currencies/resources.
   - Return to menu with summary panel.

2. **Upgrade screen flow**
   - Add an upgrade menu state.
   - Use your existing meta data files as source of truth for costs and rank caps.
   - Let player purchase upgrades and immediately persist.

3. **Apply upgrades at runtime**
   - Wire upgraded stats into movement/combat/spawn systems.
   - Keep formulas centralized (avoid copy-paste multipliers).

4. **Save game robustness**
   - Version your save schema.
   - Add migration fallback for older save payloads.
   - Add reset-profile option in menu for testing.

5. **Sprite sheet integration**
   - Replace primitive graphics with a free sprite sheet first.
   - Build animation state mapping (idle/move/fire/hit/death).
   - Keep names generic so swapping to paid pack later is asset remapping.

6. **Input/UI parity pass**
   - Ensure all menu/upgrade flows are accessible by keyboard and controller.
   - Update on-screen button glyph hints for active device.

## Checkpoints

- **Checkpoint A:** Run can end and show summary.
- **Checkpoint B:** Upgrades can be purchased and persist across refresh.
- **Checkpoint C:** Upgrades visibly affect gameplay stats.
- **Checkpoint D:** Player/enemy animations play from sprite sheet.
- **Checkpoint E:** Full menu flow works with keyboard and controller.

## Hints (use only if needed)

- Keep all economy numbers in data files so balancing doesn’t require logic edits.
- Treat storage load as unsafe input: validate before trusting.
- Separate animation “state decision” from rendering “play clip” calls.

## Stretch goals

- Add per-run unlocks and permanent unlock tracks.
- Add cloud-save-ready interface (still backed by localStorage now).
- Add UI theme switch by biome/level.

---

## Recommended free assets (temporary, easy to replace)

- **Sprites:** Kenney, OpenGameArt, itch.io free packs
- **SFX:** Kenney Audio, Freesound (check license), ZapSplat free tier
- **UI icons/gamepad glyphs:** open icon sets with permissive licenses

When importing, keep a thin asset manifest module so replacing the pack later is mostly path/name updates.

---

## Architecture cheat-sheet (what code should go where)

- **Component (`*.core.ts`)**: pure data schema, no behavior.
- **System (`*.system.ts`)**: behavior over entities every frame.
- **Input (`*.input.ts`)**: unify raw controls into gameplay actions.
- **Content (`*.data.ts`)**: balancing values and progression definitions.
- **Meta (`*.meta.ts`)**: persistence/load/save/upgrade rank state.
- **Engine (`engine.core.ts`)**: lifecycle orchestration + top-level scene wiring.

If you’re unsure where new logic belongs, start by asking:

> “Is this data, behavior, player intent, tuning config, or app lifecycle?”

Then place it by category.

---

## Definition of done (complete product target)

You are done when all are true:

- Start menu, pause, game over, and upgrade screens are functional.
- Keyboard/controller swap is seamless and UI hints match current device.
- Enemies + projectiles + collisions + scoring + juice + sound all work.
- Upgrades persist and affect gameplay in obvious ways.
- Sprite-sheet animations replace placeholder primitives.
- Refreshing the page preserves progress (with schema-safe loading).

That is no longer a practice toy — it is a full prototype foundation.
