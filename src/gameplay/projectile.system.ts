import { defineQuery, removeEntity } from 'bitecs';
import {
  BulletTagComponent,
  LifetimeComponent,
  PositionComponent,
  VelocityComponent,
} from '../core/components.core';
import { GAME_WIDTH, type EngineContext } from '../core/engine.core';

const bulletQuery = defineQuery([BulletTagComponent, PositionComponent, VelocityComponent, LifetimeComponent]);

export function projectileSystem(context: EngineContext): void {
  const entities = bulletQuery(context.world);

  for (const entity of entities) {
    PositionComponent.x[entity] += VelocityComponent.x[entity] * context.deltaMs;
    PositionComponent.y[entity] += VelocityComponent.y[entity] * context.deltaMs;
    LifetimeComponent.remainingMs[entity] -= context.deltaMs;

    if (LifetimeComponent.remainingMs[entity] <= 0 || PositionComponent.x[entity] < -30 || PositionComponent.x[entity] > GAME_WIDTH + 30) {
      removeEntity(context.world, entity);
    }
  }
}
