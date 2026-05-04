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
import { createParallaxBackground, updateParallaxBackgroundSystem, type ParallaxBackgroundState } from '../rendering/parallax-background.system';
import { baseMetaUpgradesData } from '../content/meta-upgrades.data';
import {
  createLiveTutorialState,
  updateLiveTutorialSystem,
  type LiveTutorialState,
} from '../tutorial/live-tutorial.system';

export const GAME_WIDTH = 1200;
export const GAME_HEIGHT = 675;

export type EngineContext = {
  app: Application;
  world: IWorld;
  playerEntity: number;
  playerGraphic: Graphics;
  hudLabel: Text;
  phaseLabel: Text;
  tutorialLabel: Text;
  inputState: ReturnType<typeof createInputState>;
  gamePhase: 'menu' | 'playing' | 'paused';
  currentTimeMs: number;
  deltaMs: number;
  runScore: number;
  runCombo: number;
  runMultiplier: number;
  shotsFired: number;
  metaState: ReturnType<typeof createPersistedMetaState>;
  liveTutorial: LiveTutorialState;
  parallaxBackground: ParallaxBackgroundState;
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

  const parallaxBackground = createParallaxBackground();
  app.stage.addChild(parallaxBackground.root);

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

  const phaseLabel = new Text({
    text: '',
    style: { fill: '#f5d06c', fontFamily: 'monospace', fontSize: 18 },
  });
  phaseLabel.x = 16;
  phaseLabel.y = GAME_HEIGHT - 56;
  app.stage.addChild(phaseLabel);

  const tutorialLabel = new Text({
    text: '',
    style: { fill: '#a4f2df', fontFamily: 'monospace', fontSize: 14 },
  });
  tutorialLabel.x = GAME_WIDTH - 480;
  tutorialLabel.y = 16;
  app.stage.addChild(tutorialLabel);

  const inputState = createInputState();
  const metaState = createPersistedMetaState(baseMetaUpgradesData);
  const liveTutorial = createLiveTutorialState();

  const context: EngineContext = {
    app,
    world,
    playerEntity,
    playerGraphic,
    hudLabel,
    phaseLabel,
    tutorialLabel,
    inputState,
    gamePhase: 'menu',
    currentTimeMs: 0,
    deltaMs: 0,
    runScore: 0,
    runCombo: 0,
    runMultiplier: 1,
    shotsFired: 0,
    metaState,
    liveTutorial,
    parallaxBackground,
  };

  app.ticker.add((ticker) => {
    context.currentTimeMs += ticker.deltaMS;
    context.deltaMs = ticker.deltaMS;

    updateInputState(context.inputState);

    if (context.inputState.startPressed && context.gamePhase === 'menu') {
      context.gamePhase = 'playing';
    }
    if (context.inputState.pausePressed && context.gamePhase !== 'menu') {
      context.gamePhase = context.gamePhase === 'paused' ? 'playing' : 'paused';
    }

    if (context.gamePhase === 'playing') {
      playerMovementSystem(context);
      weaponSystem(context);
    }
    updateParallaxBackgroundSystem(context);
    updateLiveTutorialSystem(context);

    const x = PositionComponent.x[playerEntity];
    const y = PositionComponent.y[playerEntity];
    playerGraphic.x = x;
    playerGraphic.y = y;

    hudLabel.text = [
      `Phase ${context.gamePhase.toUpperCase()}`,
      `Score ${Math.floor(context.runScore)}   Combo ${context.runCombo.toFixed(1)}   x${context.runMultiplier.toFixed(1)}`,
      `XP ${context.metaState.runtimeXp}   Meta ${context.metaState.metaCurrency}`,
      `Controller ${context.inputState.controllerConnected ? 'connected' : 'not connected'}   Shots ${context.shotsFired}`,
    ].join('\n');

    phaseLabel.text = context.gamePhase === 'menu'
      ? getStartPrompt(context)
      : context.gamePhase === 'paused'
        ? getResumePrompt(context)
        : '';
  });

  return context;
}

function getStartPrompt(context: EngineContext): string {
  return context.inputState.lastInputMode === 'controller'
    ? 'Press A to start'
    : 'Press Enter to start';
}

function getResumePrompt(context: EngineContext): string {
  return context.inputState.lastInputMode === 'controller'
    ? 'Paused — press Start to resume'
    : 'Paused — press Esc/P to resume';
}
