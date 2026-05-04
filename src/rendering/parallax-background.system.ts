import { Container, Graphics } from 'pixi.js';
import type { EngineContext } from '../core/engine.core';

export type ParallaxLayer = { node: Container; speedFactor: number; baseY: number };
export type ParallaxBackgroundState = { root: Container; layers: ParallaxLayer[] };

export function createParallaxBackground(): ParallaxBackgroundState {
  const root = new Container();
  const farLayer = new Container();
  farLayer.addChild(createSkyGradient(), createDistantSpores());
  const midLayer = new Container();
  midLayer.addChild(createFloatingIslands(), createCodeGlyphs());
  const nearLayer = new Container();
  nearLayer.addChild(createBiomeSilhouette());
  root.addChild(farLayer, midLayer, nearLayer);
  return {
    root,
    layers: [
      { node: farLayer, speedFactor: 0.15, baseY: 0 },
      { node: midLayer, speedFactor: 0.35, baseY: 12 },
      { node: nearLayer, speedFactor: 0.65, baseY: 28 },
    ],
  };
}

export function updateParallaxBackgroundSystem(context: EngineContext): void {
  const x = context.playerGraphic.x;
  const y = context.playerGraphic.y;
  for (const layer of context.parallaxBackground.layers) {
    layer.node.x = -(x * layer.speedFactor);
    layer.node.y = -(y * layer.speedFactor * 0.35) + layer.baseY;
  }
}

function createSkyGradient(): Graphics {
  return new Graphics().rect(-800, -300, 3200, 1800).fill({ color: 0x071226 }).rect(-800, 80, 3200, 1300).fill({ color: 0x0f2540 });
}
function createDistantSpores(): Graphics {
  const g = new Graphics();
  [[120, 120], [360, 60], [700, 150], [1040, 85], [1480, 140], [1900, 70]].forEach(([px, py]) => {
    g.circle(px, py, 18).fill({ color: 0x335d8d, alpha: 0.65 });
    g.circle(px + 24, py + 12, 7).fill({ color: 0x5e8fc7, alpha: 0.7 });
  });
  return g;
}
function createFloatingIslands(): Graphics {
  const g = new Graphics();
  [[80, 290, 260], [470, 240, 220], [830, 310, 280], [1260, 260, 230], [1620, 300, 320]].forEach(([x, y, width]) => {
    g.roundRect(x, y, width, 56, 10).fill({ color: 0x173b31 });
    g.roundRect(x + 20, y - 20, width - 40, 26, 8).fill({ color: 0x2d6e56 });
  });
  return g;
}
function createCodeGlyphs(): Graphics {
  const g = new Graphics();
  [0, 1, 2, 3, 4, 5].forEach((index) => {
    const x = 180 + index * 260;
    const y = 200 + (index % 2) * 72;
    g.roundRect(x, y, 52, 24, 6).fill({ color: 0x18444f, alpha: 0.8 });
    g.rect(x + 8, y + 8, 36, 4).fill({ color: 0x5ad8d0, alpha: 0.9 });
  });
  return g;
}
function createBiomeSilhouette(): Graphics {
  return new Graphics().poly([-200,700,-200,460,120,430,240,470,520,420,760,500,980,440,1240,490,1440,430,1800,520,2200,460,2200,700]).fill({ color: 0x0b2e25 });
}
