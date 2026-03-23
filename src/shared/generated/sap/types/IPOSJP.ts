/* eslint-disable */
import { Item } from "./common";

export interface ResponseInventoryMovement {
  data?: Item[];
  req_id?: string;
}

export interface RequestInventoryMovement {
  auth_token?: string;
  data?: Item[];
  req_id?: string;
}
