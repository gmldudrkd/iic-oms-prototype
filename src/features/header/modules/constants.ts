export const STORAGE_KEYS = {
  USER_PERMISSION: "user-permission",
  USER_TIMEZONE: "user-timezone",
} as const;

export const ALL_OPTION_VALUE = "all" as const;

// Brand & Corp 선택 가능한 경로
export const MULTI_PATHS = ["/order", "/channel-list"] as const;

export const DISABLE_PATHS = ["/product-list/detail"] as const;
export const BRAND_CORP_HIDDEN_PATHS = ["/user"] as const;
