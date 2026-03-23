import { ActionType, InitialStateType } from "@/@types/reducer.types";
import { baseReducer } from "./baseReducer";

export const createReducer =
  <T extends InitialStateType>(
    customReducer: (state: T, action: ActionType) => T,
  ) =>
  (state: T, action: ActionType): T => {
    const baseResult = baseReducer(state, action);
    if (baseResult !== null) return baseResult as T;
    return customReducer(state, action);
  };
