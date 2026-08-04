export interface Unit {
  id: string;
  title: string;
  publishedAt?: string;
}

/** Exercises `satisfies`, optional chaining and nullish coalescing. */
export function formatTitle(title: string): string {
  return title.trim() satisfies string;
}

/** Exercises ESNext lib types (`Array.prototype.at`) against an ES6 target. */
export function firstUnit(units: Unit[]): Unit | undefined {
  return units.at(0);
}

export function isPublished(unit: Unit): boolean {
  return (unit.publishedAt?.length ?? 0) > 0;
}

// `isolatedModules` requires type-only re-exports to be marked as such.
export type { Unit as UnitType };
