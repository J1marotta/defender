import { defineQuery, entityExists } from 'bitecs';
import { Graphics } from 'pixi.js';
import { PositionComponent, RenderableComponent } from '../core/components.core';
import type { EngineContext } from '../core/engine.core';

const renderQuery = defineQuery([PositionComponent, RenderableComponent]);

export function renderSystem(context: EngineContext): void {
  const entities = renderQuery(context.world);

  for (let i = 0; i < entities.length; i += 1) {
    const entity = entities[i];
    let graphic = context.graphicsByEntity[entity];

    if (!graphic) {
      graphic = new Graphics();
      context.graphicsByEntity[entity] = graphic;
      context.app.stage.addChild(graphic);
    }

    const width = RenderableComponent.width[entity];
    const height = RenderableComponent.height[entity];
    const color = RenderableComponent.color[entity];

    graphic.clear();
    graphic.rect(-width * 0.5, -height * 0.5, width, height).fill({ color });
    graphic.x = PositionComponent.x[entity];
    graphic.y = PositionComponent.y[entity];
  }

  const keys = Object.keys(context.graphicsByEntity);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const entity = Number(key);
    if (!entityExists(context.world, entity)) {
      const staleGraphic = context.graphicsByEntity[entity];
      staleGraphic.destroy();
      delete context.graphicsByEntity[entity];
    }
  }
}
