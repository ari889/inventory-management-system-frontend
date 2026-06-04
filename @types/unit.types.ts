import { Author, BaseType } from "./common.types";
import { InitialStateType } from "./reducer.types";

export interface Unit extends BaseType, Author {
  unitCode: string;
  unitName: string;
  baseUnit: Unit;
  operator: string;
  operationValue: number;
  status: boolean;
}

export interface InitialUnitState extends InitialStateType {
  units: Unit[];
  open: boolean;
  showUpdateModal: boolean;
  search?: string;
  status?: boolean;
  baseUnitId?: number;
  createdBy?: number;
}
