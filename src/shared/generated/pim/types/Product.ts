/* eslint-disable */
export interface ExcelImportResponseDTO {
  /**
   * Brand name
   * @example "Nike"
   */
  brand: string;
  /**
   * Timestamp when the job completed
   * @format date-time
   */
  completedAt?: string;
  /** Error message if the job failed */
  errorMessage?: string;
  /** Detailed processing errors */
  errors: ExcelProcessingError[];
  /**
   * Estimated processing time in seconds
   * @format int32
   */
  estimatedProcessingTimeSeconds?: number;
  /**
   * Number of rows that failed to process
   * @format int32
   */
  failedRows?: number;
  /**
   * Original filename of the uploaded Excel file
   * @example "products.xlsx"
   */
  fileName: string;
  /**
   * Unique job identifier
   * @example "excel-import-20240101-12345678"
   */
  jobId: string;
  /**
   * Number of rows processed successfully
   * @format int32
   */
  processedRows?: number;
  /**
   * Number of rows skipped
   * @format int32
   */
  skippedRows?: number;
  /**
   * Timestamp when the job started
   * @format date-time
   */
  startedAt: string;
  /** Current status of the import job */
  status: ExcelImportResponseDtoStatusEnum;
  /**
   * Total number of rows in the Excel file
   * @format int32
   */
  totalRows?: number;
  /**
   * Worker who initiated the import
   * @example "user123"
   */
  worker: string;
}

/** Current status of the import job */

export enum ExcelImportResponseDtoStatusEnum {
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  COMPLETED_WITH_ERRORS = "COMPLETED_WITH_ERRORS",
  FAILED = "FAILED",
}

/** Excel Processing Error */

export interface ExcelProcessingError {
  /** Error message describing what went wrong */
  errorMessage: string;
  /** Type of error that occurred */
  errorType: ExcelProcessingErrorErrorTypeEnum;
  /**
   * Row number where the error occurred
   * @format int32
   * @example 5
   */
  rowNumber: number;
  /**
   * SAP Code that caused the error
   * @example "SAP001"
   */
  sapCode?: string;
}

/** Type of error that occurred */

export enum ExcelProcessingErrorErrorTypeEnum {
  PRODUCT_NOT_FOUND = "PRODUCT_NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_DATA = "INVALID_DATA",
  PERSISTENCE_ERROR = "PERSISTENCE_ERROR",
  DUPLICATE_ENTRY = "DUPLICATE_ENTRY",
  PERMISSION_ERROR = "PERMISSION_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface AdminProductSearchPageRequestDTO {
  /**
   * 브랜드ID(GM, TB, AT)
   * @example "AT"
   */
  brandId: string;
  /**
   * 번들 코드 이름
   * @example "선글라스"
   */
  bundleCodes?: string[];
  channels?: string[];
  companies?: string[];
  /**
   * sap 자재 마스터 필수 속성 싱크 여부
   * @example "선글라스"
   */
  masterSyncStatus?: string;
  /**
   * 모델 코드 목록
   * @example ["66000000","66000001"]
   */
  modelCodes?: string[];
  /**
   * 페이지 번호 (0부터 시작)
   * @format int32
   * @example 0
   */
  pageNo: number;
  /**
   * 페이지 크기
   * @format int32
   * @example 100
   */
  pageSize: number;
  /**
   * 상품 정보 상태
   * @example "ALL"
   */
  productInfoStatus?: AdminProductSearchPageRequestDtoProductInfoStatusEnum;
  /**
   * 상품 타입
   * @example "ALL"
   */
  productType?: AdminProductSearchPageRequestDtoProductTypeEnum;
  /**
   * SAP 코드 목록
   * @example ["66000000","66000001"]
   */
  sapCodes?: string[];
  /**
   * SAP 제품명
   * @example "선글라스"
   */
  sapNames?: string[];
  /** SKU 코드 목록 */
  skuCodes?: string[];
}

/**
 * 상품 정보 상태
 * @example "ALL"
 */

export enum AdminProductSearchPageRequestDtoProductTypeEnum {
  ALL = "ALL",
  SINGLE = "SINGLE",
  BUNDLE = "BUNDLE",
}

/** V3 어드민 상품 검색 결과 (목록용) */

export enum AdminProductSearchPageRequestDtoProductInfoStatusEnum {
  ALL = "ALL",
  COMPLETE = "COMPLETE",
  INCOMPLETE = "INCOMPLETE",
}

/**
 * 상품 타입
 * @example "ALL"
 */

export interface OffsetPageAdminProductSearchV3ResponseDTO {
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
  /** 데이터 목록 */
  items: AdminProductSearchV3ResponseDTO[];
  /**
   * 현재 페이지 번호
   * @format int32
   */
  pageNo: number;
  /**
   * 페이지 크기
   * @format int32
   */
  pageSize: number;
  /**
   * 현재 페이지 아이템 수
   * @format int32
   */
  size: number;
  /**
   * 전체 데이터 수
   * @format int32
   */
  totalCount: number;
  /**
   * 전체 페이지 수
   * @format int32
   */
  totalPageCount: number;
}

export interface AdminProductSearchV3ResponseDTO {
  /** 번들 구성품 */
  bundleProducts: AdminBundleProductDTO[];
  /** 채널 정보 */
  channels: AdminChannelDTO[];
  /**
   * 생성 일시
   * @format date-time
   */
  createdAt?: string;
  /** 제품 정보 완성 여부 */
  isCompleted: boolean;
  /** 가격 정보 */
  prices: AdminPriceDTO[];
  /**
   * 상품 타입
   * @example "SINGLE"
   */
  productType: AdminProductSearchV3ResponseDtoProductTypeEnum;
  /**
   * SAP 코드
   * @example 11005007
   */
  sapCode: string;
  /**
   * SAP 제품명
   * @example "Pico 02(SM)"
   */
  sapName: string;
  /**
   * SKU 코드
   * @example "S11005007"
   */
  sku?: string;
  /**
   * 수정 일시
   * @format date-time
   */
  updatedAt?: string;
}

/**
 * 상품 타입
 * @example "SINGLE"
 */

export enum AdminProductSearchV3ResponseDtoProductTypeEnum {
  SINGLE = "SINGLE",
  BUNDLE = "BUNDLE",
}

export interface AdminPriceDTO {
  /**
   * 통화
   * @example "KRW"
   */
  currency: string;
  /**
   * 적용 종료일
   * @format date-time
   */
  endedAt?: string;
  /** 가격 */
  price: number;
  /**
   * 적용 시작일
   * @format date-time
   */
  startedAt: string;
}

/** V3 어드민 상품 에셋 조회 결과 */

export interface AdminChannelDTO {
  /** 활성화 여부 */
  availability: boolean;
  /** 채널 이름 */
  channelName?: string;
}

export interface AdminBundleProductDTO {
  /**
   * 수량
   * @format int32
   */
  quantity: number;
  /** SAP 코드 */
  sapCode: string;
  /** SAP 제품명 */
  sapName: string;
}

export interface OmsProductSearchRequestDTO {
  /**
   * 브랜드ID(GM, TB, AT)
   * @example "AT"
   */
  brandId?: string;
  /**
   * 세부정보 조회
   * @example true
   */
  detail: boolean;
  /**
   * 페이징 방향
   * @example "NEXT"
   */
  direction: OmsProductSearchRequestDtoDirectionEnum;
  /**
   * 첫번째 SKU (이전 페이지용 커서)
   * @example "ATIISSU-SHINE-BK-BEANIES-M-2025"
   */
  firstSku?: string;
  /**
   * 마지막 SKU (다음 페이지용 커서)
   * @example "ATIISSU-SHINE-WH-BEANIES-M-2025"
   */
  lastSku?: string;
  /**
   * 모델 코드 목록
   * @example ["66000000","66000001"]
   */
  modelCodes?: string[];
  /**
   * 페이지 번호 (0부터 시작)
   * @format int32
   * @example 0
   */
  pageNo: number;
  /**
   * 페이지 크기
   * @format int32
   * @example 100
   */
  pageSize: number;
  /**
   * 상품 정보 상태
   * @example "ALL"
   */
  productInfoStatus?: OmsProductSearchRequestDtoProductInfoStatusEnum;
  /**
   * 상품 타입
   * @example "ALL"
   */
  productType?: OmsProductSearchRequestDtoProductTypeEnum;
  /**
   * SAP 코드 목록
   * @example ["66000000","66000001"]
   */
  sapCodes?: string[];
  /**
   * SAP 제품명
   * @example "선글라스"
   */
  sapName?: string;
  /**
   * SKU 코드 목록
   * @example ["ATIISSU-SHINE-WH-BEANIES-M-2025","ATIISSU-SHINE-BK-BEANIES-M-2025"]
   */
  skuCodes?: string[];
  /**
   * UPC 코드 목록
   * @example ["880000111111","880000111112"]
   */
  upcCodes?: string[];
  /**
   * 작업자
   * @example "monster1234"
   */
  worker?: string;
}

/**
 * 페이징 방향
 * @example "NEXT"
 */

export enum OmsProductSearchRequestDtoProductTypeEnum {
  ALL = "ALL",
  SINGLE = "SINGLE",
  BUNDLE = "BUNDLE",
}

/** 상품 검색 응답 */

export enum OmsProductSearchRequestDtoProductInfoStatusEnum {
  ALL = "ALL",
  COMPLETE = "COMPLETE",
  INCOMPLETE = "INCOMPLETE",
}

/**
 * 상품 타입
 * @example "ALL"
 */

export enum OmsProductSearchRequestDtoDirectionEnum {
  NEXT = "NEXT",
  PREVIOUS = "PREVIOUS",
}

/**
 * 상품 정보 상태
 * @example "ALL"
 */

export interface OmsProductSearchResponseDTO {
  /** 페이지 정보 */
  pagination: PaginationInfo;
  /** 검색된 상품 목록 */
  products: OmsProductResponseDTO[];
}

export interface OmsProductResponseDTO {
  /** 카테고리1 */
  categoryCode1?: string;
  /** 카테고리2 */
  categoryCode2?: string;
  /** 카테고리3 */
  categoryCode3?: string;
  /** 카테고리 이름1 */
  categoryName1?: string;
  /** 카테고리 이름2 */
  categoryName2?: string;
  /** 카테고리 이름3 */
  categoryName3?: string;
  /** 에셋 */
  assets: ProductImageDTO[];
  /**
   * 브랜드 ID
   * @example "AT"
   */
  brandId?: string;
  /**
   * 번들 상품 리스트
   * @example []
   */
  bundleProducts: any;
  /** 용량 */
  capacity?: string;
  /** 용량 단위 */
  capacityUnit?: string;
  /** 케어 정보 영어 */
  careInstructionsEn?: string;
  /** 케어 정보 한국어 */
  careInstructionsKo?: string;
  /** 컬렉션 이름 */
  collectionName?: string;
  /** 색상 */
  color?: string;
  /** 제조국 */
  countryOfManufacture?: string;
  /**
   * 생성 일시
   * @format date-time
   */
  createdAt?: string;
  /**
   * 디자인 등급
   * @example "A"
   */
  designGrade?: string;
  /** HS 코드 */
  hsCode?: string;
  /**
   * 이미지
   * @example []
   */
  images: string[];
  /**
   * 번들 상품 여부
   * @example false
   */
  isBundle: boolean;
  /**
   * 제품 정보 완성 여부
   * @example false
   */
  isCompleted: boolean;
  /** 라인 이름 */
  lineName?: string;
  /** 안감 영어 */
  liningEn?: string;
  /** 안감 한국어 */
  liningKo?: string;
  /** 밀리미터 사이즈 */
  mmSize?: MmSizeDTO;
  /** 모델 코드 */
  modelCode?: string;
  /** 모델 이름 */
  modelName?: string;
  /** 순중량 */
  netWeight?: number;
  /** 겉감 영어 */
  outerFabricEn?: string;
  /** 겉감 한국어 */
  outerFabricKo?: string;
  /**
   * 무상 패키지 정보
   * @example [{"sapCode":"12345","sapName":"Shopping Bag","qty":10}]
   */
  packageMasters?: PackageMasterDTO[];
  /**
   * 유상 패키지 정보 (실제 상품 정보 포함)
   * @example []
   */
  paidPackageMasters?: any;
  /** 가격 */
  priceMasters?: PriceMasterDTO[];
  /** 제품 정보 */
  productInformation?: ProductInformationResponseDTO[];
  /**
   * 상품 타입
   * @example "SINGLE"
   */
  productType: OmsProductResponseDtoProductTypeEnum;
  /**
   * 번들 내 수량 (Bundle Product인 경우)
   * @format int32
   * @example 1
   */
  qty: number;
  /**
   * 출시일
   * @format date
   */
  releaseDate?: string;
  /** 채널 활성화 정보 */
  salesAndDistributionSettings?: SalesAndDistributionSettingDTO[];
  /**
   * 판매 등급
   * @example "A"
   */
  salesGrade?: string;
  /**
   * SAP 코드
   * @example 66000001
   */
  sapCode?: string;
  /** 제품명 */
  sapName?: string;
  /** 시즌 */
  season?: string;
  /** 사이즈 */
  size?: string;
  /**
   * sku
   * @example "ATIISSU-SHINE-WH-BEANIES-M-2025"
   */
  sku?: string;
  /** 상품 상태 */
  status?: string;
  /** UPC 코드 */
  upcCode?: string;
  /**
   * 수정 일시
   * @format date-time
   */
  updatedAt?: string;
  /** 비주얼 텍스쳐 */
  visualTexture?: string;
  /** 세탁 방법 */
  washMethod?: string;
}

/**
 * 상품 타입
 * @example "SINGLE"
 */

export interface SalesAndDistributionSettingDTO {
  /** 활성화 여부 */
  availability: boolean;
  /**
   * 채널 코드
   * @format int32
   */
  channelId?: number;
  /** 채널 이름 */
  channelName?: string;
  /** 채널 타입 */
  channelType?: string;
  /** 채널 SAP 코드 */
  sapChannelCode?: string;
  /** 채널 SAP 이름 */
  sapChannelName?: string;
}

export enum OmsProductResponseDtoProductTypeEnum {
  SINGLE = "SINGLE",
  BUNDLE = "BUNDLE",
}

export interface ProductInformationResponseDTO {
  collectionName?: string;
  description?: string;
  internalSearchKeyword?: string;
  languageCode?: string;
  name?: string;
}

export interface PriceMasterDTO {
  /** 통화 */
  currency?: string;
  /**
   * 종료일
   * @format date-time
   */
  endedAt?: string;
  /** 가격 */
  price?: number;
  /**
   * 시작일
   * @format date-time
   */
  startedAt?: string;
}

export interface PackageMasterDTO {
  /**
   * 패키지 수량
   * @format int32
   */
  qty?: number;
  /** SAP 코드 (무상 패키지용) */
  sapCode?: string;
  /** 패키지 명 */
  sapName?: string;
  /** SKU 코드 (유상 패키지용) */
  sku?: string;
}

/** 페이지 정보 */

export interface MmSizeDTO {
  /** 길이 */
  brimSize?: number;
  /** 둘레 */
  circumference?: number;
  /** 깊이 */
  depth?: number;
}

/** 오프셋 기반 페이지네이션 응답 */

export interface ProductImageDTO {
  /** 에셋 ID */
  assetId?: string;
  /** 서비스용 URL */
  cloudFrontUrl?: string;
  /**
   * 에셋 정렬 순서
   * @format int32
   */
  displayOrder?: number;
  /**
   * 에셋 크기 (bytes)
   * @format int64
   */
  fileSize?: number;
  /** 원본 파일명 */
  originalFileName?: string;
  /** 업로드 파일명 */
  storedFileName?: string;
  /** 에셋 타입(PRODUCT, MODEL, VIDEO */
  type: string;
  /** S3 URL */
  url?: string;
}

export interface PaginationInfo {
  /**
   * 현재 페이지의 아이템 수
   * @format int32
   * @example 50
   */
  currentPageSize: number;
  /**
   * 다음 페이지 존재 여부
   * @example true
   */
  hasNext: boolean;
  /**
   * 이전 페이지 존재 여부
   * @example false
   */
  hasPrevious: boolean;
  /**
   * 다음 페이지를 위한 마지막 SKU
   * @example "ATIISSU-SHINE-WH-BEANIES-M-2025"
   */
  nextCursor?: string;
  /**
   * 현재 페이지 번호
   * @format int32
   * @example 0
   */
  pageNo: number;
  /**
   * 페이지 크기
   * @format int32
   * @example 100
   */
  pageSize: number;
  /**
   * 이전 페이지를 위한 첫번째 SKU
   * @example "ATIISSU-SHINE-BK-BEANIES-M-2025"
   */
  previousCursor?: string;
  /**
   * 검색 결과 전체 개수
   * @format int32
   * @example 1250
   */
  totalCount: number;
  /**
   * 총 페이지 수
   * @format int32
   * @example 0
   */
  totalPageNo: number;
}

export interface AsyncExcelExportResult {
  /** @format date-time */
  createdAt: string;
  /** @format int32 */
  estimatedCompletionMinutes?: number;
  message: string;
  status: AsyncExcelExportResultStatusEnum;
  taskId: string;
}

export enum AsyncExcelExportResultStatusEnum {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export interface OmsChannelProductSearchRequestDTO {
  /**
   * 브랜드ID(GM, TB, AT)
   * @example "AT"
   */
  brandId?: string;
  /**
   * 채널 활성화 상태 ('ALL': 모든 채널, 'YES': 활성화된 채널만, 'NO': 비활성화된 채널만)
   * @example "ALL"
   */
  channelActive?: OmsChannelProductSearchRequestDtoChannelActiveEnum;
  /** 채널 이름 ('ALL': 모든 채널, 특정 채널 코드: 해당 채널만 필터링) */
  channelName?: string;
  /**
   * 페이징 방향
   * @example "NEXT"
   */
  direction: OmsChannelProductSearchRequestDtoDirectionEnum;
  /**
   * 첫번째 SKU (이전 페이지용 커서)
   * @example "ATIISSU-SHINE-BK-BEANIES-M-2025"
   */
  firstSku?: string;
  /**
   * 마지막 SKU (다음 페이지용 커서)
   * @example "ATIISSU-SHINE-WH-BEANIES-M-2025"
   */
  lastSku?: string;
  /**
   * 모델 코드 목록
   * @example ["66000000","66000001"]
   */
  modelCodes?: string[];
  /**
   * 페이지 번호 (0부터 시작)
   * @format int32
   * @example 0
   */
  pageNo: number;
  /**
   * 페이지 크기
   * @format int32
   * @example 100
   */
  pageSize: number;
  /**
   * 상품 정보 상태
   * @example "ALL"
   */
  productInfoStatus?: OmsChannelProductSearchRequestDtoProductInfoStatusEnum;
  /**
   * 상품 타입
   * @example "ALL"
   */
  productType?: OmsChannelProductSearchRequestDtoProductTypeEnum;
  /**
   * SAP 코드 목록
   * @example ["66000000","66000001"]
   */
  sapCodes?: string[];
  /**
   * SAP 제품명
   * @example "선글라스"
   */
  sapName?: string;
  /**
   * SKU 코드 목록
   * @example ["ATIISSU-SHINE-WH-BEANIES-M-2025","ATIISSU-SHINE-BK-BEANIES-M-2025"]
   */
  skuCodes?: string[];
  /**
   * UPC 코드 목록
   * @example ["880000111111","880000111112"]
   */
  upcCodes?: string[];
}

/**
 * 채널 활성화 상태 ('ALL': 모든 채널, 'YES': 활성화된 채널만, 'NO': 비활성화된 채널만)
 * @example "ALL"
 */

export enum OmsChannelProductSearchRequestDtoProductTypeEnum {
  ALL = "ALL",
  SINGLE = "SINGLE",
  BUNDLE = "BUNDLE",
}

export enum OmsChannelProductSearchRequestDtoProductInfoStatusEnum {
  ALL = "ALL",
  COMPLETE = "COMPLETE",
  INCOMPLETE = "INCOMPLETE",
}

/**
 * 상품 타입
 * @example "ALL"
 */

export enum OmsChannelProductSearchRequestDtoDirectionEnum {
  NEXT = "NEXT",
  PREVIOUS = "PREVIOUS",
}

/**
 * 상품 정보 상태
 * @example "ALL"
 */

export enum OmsChannelProductSearchRequestDtoChannelActiveEnum {
  ALL = "ALL",
  YES = "YES",
  NO = "NO",
}

/**
 * 페이징 방향
 * @example "NEXT"
 */

export interface ProductUpdateRequestDTO {
  /**
   * 제품 이미지 업데이트 요청 리스트
   * @example [{"originalFileName":"image1.jpg","storedFileName":"image1_12345.jpg","url":"https://example.com/image1.jpg","cloudFrontUrl":"https://cdn.example.com/image1.jpg","fileSize":102400,"displayOrder":1,"type":"PRODUCT"},{"originalFileName":"image2.jpg","storedFileName":"image2_12345.jpg","url":"https://example.com/image2.jpg","cloudFrontUrl":"https://cdn.example.com/image2.jpg","fileSize":204800,"displayOrder":2,"type":"PRODUCT"}]
   */
  assets: string;
  /**
   * 채널 사용 가능 업데이트 요청 리스트
   * @example [{"sapChannelCode":"CHANNEL_1","isActive":true},{"sapChannelCode":"CHANNEL_2","isActive":false}]
   */
  channel: string;
  /**
   * 패키지 정보 업데이트 요청 리스트 (SKU + 수량)
   * @example [{"sku":"SKU001","quantity":2},{"sku":"SKU002","quantity":1}]
   */
  packages: string;
  /**
   * 제품 정보 업데이트 요청 리스트
   * @example [{"language":"en","name":"Product Name","description":"Product Description","collection":"Collection Name","internalSearchKeyword":"키워드"},{"language":"ko","name":"제품 이름","description":"제품 설명","collection":"컬렉션 이름","internalSearchKeyword":"keyword"}]
   */
  productInformation: string;
  /**
   * 제품 상태
   * @example "ACTIVE"
   */
  status?: string;
}

export interface AdminProductDetailV3ResponseDTO {
  /** 카테고리 코드1 */
  categoryCode1?: string;
  /** 카테고리 코드2 */
  categoryCode2?: string;
  /** 카테고리 코드3 */
  categoryCode3?: string;
  /** 카테고리 이름1 */
  categoryName1?: string;
  /** 카테고리 이름2 */
  categoryName2?: string;
  /** 카테고리 이름3 */
  categoryName3?: string;
  /**
   * 브랜드 ID
   * @example "AT"
   */
  brandId: string;
  /** 용량 */
  capacity?: string;
  /** 용량 단위 */
  capacityUnit?: string;
  /** 케어 정보 영어 */
  careInstructionsEn?: string;
  /** 케어 정보 한국어 */
  careInstructionsKo?: string;
  /** 채널 정보 */
  channels: DetailChannelDTO[];
  /** 컬렉션 이름 */
  collectionName?: string;
  /** 색상 */
  color?: string;
  /** 제조국 */
  countryOfManufacture?: string;
  /**
   * 생성 일시
   * @format date-time
   */
  createdAt?: string;
  /** 디자인 등급 */
  designGrade?: string;
  /** HS 코드 */
  hsCode?: string;
  /** 번들 상품 여부 */
  isBundle: boolean;
  /** 제품 정보 완성 여부 */
  isCompleted: boolean;
  /** 라인 이름 */
  lineName?: string;
  /** 안감 영어 */
  liningEn?: string;
  /** 안감 한국어 */
  liningKo?: string;
  /** 밀리미터 사이즈 */
  mmSize?: MmSizeDTO;
  /** 모델 코드 */
  modelCode?: string;
  /** 모델 이름 */
  modelName?: string;
  /** 순중량 */
  netWeight?: number;
  /** 겉감 영어 */
  outerFabricEn?: string;
  /** 겉감 한국어 */
  outerFabricKo?: string;
  /** 패키지 정보 */
  packageMasters: DetailPackageMasterDTO[];
  /** 가격 정보 */
  priceMasters: DetailPriceMasterDTO[];
  /**
   * 상품 타입
   * @example "SINGLE"
   */
  productType: AdminProductDetailV3ResponseDtoProductTypeEnum;
  /**
   * 출시일
   * @format date
   */
  releaseDate?: string;
  /** 판매 등급 */
  salesGrade?: string;
  /**
   * SAP 코드
   * @example 11005007
   */
  sapCode: string;
  /**
   * SAP 제품명
   * @example "Pico 02(SM)"
   */
  sapName: string;
  /** 시즌 */
  season?: string;
  /** 사이즈 */
  size?: string;
  /**
   * SKU 코드
   * @example "S11005007"
   */
  sku?: string;
  /** 상품 상태 */
  status?: string;
  /** UPC 코드 */
  upcCode?: string;
  /**
   * 수정 일시
   * @format date-time
   */
  updatedAt?: string;
  /** 비주얼 텍스쳐 */
  visualTexture?: string;
  /** 세탁 방법 */
  washMethod?: string;
}

/**
 * 상품 타입
 * @example "SINGLE"
 */

export enum AdminProductDetailV3ResponseDtoProductTypeEnum {
  SINGLE = "SINGLE",
  BUNDLE = "BUNDLE",
}

/** 어드민 프론트 상품 검색 요청 (페이지 기반) */

export interface DetailPriceMasterDTO {
  /**
   * 통화
   * @example "KRW"
   */
  currency: string;
  /**
   * 적용 종료일
   * @format date-time
   */
  endedAt?: string;
  /** 가격 */
  price: number;
  /** 가격 코드 (SAP) */
  priceCode: string;
  /**
   * 적용 시작일
   * @format date-time
   */
  startedAt: string;
  /**
   * 상태
   * @example "ACTIVE"
   */
  status: string;
}

/** Excel Import Response */

export interface DetailPackageMasterDTO {
  /**
   * 표시 순서
   * @format int32
   */
  displayOrder: number;
  /** 패키지 ID */
  id: string;
  /**
   * 패키지 타입
   * @example "FREE"
   */
  packageType: DetailPackageMasterDtoPackageTypeEnum;
  /**
   * 수량
   * @format int32
   */
  quantity: number;
  /** SKU */
  sku: string;
}

/**
 * 패키지 타입
 * @example "FREE"
 */

export enum DetailPackageMasterDtoPackageTypeEnum {
  FREE = "FREE",
  PAID = "PAID",
}

/** 가격 마스터 상세 */

export interface DetailChannelDTO {
  /** 활성화 여부 */
  availability: boolean;
  /**
   * 채널 ID
   * @format int32
   */
  channelId: number;
  /** 채널 이름 */
  channelName: string;
  /** 채널 타입 */
  channelType: string;
  /** SAP 채널 코드 */
  sapChannelCode: string;
  /** SAP 채널 이름 */
  sapChannelName: string;
}

/** 패키지 마스터 상세 */

export interface AdminProductAssetV3ResponseDTO {
  /** S3 URL */
  s3Url: string;
  /** 에셋 ID */
  assetId: string;
  /**
   * 에셋 타입
   * @example "PRODUCT"
   */
  assetType: AdminProductAssetV3ResponseDtoAssetTypeEnum;
  /**
   * 생성 일시
   * @format date-time
   */
  createdAt: string;
  /** 파일 확장자 */
  fileExtension: string;
  /** 원본 파일명 */
  fileName: string;
  /**
   * 파일 크기 (bytes)
   * @format int64
   */
  fileSize: number;
  /** MIME 타입 */
  mimeType: string;
  /**
   * 리비전
   * @format int32
   */
  revision: number;
  /**
   * 정렬 순서
   * @format int32
   */
  sortOrder: number;
  /** 서비스용 URL (CloudFront) */
  url: string;
}

/**
 * 에셋 타입
 * @example "PRODUCT"
 */

export enum AdminProductAssetV3ResponseDtoAssetTypeEnum {
  PRODUCT = "PRODUCT",
  MODEL = "MODEL",
  VIDEO = "VIDEO",
}

/** V3 어드민 상품 상세 조회 결과 */
