import { PositionComponent, VelocityComponent } from '../core/components.core';
import { GAME_HEIGHT, GAME_WIDTH, type EngineContext } from '../core/engine.core';

const BASE_ACCELERATION = 0.0014;
const BASE_MAX_SPEED = 0.8;
const DRAG = 0.001;

export function playerMovementSystem(context: EngineContext): void {
  const e = context.playerEntity;
  const input = context.inputState;
  const dt = context.deltaMs;

  const rankMobility = getRank(context.metaState.purchasedRanks, 'meta.player.base_mobility');
  const mobilityMultiplier = 1 + rankMobility * 0.03;

  const acceleration = BASE_ACCELERATION * mobilityMultiplier;
  const maxSpeed = BASE_MAX_SPEED * mobilityMultiplier;

  const inputX = input.moveX;
  const inputY = input.moveY;

  VelocityComponent.x[e] += inputX * acceleration * dt;
  VelocityComponent.y[e] += inputY * acceleration * dt;

  VelocityComponent.x[e] *= Math.max(0, 1 - DRAG * dt);
  VelocityComponent.y[e] *= Math.max(0, 1 - DRAG * dt);

  VelocityComponent.x[e] = clamp(VelocityComponent.x[e], -maxSpeed, maxSpeed);
  VelocityComponent.y[e] = clamp(VelocityComponent.y[e], -maxSpeed, maxSpeed);

  PositionComponent.x[e] = wrap(PositionComponent.x[e] + VelocityComponent.x[e] * dt, GAME_WIDTH);
  PositionComponent.y[e] = clamp(PositionComponent.y[e] + VelocityComponent.y[e] * dt, 24, GAME_HEIGHT - 24);
}

function getRank(purchasedRanks: Record<string, number>, id: string): number {
  if (Object.prototype.hasOwnProperty.call(purchasedRanks, id)) {
    return purchasedRanks[id];
  }
  return 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function wrap(value: number, max: number): number {
  if (value < 0) return value + max;
  if (value > max) return value - max;
  return value;
}
