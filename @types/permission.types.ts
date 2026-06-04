import { BaseType } from "./common.types";
import { Module } from "./module.types";
import { InitialStateType } from "./reducer.types";

export interface Permission extends BaseType {
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
  search?: string;
  deletable?: boolean;
  moduleId?: number;
}
