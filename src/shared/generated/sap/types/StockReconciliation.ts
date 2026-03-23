/* eslint-disable */
export interface ReconciliationResult {
  /** @format int32 */
  failCount?: number;
  invoiceNo?: string;
  message?: string;
  success?: boolean;
  /** @format int32 */
  successCount?: number;
}

export interface MissingSalesStockDto {
  brandCode?: string;
  invoiceNo?: string;
  plntCode?: string;
  productCode?: string;
  /** @format int32 */
  qty?: number;
  /** @format date-time */
  saleDate?: string;
  /** @format int64 */
  salesId?: number;
  uniqueCode?: string;
}
