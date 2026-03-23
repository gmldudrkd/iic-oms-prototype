import { Box, CircularProgress } from "@mui/material";

export const FullScreenLoader = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)", // 반투명 배경
        zIndex: 9999, // 최상위 레이어 유지
      }}
    >
      <CircularProgress size={60} />
    </Box>
  );
};

export default FullScreenLoader;
