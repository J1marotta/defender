# Developer Onboarding Tutorial (Dev-Only, Not Shipped In-Game)

This tutorial is for you (the developer), not for players. Keep it as documentation and optional debug UI while building.

## Stage path
1. **Boot + Input Mapping**: understand `engine.core.ts` and `input-state.input.ts`.
2. **Player Feel**: movement, damping, and weapon cadence in gameplay systems.
3. **Camera + Parallax**: how multi-layer motion sells depth.
4. **Combat Loop**: projectile entities, hit detection, and score from outcomes.
5. **Meta Loop**: upgrades, persistence, and runtime application.
6. **Content Pipeline**: generated assets and sprite-sheet integration.

## Parallax implementation in this repo
- We use **3 layers** for an alien bioworld:
  - Far sky spores (slow)
  - Mid floating islands + code motifs (medium)
  - Near biome silhouette (fast)
- Horizontal + vertical camera movement is supported.

Core file: `src/rendering/parallax-background.system.ts`.

## Asset generation with agent-sprite-forge

Run:
```bash
npm run generate:assets
```

This prepares `tools/agent-sprite-forge` (clone/pull). Then use that tool's workflow to generate:
- `parallax_far.png`
- `parallax_mid.png`
- `parallax_near.png`

Recommended constraints:
- Pixel art, retro palette, readable silhouettes.
- Deterministic seed for reproducibility.
- Theme: alien bioworld with subtle game-dev motifs (glyphs, schematics, node lines).

Export generated files to: `assets/generated/parallax/`.
