import { defineQuery, removeEntity } from 'bitecs';
import {
  EnemyBehaviorComponent,
  EnemyTagComponent,
  PositionComponent,
  VelocityComponent,
} from '../core/components.core';
import { spawnEnemyCore } from '../core/factories.core';
import { GAME_HEIGHT, GAME_WIDTH, type EngineContext } from '../core/engine.core';

const enemyQuery = defineQuery([EnemyTagComponent, PositionComponent, VelocityComponent, EnemyBehaviorComponent]);
const SPAWN_INTERVAL_MS = 900;

export function enemySpawnSystem(context: EngineContext): void {
  const elapsed = context.currentTimeMs - context.lastEnemySpawnMs;
  if (elapsed >= SPAWN_INTERVAL_MS) {
    context.lastEnemySpawnMs = context.currentTimeMs;
    spawnEnemyCore(context.world, context.currentTimeMs);
  }
}

export function enemyMovementSystem(context: EngineContext): void {
  const entities = enemyQuery(context.world);
  const playerX = PositionComponent.x[context.playerEntity];
  const playerY = PositionComponent.y[context.playerEntity];

  for (const entity of entities) {
    const archetypeId = EnemyBehaviorComponent.archetypeId[entity];
    const seed = EnemyBehaviorComponent.seed[entity];
    const dx = playerX - PositionComponent.x[entity];
    const dy = playerY - PositionComponent.y[entity];
    const distance = Math.max(1, Math.hypot(dx, dy));

    if (archetypeId === 0 || archetypeId === 3) {
      VelocityComponent.x[entity] += (dx / distance) * 0.01;
      VelocityComponent.y[entity] += (dy / distance) * 0.01;
    } else if (archetypeId === 1) {
      VelocityComponent.x[entity] += (dx / distance) * 0.008;
      VelocityComponent.y[entity] = Math.sin(context.currentTimeMs * 0.003 + seed) * 0.3;
    } else if (archetypeId === 2) {
      const orbitAngle = context.currentTimeMs * 0.002 + seed;
      VelocityComponent.x[entity] = Math.cos(orbitAngle) * 0.2;
      VelocityComponent.y[entity] = Math.sin(orbitAngle) * 0.2;
    } else {
      VelocityComponent.x[entity] += (dx / distance) * 0.004;
      VelocityComponent.y[entity] += (dy / distance) * 0.004;
    }

    VelocityComponent.x[entity] = clamp(VelocityComponent.x[entity], -0.42, 0.42);
    VelocityComponent.y[entity] = clamp(VelocityComponent.y[entity], -0.42, 0.42);
    PositionComponent.x[entity] += VelocityComponent.x[entity] * context.deltaMs;
    PositionComponent.y[entity] += VelocityComponent.y[entity] * context.deltaMs;

    if (PositionComponent.x[entity] < -50 || PositionComponent.x[entity] > GAME_WIDTH + 50 || PositionComponent.y[entity] < -50 || PositionComponent.y[entity] > GAME_HEIGHT + 50) {
      removeEntity(context.world, entity);
    }
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
