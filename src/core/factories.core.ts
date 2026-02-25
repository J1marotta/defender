import { addEntity, addComponent, type IWorld } from 'bitecs';
import {
  BulletTagComponent,
  ColliderComponent,
  DamageComponent,
  EnemyBehaviorComponent,
  EnemyTagComponent,
  HealthComponent,
  LifetimeComponent,
  PositionComponent,
  RenderableComponent,
  VelocityComponent,
} from './components.core';
import { enemyArchetypesData, type EnemyArchetypeData } from '../content/enemy-archetypes.data';
import { GAME_HEIGHT, GAME_WIDTH } from './engine.core';

export function spawnPlayerBulletCore(world: IWorld, x: number, y: number): number {
  const entity = addEntity(world);
  addComponent(world, BulletTagComponent, entity);
  addComponent(world, PositionComponent, entity);
  addComponent(world, VelocityComponent, entity);
  addComponent(world, RenderableComponent, entity);
  addComponent(world, ColliderComponent, entity);
  addComponent(world, LifetimeComponent, entity);
  addComponent(world, DamageComponent, entity);

  PositionComponent.x[entity] = x + 20;
  PositionComponent.y[entity] = y;
  VelocityComponent.x[entity] = 1.05;
  VelocityComponent.y[entity] = 0;

  RenderableComponent.width[entity] = 10;
  RenderableComponent.height[entity] = 2;
  RenderableComponent.color[entity] = 0xd6f0ff;

  ColliderComponent.radius[entity] = 4;
  LifetimeComponent.remainingMs[entity] = 1700;
  DamageComponent.value[entity] = 1;

  return entity;
}

export function spawnEnemyCore(world: IWorld, nowMs: number): number {
  const entity = addEntity(world);
  addComponent(world, EnemyTagComponent, entity);
  addComponent(world, PositionComponent, entity);
  addComponent(world, VelocityComponent, entity);
  addComponent(world, RenderableComponent, entity);
  addComponent(world, ColliderComponent, entity);
  addComponent(world, HealthComponent, entity);
  addComponent(world, EnemyBehaviorComponent, entity);

  const archetype = randomArchetype();
  const spawnFromLeft = Math.random() > 0.5;
  const spawnY = 90 + Math.random() * (GAME_HEIGHT - 180);

  PositionComponent.x[entity] = spawnFromLeft ? 40 : GAME_WIDTH - 40;
  PositionComponent.y[entity] = spawnY;
  VelocityComponent.x[entity] = spawnFromLeft ? archetype.speed : -archetype.speed;
  VelocityComponent.y[entity] = 0;

  RenderableComponent.width[entity] = archetype.size;
  RenderableComponent.height[entity] = archetype.size;
  RenderableComponent.color[entity] = archetype.color;

  ColliderComponent.radius[entity] = archetype.size * 0.55;
  HealthComponent.hp[entity] = archetype.hp;
  EnemyBehaviorComponent.archetypeId[entity] = archetype.id;
  EnemyBehaviorComponent.seed[entity] = nowMs * 0.001 + Math.random() * 10;

  return entity;
}

function randomArchetype(): EnemyArchetypeData {
  const index = Math.floor(Math.random() * enemyArchetypesData.length);
  return enemyArchetypesData[index];
}
