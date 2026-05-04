#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const vendorRoot = resolve(process.cwd(), 'tools');
const forgeDir = resolve(vendorRoot, 'agent-sprite-forge');
if (!existsSync(vendorRoot)) mkdirSync(vendorRoot, { recursive: true });

if (!existsSync(forgeDir)) {
  execSync(`git clone https://github.com/0x0funky/agent-sprite-forge ${forgeDir}`, { stdio: 'inherit' });
} else {
  execSync('git pull --ff-only', { cwd: forgeDir, stdio: 'inherit' });
}

console.log('\nagent-sprite-forge is ready at tools/agent-sprite-forge');
console.log('Next: open tools/agent-sprite-forge and run its generation workflow for alien-bioworld parallax layers.');
console.log('Use deterministic seeds and export outputs into assets/generated/parallax/.');
