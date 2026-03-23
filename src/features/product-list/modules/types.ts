// modal create bundle form values
export interface FormValues {
  searchType: string;
  searchSingle: string;
  searchSAP: string;
  searchBulk: string;
}

// modal create bundle 옵션 리스트
export interface Option {
  sapName: string;
  sapCode: string;
  skuCode: string;
  selected: boolean;
  quantity: number;
  unitPrice: number;
}
