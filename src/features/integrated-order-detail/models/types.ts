import { DateRange } from "@mui/x-date-pickers-pro/models/range";
import { Dayjs } from "dayjs";
import { FieldValues } from "react-hook-form";

import { ClaimCreateRequestFaultEnum } from "@/shared/generated/oms/types/Claim";
import { OrderEstimateRefundFeeRequestFaultEnum } from "@/shared/generated/oms/types/Order";

// 검색 타입
export interface SearchData extends FieldValues {
  searchKeyType: string;
  searchKeyword: string;
  statusFilter: string[];
  shippingStatusFilter: string[];
  channelCodes: string[];
  period: DateRange<Dayjs> | null;
}

// OpenCage API 응답 결과 타입 (하나의 결과 항목)
export interface OpenCageResponse {
  formatted: string;
  components: {
    house_number?: string;
    road?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
}

// 행정안전부 API 응답 결과 타입
export interface JusoApiResponse {
  detBdNmList?: string | null;
  engAddr?: string | null;
  rn?: string | null;
  emdNm?: string | null;
  zipNo?: string | null;
  roadAddrPart2?: string | null;
  emdNo?: string | null;
  sggNm?: string | null;
  jibunAddr?: string | null;
  siNm?: string | null;
  roadAddrPart1?: string | null;
  bdNm?: string | null;
  admCd?: string | null;
  udrtYn?: string | null;
  lnbrMnnm?: string | null;
  roadAddr?: string | null;
  lnbrSlno?: string | null;
  buldMnnm?: string | null;
  bdKdcd?: string | null;
  liNm?: string | null;
  rnMgtSn?: string | null;
  mtYn?: string | null;
  bdMgtSn?: string | null;
  buldSlno?: string | null;
}

// 주문 예상 환불 요청 타입을 클레임 생성 요청 타입으로 변환
export const mapFaultEnum = (
  fault: OrderEstimateRefundFeeRequestFaultEnum,
): ClaimCreateRequestFaultEnum => {
  return ClaimCreateRequestFaultEnum[fault];
};
