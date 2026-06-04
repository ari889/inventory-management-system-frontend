import { InititalPermissionState } from "@/@types/permission.types";
import { baseInitialState } from "./baseInitialState";

export const initialPermissionState: InititalPermissionState = {
  ...baseInitialState,
  permissions: [],
  createModal: false,
  editModal: false,
  search: "",
  deletable: undefined,
  moduleId: undefined,
};
