import { BaseType } from "./common.types";
import { Module } from "./module.types";
import { Permission } from "./permission.types";
import { InitialStateType } from "./reducer.types";

export interface ModuleRole extends BaseType {
  module: Module;
  roleId: number;
}

export interface PermissionRole extends BaseType {
  permission: Permission;
  roleId: number;
}

export interface Role extends BaseType {
  roleName: string;
  deletable: boolean;
  moduleRole: ModuleRole[];
  permissionRole: PermissionRole[];
}

export interface InitialRoleState extends InitialStateType {
  roles: Role[];
  search: string;
  open: boolean;
  deletable: boolean | null;
}
