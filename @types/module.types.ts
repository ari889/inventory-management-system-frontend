import { UniqueIdentifier } from "@dnd-kit/core";
import { BaseType, Deletable } from "./common.types";
import { Permission } from "./permission.types";

export interface Module extends BaseType, Deletable {
  id: number;
  menuId: number;
  type: boolean; // true = Divider, False = Module
  moduleName: string | null;
  dividerTitle: string | null;
  iconClass: string | null;
  url: string | null;
  order: number;
  parentId: number | null;
  parent: Module | null;
  target: "SELF" | "BLANK";
  children: Module[];
  permissions: Permission[];
}

// ─── Types ────────────────────────────────────────────────────────────────────

/** Internal tree node — wraps ModuleType with a live `order` counter */
export interface MenuModule {
  id: number;
  order: number;
  data: Module;
  children: MenuModule[];
}

export type ModuleDepth = 0 | 1;

export interface FlatModule {
  id: number;
  order: number;
  data: Module;
  parentId: number | null;
  depth: ModuleDepth;
}

export interface DragState {
  activeId: UniqueIdentifier | null;
}

export interface SkeletonPosition {
  parentId: UniqueIdentifier | null;
  index: number;
}

export interface ModulesState {
  activeId: UniqueIdentifier | null;
  skeletonParentId: UniqueIdentifier | null;
  skeletonIndex: number | null;
  expanded: Set<number>;
  selectedModule: number | null;
  modalOpen: boolean;
}
