import { Box, Typography } from "@mui/material";

interface FilterItemProps {
  label: string;
  color: string;
  checked: boolean;
  onClick: () => void;
}

export default function FilterItem({
  label,
  color,
  checked,
  onClick,
}: FilterItemProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={0.5}
      sx={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <Box
        width={12}
        height={12}
        sx={{
          backgroundColor: color,
          border: "1px solid #ccc",
        }}
      />
      <Typography
        fontSize="12px"
        sx={{
          textDecoration: checked ? "none" : "line-through",
          color: checked ? "inherit" : "#999",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
