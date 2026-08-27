export type BadgeState = 'record';

export interface BadgeSnapshot {
  state: BadgeState;
  count: number;
}

/** Legacy preview aliases are ignored. The image is never a verdict. */
export function parsePreviewState(_value: string | null): BadgeState | null {
  return null;
}

export function snapshotFromRecord(input: {
  found: boolean;
  leafCount: number;
}): BadgeSnapshot {
  return {
    state: 'record',
    count: input.found ? input.leafCount : 0,
  };
}

export async function resolveSnapshot(_domain: string): Promise<BadgeSnapshot> {
  return { state: 'record', count: 0 };
}
