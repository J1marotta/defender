export type PlayerModifierData = {
  id: string;
  label: string;
  description: string;
  values: {
    attackSpeedMultiplier: number;
    movementSpeedMultiplier: number;
    dodgeChanceDelta: number;
    doubleShotChanceDelta: number;
  };
};

export const stageModifiersData: PlayerModifierData[] = [
  {
    id: 'mod.player.attack_speed_1',
    label: 'Rapid Capacitors',
    description: '+20% attack speed',
    values: {
      attackSpeedMultiplier: 1.2,
      movementSpeedMultiplier: 1,
      dodgeChanceDelta: 0,
      doubleShotChanceDelta: 0,
    },
  },
  {
    id: 'mod.player.mobility_1',
    label: 'Thruster Overdrive',
    description: '+15% movement speed',
    values: {
      attackSpeedMultiplier: 1,
      movementSpeedMultiplier: 1.15,
      dodgeChanceDelta: 0,
      doubleShotChanceDelta: 0,
    },
  },
  {
    id: 'mod.player.lucky_guns_1',
    label: 'Twin Trigger',
    description: '+10% chance to fire twice',
    values: {
      attackSpeedMultiplier: 1,
      movementSpeedMultiplier: 1,
      dodgeChanceDelta: 0,
      doubleShotChanceDelta: 0.1,
    },
  },
];
