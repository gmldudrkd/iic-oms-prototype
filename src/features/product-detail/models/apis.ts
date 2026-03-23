import { FetchWithTokenPIM } from "@/shared/apis/fetchExtended";
import {
  OmsProductResponseDTO,
  ProductUpdateRequestDTO,
} from "@/shared/generated/pim/types/Product";
import { S3UploadResponseDTO } from "@/shared/generated/pim/types/Upload";

/**
 * 상품 정보 조회
 * GET
 * /v1/oms/products/skus/{sku}
 */
export const getProductDetail = async (sku: string) => {
  const response = await FetchWithTokenPIM(`/v1/oms/products/skus/${sku}`);
  return response as OmsProductResponseDTO;
};

/**
 * 다중 파일 업로드
 * POST
 * /v1/common/upload/files
 */
export const postUploadImages = async (requestData: FormData) => {
  const response = await FetchWithTokenPIM(
    "/v1/common/upload/files",
    "POST",
    requestData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response as S3UploadResponseDTO[];
};

/**
 * Update a product
 * PATCH
 * /v1/oms/products/skus/{sku}
 */
export const patchUpdateProduct = async ({
  sku,
  requestData,
}: {
  sku: string;
  requestData: ProductUpdateRequestDTO;
}) => {
  const response = await FetchWithTokenPIM(
    `/v1/oms/products/skus/${sku}`,
    "PATCH",
    requestData,
  );
  return response as OmsProductResponseDTO;
};
