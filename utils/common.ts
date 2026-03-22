import { FlatModule, MenuModule, Module } from "@/@types/module.types";
import _ from "lodash";

/**
 * Slug generator
 * @param str
 * @returns string
 */
export const stringToSlug = (str: string) => _.kebabCase(str);

// ─── Reorder ─────────────────────────────────────────────────────────────────
// Reassigns order as a global flat counter:
// parent[0], its children…, parent[1], its children…

export function reorder(items: Module[]): Module[] {
  let counter = 0;
  return items.map((item) => {
    const itemOrder = counter++;
    const newChildren = (item.children ?? []).map((child) => ({
      ...child,
      order: counter++,
    }));
    return { ...item, order: itemOrder, children: newChildren };
  });
}

// ─── Convert API data ─────────────────────────────────────────────────────────
// toMenuModules is kept for backward compat but just calls reorder now

export function toMenuModules(modules: Module[]): Module[] {
  return reorder(modules);
}

// ─── Flatten ──────────────────────────────────────────────────────────────────

export function flattenModules(
  items: Module[],
  parentId: number | null = null,
  depth: 0 | 1 = 0,
): FlatModule[] {
  return items.flatMap((item): FlatModule[] => [
    { id: item.id, order: item.order, parentId, depth, data: item },
    ...(depth === 0 ? flattenModules(item.children ?? [], item.id, 1) : []),
  ]);
}

// ─── Extract ──────────────────────────────────────────────────────────────────

export function extractModule(
  items: Module[],
  id: number,
): [Module | null, Module[]] {
  let extracted: Module | null = null;
  const cleaned = items
    .filter((item) => {
      if (item.id === id) {
        extracted = { ...item };
        return false;
      }
      return true;
    })
    .map((item) => {
      const [ex, newChildren] = extractModule(item.children ?? [], id);
      if (ex && !extracted) extracted = ex;
      return { ...item, children: newChildren };
    });
  return [extracted, cleaned];
}
