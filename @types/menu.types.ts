import { Module } from "./module.types";
import { InitialStateType } from "./reducer.types";

export interface Menu {
  id: number;
  menuName: string;
  deletable: boolean;
  createdAt: Date;
  updatedAt: Date;
  modules: Module[];
}

export interface InitialMenuState extends InitialStateType {
  menus: Menu[];
  search: string;
  open: boolean;
  showUpdateModal: boolean;
  deletable: boolean | null;
}
