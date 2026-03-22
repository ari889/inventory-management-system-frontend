import { Module } from "./module.types";
import { Permission } from "./permission.types";
import { InitialStateType } from "./reducer.types";

export interface ModuleRole {
  id: number;
  module: Module;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PermissionRole {
  id: number;
  permission: Permission;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: number;
  roleName: string;
  deletable: boolean;
  moduleRole: ModuleRole[];
  permissionRole: PermissionRole[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InitialRoleState extends InitialStateType {
  roles: Role[];
  search: string;
  open: boolean;
  deletable: boolean | null;
}
