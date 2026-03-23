import { InititalPermissionState } from "@/@types/permission.types";
import { baseInitialState } from "./baseInitialState";

export const initialPermissionState: InititalPermissionState = {
  ...baseInitialState,
  permissions: [],
  createModal: false,
  editModal: false,
  name: "",
  slug: "",
  deletable: null,
};
