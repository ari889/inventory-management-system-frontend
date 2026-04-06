import { BaseType } from "./common.types";
import { Module } from "./module.types";
import { InitialStateType } from "./reducer.types";

export interface Permission extends BaseType {
  id: number;
  moduleId: number;
  module: Module;
  name: string;
  slug: string;
  deletable: boolean;
}

export interface InititalPermissionState extends InitialStateType {
  permissions: Permission[];
  createModal: boolean;
  editModal: boolean;
  name: string;
  slug: string;
  deletable: boolean | null;
}
