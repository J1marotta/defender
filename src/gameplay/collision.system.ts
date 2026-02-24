import { defineQuery, removeEntity } from 'bitecs';
import {
  ColliderComponent,
  DamageComponent,
  EnemyTagComponent,
  HealthComponent,
  PlayerTagComponent,
  PositionComponent,
  ProjectileTagComponent,
} from '../core/components.core';
import type { EngineContext } from '../core/engine.core';

const enemyQuery = defineQuery([EnemyTagComponent, PositionComponent, ColliderComponent, HealthComponent, DamageComponent]);
const projectileQuery = defineQuery([ProjectileTagComponent, PositionComponent, ColliderComponent, DamageComponent]);
const playerQuery = defineQuery([PlayerTagComponent, PositionComponent, ColliderComponent]);

export function collisionSystem(context: EngineContext): void {
  const enemies = enemyQuery(context.world);
  const projectiles = projectileQuery(context.world);
  const players = playerQuery(context.world);

  for (let i = 0; i < projectiles.length; i += 1) {
    const p = projectiles[i];
    let projectileConsumed = false;

    for (let j = 0; j < enemies.length; j += 1) {
      const e = enemies[j];
      if (touching(p, e)) {
        HealthComponent.current[e] = HealthComponent.current[e] - DamageComponent.value[p];
        removeEntity(context.world, p);
        projectileConsumed = true;
        break;
      }
    }

    if (projectileConsumed) {
      continue;
    }
  }

  if (players.length === 0) {
    return;
  }

  const player = players[0];
  for (let i = 0; i < enemies.length; i += 1) {
    const e = enemies[i];
    if (touching(player, e)) {
      context.playerHull = Math.max(0, context.playerHull - DamageComponent.value[e]);
      context.runCombo = 0;
      context.runMultiplier = 1;
      removeEntity(context.world, e);
      delete context.enemyScoreByEntity[e];
    }
  }
}

function touching(a: number, b: number): boolean {
  const dx = PositionComponent.x[a] - PositionComponent.x[b];
  const dy = PositionComponent.y[a] - PositionComponent.y[b];
  const r = ColliderComponent.radius[a] + ColliderComponent.radius[b];
  return dx * dx + dy * dy <= r * r;
}
