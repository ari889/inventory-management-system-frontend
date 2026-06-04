import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import {
  CustomerGroup,
  InitialCustomerGroupState,
} from "@/@types/customer-group.types";

const customerGroupCustomReducer = (
  state: InitialCustomerGroupState,
  action: ActionType,
): InitialCustomerGroupState => {
  switch (action.type) {
    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.customerGroups.map((m) => m.id)),
      };
    case "SET_CUSTOMER_GROUPS":
      return { ...state, customerGroups: action.payload as CustomerGroup[] };
    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };
    case "REFRESH": {
      const newCustomerGroups = [
        action.payload as CustomerGroup,
        ...state.customerGroups,
      ];
      if (newCustomerGroups.length > state.limit) newCustomerGroups.pop();
      return {
        ...state,
        customerGroups: newCustomerGroups,
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
      const updatedCustomerGroup = action.payload as CustomerGroup;
      return {
        ...state,
        showUpdateModal: false,
        selectedId: null,
        customerGroups: state.customerGroups.map((w) =>
          w.id === updatedCustomerGroup.id ? updatedCustomerGroup : w,
        ),
      };
    }
    case "SET_SEARCH":
      return { ...state, search: action.payload as string };
    case "SET_STATUS":
      return { ...state, status: action.payload as boolean };
    case "SET_CREATED_BY":
      return { ...state, createdBy: action.payload as number };
    default:
      return state;
  }
};

export const customerGroupReducer = createReducer<InitialCustomerGroupState>(
  customerGroupCustomReducer,
);
