import { InitialMenuState } from "@/@types/menu.types";
import { baseInitialState } from "./baseInitialState";

export const initialMenuState: InitialMenuState = {
  ...baseInitialState,
  menus: [],
  search: "",
  open: false,
  showUpdateModal: false,
  deletable: null,
};
