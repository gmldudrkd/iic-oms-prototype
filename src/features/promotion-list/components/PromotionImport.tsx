"use client";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Button, Menu, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import * as XLSX from "xlsx";

import {
  IMPORT_PROMOTION_TYPES,
  IMPORT_TARGET_TYPES,
  IMPORT_TEMPLATE_COLUMNS,
  IMPORT_TEMPLATE_SAMPLE_ROWS,
} from "@/features/promotion-list/modules/constants";
import {
  PromotionRangeReward,
  PromotionRewardProduct,
  PromotionRow,
  PromotionTargetProduct,
} from "@/features/promotion-list/modules/mockData";

import { BRAND_CORP_CHANNELS } from "@/shared/constants/brandCorpChannels";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";

interface PromotionImportProps {
  // 업로드로 생성된 프로모션(Draft)을 리스트에 반영
  onImport: (rows: PromotionRow[]) => void;
  // 신규 ID 부여 기준 (현재 리스트 최대 ID)
  nextId: number;
}

type ImportRawRow = Record<string, string | number | undefined>;

// 엑셀 셀 값 → 문자열 (날짜 셀은 YYYY.MM.DD HH:mm 으로 정규화)
const cellToString = (value: string | number | Date | undefined) => {
  if (value === undefined || value === null) return "";
  if (value instanceof Date) return dayjs(value).format("YYYY.MM.DD HH:mm");
  return String(value).trim();
};

// "YYYY-MM-DD" / "YYYY.MM.DD" / "YYYY-MM-DD HH:mm" 을 리스트 표기 형식으로 변환
// 시각이 없으면 시작일은 00:00:00, 종료일은 23:59:59 로 저장
const normalizeDate = (value: string, endOfDay: boolean) => {
  if (!value) return null;
  const normalized = value.replace(/\./g, "-");
  const parsed = dayjs(normalized);
  if (!parsed.isValid()) return null;
  const hasTime = /\d{1,2}:\d{2}/.test(normalized);
  if (hasTime) return parsed.format("YYYY.MM.DD HH:mm:ss");
  const base = endOfDay ? parsed.endOf("day") : parsed.startOf("day");
  return base.format("YYYY.MM.DD HH:mm:ss");
};

// 여러 값 셀 → 줄바꿈(또는 쉼표/세미콜론) 단위로 분리
const splitLines = (value: string) =>
  value
    .split(/[\n,;]+/)
    .map((v) => v.trim())
    .filter(Boolean);

// "제품명 - 코드" → { name, code } (구분자 없으면 코드 = 제품명)
const parseProduct = (text: string) => {
  const idx = text.lastIndexOf(" - ");
  if (idx < 0) return { name: text, code: text };
  return {
    name: text.slice(0, idx).trim(),
    code: text.slice(idx + 3).trim(),
  };
};

const toTargetProduct = (text: string): PromotionTargetProduct => {
  const { name, code } = parseProduct(text);
  return { id: code, productName: name, price: 0, category: "-" };
};

const toRewardProduct = (text: string): PromotionRewardProduct => {
  const { name, code } = parseProduct(text);
  return { productName: name, skuCode: code };
};

// Order Amount 의 "[하한 ~ 상한] 제품명 - 코드" → 구간별 Reward 제품
// 상한이 비어 있으면 무제한 구간. 대괄호가 없는 줄은 첫 구간(하한 0 · 무제한)으로 묶음
const parseRangeRewards = (lines: string[]): PromotionRangeReward[] => {
  const ranges: PromotionRangeReward[] = [];
  const toNumber = (v: string) => Number(v.replace(/[^\d.]/g, "")) || 0;
  lines.forEach((line) => {
    const match = line.match(/^\[([^\]]*)\]\s*(.*)$/);
    const label = match ? match[1].trim() : "";
    const product = toRewardProduct(match ? match[2] : line);
    const [minText = "", maxText = ""] = label.split("~");
    const min = toNumber(minText);
    const max = toNumber(maxText);
    const unlimited = !maxText.trim() || max === 0;
    const key = label || "≥ 0";
    const existing = ranges.find((r) => r.label === key);
    if (existing) {
      existing.products.push(product);
      return;
    }
    ranges.push({
      label: unlimited ? `≥ ${minText.trim() || "0"}` : key,
      min,
      max: unlimited ? Number.MAX_SAFE_INTEGER : max,
      unlimited,
      products: [product],
    });
  });
  return ranges;
};

// 채널명 → Brand / Corp (BRAND_CORP_CHANNELS 역조회, 없으면 "BRAND_..._CORP" 명명 규칙으로 추정)
const brandCorpFromChannel = (channel: string) => {
  const hit = Object.entries(BRAND_CORP_CHANNELS).find(([, channels]) =>
    channels.includes(channel),
  );
  if (hit) {
    const [brand, corp] = hit[0].split("|");
    return { brand, corp };
  }
  const parts = channel.split("_").filter(Boolean);
  if (parts.length >= 2) {
    return { brand: parts[0], corp: parts[parts.length - 1] };
  }
  return null;
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

  // 템플릿 다운로드: 헤더 + 케이스별 샘플 행 (Export 엑셀과 동일한 컬럼 표기)
  const handleDownloadTemplate = useCallback(() => {
    handleCloseMenu();
    const ws = XLSX.utils.json_to_sheet(IMPORT_TEMPLATE_SAMPLE_ROWS, {
      header: IMPORT_TEMPLATE_COLUMNS.map((c) => c.key),
    });
    ws["!cols"] = IMPORT_TEMPLATE_COLUMNS.map((c) => ({ wch: c.width }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Promotions");
    XLSX.writeFile(wb, "IIC_OMS_Promotion_Import_Template.xlsx");
  }, []);

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

        const title = get("promotionTitle");
        const goal = get("goal");
        const promotionTypeRaw = get("promotionType").toUpperCase();
        const targetTypeCode = get("targetType").toUpperCase();
        const purchaseBasisRaw = get("purchaseBasis").toUpperCase();
        const purchaseQuantityRaw = get("purchaseQuantity");
        const rewardBasisRaw = get("rewardBasis").toUpperCase();
        const targetLines = splitLines(get("targetProduct"));
        const excludedLines = splitLines(get("excludedProduct"));
        const rewardLines = get("rewardProduct")
          .split(/\n+/)
          .map((v) => v.trim())
          .filter(Boolean);
        const channels = splitLines(get("channel"));
        const startDate = normalizeDate(get("startDate"), false);
        const endDateRaw = get("endDate");
        const endDate = endDateRaw ? normalizeDate(endDateRaw, true) : "";

        // 빈 행은 건너뜀
        if (
          !title &&
          !targetTypeCode &&
          rewardLines.length === 0 &&
          channels.length === 0 &&
          !startDate
        ) {
          return;
        }

        const brandCorp = channels.length
          ? brandCorpFromChannel(channels[0])
          : null;

        const missing: string[] = [];
        if (!title) missing.push("promotionTitle");
        if (rewardLines.length === 0) missing.push("rewardProduct");
        if (channels.length === 0) missing.push("channel");
        else if (!brandCorp) missing.push("channel (unknown Brand/Corp)");
        if (!startDate) missing.push("startDate");
        if (endDate === null) missing.push("endDate (invalid)");
        if (missing.length > 0) {
          errors.push(`Row ${rowNo}: ${missing.join(", ")}`);
          return;
        }

        // Target Type 코드 → 저장 triggerType (미기재·불일치 시 SPECIFIC_PRODUCT)
        const resolvedCode =
          targetTypeCode in IMPORT_TARGET_TYPES
            ? targetTypeCode
            : "SPECIFIC_PRODUCT";
        const isSpecific = resolvedCode === "SPECIFIC_PRODUCT";
        const isAmount = resolvedCode === "ORDER_AMOUNT";

        const targetProducts = isSpecific
          ? targetLines.map(toTargetProduct)
          : [];
        const excludedProducts = excludedLines.map(toTargetProduct);
        const rangeRewards = isAmount ? parseRangeRewards(rewardLines) : [];
        const rewardProducts: PromotionRewardProduct[] = isAmount
          ? rangeRewards.flatMap((r) => r.products)
          : rewardLines.map(toRewardProduct);
        // Promotion Type (미기재·불일치 시 GWP). Packaging Benefit 은 증정 기준이 Per product quantity 로 고정
        const promotionType: PromotionRow["promotionType"] =
          promotionTypeRaw === IMPORT_PROMOTION_TYPES[1] ? "PACKAGE" : "GWP";
        const rewardBasis =
          !isAmount &&
          (promotionType === "PACKAGE" ||
            rewardBasisRaw === "PER_PRODUCT_QUANTITY")
            ? "PER_PRODUCT_QUANTITY"
            : "PER_ORDER";

        const trigger = isAmount
          ? `Order Amount ≥ ${rangeRewards[0]?.min.toLocaleString() ?? 0}`
          : isSpecific && targetProducts.length
            ? targetProducts.map((t) => t.productName).join(", ")
            : "Purchase Any Product";
        const rewardLabel =
          rewardBasis === "PER_PRODUCT_QUANTITY"
            ? "per target item"
            : "per order";

        created.push({
          id: nextId + created.length + 1,
          brand: brandCorp?.brand ?? "",
          corp: brandCorp?.corp ?? "",
          title,
          goal: goal || undefined,
          // 업로드로 생성된 프로모션은 검토 후 활성화하도록 Draft 로 등록
          status: "Draft",
          promotionType,
          triggerType: IMPORT_TARGET_TYPES[resolvedCode],
          triggerChannels: channels,
          trigger,
          targetProducts: targetProducts.length ? targetProducts : undefined,
          purchaseBasis: isSpecific
            ? purchaseBasisRaw === "ALL"
              ? "ALL"
              : "ANY"
            : undefined,
          purchaseQuantity: isSpecific
            ? Math.max(1, Number(purchaseQuantityRaw) || 1)
            : undefined,
          rewardBasis: isAmount ? undefined : rewardBasis,
          excludedProducts: excludedProducts.length
            ? excludedProducts
            : undefined,
          reward: `${rewardProducts[0]?.productName ?? ""} * 1\n(${rewardLabel})`,
          rewardProducts,
          rangeRewards: isAmount ? rangeRewards : undefined,
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
