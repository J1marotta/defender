export type MetaUpgradeData = {
  id: string;
  label: string;
  maxRank: number;
  costPerRank: number[];
  effectPerRank: number[];
};

export const baseMetaUpgradesData: MetaUpgradeData[] = [
  {
    id: 'meta.player.base_health',
    label: 'Hull Plating',
    maxRank: 5,
    costPerRank: [10, 20, 30, 45, 60],
    effectPerRank: [5, 5, 5, 10, 10],
  },
  {
    id: 'meta.player.base_mobility',
    label: 'Thruster Blueprint',
    maxRank: 5,
    costPerRank: [10, 20, 30, 45, 60],
    effectPerRank: [0.03, 0.03, 0.04, 0.05, 0.05],
  },
  {
    id: 'meta.player.base_attack_speed',
    label: 'Weapon Feed System',
    maxRank: 5,
    costPerRank: [10, 20, 30, 45, 60],
    effectPerRank: [0.03, 0.03, 0.04, 0.05, 0.05],
  },
];
