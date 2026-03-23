/* eslint-disable */
export interface ChannelSettingsMigrationResponseDTO {
  /** @format int32 */
  failedCount: number;
  failedItems: FailedItemDTO[];
  /** @format int32 */
  skippedCount: number;
  /** @format int32 */
  totalCount: number;
  /** @format int32 */
  updatedCount: number;
  updatedItems: UpdatedItemDTO[];
}

export interface UpdatedItemDTO {
  channelSettings: Record<string, boolean>;
  sapCode: string;
}

export interface FailedItemDTO {
  reason: string;
  sapCode: string;
}

/** File processing error details */
