"use client";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import ViewListIcon from "@mui/icons-material/ViewList";
import {
  Button,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { DataGridPro, GridPaginationModel } from "@mui/x-data-grid-pro";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as XLSX from "xlsx";

import PromotionCalendar from "@/features/promotion-list/components/PromotionCalendar";
import PromotionImport from "@/features/promotion-list/components/PromotionImport";
import SearchForm from "@/features/promotion-list/components/SearchForm";
import { COLUMNS_PROMOTION_LIST } from "@/features/promotion-list/modules/columns";
import {
  DEFAULT_STATUS,
  TITLE_PARTIAL_SEARCH_MIN_LENGTH,
  VIEW_MODE_OPTIONS,
  ViewMode,
} from "@/features/promotion-list/modules/constants";
import {
  MOCK_PROMOTIONS,
  PromotionRow,
} from "@/features/promotion-list/modules/mockData";
import {
  getRemaining,
  getRewardDisplayRows,
  getTargetType,
} from "@/features/promotion-list/modules/utils";

import TotalResult from "@/shared/components/text/TotalResult";
import { COMMON_TABLE_PAGE_SIZE_OPTIONS } from "@/shared/constants";
import {
  brandCorpKey,
  brandCorpKeysOf,
} from "@/shared/constants/brandCorpChannels";
import useCurrentTime from "@/shared/hooks/useCurrentTime";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { useUserPermissionStore } from "@/shared/stores/useUserPermissionStore";
import { MUIDataGridTheme } from "@/shared/styles/theme";

// 메뉴 진입/초기화 시 노출 목록 (기본 상태가 ""이면 전체 노출)
const defaultRowsOf = (rows: PromotionRow[]) =>
  DEFAULT_STATUS
    ? rows.filter((row) => row.status.toUpperCase() === DEFAULT_STATUS)
    : rows;

export default function PromotionList() {
  const { timezone } = useTimezoneStore();
  const selectedPermission = useUserPermissionStore(
    (s) => s.selectedPermission,
  );

  // 상단 헤더 Brand & Corp 선택에 속한 프로모션만 조회 대상 (선택 전에는 전체)
  const scopedPromotions = useMemo(() => {
    const keys = brandCorpKeysOf(selectedPermission);
    if (keys.length === 0) return MOCK_PROMOTIONS;
    return MOCK_PROMOTIONS.filter((row) =>
      keys.includes(brandCorpKey(row.brand, row.corp)),
    );
  }, [selectedPermission]);

  const defaultValues = useMemo(
    () => ({
      dateType: "startDate",
      // 진행 예정 프로모션(시작일이 미래)도 기본 조회에 포함되도록 앞뒤 3개월
      period: [
        dayjs().tz(timezone).subtract(3, "month").startOf("day"),
        dayjs().tz(timezone).add(3, "month").endOf("day"),
      ],
      status: DEFAULT_STATUS,
      channel: "",
      searchKeyType: "title",
      searchKeyword: "",
    }),
    [timezone],
  );

  const methods = useForm({ defaultValues });

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: COMMON_TABLE_PAGE_SIZE_OPTIONS[0],
  });

  // 검색 결과 보기 방식 — 검색 조건은 동일하고 결과 영역만 List / Calendar 로 전환
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Mock: 실제로는 API에서 isFetching, isSuccess를 받아옴
  const [isFetching] = useState(false);
  const [filteredData, setFilteredData] = useState<PromotionRow[]>(() =>
    defaultRowsOf(scopedPromotions),
  );

  const { currentTime } = useCurrentTime({
    isFetching: false,
    isSuccess: true,
  });

  const rows = useMemo(() => {
    return filteredData.map((row, index) => ({
      ...row,
      _id: `${row.id}-${index}`,
    }));
  }, [filteredData]);

  const handleSearch = useCallback(() => {
    const values = methods.getValues();
    const { dateType, period, status, channel, searchKeyType, searchKeyword } =
      values;

    let result = [...scopedPromotions];

    // Status 필터
    if (status) {
      result = result.filter(
        (row) => row.status.toUpperCase() === String(status).toUpperCase(),
      );
    }

    // Channel 필터
    if (channel) {
      result = result.filter((row) =>
        row.triggerChannels.some((ch) =>
          ch.toLowerCase().includes(String(channel).toLowerCase()),
        ),
      );
    }

    // Date 필터 - period 값이 둘 다 있을 때만 적용
    if (period?.[0] && period?.[1]) {
      const startDate = dayjs(period[0]);
      const endDate = dayjs(period[1]);
      if (startDate.isValid() && endDate.isValid()) {
        result = result.filter((row) => {
          const dateField =
            dateType === "endDate" ? row.endDate : row.startDate;
          const normalized = dateField.replace(/\./g, "-");
          const rowDate = dayjs(normalized);
          if (!rowDate.isValid()) return true;
          return (
            rowDate.isAfter(startDate.subtract(1, "day")) &&
            rowDate.isBefore(endDate.add(1, "day"))
          );
        });
      }
    }

    // Keyword 검색
    const keyword = String(searchKeyword ?? "").trim();
    if (keyword) {
      const keywords = keyword
        .split("\n")
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);

      // Title 단일 부분검색은 최소 글자 수 미만이면 조회하지 않음
      if (
        searchKeyType === "title" &&
        keywords.length === 1 &&
        keywords[0].length < TITLE_PARTIAL_SEARCH_MIN_LENGTH
      ) {
        methods.setError("searchKeyword", {
          type: "minLength",
          message: `Enter at least ${TITLE_PARTIAL_SEARCH_MIN_LENGTH} characters to search by Title`,
        });
        return;
      }
      methods.clearErrors("searchKeyword");

      if (keywords.length > 0) {
        result = result.filter((row) => {
          const fieldMap: Record<string, string> = {
            id: String(row.id),
            title: row.title,
            createdBy: row.createdBy,
            updatedBy: row.updatedBy,
            gwpName: row.reward,
            gwpSapCode: row.reward,
            // Reward SAP Code: 사은품 제품의 SKU 코드 전체를 대상으로 검색
            rewardSapCode: row.rewardProducts
              .map((product) => product.skuCode)
              .join("\n"),
            targetProductName: [
              row.trigger,
              ...(row.targetProducts ?? []).map((p) => p.productName),
            ].join("\n"),
            targetSapCode: row.trigger,
          };
          const fieldValue = (
            fieldMap[String(searchKeyType)] ?? ""
          ).toLowerCase();
          // Title: 단일 키워드는 부분일치, 복수 키워드(줄바꿈)는 정확일치
          if (searchKeyType === "title" && keywords.length > 1) {
            return keywords.some((kw) => fieldValue === kw);
          }
          return keywords.some((kw) => fieldValue.includes(kw));
        });
      }
    }

    setFilteredData(result);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [methods, scopedPromotions]);

  // Brand & Corp 변경 시 현재 검색 조건으로 다시 조회
  useEffect(() => {
    handleSearch();
  }, [scopedPromotions, handleSearch]);

  const handleReset = useCallback(() => {
    methods.reset();
    setFilteredData(defaultRowsOf(scopedPromotions));
  }, [methods, scopedPromotions]);

  const handleRefresh = useCallback(() => {
    // Mock: 실제로는 refetch 호출
  }, []);

  // Import: 업로드로 생성된 Draft 프로모션을 현재 조회 결과 상단에 추가 (Mock)
  const handleImport = useCallback((imported: PromotionRow[]) => {
    setFilteredData((prev) => [...imported, ...prev]);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  const maxPromotionId = useMemo(
    () =>
      Math.max(
        ...MOCK_PROMOTIONS.map((row) => row.id),
        ...filteredData.map((row) => row.id),
      ),
    [filteredData],
  );

  const handleExport = useCallback(() => {
    const exportData = filteredData.map((row) => ({
      ID: row.id,
      promotionTitle: row.title,
      targetType: getTargetType(row.triggerType),
      rewardProduct: getRewardDisplayRows(row)
        .map((item) =>
          [
            item.rangeLabel ? `[${item.rangeLabel}]` : "",
            `${item.product.productName} - ${item.product.skuCode}`,
          ]
            .filter(Boolean)
            .join(" "),
        )
        .join("\n"),
      // 재고 (잔여 / 전체) — 검색 시점 기준, Order Amount 는 구간별 재고 최소 제품
      stock: getRewardDisplayRows(row)
        .map((item) =>
          item.product.total === undefined
            ? "-"
            : `${getRemaining(item.product)} / ${item.product.total}`,
        )
        .join("\n"),
      channel: row.triggerChannels.join(", "),
      status: row.status,
      createdDate: row.createdAt.replace(/\./g, "-").slice(0, 10),
      startDate: row.startDate.replace(/\./g, "-").slice(0, 10),
      endDate: row.endDate.replace(/\./g, "-"),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Promotions");
    const date = dayjs().tz(timezone).format("YYYYMMDD_HHmm");
    XLSX.writeFile(wb, `IIC_OMS_Promotion_List_${date}.xlsx`);
  }, [filteredData, timezone]);

  const handlePaginationModelChange = useCallback(
    (model: GridPaginationModel) => {
      if (isFetching) return;
      setPaginationModel(model);
    },
    [isFetching],
  );

  return (
    <ThemeProvider theme={MUIDataGridTheme}>
      <FormProvider {...methods}>
        <div className="flex flex-col gap-[24px]">
          {/* Search Form */}
          <div className="border-b border-outlined bg-white">
            <div className="px-[24px]">
              <SearchForm onSearch={handleSearch} onReset={handleReset} />
            </div>
          </div>

          {/* DataGrid */}
          <div className="border-[1px] border-solid border-[#E0E0E0] bg-white p-[24px]">
            <div className="mb-[8px] flex items-center justify-between">
              <div className="flex items-center gap-[16px]">
                <TotalResult
                  totalResult={filteredData.length}
                  classNames="!mb-0"
                />
                <ToggleButtonGroup
                  exclusive
                  size="small"
                  value={viewMode}
                  onChange={(_, v: ViewMode | null) => {
                    if (v) setViewMode(v);
                  }}
                  aria-label="Result view"
                >
                  {VIEW_MODE_OPTIONS.map((opt) => (
                    <ToggleButton
                      key={opt.value}
                      value={opt.value}
                      sx={{ textTransform: "none", px: 1.5, py: 0.5, gap: 0.5 }}
                    >
                      {opt.value === "list" ? (
                        <ViewListIcon fontSize="small" />
                      ) : (
                        <CalendarMonthIcon fontSize="small" />
                      )}
                      {opt.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </div>

              <div className="flex items-center gap-[8px]">
                <p className="text-[14px] text-black">
                  Updated at: {currentTime}
                </p>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  disabled={isFetching}
                >
                  Refresh
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleExport}
                >
                  Export
                </Button>
                <PromotionImport
                  onImport={handleImport}
                  nextId={maxPromotionId}
                />
              </div>
            </div>

            {viewMode === "calendar" ? (
              <PromotionCalendar rows={filteredData} />
            ) : (
              <div className="h-[calc(100vh-310px)] min-h-[400px]">
                <DataGridPro
                  columns={COLUMNS_PROMOTION_LIST}
                  rows={rows}
                  getRowId={(row) => row._id}
                  pagination
                  paginationModel={paginationModel}
                  onPaginationModelChange={handlePaginationModelChange}
                  pageSizeOptions={COMMON_TABLE_PAGE_SIZE_OPTIONS}
                  paginationMode="client"
                  disableColumnMenu
                  disableRowSelectionOnClick
                  disableColumnFilter
                  disableColumnSorting
                  loading={isFetching}
                  rowHeight={26}
                  getRowHeight={() => "auto"}
                  hideFooterSelectedRowCount
                />
              </div>
            )}
          </div>
        </div>
      </FormProvider>
    </ThemeProvider>
  );
}
