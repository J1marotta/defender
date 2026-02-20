import { addEntity, createWorld, type IWorld } from 'bitecs';
import { Application, Graphics, Text } from 'pixi.js';
import {
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

export const GAME_WIDTH = 1200;
export const GAME_HEIGHT = 675;

export type EngineContext = {
  app: Application;
  world: IWorld;
  playerEntity: number;
  playerGraphic: Graphics;
  hudLabel: Text;
  inputState: ReturnType<typeof createInputState>;
  currentTimeMs: number;
  deltaMs: number;
  runScore: number;
  runCombo: number;
  runMultiplier: number;
  shotsFired: number;
  metaState: ReturnType<typeof createPersistedMetaState>;
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

  PositionComponent.x[playerEntity] = GAME_WIDTH * 0.5;
  PositionComponent.y[playerEntity] = GAME_HEIGHT * 0.5;
  VelocityComponent.x[playerEntity] = 0;
  VelocityComponent.y[playerEntity] = 0;
  PlayerTagComponent[playerEntity] = 1;
  WeaponComponent.cooldownMs[playerEntity] = 150;
  WeaponComponent.cooldownRemainingMs[playerEntity] = 0;
  RenderableComponent.width[playerEntity] = 24;
  RenderableComponent.height[playerEntity] = 12;
  RenderableComponent.color[playerEntity] = 0x58d5ff;

  const playerGraphic = new Graphics()
    .poly([0, -8, 22, 0, 0, 8])
    .fill({ color: 0x58d5ff });
  app.stage.addChild(playerGraphic);

  const hudLabel = new Text({
    text: '',
    style: { fill: '#b5c7ff', fontFamily: 'monospace', fontSize: 18 },
  });
  hudLabel.x = 16;
  hudLabel.y = 16;
  app.stage.addChild(hudLabel);

  const inputState = createInputState();
  const metaState = createPersistedMetaState(baseMetaUpgradesData);

  const context: EngineContext = {
    app,
    world,
    playerEntity,
    playerGraphic,
    hudLabel,
    inputState,
    currentTimeMs: 0,
    deltaMs: 0,
    runScore: 0,
    runCombo: 0,
    runMultiplier: 1,
    shotsFired: 0,
    metaState,
  };

  app.ticker.add((ticker) => {
    context.currentTimeMs += ticker.deltaMS;
    context.deltaMs = ticker.deltaMS;

    updateInputState(context.inputState);

    playerMovementSystem(context);
    weaponSystem(context);

    const x = PositionComponent.x[playerEntity];
    const y = PositionComponent.y[playerEntity];
    playerGraphic.x = x;
    playerGraphic.y = y;

    hudLabel.text = [
      `Score ${Math.floor(context.runScore)}   Combo ${context.runCombo.toFixed(1)}   x${context.runMultiplier.toFixed(1)}`,
      `XP ${context.metaState.runtimeXp}   Meta ${context.metaState.metaCurrency}`,
      `Controller ${context.inputState.controllerConnected ? 'connected' : 'not connected'}   Shots ${context.shotsFired}`,
    ].join('\n');
  });

  return context;
}
