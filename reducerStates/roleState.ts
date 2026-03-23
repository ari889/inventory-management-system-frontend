import { InitialRoleState } from "@/@types/role.types";
import { baseInitialState } from "./baseInitialState";

export const initialRoleState: InitialRoleState = {
  ...baseInitialState,
  roles: [],
  search: "",
  open: false,
  deletable: null,
};
