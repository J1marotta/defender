import { addComponent, addEntity, defineQuery, removeEntity } from 'bitecs';
import {
  ColliderComponent,
  DamageComponent,
  LifetimeComponent,
  PositionComponent,
  ProjectileTagComponent,
  RenderableComponent,
  VelocityComponent,
  WeaponComponent,
} from '../core/components.core';
import { GAME_WIDTH, type EngineContext } from '../core/engine.core';

const projectileQuery = defineQuery([ProjectileTagComponent, PositionComponent, VelocityComponent, LifetimeComponent]);

export function spawnProjectileFromPlayer(context: EngineContext): void {
  const player = context.playerEntity;
  const projectile = addEntity(context.world);

  addComponent(context.world, ProjectileTagComponent, projectile);
  addComponent(context.world, PositionComponent, projectile);
  addComponent(context.world, VelocityComponent, projectile);
  addComponent(context.world, LifetimeComponent, projectile);
  addComponent(context.world, DamageComponent, projectile);
  addComponent(context.world, ColliderComponent, projectile);
  addComponent(context.world, RenderableComponent, projectile);
  PositionComponent.x[projectile] = PositionComponent.x[player] + 18;
  PositionComponent.y[projectile] = PositionComponent.y[player];
  VelocityComponent.x[projectile] = 1.2;
  VelocityComponent.y[projectile] = 0;
  LifetimeComponent.remainingMs[projectile] = 1100;
  DamageComponent.value[projectile] = 1;
  ColliderComponent.radius[projectile] = 4;
  RenderableComponent.width[projectile] = 8;
  RenderableComponent.height[projectile] = 3;
  RenderableComponent.color[projectile] = 0x7ee6ff;

  const doubleShotChance = context.activeModifierTotals.doubleShotChanceDelta;
  if (Math.random() < doubleShotChance) {
    const second = addEntity(context.world);
    addComponent(context.world, ProjectileTagComponent, second);
    addComponent(context.world, PositionComponent, second);
    addComponent(context.world, VelocityComponent, second);
    addComponent(context.world, LifetimeComponent, second);
    addComponent(context.world, DamageComponent, second);
    addComponent(context.world, ColliderComponent, second);
    addComponent(context.world, RenderableComponent, second);
    PositionComponent.x[second] = PositionComponent.x[player] + 18;
    PositionComponent.y[second] = PositionComponent.y[player] - 8;
    VelocityComponent.x[second] = 1.2;
    VelocityComponent.y[second] = 0;
    LifetimeComponent.remainingMs[second] = 1100;
    DamageComponent.value[second] = 1;
    ColliderComponent.radius[second] = 4;
    RenderableComponent.width[second] = 8;
    RenderableComponent.height[second] = 3;
    RenderableComponent.color[second] = 0x7ee6ff;
  }
}

export function projectileSystem(context: EngineContext): void {
  const entities = projectileQuery(context.world);

  for (let i = 0; i < entities.length; i += 1) {
    const e = entities[i];
    PositionComponent.x[e] = PositionComponent.x[e] + VelocityComponent.x[e] * context.deltaMs;
    PositionComponent.y[e] = PositionComponent.y[e] + VelocityComponent.y[e] * context.deltaMs;
    LifetimeComponent.remainingMs[e] = LifetimeComponent.remainingMs[e] - context.deltaMs;

    if (LifetimeComponent.remainingMs[e] <= 0 || PositionComponent.x[e] > GAME_WIDTH + 20) {
      removeEntity(context.world, e);
    }
  }
}

export function applyPlayerAttackSpeed(context: EngineContext): void {
  const rankAttackSpeed = context.metaState.purchasedRanks['meta.player.base_attack_speed'] || 0;
  const modifierAttackSpeed = context.activeModifierTotals.attackSpeedMultiplier;
  const attackSpeedMultiplier = (1 + rankAttackSpeed * 0.03) * modifierAttackSpeed;
  const cooldown = 150 / attackSpeedMultiplier;
  WeaponComponent.cooldownMs[context.playerEntity] = cooldown;
}
