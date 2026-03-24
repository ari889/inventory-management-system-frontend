import { ActionType } from "@/@types/reducer.types";
import { InitialRoleState, Role } from "@/@types/role.types";
import { createReducer } from "./createReducer";

const roleCustomReducer = (
  state: InitialRoleState,
  action: ActionType,
): InitialRoleState => {
  switch (action.type) {
    case "SET_ROLES":
      return { ...state, roles: action.payload as Role[] };

    case "REFRESH": {
      const newRoles = [action.payload as Role, ...state.roles];
      if (newRoles.length > state.limit) newRoles.pop();
      return { ...state, roles: newRoles, totalCount: state.totalCount + 1 };
    }

    case "SET_SEARCH":
      return { ...state, search: action.payload as string, page: 0 };

    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };

    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.roles.map((r) => r.id)),
      };

    case "SET_DELETABLE":
      return { ...state, deletable: action.payload as boolean | null };

    default:
      return state;
  }
};

export const roleReducer = createReducer<InitialRoleState>(roleCustomReducer);
