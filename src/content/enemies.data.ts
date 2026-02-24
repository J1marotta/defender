export type EnemyArchetypeData = {
  id: string;
  behaviorKind: number;
  speed: number;
  radius: number;
  hitPoints: number;
  touchDamage: number;
  scoreValue: number;
  color: number;
};

export const enemyArchetypesData: EnemyArchetypeData[] = [
  { id: 'enemy.chase', behaviorKind: 1, speed: 0.14, radius: 12, hitPoints: 2, touchDamage: 8, scoreValue: 90, color: 0xff6b6b },
  { id: 'enemy.strafe', behaviorKind: 2, speed: 0.12, radius: 10, hitPoints: 1, touchDamage: 6, scoreValue: 70, color: 0xffb36b },
  { id: 'enemy.orbit', behaviorKind: 3, speed: 0.1, radius: 11, hitPoints: 2, touchDamage: 9, scoreValue: 110, color: 0xffea6b },
  { id: 'enemy.kamikaze', behaviorKind: 4, speed: 0.18, radius: 9, hitPoints: 1, touchDamage: 14, scoreValue: 130, color: 0xff4da0 },
  { id: 'enemy.shooter', behaviorKind: 5, speed: 0.09, radius: 13, hitPoints: 3, touchDamage: 10, scoreValue: 140, color: 0x9f7bff },
];
