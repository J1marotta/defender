import { defineQuery, removeEntity } from 'bitecs';
import {
  BulletTagComponent,
  ColliderComponent,
  DamageComponent,
  EnemyTagComponent,
  HealthComponent,
  PlayerTagComponent,
  PositionComponent,
} from '../core/components.core';
import type { EngineContext } from '../core/engine.core';

const bulletQuery = defineQuery([BulletTagComponent, PositionComponent, ColliderComponent, DamageComponent]);
const enemyQuery = defineQuery([EnemyTagComponent, PositionComponent, ColliderComponent, HealthComponent]);
const playerQuery = defineQuery([PlayerTagComponent, PositionComponent, ColliderComponent]);

export function collisionSystem(context: EngineContext): void {
  const bullets = bulletQuery(context.world);
  const enemies = enemyQuery(context.world);
  const players = playerQuery(context.world);

  for (const bulletEntity of bullets) {
    let bulletRemoved = false;
    for (const enemyEntity of enemies) {
      if (circlesOverlap(bulletEntity, enemyEntity)) {
        HealthComponent.hp[enemyEntity] -= DamageComponent.value[bulletEntity];
        removeEntity(context.world, bulletEntity);
        bulletRemoved = true;

        if (HealthComponent.hp[enemyEntity] <= 0) {
          removeEntity(context.world, enemyEntity);
          context.runScore += 100 * context.runMultiplier;
          context.runCombo = Math.min(99, context.runCombo + 0.8);
          context.runMultiplier = 1 + Math.floor(context.runCombo / 4) * 0.2;
          context.metaState.runtimeXp += 3;
        }
        break;
      }
    }
    if (bulletRemoved) {
      continue;
    }
  }

  for (const playerEntity of players) {
    for (const enemyEntity of enemies) {
      if (circlesOverlap(playerEntity, enemyEntity)) {
        removeEntity(context.world, enemyEntity);
        context.runCombo = 0;
        context.runMultiplier = 1;
        context.runScore = Math.max(0, context.runScore - 150);
      }
    }
  }

  context.runCombo = Math.max(0, context.runCombo - context.deltaMs * 0.0012);
  context.runMultiplier = Math.max(1, 1 + Math.floor(context.runCombo / 4) * 0.2);
}

function circlesOverlap(entityA: number, entityB: number): boolean {
  const dx = PositionComponent.x[entityA] - PositionComponent.x[entityB];
  const dy = PositionComponent.y[entityA] - PositionComponent.y[entityB];
  const radius = ColliderComponent.radius[entityA] + ColliderComponent.radius[entityB];
  return dx * dx + dy * dy <= radius * radius;
}
