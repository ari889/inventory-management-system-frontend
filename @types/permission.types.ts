import { Module } from "./module.types";
import { InitialStateType } from "./reducer.types";

export interface Permission {
  id: number;
  moduleId: number;
  module: Module;
  name: string;
  slug: string;
  deletable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InititalPermissionState extends InitialStateType {
  permissions: Permission[];
  createModal: boolean;
  editModal: boolean;
}
