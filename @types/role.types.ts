import { InitialStateType } from "./reducer.types";

export interface Role {
  id: number;
  roleName: string;
  deletable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InitialRoleState extends InitialStateType {
  roles: Role[];
  search: string;
  open: boolean;
  showUpdateModal: boolean;
  deletable: boolean | null;
}
