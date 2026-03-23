/* eslint-disable */
import { Result } from "./common";

export interface AsnInboundResponse {
  ES_RESULT?: Result;
  success?: boolean;
}

export interface AsnInvoiceRequest {
  invoice?: string;
}
