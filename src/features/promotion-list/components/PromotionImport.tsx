"use client";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Button, Menu, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import * as XLSX from "xlsx";

import {
  IMPORT_TEMPLATE_COLUMNS,
  IMPORT_TEMPLATE_SAMPLE_ROW,
  IMPORT_TRIGGER_TYPES,
} from "@/features/promotion-list/modules/constants";
import { PromotionRow } from "@/features/promotion-list/modules/mockData";

import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";

interface PromotionImportProps {
  // 업로드로 생성된 프로모션(Draft)을 리스트에 반영
  onImport: (rows: PromotionRow[]) => void;
  // 신규 ID 부여 기준 (현재 리스트 최대 ID)
  nextId: number;
}

type ImportRawRow = Record<string, string | number | undefined>;

// 엑셀 셀 값 → 문자열 (날짜 셀은 YYYY.MM.DD 로 정규화)
const cellToString = (value: string | number | Date | undefined) => {
  if (value === undefined || value === null) return "";
  if (value instanceof Date) return dayjs(value).format("YYYY.MM.DD");
  return String(value).trim();
};

// "YYYY-MM-DD" / "YYYY.MM.DD" / "YYYY-MM-DD HH:mm" 을 리스트 표기 형식으로 변환
const normalizeDate = (value: string, endOfDay: boolean) => {
  if (!value) return null;
  const parsed = dayjs(value.replace(/\./g, "-"));
  if (!parsed.isValid()) return null;
  const base = endOfDay ? parsed.endOf("day") : parsed.startOf("day");
  return base.format("YYYY.MM.DD HH:mm:ss");
};

export default function PromotionImport({
  onImport,
  nextId,
}: PromotionImportProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { openSnackbar } = useSnackbarStore();
  const { timezone } = useTimezoneStore();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => setAnchorEl(null);

  // 템플릿 다운로드: 헤더 + 샘플 1행
  const handleDownloadTemplate = useCallback(() => {
    handleCloseMenu();
    const ws = XLSX.utils.json_to_sheet([IMPORT_TEMPLATE_SAMPLE_ROW], {
      header: IMPORT_TEMPLATE_COLUMNS.map((c) => c.key),
    });
    ws["!cols"] = IMPORT_TEMPLATE_COLUMNS.map((c) => ({ wch: c.width }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Promotions");
    const date = dayjs().tz(timezone).format("YYYYMMDD_HHmm");
    XLSX.writeFile(wb, `IIC_OMS_Promotion_Import_Template_${date}.xlsx`);
  }, [timezone]);

  // 업로드 파일 파싱 → PromotionRow(Draft) 변환. 필수값 누락 행은 에러로 집계
  const parseWorkbook = useCallback(
    (data: ArrayBuffer) => {
      const wb = XLSX.read(data, { type: "array", cellDates: true });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rawRows = XLSX.utils.sheet_to_json<ImportRawRow>(ws, {
        defval: "",
      });

      const created: PromotionRow[] = [];
      const errors: string[] = [];
      const now = dayjs().tz(timezone).format("YYYY.MM.DD HH:mm:ss");

      rawRows.forEach((raw, index) => {
        const rowNo = index + 2; // 헤더 다음 행부터
        const get = (key: string) => cellToString(raw[key]);

        const title = get("Title");
        const brand = get("Brand");
        const corp = get("Corp");
        const channel = get("Channel");
        const triggerType = get("Trigger Type");
        const targetSapCode = get("Target SAP Code");
        const rewardName = get("Reward Product Name");
        const rewardSapCode = get("Reward SAP Code");
        const rewardQty = Number(get("Reward Qty") || 1);
        const startDate = normalizeDate(get("Start Date"), false);
        const endDateRaw = get("End Date");
        const endDate = endDateRaw ? normalizeDate(endDateRaw, true) : "";

        // 빈 행은 건너뜀
        if (
          !title &&
          !brand &&
          !corp &&
          !channel &&
          !rewardSapCode &&
          !startDate
        ) {
          return;
        }

        const missing: string[] = [];
        if (!title) missing.push("Title");
        if (!brand) missing.push("Brand");
        if (!corp) missing.push("Corp");
        if (!channel) missing.push("Channel");
        if (!rewardSapCode) missing.push("Reward SAP Code");
        if (!startDate) missing.push("Start Date");
        if (endDate === null) missing.push("End Date (invalid)");
        if (missing.length > 0) {
          errors.push(`Row ${rowNo}: ${missing.join(", ")}`);
          return;
        }

        const resolvedTriggerType = IMPORT_TRIGGER_TYPES.includes(triggerType)
          ? triggerType
          : IMPORT_TRIGGER_TYPES[0];

        created.push({
          id: nextId + created.length + 1,
          brand,
          corp,
          title,
          // 업로드로 생성된 프로모션은 검토 후 활성화하도록 Draft 로 등록
          status: "Draft",
          triggerType: resolvedTriggerType,
          triggerChannels: channel
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean),
          trigger: targetSapCode || "All Products",
          reward: `${rewardName || rewardSapCode} * ${rewardQty}\n(per order)`,
          rewardProducts: [
            {
              productName: rewardName || rewardSapCode,
              skuCode: rewardSapCode,
            },
          ],
          startDate: startDate as string,
          endDate: endDate ?? "",
          alwaysOn: !endDate,
          createdBy: "import",
          createdAt: now,
          updatedBy: "-",
        });
      });

      return { created, errors };
    },
    [nextId, timezone],
  );

  const handleUploadExcel = useCallback(() => {
    handleCloseMenu();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx, .xls";
    input.multiple = false;
    input.onchange = async (event) => {
      const { files } = event.target as HTMLInputElement;
      if (!files || files.length === 0) return;

      try {
        const buffer = await files[0].arrayBuffer();
        const { created, errors } = parseWorkbook(buffer);

        if (created.length > 0) onImport(created);

        if (created.length === 0 && errors.length === 0) {
          openSnackbar({
            severity: "warning",
            message: "No promotion rows found in the uploaded file.",
          });
          return;
        }

        if (errors.length > 0) {
          openSnackbar({
            severity: created.length > 0 ? "warning" : "error",
            alertTitle:
              created.length > 0
                ? `${created.length} promotion(s) imported as Draft, ${errors.length} row(s) skipped`
                : "Import failed",
            message: errors.slice(0, 5).join("\n"),
            autoHideDuration: null,
          });
          return;
        }

        openSnackbar({
          severity: "success",
          message: `${created.length} promotion(s) imported as Draft.`,
        });
      } catch {
        openSnackbar({
          severity: "error",
          message: "Failed to read the file. Please upload a valid Excel file.",
        });
      }
    };
    input.click();
  }, [onImport, openSnackbar, parseWorkbook]);

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<UploadFileIcon />}
        onClick={handleOpenMenu}
      >
        Import
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <MenuItem onClick={handleDownloadTemplate}>Download Template</MenuItem>
        <MenuItem onClick={handleUploadExcel}>Upload Excel</MenuItem>
      </Menu>
    </>
  );
}
