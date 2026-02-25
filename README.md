# Defender-style Web Prototype (Pixi + ECS)

This repository now contains an extendable prototype architecture for a Defender-inspired side scroller with:

- `pixi.js` rendering
- data-driven content files
- ECS via `bitecs`
- keyboard + Xbox-style controller support (Gamepad API)
- localStorage-backed meta progression scaffold
- random enemy spawning with 5 archetypes
- projectile, enemy, and player collision handling

## Core decisions implemented

- Pure code web stack with Pixi
- 2D fixed resolution target (`1200x675`)
- ECS architecture designed for scaling enemy archetypes and bullet density
- Player-focused modifiers and base-stat meta upgrades

## Folder naming convention

Per your naming preference, files use domain suffixes:

- `*.core.ts` engine/ECS bootstrap
- `*.system.ts` runtime systems
- `*.data.ts` data-driven content
- `*.meta.ts` persistent progression
- `*.input.ts` input adapters

## Run

```bash
npm install
npm run dev
```

## Next implementation slices

1. Add terrain + ground collision and rescue entities/systems
2. Add world map with three levels and randomized modifiers
3. Add secondary beam behavior and powerup pipeline
4. Add replay seed and run telemetry output
5. Add per-archetype attacks (starting with shooter projectiles)
