import type { EngineContext } from '../core/engine.core';

export type TutorialStep = {
  id: string;
  chapter: string;
  title: string;
  why: string;
  fileHint: string;
  autoComplete?: (context: EngineContext) => boolean;
};

export type LiveTutorialState = {
  visible: boolean;
  currentStepIndex: number;
  manuallyConfirmedStepIds: Record<string, true>;
};

const STORAGE_KEY = 'defender.liveTutorial.v1';

const steps: TutorialStep[] = [
  {
    id: 'menu-state',
    chapter: 'Feature 1: Menu + UI State',
    title: 'Implement menu and pause state transitions',
    why: 'Understand where lifecycle state should live and how systems are gated by phase.',
    fileHint: 'Edit src/core/engine.core.ts',
    autoComplete: (context) => context.gamePhase === 'paused' || context.gamePhase === 'playing',
  },
  {
    id: 'input-aware-ui',
    chapter: 'Feature 1: Menu + UI State',
    title: 'Switch UI hints based on active input mode',
    why: 'Learn how input abstraction feeds UI state without game logic caring about devices.',
    fileHint: 'Edit src/input/input-state.input.ts and src/core/engine.core.ts',
    autoComplete: (context) => context.inputState.lastInputMode === 'controller' && context.inputState.controllerConnected,
  },
  {
    id: 'projectiles-and-collision',
    chapter: 'Feature 2: Core Combat Loop',
    title: 'Add projectile + enemy collision loop',
    why: 'Build ECS confidence by adding entities and a dedicated collision system.',
    fileHint: 'Edit src/core/components.core.ts + add gameplay systems',
    autoComplete: (context) => context.shotsFired >= 10 && context.runScore >= 200,
  },
  {
    id: 'juice-and-sound',
    chapter: 'Feature 2: Core Combat Loop',
    title: 'Add juice feedback and SFX hooks',
    why: 'See how game feel comes from feedback systems, not just mechanics.',
    fileHint: 'Add/render FX + audio abstraction in engine/gameplay modules',
  },
  {
    id: 'upgrades-save-animation',
    chapter: 'Feature 3: Progression + Polish',
    title: 'Integrate upgrades, save flow, and sprite-sheet animation state',
    why: 'Practice data-driven progression and visual pipelines that survive content swaps.',
    fileHint: 'Edit src/meta/*.ts, src/content/*.data.ts, and render layer',
  },
];

export function createLiveTutorialState(): LiveTutorialState {
  const fallback: LiveTutorialState = {
    visible: true,
    currentStepIndex: 0,
    manuallyConfirmedStepIds: {},
  };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<LiveTutorialState>;

    return {
      visible: typeof parsed.visible === 'boolean' ? parsed.visible : fallback.visible,
      currentStepIndex: Number.isInteger(parsed.currentStepIndex) ? clamp(parsed.currentStepIndex as number, 0, steps.length - 1) : 0,
      manuallyConfirmedStepIds: parsed.manuallyConfirmedStepIds && typeof parsed.manuallyConfirmedStepIds === 'object'
        ? (parsed.manuallyConfirmedStepIds as Record<string, true>)
        : {},
    };
  } catch {
    return fallback;
  }
}

export function updateLiveTutorialSystem(context: EngineContext): void {
  const tutorial = context.liveTutorial;

  if (context.inputState.tutorialTogglePressed) {
    tutorial.visible = !tutorial.visible;
  }

  if (context.inputState.tutorialNextPressed) {
    tutorial.currentStepIndex = clamp(tutorial.currentStepIndex + 1, 0, steps.length - 1);
  }

  if (context.inputState.tutorialPrevPressed) {
    tutorial.currentStepIndex = clamp(tutorial.currentStepIndex - 1, 0, steps.length - 1);
  }

  const activeStep = steps[tutorial.currentStepIndex];
  const autoComplete = activeStep.autoComplete ? activeStep.autoComplete(context) : false;

  if (context.inputState.tutorialConfirmPressed || autoComplete) {
    tutorial.manuallyConfirmedStepIds[activeStep.id] = true;
    if (tutorial.currentStepIndex < steps.length - 1) {
      tutorial.currentStepIndex += 1;
    }
  }

  persistLiveTutorialState(tutorial);

  context.tutorialLabel.visible = tutorial.visible;
  context.tutorialLabel.text = tutorial.visible
    ? renderTutorialPanel(context, activeStep, autoComplete)
    : '';
}

function renderTutorialPanel(context: EngineContext, activeStep: TutorialStep, activeStepAutoComplete: boolean): string {
  const completedCount = steps.filter((step) => context.liveTutorial.manuallyConfirmedStepIds[step.id]).length;
  const inputHint = context.inputState.lastInputMode === 'controller'
    ? 'Y toggle / DPad◀▶ change / B complete step'
    : 'H toggle / [ ] change / M complete step';

  return [
    'LIVE TUTORIAL',
    `${completedCount}/${steps.length} steps complete`,
    ``,
    `${activeStep.chapter}`,
    `${context.liveTutorial.currentStepIndex + 1}. ${activeStep.title}`,
    `Why: ${activeStep.why}`,
    `Try here: ${activeStep.fileHint}`,
    `Auto-check: ${activeStepAutoComplete ? 'ready ✓' : 'waiting...'}`,
    '',
    `Controls: ${inputHint}`,
    'Tip: keep dev server running and edit files live.',
  ].join('\n');
}

function persistLiveTutorialState(state: LiveTutorialState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore localStorage write errors.
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
