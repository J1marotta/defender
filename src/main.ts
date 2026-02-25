import { createEngineCore } from './core/engine.core';

const mountNode = document.querySelector<HTMLDivElement>('#app');

if (!mountNode) {
  throw new Error('Missing #app mount node');
}

void createEngineCore(mountNode);
