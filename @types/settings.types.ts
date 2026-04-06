import { BaseType } from "./common.types";

export interface Setting extends BaseType {
  id: number;
  name: string;
  value: string;
}
