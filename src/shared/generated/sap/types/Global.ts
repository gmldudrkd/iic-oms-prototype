/* eslint-disable */
export interface GlobalMemberSearchConditionDto {
  text?: string;
  type?: string;
}

export interface GlobalMemberDto {
  DEPARTMENT?: string;
  EMP_SEQ?: string;
  /** @format date */
  JOIN_DATE?: string;
  /** @format int64 */
  PGM_IDX?: number;
  UserId?: string;
  UserName?: string;
}

export interface BpFilterDto {
  country?: string;
  sapCode?: string;
  sname?: string;
}
