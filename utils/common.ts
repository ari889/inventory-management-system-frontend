import { FlatModule, MenuModule, Module } from "@/@types/module.types";
import { Active, Over } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
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

/**
 * Compute next modules
 * @param prev
 * @param currentFlat
 * @param active
 * @param over
 * @param overData
 * @param overId
 * @param activeItem
 * @returns
 */
export function computeNextModules(
  prev: Module[],
  currentFlat: FlatModule[],
  active: Active,
  over: Over,
  overData: { type?: string; parentId?: number } | undefined,
  overId: number,
  activeItem: FlatModule,
): Module[] {
  // ── Drop into child zone ──
  if (overData?.type === "childZone" && overData.parentId != null) {
    const newParentId = overData.parentId;
    if (active.id === newParentId) return prev;
    const [extracted, cleaned] = extractModule(prev, active.id as number);
    if (!extracted) return prev;

    const orphans: Module[] = extracted.children ?? [];
    const toInsert: Module = { ...extracted, children: [] };
    const originalIndex = prev.findIndex((m) => m.id === extracted!.id);
    const withOrphans = [...cleaned];
    if (orphans.length > 0) {
      withOrphans.splice(
        Math.min(originalIndex, withOrphans.length),
        0,
        ...orphans,
      );
    }

    return reorder(
      withOrphans.map((item) =>
        item.id === newParentId
          ? { ...item, children: reorder([...(item.children ?? []), toInsert]) }
          : item,
      ),
    );
  }

  const overItem = currentFlat.find((f) => f.id === overId);
  if (!overItem) return prev;

  // ── Parent reorder ──
  if (activeItem.depth === 0 && overItem.depth === 0) {
    const ai = prev.findIndex((m) => m.id === active.id);
    const oi = prev.findIndex((m) => m.id === overId);
    return reorder(arrayMove(prev, ai, oi));
  }

  // ── Child reorder (same parent) ──
  if (
    activeItem.depth === 1 &&
    overItem.depth === 1 &&
    activeItem.parentId === overItem.parentId
  ) {
    return reorder(
      prev.map((item) => {
        if (item.id !== activeItem.parentId) return item;
        const children = item.children ?? [];
        const ai = children.findIndex((c) => c.id === active.id);
        const oi = children.findIndex((c) => c.id === overId);
        return { ...item, children: reorder(arrayMove(children, ai, oi)) };
      }),
    );
  }

  // ── Child → different parent ──
  if (
    activeItem.depth === 1 &&
    overItem.depth === 1 &&
    activeItem.parentId !== overItem.parentId
  ) {
    let moved: Module | null = null;
    const step1 = prev.map((item) => {
      if (item.id !== activeItem.parentId) return item;
      const child = (item.children ?? []).find((c) => c.id === active.id);
      if (child) moved = child;
      return {
        ...item,
        children: reorder(
          (item.children ?? []).filter((c) => c.id !== active.id),
        ),
      };
    });
    if (!moved) return prev;
    return reorder(
      step1.map((item) => {
        if (item.id !== overItem.parentId) return item;
        const children = [...(item.children ?? [])];
        const oi = children.findIndex((c) => c.id === overId);
        children.splice(oi, 0, moved!);
        return { ...item, children: reorder(children) };
      }),
    );
  }

  // ── Child → promote to top-level ──
  if (activeItem.depth === 1 && overItem.depth === 0) {
    const [extracted, cleaned] = extractModule(prev, active.id as number);
    if (!extracted) return prev;
    const oi = cleaned.findIndex((m) => m.id === overId);
    const result = [...cleaned];
    result.splice(oi, 0, { ...extracted, children: [] });
    return reorder(result);
  }

  return prev;
}
