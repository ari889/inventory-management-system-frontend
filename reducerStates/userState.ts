import { baseInitialState } from "./baseInitialState";
import { InitialUserState } from "@/@types/user.types";

export const initialUserState: InitialUserState = {
  ...baseInitialState,
  users: [],
  open: false,
};
