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
    case "REFRESH": {
      const newUsers = [action.payload as User, ...state.users];
      if (newUsers.length > state.limit) newUsers.pop();
      return { ...state, users: newUsers, totalCount: state.totalCount + 1 };
    }
    case "TOGGLE_UPDATE_MODAL":
      return {
        ...state,
        showUpdateModal: !state.showUpdateModal,
        selectedId: state.selectedId ? null : (action.payload as number),
      };
    case "UPDATE_SUCCESS": {
      const updatedUser = action.payload as User;
      return {
        ...state,
        showUpdateModal: false,
        selectedId: null,
        users: state.users.map((u) =>
          u.id === updatedUser.id ? updatedUser : u,
        ),
      };
    }
    default:
      return state;
  }
};

export const userReducer = createReducer<InitialUserState>(userCustomReducer);
