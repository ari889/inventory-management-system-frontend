import { User } from "./user.types";

export interface BaseType {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Author {
  creator: User;
  updator: User | null;
}

export interface Deletable {
  deletable: boolean; // true = Yes, False = No
}
