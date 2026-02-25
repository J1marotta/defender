import { addComponent, addEntity, defineQuery, enterQuery, exitQuery, type IWorld, createWorld } from 'bitecs';
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
import { projectileSystem } from '../gameplay/projectile.system';
import { enemyMovementSystem, enemySpawnSystem } from '../gameplay/enemy.system';
import { collisionSystem } from '../gameplay/collision.system';

export const GAME_WIDTH = 1200;
export const GAME_HEIGHT = 675;

const renderQuery = defineQuery([RenderableComponent, PositionComponent]);
const renderEnterQuery = enterQuery(renderQuery);
const renderExitQuery = exitQuery(renderQuery);

export type EngineContext = {
  app: Application;
  world: IWorld;
  playerEntity: number;
  hudLabel: Text;
  entityGraphics: Map<number, Graphics>;
  inputState: ReturnType<typeof createInputState>;
  currentTimeMs: number;
  deltaMs: number;
  runScore: number;
  runCombo: number;
  runMultiplier: number;
  shotsFired: number;
  lastEnemySpawnMs: number;
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
  addComponent(world, PlayerTagComponent, playerEntity);
  addComponent(world, PositionComponent, playerEntity);
  addComponent(world, VelocityComponent, playerEntity);
  addComponent(world, WeaponComponent, playerEntity);
  addComponent(world, RenderableComponent, playerEntity);
  addComponent(world, ColliderComponent, playerEntity);

  PositionComponent.x[playerEntity] = GAME_WIDTH * 0.5;
  PositionComponent.y[playerEntity] = GAME_HEIGHT * 0.5;
  VelocityComponent.x[playerEntity] = 0;
  VelocityComponent.y[playerEntity] = 0;
  WeaponComponent.cooldownMs[playerEntity] = 150;
  WeaponComponent.cooldownRemainingMs[playerEntity] = 0;
  RenderableComponent.width[playerEntity] = 24;
  RenderableComponent.height[playerEntity] = 12;
  RenderableComponent.color[playerEntity] = 0x58d5ff;
  ColliderComponent.radius[playerEntity] = 11;

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
    hudLabel,
    entityGraphics: new Map<number, Graphics>(),
    inputState,
    currentTimeMs: 0,
    deltaMs: 0,
    runScore: 0,
    runCombo: 0,
    runMultiplier: 1,
    shotsFired: 0,
    lastEnemySpawnMs: 0,
    metaState,
  };

  app.ticker.add((ticker) => {
    context.currentTimeMs += ticker.deltaMS;
    context.deltaMs = ticker.deltaMS;

    updateInputState(context.inputState);
    playerMovementSystem(context);
    weaponSystem(context);
    enemySpawnSystem(context);
    enemyMovementSystem(context);
    projectileSystem(context);
    collisionSystem(context);

    syncRenderableGraphics(context);

    hudLabel.text = [
      `Score ${Math.floor(context.runScore)}   Combo ${context.runCombo.toFixed(1)}   x${context.runMultiplier.toFixed(1)}`,
      `XP ${context.metaState.runtimeXp}   Meta ${context.metaState.metaCurrency}`,
      `Controller ${context.inputState.controllerConnected ? 'connected' : 'not connected'}   Shots ${context.shotsFired}`,
      `Enemies roam and collide: shoot to survive`,
    ].join('\n');
  });

  return context;
}

function syncRenderableGraphics(context: EngineContext): void {
  const entered = renderEnterQuery(context.world);
  for (const entity of entered) {
    const width = RenderableComponent.width[entity];
    const height = RenderableComponent.height[entity];
    const color = RenderableComponent.color[entity];

    const graphic = new Graphics()
      .rect(-width * 0.5, -height * 0.5, width, height)
      .fill({ color });

    context.entityGraphics.set(entity, graphic);
    context.app.stage.addChild(graphic);
  }

  const entities = renderQuery(context.world);
  for (const entity of entities) {
    const graphic = context.entityGraphics.get(entity);
    if (graphic) {
      graphic.x = PositionComponent.x[entity];
      graphic.y = PositionComponent.y[entity];
      if (entity === context.playerEntity) {
        graphic.rotation = VelocityComponent.x[entity] * 0.08;
      }
    }
  }

  const exited = renderExitQuery(context.world);
  for (const entity of exited) {
    const graphic = context.entityGraphics.get(entity);
    if (graphic) {
      graphic.destroy();
      context.entityGraphics.delete(entity);
    }
  }

}
