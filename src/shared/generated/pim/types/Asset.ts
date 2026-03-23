/* eslint-disable */
export interface BulkAssetUploadResponseDTO {
  /**
   * Brand
   * @example "ATIISSU"
   */
  brand: string;
  /**
   * Upload completion time
   * @format date-time
   */
  completedAt?: string;
  /** Error message if upload failed */
  errorMessage?: string;
  /** List of processing errors for individual files */
  errors: FileProcessingError[];
  /**
   * Number of files that failed processing
   * @format int32
   */
  failedFiles: number;
  /**
   * Upload job ID for tracking
   * @example "bulk-upload-20250719-001"
   */
  jobId: string;
  /**
   * Number of files successfully processed
   * @format int32
   */
  processedFiles: number;
  /**
   * Number of files skipped due to invalid filename
   * @format int32
   */
  skippedFiles: number;
  /** Slack channel ID where notification was sent */
  slackChannelId?: string;
  /** Slack message timestamp */
  slackMessageTs?: string;
  /**
   * Upload start time
   * @format date-time
   */
  startedAt: string;
  /**
   * Upload status
   * @example "PROCESSING"
   */
  status: BulkAssetUploadResponseDtoStatusEnum;
  /**
   * Total number of files submitted for upload
   * @format int32
   */
  totalFiles: number;
  /** worker */
  worker: string;
}

/**
 * Upload status
 * @example "PROCESSING"
 */

export enum BulkAssetUploadResponseDtoStatusEnum {
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  COMPLETED_WITH_ERRORS = "COMPLETED_WITH_ERRORS",
  FAILED = "FAILED",
}

export interface FileProcessingError {
  /** Error message */
  errorMessage: string;
  /** Error type */
  errorType: FileProcessingErrorErrorTypeEnum;
  /** Original filename */
  filename: string;
}

/** Error type */

export enum FileProcessingErrorErrorTypeEnum {
  INVALID_FILENAME = "INVALID_FILENAME",
  PRODUCT_NOT_FOUND = "PRODUCT_NOT_FOUND",
  S3_UPLOAD_FAILED = "S3_UPLOAD_FAILED",
  ASSET_SAVE_FAILED = "ASSET_SAVE_FAILED",
  UNSUPPORTED_FILE_TYPE = "UNSUPPORTED_FILE_TYPE",
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  EXCEEDED_FILE_COUNT = "EXCEEDED_FILE_COUNT",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}
