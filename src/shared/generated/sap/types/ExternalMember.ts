/* eslint-disable */
export interface ExternalMemberRequestDto {
  /** user 정보(영문권장)<br>Ex.client secret Issue */
  userInfo?: string;
  /** user에 부여할 권한 */
  userRole?: string;
  /** user에 부여할 권한정보 */
  userRoleInfo?: string;
}

export interface ExternalMemberResponseDto {
  clientSecret?: string;
  userInfo?: string;
}
