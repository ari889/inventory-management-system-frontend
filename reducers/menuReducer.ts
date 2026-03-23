import { InitialMenuState, Menu } from "@/@types/menu.types";
import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";

const menuCustomReducer = (
  state: InitialMenuState,
  action: ActionType,
): InitialMenuState => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload as string, page: 0 };
    case "SET_MENUS":
      return { ...state, menus: action.payload as Menu[] };
    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };
    case "REFRESH": {
      const newMenus = [action.payload as Menu, ...state.menus];
      if (newMenus.length > state.limit) newMenus.pop();
      return { ...state, menus: newMenus };
    }
    case "SELECT_ALL_ROWS":
      return { ...state, selectedRows: new Set(state.menus.map((m) => m.id)) };
    case "TOGGLE_UPDATE_MODAL":
      return {
        ...state,
        showUpdateModal: !state.showUpdateModal,
        selectedId: state.selectedId ? null : (action.payload as number),
      };
    case "UPDATE_SUCCESS": {
      const updatedMenu = action.payload as Menu;
      return {
        ...state,
        showUpdateModal: false,
        selectedId: null,
        menus: state.menus.map((m) =>
          m.id === updatedMenu.id ? updatedMenu : m,
        ),
      };
    }
    case "SET_DELETABLE":
      return { ...state, deletable: action.payload as boolean | null };
    default:
      return state;
  }
};

export const menuReducer = createReducer<InitialMenuState>(menuCustomReducer);
