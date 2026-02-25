export type EnemyArchetypeData = {
  id: number;
  label: string;
  speed: number;
  hp: number;
  size: number;
  color: number;
};

export const enemyArchetypesData: EnemyArchetypeData[] = [
  { id: 0, label: 'chase', speed: 0.16, hp: 1, size: 12, color: 0xff5a7d },
  { id: 1, label: 'strafe', speed: 0.2, hp: 1, size: 10, color: 0xffaa5a },
  { id: 2, label: 'orbit', speed: 0.13, hp: 2, size: 14, color: 0xb375ff },
  { id: 3, label: 'kamikaze', speed: 0.28, hp: 1, size: 9, color: 0xff3a3a },
  { id: 4, label: 'shooter', speed: 0.1, hp: 2, size: 13, color: 0x59ff9f },
];
