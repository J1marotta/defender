import { WeaponComponent } from '../core/components.core';
import { spawnPlayerBulletCore } from '../core/factories.core';
import type { EngineContext } from '../core/engine.core';
import { PositionComponent } from '../core/components.core';

export function weaponSystem(context: EngineContext): void {
  const e = context.playerEntity;
  const dt = context.deltaMs;

  WeaponComponent.cooldownRemainingMs[e] = Math.max(0, WeaponComponent.cooldownRemainingMs[e] - dt);

  const rankAttackSpeed = getRank(context.metaState.purchasedRanks, 'meta.player.base_attack_speed');
  const attackSpeedMultiplier = 1 + rankAttackSpeed * 0.03;
  const cooldownMs = WeaponComponent.cooldownMs[e] / attackSpeedMultiplier;

  if (context.inputState.firePrimary && WeaponComponent.cooldownRemainingMs[e] <= 0) {
    WeaponComponent.cooldownRemainingMs[e] = cooldownMs;
    context.shotsFired += 1;
    spawnPlayerBulletCore(context.world, PositionComponent.x[e], PositionComponent.y[e]);
  }
}

function getRank(purchasedRanks: Record<string, number>, id: string): number {
  if (Object.prototype.hasOwnProperty.call(purchasedRanks, id)) {
    return purchasedRanks[id];
  }
  return 0;
}
