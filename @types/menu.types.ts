import { BaseType } from "./common.types";
import { Module } from "./module.types";
import { InitialStateType } from "./reducer.types";

export interface Menu extends BaseType {
  id: number;
  menuName: string;
  deletable: boolean;
  modules: Module[];
}

export interface InitialMenuState extends InitialStateType {
  menus: Menu[];
  search: string;
  open: boolean;
  showUpdateModal: boolean;
  deletable: boolean | null;
}
