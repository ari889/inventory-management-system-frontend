import { BaseType, Deletable } from "./common.types";

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
}
