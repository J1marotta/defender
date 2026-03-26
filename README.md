# Defender-style Web Prototype (Pixi + ECS)

This repository now contains an extendable prototype architecture for a Defender-inspired side scroller with:

- `pixi.js` rendering
- data-driven content files
- ECS via `bitecs`
- keyboard + Xbox-style controller support (Gamepad API)
- localStorage-backed meta progression scaffold

## Run

```bash
npm install
npm run dev
```

## Learn by building: interactive tutorial path

If you want to learn game dev by actually shipping features, follow **`docs/TUTORIAL.md`**.

This repo now also includes an in-game **Live Tutorial panel** in the running build so you can keep the game open while editing:

- **Keyboard:** `H` toggle panel, `[` / `]` previous/next step, `M` mark step complete
- **Controller:** `Y` toggle panel, D-Pad left/right previous/next, `B` mark step complete

It gives you a 3-feature path that teaches:

1. **Menu + input-mode-aware UI**
2. **Collision + enemy loop + juice (sound/screenshake/feedback)**
3. **Upgrades + save game + sprite-sheet animation integration**

Each chapter is designed so you discover the architecture yourself (systems/components/data/input/meta), with checkpoints and stretch goals, without handing you a copy-paste full solution.

👉 Start here: **[docs/TUTORIAL.md](docs/TUTORIAL.md)**
