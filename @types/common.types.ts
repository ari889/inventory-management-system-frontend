export interface BaseType {
  createdAt: Date;
  updatedAt: Date;
}

export interface Deletable {
  deletable: boolean; // true = Yes, False = No
}
