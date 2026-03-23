import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Button, Popover, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

import usePutProductListExcelImport from "@/features/product-list/hooks/usePutProductListExcelImport";

import { useUserPermissionStore } from "@/shared/stores/useUserPermissionStore";

export default function ProductInfoBulkUpdate() {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { selectedPermission } = useUserPermissionStore();
  const isATIISSU = selectedPermission.some(
    (permission) => permission.brand.name === "ATIISSU",
  );

  const templateUrl = isATIISSU
    ? "https://pim-resources-dev.systemiic.com/template/OMS_ATiissu%20Product%20List_20250501_1950.xlsx"
    : "https://pim-resources-dev.systemiic.com/template/PIM_Nuflaat%20Product%20Info%20Bulk%20Update_20250805_1949.xlsx";

  // 📍 상품 업데이트 API
  const { mutate } = usePutProductListExcelImport();

  const handleClickExportButton = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsOpenMenu(true);
  };

  const handleImportExcel = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx, .xls";
    input.multiple = false;
    input.onchange = (event) => {
      const { files } = event.target as HTMLInputElement;
      if (files && files.length > 0) {
        const formData = new FormData();
        formData.append("file", files[0]);
        mutate(formData);
      }
    };
    input.click();
  };

  const handleCloseExportButton = () => {
    setIsOpenMenu(false);
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="warning"
        onClick={handleClickExportButton}
        startIcon={<UploadFileIcon />}
      >
        Product Info Bulk Update
      </Button>
      <Popover
        id="BulkUpdate"
        open={isOpenMenu}
        anchorEl={anchorEl}
        onClose={handleCloseExportButton}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={isOpenMenu}
          onClose={handleCloseExportButton}
        >
          <MenuItem>
            <a href={templateUrl} download rel="noopener noreferrer">
              Download Template
            </a>
          </MenuItem>
          <MenuItem onClick={handleImportExcel}>Upload Template</MenuItem>
        </Menu>
      </Popover>
    </>
  );
}
