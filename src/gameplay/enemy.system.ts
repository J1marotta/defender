import { addComponent, addEntity, defineQuery, removeEntity } from 'bitecs';
import {
  ColliderComponent,
  DamageComponent,
  EnemyBehaviorComponent,
  EnemyTagComponent,
  HealthComponent,
  PositionComponent,
  RenderableComponent,
  VelocityComponent,
} from '../core/components.core';
import { GAME_HEIGHT, GAME_WIDTH, type EngineContext } from '../core/engine.core';
import { enemyArchetypesData } from '../content/enemies.data';

const enemyQuery = defineQuery([EnemyTagComponent, PositionComponent, VelocityComponent, EnemyBehaviorComponent]);

export function enemySpawnSystem(context: EngineContext): void {
  context.enemySpawnTimerMs -= context.deltaMs;
  if (context.enemySpawnTimerMs > 0) {
    return;
  }

  context.enemySpawnTimerMs = context.enemySpawnIntervalMs;
  const randomIndex = Math.floor(Math.random() * enemyArchetypesData.length);
  const archetype = enemyArchetypesData[randomIndex];
  const enemy = addEntity(context.world);

  addComponent(context.world, EnemyTagComponent, enemy);
  PositionComponent.x[enemy] = Math.random() * GAME_WIDTH;
  PositionComponent.y[enemy] = 40 + Math.random() * (GAME_HEIGHT - 120);
  VelocityComponent.x[enemy] = (Math.random() * 2 - 1) * archetype.speed;
  VelocityComponent.y[enemy] = (Math.random() * 2 - 1) * archetype.speed;
  EnemyBehaviorComponent.kind[enemy] = archetype.behaviorKind;
  ColliderComponent.radius[enemy] = archetype.radius;
  HealthComponent.current[enemy] = archetype.hitPoints;
  HealthComponent.max[enemy] = archetype.hitPoints;
  DamageComponent.value[enemy] = archetype.touchDamage;
  RenderableComponent.width[enemy] = archetype.radius * 2;
  RenderableComponent.height[enemy] = archetype.radius * 2;
  RenderableComponent.color[enemy] = archetype.color;

  context.enemyScoreByEntity[enemy] = archetype.scoreValue;
}

export function enemyMovementSystem(context: EngineContext): void {
  const entities = enemyQuery(context.world);
  const playerX = PositionComponent.x[context.playerEntity];
  const playerY = PositionComponent.y[context.playerEntity];

  for (let i = 0; i < entities.length; i += 1) {
    const e = entities[i];
    const kind = EnemyBehaviorComponent.kind[e];
    const dx = playerX - PositionComponent.x[e];
    const dy = playerY - PositionComponent.y[e];
    const length = Math.hypot(dx, dy) || 1;

    if (kind === 1 || kind === 4) {
      VelocityComponent.x[e] += (dx / length) * 0.01;
      VelocityComponent.y[e] += (dy / length) * 0.01;
    } else if (kind === 2) {
      VelocityComponent.x[e] += (dy / length) * 0.007;
      VelocityComponent.y[e] -= (dx / length) * 0.007;
    } else if (kind === 3) {
      VelocityComponent.x[e] += (dy / length) * 0.005;
      VelocityComponent.y[e] -= (dx / length) * 0.005;
    } else if (kind === 5) {
      VelocityComponent.x[e] += (dx / length) * 0.003;
      VelocityComponent.y[e] += (dy / length) * 0.003;
    }

    VelocityComponent.x[e] *= 0.985;
    VelocityComponent.y[e] *= 0.985;

    PositionComponent.x[e] = wrap(PositionComponent.x[e] + VelocityComponent.x[e] * context.deltaMs, GAME_WIDTH);
    PositionComponent.y[e] = clamp(PositionComponent.y[e] + VelocityComponent.y[e] * context.deltaMs, 24, GAME_HEIGHT - 24);

    if (HealthComponent.current[e] <= 0) {
      const enemyScore = context.enemyScoreByEntity[e] || 50;
      context.runScore += enemyScore * context.runMultiplier;
      context.runCombo = Math.min(99, context.runCombo + 0.8);
      context.metaState.runtimeXp += 4;
      removeEntity(context.world, e);
      delete context.enemyScoreByEntity[e];
    }
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function wrap(value: number, max: number): number {
  if (value < 0) return value + max;
  if (value > max) return value - max;
  return value;
}
