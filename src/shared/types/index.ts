export interface ApiError {
  status?: number;
  errorCode?: string;
  errorMessage?: string;
  errorDetail?: { field: string; value: string; reason: string }[];
}
