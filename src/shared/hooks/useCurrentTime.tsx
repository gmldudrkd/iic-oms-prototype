import { SxProps, Theme, Typography } from "@mui/material";
import { useState, useEffect } from "react";

import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { getLocalTime } from "@/shared/utils/formatDate";

interface UseCurrentTimeProps {
  isFetching: boolean;
  isSuccess: boolean;
  format?: string;
}

export default function useCurrentTime({
  isFetching,
  isSuccess,
  format = "YYYY-MM-DD HH:mm:ss",
}: UseCurrentTimeProps) {
  const { timezone } = useTimezoneStore();
  const [currentTime, setCurrentTime] = useState<string>(
    getLocalTime(new Date(), timezone),
  );

  // 현재 시간 업데이트
  useEffect(() => {
    if (!isFetching && isSuccess) {
      const formattedTime = getLocalTime(new Date(), timezone, format);
      setCurrentTime(formattedTime);
    }
  }, [isFetching, isSuccess, timezone, format]);

  const UpdatedAt = ({ sx }: { sx?: SxProps<Theme> }) => {
    return (
      <Typography fontSize="14px" sx={{ ...sx }}>
        Updated at: {currentTime}
      </Typography>
    );
  };

  return { currentTime, setCurrentTime, UpdatedAt };
}
