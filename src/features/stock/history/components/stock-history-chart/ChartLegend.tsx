import { Box, Typography } from "@mui/material";

export default function ChartLegend() {
  return (
    <Box display="flex" justifyContent="flex-end" mb={1}>
      <Typography fontSize="12px" fontWeight="bold" mr={2}>
        Channel Qty Line Style :
      </Typography>
      <Box display="flex" gap={2}>
        <Box display="flex" alignItems="center">
          <Box
            width={30}
            height={2}
            bgcolor="black"
            mr={1}
            sx={{ borderTop: "2px solid black" }}
          />
          <Typography variant="body2">Distributed Qty</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Box
            width={30}
            height={2}
            mr={1}
            sx={{ borderTop: "2px dashed black" }}
          />
          <Typography variant="body2">Available Qty</Typography>
        </Box>
      </Box>
    </Box>
  );
}
