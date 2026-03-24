import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { InitialUserState, User } from "@/@types/user.types";

const userCustomReducer = (
  state: InitialUserState,
  action: ActionType,
): InitialUserState => {
  switch (action.type) {
    case "SELECT_ALL_ROWS":
      return { ...state, selectedRows: new Set(state.users.map((m) => m.id)) };
    case "SET_USERS":
      return { ...state, users: action.payload as User[] };
    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };
    default:
      return state;
  }
};

export const userReducer = createReducer<InitialUserState>(userCustomReducer);
