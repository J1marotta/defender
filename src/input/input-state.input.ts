export type InputState = {
  moveX: number;
  moveY: number;
  firePrimary: boolean;
  fireSecondary: boolean;
  controllerConnected: boolean;
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
  };
}

export function updateInputState(input: InputState): void {
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
    const rtPressed = gamepad.buttons[7] && gamepad.buttons[7].pressed;
    const aPressed = gamepad.buttons[0] && gamepad.buttons[0].pressed;
    const ltPressed = gamepad.buttons[6] && gamepad.buttons[6].pressed;
    const bPressed = gamepad.buttons[1] && gamepad.buttons[1].pressed;

    input.moveX = Math.abs(rawX) > deadzone ? rawX : keyboardX;
    input.moveY = Math.abs(rawY) > deadzone ? rawY : keyboardY;
    input.firePrimary = Boolean(rtPressed || aPressed || pressedKeys.has('Space'));
    input.fireSecondary = Boolean(ltPressed || bPressed || pressedKeys.has('ShiftLeft'));
    input.controllerConnected = true;
    return;
  }

  input.moveX = keyboardX;
  input.moveY = keyboardY;
  input.firePrimary = pressedKeys.has('Space');
  input.fireSecondary = pressedKeys.has('ShiftLeft');
  input.controllerConnected = false;
}
