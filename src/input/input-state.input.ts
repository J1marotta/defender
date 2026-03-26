export type InputState = {
  moveX: number;
  moveY: number;
  firePrimary: boolean;
  fireSecondary: boolean;
  controllerConnected: boolean;
  lastInputMode: 'keyboardMouse' | 'controller';
  pausePressed: boolean;
  startPressed: boolean;
  tutorialTogglePressed: boolean;
  tutorialNextPressed: boolean;
  tutorialPrevPressed: boolean;
  tutorialConfirmPressed: boolean;
};

const pressedKeys = new Set<string>();

window.addEventListener('keydown', (event) => {
  pressedKeys.add(event.code);
});

window.addEventListener('keyup', (event) => {
  pressedKeys.delete(event.code);
});

export function createInputState(): InputState {
  return {
    moveX: 0,
    moveY: 0,
    firePrimary: false,
    fireSecondary: false,
    controllerConnected: false,
    lastInputMode: 'keyboardMouse',
    pausePressed: false,
    startPressed: false,
    tutorialTogglePressed: false,
    tutorialNextPressed: false,
    tutorialPrevPressed: false,
    tutorialConfirmPressed: false,
  };
}

export function updateInputState(input: InputState): void {
  const wasPausePressed = input.pausePressed;
  const wasStartPressed = input.startPressed;
  const wasTutorialTogglePressed = input.tutorialTogglePressed;
  const wasTutorialNextPressed = input.tutorialNextPressed;
  const wasTutorialPrevPressed = input.tutorialPrevPressed;
  const wasTutorialConfirmPressed = input.tutorialConfirmPressed;

  const gamepadsFn = navigator.getGamepads;
  const gamepads = gamepadsFn ? gamepadsFn.call(navigator) : [];
  const gamepad = Array.from(gamepads).find(Boolean);

  const keyboardX = (pressedKeys.has('KeyD') || pressedKeys.has('ArrowRight') ? 1 : 0)
    + (pressedKeys.has('KeyA') || pressedKeys.has('ArrowLeft') ? -1 : 0);
  const keyboardY = (pressedKeys.has('KeyS') || pressedKeys.has('ArrowDown') ? 1 : 0)
    + (pressedKeys.has('KeyW') || pressedKeys.has('ArrowUp') ? -1 : 0);

  if (gamepad) {
    const deadzone = 0.18;
    const rawX = Number.isFinite(gamepad.axes[0]) ? gamepad.axes[0] : 0;
    const rawY = Number.isFinite(gamepad.axes[1]) ? gamepad.axes[1] : 0;
    const rtPressed = Boolean(gamepad.buttons[7] && gamepad.buttons[7].pressed);
    const aPressed = Boolean(gamepad.buttons[0] && gamepad.buttons[0].pressed);
    const ltPressed = Boolean(gamepad.buttons[6] && gamepad.buttons[6].pressed);
    const bPressed = Boolean(gamepad.buttons[1] && gamepad.buttons[1].pressed);
    const startHeld = Boolean(gamepad.buttons[9] && gamepad.buttons[9].pressed);
    const dpadRightHeld = Boolean(gamepad.buttons[15] && gamepad.buttons[15].pressed);
    const dpadLeftHeld = Boolean(gamepad.buttons[14] && gamepad.buttons[14].pressed);
    const yHeld = Boolean(gamepad.buttons[3] && gamepad.buttons[3].pressed);

    input.moveX = Math.abs(rawX) > deadzone ? rawX : keyboardX;
    input.moveY = Math.abs(rawY) > deadzone ? rawY : keyboardY;
    input.firePrimary = rtPressed || aPressed || pressedKeys.has('Space');
    input.fireSecondary = ltPressed || bPressed || pressedKeys.has('ShiftLeft');
    input.controllerConnected = true;
    input.lastInputMode = Math.abs(rawX) > deadzone || Math.abs(rawY) > deadzone || aPressed || bPressed || rtPressed || ltPressed
      ? 'controller'
      : keyboardX !== 0 || keyboardY !== 0 || pressedKeys.has('Space') || pressedKeys.has('ShiftLeft')
        ? 'keyboardMouse'
        : input.lastInputMode;

    const pauseHeld = pressedKeys.has('Escape') || pressedKeys.has('KeyP') || startHeld;
    const startActionHeld = pressedKeys.has('Enter') || aPressed;
    const tutorialToggleHeld = pressedKeys.has('KeyH') || yHeld;
    const tutorialNextHeld = pressedKeys.has('BracketRight') || dpadRightHeld;
    const tutorialPrevHeld = pressedKeys.has('BracketLeft') || dpadLeftHeld;
    const tutorialConfirmHeld = pressedKeys.has('KeyM') || bPressed;

    input.pausePressed = pauseHeld && !wasPausePressed;
    input.startPressed = startActionHeld && !wasStartPressed;
    input.tutorialTogglePressed = tutorialToggleHeld && !wasTutorialTogglePressed;
    input.tutorialNextPressed = tutorialNextHeld && !wasTutorialNextPressed;
    input.tutorialPrevPressed = tutorialPrevHeld && !wasTutorialPrevPressed;
    input.tutorialConfirmPressed = tutorialConfirmHeld && !wasTutorialConfirmPressed;
    return;
  }

  input.moveX = keyboardX;
  input.moveY = keyboardY;
  input.firePrimary = pressedKeys.has('Space');
  input.fireSecondary = pressedKeys.has('ShiftLeft');
  input.controllerConnected = false;
  if (keyboardX !== 0 || keyboardY !== 0 || input.firePrimary || input.fireSecondary) {
    input.lastInputMode = 'keyboardMouse';
  }

  const pauseHeld = pressedKeys.has('Escape') || pressedKeys.has('KeyP');
  const startActionHeld = pressedKeys.has('Enter');
  const tutorialToggleHeld = pressedKeys.has('KeyH');
  const tutorialNextHeld = pressedKeys.has('BracketRight');
  const tutorialPrevHeld = pressedKeys.has('BracketLeft');
  const tutorialConfirmHeld = pressedKeys.has('KeyM');

  input.pausePressed = pauseHeld && !wasPausePressed;
  input.startPressed = startActionHeld && !wasStartPressed;
  input.tutorialTogglePressed = tutorialToggleHeld && !wasTutorialTogglePressed;
  input.tutorialNextPressed = tutorialNextHeld && !wasTutorialNextPressed;
  input.tutorialPrevPressed = tutorialPrevHeld && !wasTutorialPrevPressed;
  input.tutorialConfirmPressed = tutorialConfirmHeld && !wasTutorialConfirmPressed;
}
