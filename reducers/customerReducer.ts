import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { Customer, InitialCustomerState } from "@/@types/customer.types";

const customerCustomReducer = (
  state: InitialCustomerState,
  action: ActionType,
): InitialCustomerState => {
  switch (action.type) {
    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.customers.map((m) => m.id)),
      };
    case "SET_CUSTOMERS":
      return { ...state, customers: action.payload as Customer[] };
    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };
    case "REFRESH": {
      const newCustomers = [action.payload as Customer, ...state.customers];
      if (newCustomers.length > state.limit) newCustomers.pop();
      return {
        ...state,
        customers: newCustomers,
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
      const updatedSupplier = action.payload as Customer;
      return {
        ...state,
        showUpdateModal: false,
        selectedId: null,
        customers: state.customers.map((c) =>
          c.id === updatedSupplier.id ? updatedSupplier : c,
        ),
      };
    }
    case "SET_SEARCH":
      return { ...state, search: action.payload as string, page: 0 };
    case "SET_STATUS":
      return { ...state, status: action.payload as boolean, page: 0 };
    case "SET_CREATED_BY":
      return { ...state, createdBy: action.payload as number, page: 0 };
    case "SET_CUSTOMER_GROUP_ID":
      return { ...state, customerGroupId: action.payload as number, page: 0 };
    default:
      return state;
  }
};

export const customerReducer = createReducer<InitialCustomerState>(
  customerCustomReducer,
);
