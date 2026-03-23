/* eslint-disable */
import { Item } from "./common";

export interface WmsAdjustmentRequest {
  T_DATA?: Item[];
}

export interface WmsResponse {
  ES_RESULT?: Response;
}

export interface Response {
  MSG?: string;
  MTY?: string;
}
