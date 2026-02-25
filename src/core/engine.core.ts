import { addComponent, addEntity, createWorld, type IWorld } from 'bitecs';
import { Application, Graphics, Text } from 'pixi.js';
import {
  ColliderComponent,
  PlayerTagComponent,
  PositionComponent,
  RenderableComponent,
  VelocityComponent,
  WeaponComponent,
} from './components.core';
import { createInputState, updateInputState } from '../input/input-state.input';
import { playerMovementSystem } from '../gameplay/player-movement.system';
import { weaponSystem } from '../gameplay/weapon.system';
import { createPersistedMetaState } from '../meta/meta-store.meta';
import { baseMetaUpgradesData } from '../content/meta-upgrades.data';
import { collisionSystem } from '../gameplay/collision.system';
import { enemyMovementSystem, enemySpawnSystem } from '../gameplay/enemy.system';
import { applyPlayerAttackSpeed, projectileSystem } from '../gameplay/projectile.system';
import { stageModifiersData } from '../content/modifiers.data';
import { renderSystem } from '../gameplay/render.system';

export const GAME_WIDTH = 1200;
export const GAME_HEIGHT = 675;

export type EngineContext = {
  app: Application;
  world: IWorld;
  playerEntity: number;
  hudLabel: Text;
  inputState: ReturnType<typeof createInputState>;
  currentTimeMs: number;
  deltaMs: number;
  runScore: number;
  runCombo: number;
  runMultiplier: number;
  shotsFired: number;
  playerHull: number;
  metaState: ReturnType<typeof createPersistedMetaState>;
  enemySpawnTimerMs: number;
  enemySpawnIntervalMs: number;
  enemyScoreByEntity: Record<number, number>;
  graphicsByEntity: Record<number, Graphics>;
  activeModifierTotals: {
    attackSpeedMultiplier: number;
    movementSpeedMultiplier: number;
    dodgeChanceDelta: number;
    doubleShotChanceDelta: number;
  };
  activeModifierLabel: string;
};

export async function createEngineCore(mountNode: HTMLElement): Promise<EngineContext> {
  const app = new Application();
  await app.init({
    background: '#02050b',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    antialias: false,
  });
  mountNode.appendChild(app.canvas);

  const world = createWorld();
  const playerEntity = addEntity(world);

  addComponent(world, PlayerTagComponent, playerEntity);
  addComponent(world, PositionComponent, playerEntity);
  addComponent(world, VelocityComponent, playerEntity);
  addComponent(world, WeaponComponent, playerEntity);
  addComponent(world, ColliderComponent, playerEntity);
  addComponent(world, RenderableComponent, playerEntity);
  PositionComponent.x[playerEntity] = GAME_WIDTH * 0.5;
  PositionComponent.y[playerEntity] = GAME_HEIGHT * 0.5;
  VelocityComponent.x[playerEntity] = 0;
  VelocityComponent.y[playerEntity] = 0;
  WeaponComponent.cooldownMs[playerEntity] = 150;
  WeaponComponent.cooldownRemainingMs[playerEntity] = 0;
  ColliderComponent.radius[playerEntity] = 12;
  RenderableComponent.width[playerEntity] = 24;
  RenderableComponent.height[playerEntity] = 12;
  RenderableComponent.color[playerEntity] = 0x58d5ff;

  const hudLabel = new Text({
    text: '',
    style: { fill: '#b5c7ff', fontFamily: 'monospace', fontSize: 18 },
  });
  hudLabel.x = 16;
  hudLabel.y = 16;
  app.stage.addChild(hudLabel);

  const inputState = createInputState();
  const metaState = createPersistedMetaState(baseMetaUpgradesData);
  const activeModifier = stageModifiersData[Math.floor(Math.random() * stageModifiersData.length)];

  const context: EngineContext = {
    app,
    world,
    playerEntity,
    hudLabel,
    inputState,
    currentTimeMs: 0,
    deltaMs: 0,
    runScore: 0,
    runCombo: 0,
    runMultiplier: 1,
    shotsFired: 0,
    playerHull: 100,
    metaState,
    enemySpawnTimerMs: 500,
    enemySpawnIntervalMs: 850,
    enemyScoreByEntity: {},
    graphicsByEntity: {},
    activeModifierTotals: {
      attackSpeedMultiplier: activeModifier.values.attackSpeedMultiplier,
      movementSpeedMultiplier: activeModifier.values.movementSpeedMultiplier,
      dodgeChanceDelta: activeModifier.values.dodgeChanceDelta,
      doubleShotChanceDelta: activeModifier.values.doubleShotChanceDelta,
    },
    activeModifierLabel: activeModifier.label,
  };

  app.ticker.add((ticker) => {
    context.currentTimeMs += ticker.deltaMS;
    context.deltaMs = ticker.deltaMS;

    updateInputState(context.inputState);
    applyPlayerAttackSpeed(context);

    enemySpawnSystem(context);
    playerMovementSystem(context);
    enemyMovementSystem(context);
    weaponSystem(context);
    projectileSystem(context);
    collisionSystem(context);
    renderSystem(context);

    hudLabel.text = [
      `Hull ${context.playerHull.toFixed(0)}  Score ${Math.floor(context.runScore)}  Combo ${context.runCombo.toFixed(1)}  x${context.runMultiplier.toFixed(1)}`,
      `XP ${context.metaState.runtimeXp}  Meta ${context.metaState.metaCurrency}  Shots ${context.shotsFired}`,
      `Modifier ${context.activeModifierLabel}  Controller ${context.inputState.controllerConnected ? 'connected' : 'not connected'}`,
    ].join('\n');
  });

  return context;
}
