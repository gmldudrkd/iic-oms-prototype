import { FetchWithTokenPIM } from "@/shared/apis/fetchExtended";
import {
  BundleResponseDTO,
  CreateBundleRequestDTO,
} from "@/shared/generated/pim/types/Bundle";
import {
  OmsProductSearchRequestDTO,
  OmsProductSearchResponseDTO,
  ExcelImportResponseDTO,
} from "@/shared/generated/pim/types/Product";

/**
 * SapCode 목록 또는 SapName으로 상품 정보를 검색합니다.
 * POST
 * /v2/oms/products/search
 */
export const postProductList = async (
  requestData: OmsProductSearchRequestDTO,
) => {
  const url = "/v2/oms/products/search";
  const rawResponse = await FetchWithTokenPIM(url, "POST", requestData);
  return rawResponse as OmsProductSearchResponseDTO;
};

/**
 * Create a new bundle
 * POST
 * /v1/oms/bundles
 */
export const postCreateBundle = async (requestData: CreateBundleRequestDTO) => {
  const url = "/v1/oms/bundles";
  const rawResponse = await FetchWithTokenPIM(url, "POST", requestData);
  return rawResponse as BundleResponseDTO;
};

/**
 * 상품 검색 결과를 Excel로 내보내고 Slack으로 전송
 * POST
 * /v1/oms/products/search/export-excel
 */
export const postProductListExportExcel = async (
  requestData: OmsProductSearchRequestDTO,
) => {
  const url = `/v1/oms/products/search/export-excel`;
  const rawResponse = await FetchWithTokenPIM(url, "POST", requestData);
  return rawResponse;
};

/**
 * Import products from Excel file
 * PUT
 * /v1/oms/products/excel-import
 */
export const putProductListExcelImport = async (
  requestData: FormData,
  brandId: string,
  workerId: string,
) => {
  const url = `/v1/oms/products/excel-import?brandId=${brandId}&workerId=${workerId}`;
  const rawResponse = await FetchWithTokenPIM(url, "PUT", requestData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return rawResponse as ExcelImportResponseDTO;
};

/**
 * Bulk upload asset files
 * POST
 * /v1/oms/assets/bulk-upload
 */
export const postBulkUploadAssetFiles = async (
  requestData: FormData,
  brandId: string,
  workerId: string,
) => {
  const url = `/v1/oms/assets/bulk-upload?brandId=${brandId}&workerId=${workerId}`;
  const rawResponse = await FetchWithTokenPIM(url, "POST", requestData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return rawResponse;
};
