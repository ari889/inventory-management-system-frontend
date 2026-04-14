import { Author, BaseType } from "./common.types";

export interface HRMSetting extends BaseType, Author {
  checkIn: Date;
  checkOut: Date;
}
