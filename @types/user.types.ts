import { BaseType } from "./common.types";
import { InitialStateType } from "./reducer.types";
import { Role } from "./role.types";

export interface User extends BaseType {
  id: number;
  name: string;
  email: string;
  phoneNo?: string;
  emailVerifiedAt?: Date;
  password: string;
  roleId: number;
  role: Role;
  avatar?: string;
  gender: boolean; // true = Male, False = Female
  status: boolean; // true = Active, False = Inactive
  creator: User;
  updater: User | null;
}

export interface InitialUserState extends InitialStateType {
  users: User[];
  open: boolean;
}
