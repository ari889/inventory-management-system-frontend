import { Author, BaseType } from "./common.types";
import { InitialStateType } from "./reducer.types";
import { Role } from "./role.types";

export interface User extends BaseType, Author {
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
}

export interface InitialUserState extends InitialStateType {
  users: User[];
  open: boolean;
  showUpdateModal: boolean;
}
