import { InititalPermissionState, Permission } from "@/@types/permission.types";
import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";

const permissionCustomReducer = (
  state: InititalPermissionState,
  action: ActionType,
): InititalPermissionState => {
  switch (action.type) {
    case "SET_PERMISSIONS":
      return { ...state, permissions: action.payload as Permission[] };

    case "REFRESH": {
      const newPermissions = action.payload as Permission[];
      const combined = [...newPermissions, ...state.permissions];
      return { ...state, permissions: combined.slice(0, state.limit) };
    }

    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.permissions.map((p) => p.id)),
      };

    case "TOGGLE_MODAL":
      return { ...state, createModal: !state.createModal };

    case "OPEN_EDIT_MODAL":
      return {
        ...state,
        editModal: true,
        selectedId: action.payload as number,
      };

    case "CLOSE_EDIT_MODAL":
      return { ...state, editModal: false, selectedId: null };

    case "UPDATE_SUCCESS": {
      const payload = action.payload as Permission;
      return {
        ...state,
        permissions: state.permissions.map((p) =>
          p.id === payload.id ? payload : p,
        ),
      };
    }

    case "SET_NAME":
      return { ...state, name: action.payload as string };

    case "SET_SLUG":
      return { ...state, slug: action.payload as string };

    case "SET_DELETABLE":
      return { ...state, deletable: action.payload as boolean | null };

    default:
      return state;
  }
};

export const permissionReducer = createReducer<InititalPermissionState>(
  permissionCustomReducer,
);
