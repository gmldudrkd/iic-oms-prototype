/* eslint-disable */
export interface S3UploadResponseDTO {
  cloudFrontUrl: string;
  /** @format int64 */
  fileSize: number;
  originalFileName: string;
  storedFileName: string;
  type: string;
  url: string;
}
