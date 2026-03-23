/* eslint-disable */
export interface RefreshTokenRequestDto {
  /** refresh token */
  refreshToken: string;
}

export interface JwtTokenInfo {
  access_token?: string;
  /** @format date-time */
  expires_in?: string;
  /** @format date-time */
  fresh_expires_in?: string;
  grant_type?: string;
  refresh_token?: string;
  scope?: string;
}

export interface AccessTokenRequestDto {
  /** 발급받은 외부사용자 secret 키 */
  clientSecret: string;
}
