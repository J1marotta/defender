import { Types, defineComponent } from 'bitecs';

export const PositionComponent = defineComponent({
  x: Types.f32,
  y: Types.f32,
});

export const VelocityComponent = defineComponent({
  x: Types.f32,
  y: Types.f32,
});

export const PlayerTagComponent = defineComponent();
export const EnemyTagComponent = defineComponent();
export const ProjectileTagComponent = defineComponent();

export const WeaponComponent = defineComponent({
  cooldownMs: Types.f32,
  cooldownRemainingMs: Types.f32,
});

export const RenderableComponent = defineComponent({
  width: Types.f32,
  height: Types.f32,
  color: Types.ui32,
});

export const ColliderComponent = defineComponent({
  radius: Types.f32,
});

export const HealthComponent = defineComponent({
  current: Types.f32,
  max: Types.f32,
});

export const LifetimeComponent = defineComponent({
  remainingMs: Types.f32,
});

export const DamageComponent = defineComponent({
  value: Types.f32,
});

export const EnemyBehaviorComponent = defineComponent({
  kind: Types.ui8,
});
