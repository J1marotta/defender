import { WeaponComponent } from '../core/components.core';
import type { EngineContext } from '../core/engine.core';
import { spawnProjectileFromPlayer } from './projectile.system';

export function weaponSystem(context: EngineContext): void {
  const e = context.playerEntity;
  const dt = context.deltaMs;

  WeaponComponent.cooldownRemainingMs[e] = Math.max(0, WeaponComponent.cooldownRemainingMs[e] - dt);

  if (context.inputState.firePrimary && WeaponComponent.cooldownRemainingMs[e] <= 0) {
    WeaponComponent.cooldownRemainingMs[e] = WeaponComponent.cooldownMs[e];
    context.shotsFired += 1;
    context.runScore += 15 * context.runMultiplier;
    context.runCombo = Math.min(99, context.runCombo + 0.25);
    context.runMultiplier = 1 + Math.floor(context.runCombo / 4) * 0.2;
    context.metaState.runtimeXp += 1;
    spawnProjectileFromPlayer(context);
  } else {
    context.runCombo = Math.max(0, context.runCombo - dt * 0.0015);
    context.runMultiplier = Math.max(1, 1 + Math.floor(context.runCombo / 4) * 0.2);
  }
}
