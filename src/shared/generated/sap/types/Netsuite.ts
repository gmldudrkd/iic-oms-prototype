/* eslint-disable */
export interface NetsuiteInventoryResponse {
  data?: NetsuiteInventoryItem[];
  status?: string;
}

export interface NetsuiteInventoryItem {
  internal_id?: string;
  name?: string;
  /** @format int64 */
  quantity?: number;
  upc_code?: string;
}
