import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/material/styles";

// LoadingSpinner 컴포넌트의 Props 정의
interface LoadingSpinnerProps {
  /**
   * 스피너의 크기 (픽셀 단위)
   * @default 40
   */
  size?: number;
  /**
   * 스피너의 색상
   * @default 'primary'
   */
  color?: CircularProgressProps["color"];
  /**
   * 스피너를 감싸는 Box 컨테이너에 적용할 사용자 정의 스타일 (sx prop)
   */
  sx?: SxProps<Theme>;
  /**
   * MUI CircularProgress 컴포넌트에 직접 전달할 추가 props
   * (size, color 제외)
   */
  circularProgressProps?: Omit<CircularProgressProps, "size" | "color">;
}

export default function LoadingSpinner({
  size = 40,
  color = "primary",
  sx,
  circularProgressProps,
}: LoadingSpinnerProps) {
  return (
    <CircularProgress
      color={color}
      size={size}
      sx={{ width: "100%", margin: "auto", ...sx }}
      {...circularProgressProps}
    />
  );
}
