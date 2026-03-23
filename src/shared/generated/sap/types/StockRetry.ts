/* eslint-disable */
export interface FailedStockUpdate {
  barcode?: string;
  /** @format date-time */
  createdAt?: string;
  errorMessage?: string;
  historyComment?: string;
  /** @format int64 */
  id?: number;
  invoiceNo?: string;
  ledger?: string;
  ledgerOperator?: string;
  modifiedUser?: string;
  operationType?: string;
  plntCode?: string;
  /** @format date-time */
  processedAt?: string;
  /** @format int32 */
  qty?: number;
  /** @format int32 */
  retryCount?: number;
  sapCode?: string;
  sloc?: string;
  status?: FailedStockUpdateStatusEnum;
  timeZone?: string;
  uniqueCode?: string;
}

export enum FailedStockUpdateStatusEnum {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}
