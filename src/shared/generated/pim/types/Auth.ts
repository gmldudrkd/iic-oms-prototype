/* eslint-disable */
export interface SendCodeRequest {
  email: string;
}

export interface SendCodeResponse {
  verificationToken: string;
}

export interface VerifyCodeRequest {
  code: string;
  email: string;
  verificationToken: string;
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
}
