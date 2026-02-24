import type { MetaUpgradeData } from '../content/meta-upgrades.data';

const STORAGE_KEY = 'defender.meta.v1';

type PersistedMetaShape = {
  metaCurrency: number;
  purchasedRanks: Record<string, number>;
};

export type MetaState = PersistedMetaShape & {
  runtimeXp: number;
  save: () => void;
};

export function createPersistedMetaState(upgrades: MetaUpgradeData[]): MetaState {
  const loaded = loadMetaState();
  const sanitizedRanks: Record<string, number> = {};

  for (const upgrade of upgrades) {
    const existing = getStoredRank(loaded.purchasedRanks, upgrade.id);
    sanitizedRanks[upgrade.id] = Math.max(0, Math.min(existing, upgrade.maxRank));
  }

  const metaState: MetaState = {
    metaCurrency: loaded.metaCurrency,
    purchasedRanks: sanitizedRanks,
    runtimeXp: 0,
    save: () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          metaCurrency: metaState.metaCurrency,
          purchasedRanks: metaState.purchasedRanks,
        }),
      );
    },
  };

  return metaState;
}

function getStoredRank(purchasedRanks: Record<string, number>, id: string): number {
  if (Object.prototype.hasOwnProperty.call(purchasedRanks, id)) {
    return purchasedRanks[id];
  }
  return 0;
}

function loadMetaState(): PersistedMetaShape {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { metaCurrency: 0, purchasedRanks: {} };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedMetaShape>;
    const metaCurrency = Number.isFinite(parsed.metaCurrency) ? (parsed.metaCurrency as number) : 0;
    const purchasedRanks = isRecord(parsed.purchasedRanks) ? (parsed.purchasedRanks as Record<string, number>) : {};

    return {
      metaCurrency,
      purchasedRanks,
    };
  } catch {
    return { metaCurrency: 0, purchasedRanks: {} };
  }
}

function isRecord(value: unknown): value is Record<string, number> {
  return Boolean(value) && typeof value === 'object';
}
