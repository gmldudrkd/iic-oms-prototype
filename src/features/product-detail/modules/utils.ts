import { UploadedImage } from "@/features/product-detail/modules/types";

/**
 * 파일 이름 부분 추출
 * @param fileName 파일 이름
 * @param index 추출할 부분의 인덱스
 * @returns 추출된 부분
 */
const getPartialFileName = (fileName: string, index: number): string => {
  return fileName.split("_")[index] || "";
};

// ========== Nuflaat 전용 검증 함수 ==========
// SKU 코드 검사 : 현재 조회 중인 상품과 다른 SKU Code인 경우 → 5-2의 알럿 출력
const validateSkuCode = (files: UploadedImage[], skuCode: string): string[] => {
  return files
    .filter(
      (file) => getPartialFileName(file.frontInfo.file.name, 0) !== skuCode,
    )
    .map((file) => file.frontInfo.file.name);
};

// 노출 순서 형식 검사 (두 자리 숫자) : 이미지 노출 순서가 2자리 숫자로 표현되지 않은 경우 → 5-3의 알럿 출력
const validateExposureOrderFormat = (files: UploadedImage[]): string[] => {
  return files
    .filter(
      (file) =>
        !/^[0-9]{2}$/.test(getPartialFileName(file.frontInfo.file.name, 1)),
    )
    .map((file) => file.frontInfo.file.name);
};

// 노출 순서 중복 검사
const validateDuplicateExposureOrders = (
  newFiles: UploadedImage[],
  existingFiles: UploadedImage[],
) => {
  const findDuplicateOrders = (orders: string[]) => {
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    for (const order of orders) {
      if (seen.has(order)) duplicates.add(order);
      else seen.add(order);
    }
    return Array.from(duplicates);
  };

  // 중복 노출 시 에러 처리
  const handleDuplicateError = (
    duplicateOrders: (string | undefined)[],
    fileList: UploadedImage[],
  ) => {
    const invalidFiles = fileList
      .filter((img) =>
        duplicateOrders.includes(
          getPartialFileName(img.frontInfo.file.name, 1),
        ),
      )
      .map((img) => img.frontInfo.file.name);
    return invalidFiles;
  };

  // 1. 동시 업로드 중복 체크
  const uploadOrders = newFiles.map((img) =>
    getPartialFileName(img.frontInfo.file.name, 1),
  );
  const duplicateUploadOrders = findDuplicateOrders(uploadOrders);

  if (duplicateUploadOrders.length > 0) {
    return handleDuplicateError(duplicateUploadOrders, newFiles);
  }

  // 2. 기존 업로드와 중복 체크
  const allImages = [...newFiles, ...existingFiles];
  const allOrders = allImages.map((img) =>
    getPartialFileName(img.frontInfo.file.name, 1),
  );
  const duplicateAllOrders = findDuplicateOrders(allOrders);

  if (duplicateAllOrders.length > 0) {
    return handleDuplicateError(duplicateAllOrders, newFiles);
  }
};

/**
 * 이미지 파일 유효성 검사
 * @param newFiles 새로 업로드된 파일 목록
 * @param existingFiles 기존 파일 목록
 * @param skuCode 상품의 SKU 코드
 * @returns 유효성 검사 결과
 */
export const validateImageFiles = (
  newFiles: UploadedImage[],
  existingFiles: UploadedImage[],
  skuCode: string,
): { isValid: boolean; errorMessage?: string } => {
  const skuErrors = validateSkuCode(newFiles, skuCode);
  if (skuErrors.length > 0) {
    return {
      isValid: false,
      errorMessage: `The SKU Code included in the file name does not match the SKU Code of the currently viewed product: \n${skuErrors.join(", ")}`,
    };
  }

  const formatErrors = validateExposureOrderFormat(newFiles);
  if (formatErrors.length > 0) {
    return {
      isValid: false,
      errorMessage: `The 2nd element in the file name should be two digits: \n${formatErrors.join(", ")}`,
    };
  }

  const duplicateErrors = validateDuplicateExposureOrders(
    newFiles,
    existingFiles,
  );
  if (duplicateErrors && duplicateErrors.length > 0) {
    return {
      isValid: false,
      errorMessage: `Duplicate exposure orders cannot be assigned to images with the same SKU Code: \n${duplicateErrors.join(", ")}`,
    };
  }

  return { isValid: true };
};

// ========== Atiissu 전용 검증 함수 ==========

// Model Code 검사: 현재 조회 중인 상품과 다른 Model Code인 경우
const validateModelCode = (
  files: UploadedImage[],
  modelCode: string | null,
): string[] => {
  if (!modelCode) return [];
  return files
    .filter(
      (file) => getPartialFileName(file.frontInfo.file.name, 0) !== modelCode,
    )
    .map((file) => file.frontInfo.file.name);
};

// SAP Code 검사: 현재 조회 중인 상품과 다른 SAP Code인 경우
const validateSapCode = (files: UploadedImage[], sapCode: string): string[] => {
  return files
    .filter(
      (file) => getPartialFileName(file.frontInfo.file.name, 1) !== sapCode,
    )
    .map((file) => file.frontInfo.file.name);
};

// 노출 순서 형식 검사 (셋째 변수): 이미지 노출 순서가 2자리 숫자로 표현되지 않은 경우
const validateExposureOrderFormatAtiissu = (
  files: UploadedImage[],
): string[] => {
  return files
    .filter(
      (file) =>
        getPartialFileName(file.frontInfo.file.name, 2).length !== 2 ||
        !/^[0-9]+$/.test(getPartialFileName(file.frontInfo.file.name, 2)),
    )
    .map((file) => file.frontInfo.file.name);
};

// 노출 순서 중복 검사 (셋째 변수): 동시 업로드 하는 이미지 파일의 파일명에서 중복된 값이 존재하는 경우
const validateDuplicateExposureOrdersAtiissu = (
  newFiles: UploadedImage[],
  existingFiles: UploadedImage[],
): string[] | undefined => {
  const findDuplicateOrders = (orders: string[]) => {
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    for (const order of orders) {
      if (seen.has(order)) duplicates.add(order);
      else seen.add(order);
    }
    return Array.from(duplicates);
  };

  // 중복 노출 시 에러 처리
  const handleDuplicateError = (
    duplicateOrders: (string | undefined)[],
    fileList: UploadedImage[],
  ) => {
    const invalidFiles = fileList
      .filter((img) =>
        duplicateOrders.includes(
          getPartialFileName(img.frontInfo.file.name, 2),
        ),
      )
      .map((img) => img.frontInfo.file.name);
    return invalidFiles;
  };

  // 1. 동시 업로드 중복 체크
  const uploadOrders = newFiles.map((img) =>
    getPartialFileName(img.frontInfo.file.name, 2),
  );
  const duplicateUploadOrders = findDuplicateOrders(uploadOrders);

  if (duplicateUploadOrders.length > 0) {
    return handleDuplicateError(duplicateUploadOrders, newFiles);
  }

  // 2. 기존 업로드와 중복 체크
  const allImages = [...newFiles, ...existingFiles];
  const allOrders = allImages.map((img) =>
    getPartialFileName(img.frontInfo.file.name, 2),
  );
  const duplicateAllOrders = findDuplicateOrders(allOrders);

  if (duplicateAllOrders.length > 0) {
    return handleDuplicateError(duplicateAllOrders, newFiles);
  }

  return undefined;
};

// 이미지 타입 검사 (다섯째 변수): 다섯째 변수에 product, model이 아닌 다른 값이 있는 경우
const validateImageType = (files: UploadedImage[]): string[] => {
  return files
    .filter(
      (file) =>
        getPartialFileName(file.frontInfo.file.name, 4) !== "product" &&
        getPartialFileName(file.frontInfo.file.name, 4) !== "model",
    )
    .map((file) => file.frontInfo.file.name);
};

/**
 * Atiissu 이미지 파일 유효성 검사
 * @param newFiles 새로 업로드된 파일 목록
 * @param existingFiles 기존 파일 목록
 * @param modelCode 상품의 Model 코드
 * @param sapCode 상품의 SAP 코드
 * @returns 유효성 검사 결과
 */
export const validateImageFilesAtiissu = (
  newFiles: UploadedImage[],
  existingFiles: UploadedImage[],
  modelCode: string | null,
  sapCode: string,
): { isValid: boolean; errorMessage?: string } => {
  const modelErrors = validateModelCode(newFiles, modelCode);
  if (modelErrors.length > 0) {
    return {
      isValid: false,
      errorMessage: `The Model Code included in the file name does not match the Model Code of the currently viewed product \n${modelErrors.join(", ")}`,
    };
  }

  const sapErrors = validateSapCode(newFiles, sapCode);
  if (sapErrors.length > 0) {
    return {
      isValid: false,
      errorMessage: `The SAP Code included in the file name does not match the SAP Code of the currently viewed product: \n${sapErrors.join(", ")}`,
    };
  }

  const formatErrors = validateExposureOrderFormatAtiissu(newFiles);
  if (formatErrors.length > 0) {
    return {
      isValid: false,
      errorMessage: `The 3rd element in the file name should be two digits: \n${formatErrors.join(", ")}`,
    };
  }

  const duplicateErrors = validateDuplicateExposureOrdersAtiissu(
    newFiles,
    existingFiles,
  );
  if (duplicateErrors && duplicateErrors.length > 0) {
    return {
      isValid: false,
      errorMessage: `Duplicate exposure orders cannot be assigned to images with the same SAP Code: \n${duplicateErrors.join(", ")}`,
    };
  }

  const typeErrors = validateImageType(newFiles);
  if (typeErrors.length > 0) {
    return {
      isValid: false,
      errorMessage: `The 5th element in the file name should be either 'product' or 'model': \n${typeErrors.join(", ")}`,
    };
  }

  return { isValid: true };
};
