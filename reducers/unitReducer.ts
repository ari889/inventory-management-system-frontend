import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { InitialUnitState, Unit } from "@/@types/unit.types";

const unitCustomReducer = (
  state: InitialUnitState,
  action: ActionType,
): InitialUnitState => {
  switch (action.type) {
    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.units.map((m) => m.id)),
      };
    case "SET_UNITS":
      return { ...state, units: action.payload as Unit[] };
    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };
    case "REFRESH": {
      const newUnits = [action.payload as Unit, ...state.units];
      if (newUnits.length > state.limit) newUnits.pop();
      return {
        ...state,
        units: newUnits,
        totalCount: state.totalCount + 1,
      };
    }
    case "TOGGLE_UPDATE_MODAL":
      return {
        ...state,
        showUpdateModal: !state.showUpdateModal,
        selectedId: state.selectedId ? null : (action.payload as number),
      };
    case "UPDATE_SUCCESS": {
      const updatedUnit = action.payload as Unit;
      return {
        ...state,
        showUpdateModal: false,
        selectedId: null,
        units: state.units.map((w) =>
          w.id === updatedUnit.id ? updatedUnit : w,
        ),
      };
    }
    case "SET_SEARCH":
      return { ...state, search: action.payload as string };
    case "SET_STATUS":
      return { ...state, status: action.payload as boolean };
    case "SET_BASE_UNIT_ID":
      return { ...state, baseUnitId: action.payload as number };
    case "SET_CREATED_BY":
      return { ...state, createdBy: action.payload as number };
    default:
      return state;
  }
};

export const unitReducer = createReducer<InitialUnitState>(unitCustomReducer);
