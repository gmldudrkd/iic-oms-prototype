import { Box } from "@mui/material";

interface ProductInfoTableProps {
  sku: string;
  productName?: string;
}

export default function ProductInfoTable({
  sku,
  productName,
}: ProductInfoTableProps) {
  return (
    <Box
      component="table"
      width="100%"
      sx={{
        mt: "16px",
        mb: "10px",
        borderCollapse: "collapse",
        border: "1px solid #E0E0E0",
      }}
    >
      <Box component="tbody">
        <Box component="tr">
          <Box
            component="td"
            width="200px"
            bgcolor="rgba(33, 150, 243, 0.08)"
            padding="10px 16px"
            sx={{ fontWeight: "bold", border: "1px solid #E0E0E0" }}
          >
            SKU Code
          </Box>
          <Box
            component="td"
            padding="10px 16px"
            flex={1}
            sx={{ border: "1px solid #E0E0E0" }}
          >
            {sku}
          </Box>
          <Box
            component="td"
            width="200px"
            bgcolor="rgba(33, 150, 243, 0.08)"
            padding="10px 16px"
            sx={{ fontWeight: "bold", border: "1px solid #E0E0E0" }}
          >
            Product Name
          </Box>
          <Box
            component="td"
            padding="10px 16px"
            flex={1}
            sx={{ border: "1px solid #E0E0E0" }}
          >
            {productName ?? "-"}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
