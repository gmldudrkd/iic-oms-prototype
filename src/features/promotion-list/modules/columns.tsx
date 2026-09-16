import { Chip, Tooltip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid-pro";
import Link from "next/link";
import { useState } from "react";

import { PromotionRow } from "@/features/promotion-list/modules/mockData";
import {
  getRemaining,
  getRewardDisplayRows,
  getStockLevel,
  getTargetType,
  PromotionTargetType,
  StockLevel,
} from "@/features/promotion-list/modules/utils";

const renderStatusCell = (params: GridRenderCellParams) => {
  const statusColorMap: Record<
    string,
    "success" | "warning" | "error" | "default"
  > = {
    Active: "success",
    Scheduled: "warning",
    Ended: "default",
    Draft: "default",
    Deleted: "default",
  };

  const status = params.value as string;

  const customSxMap: Record<string, object> = {
    Ended: { backgroundColor: "#9E9E9E", color: "#FFFFFF" },
    Draft: { backgroundColor: "#42A5F5", color: "#FFFFFF" },
    Deleted: { backgroundColor: "#C62828", color: "#FFFFFF" },
  };

  return (
    <Chip
      label={params.value}
      color={statusColorMap[status] ?? "default"}
      size="small"
      sx={customSxMap[status]}
    />
  );
};

function ChannelChipsCell({ values }: { values: string[] }) {
  const [expanded, setExpanded] = useState(false);
  if (!values || values.length === 0) return <>-</>;

  const MAX_VISIBLE = 3;
  const visible = expanded ? values : values.slice(0, MAX_VISIBLE);
  const remaining = values.length - MAX_VISIBLE;

  return (
    <div className="m-[5px] flex flex-wrap items-center gap-[4px] p-[3px]">
      {visible.map((v, i) => (
        <Chip key={i} label={v} size="small" variant="outlined" />
      ))}
      {!expanded && remaining > 0 && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(true);
          }}
          style={{
            color: "#42A5F5",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          +{remaining} more
        </span>
      )}
      {expanded && remaining > 0 && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(false);
          }}
          style={{
            color: "#42A5F5",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Show less
        </span>
      )}
    </div>
  );
}

// Target Type 칩 (Specific Product / Order Amount / All Product)
const TARGET_TYPE_SX: Record<PromotionTargetType, object> = {
  "Specific Product": { backgroundColor: "#EEEEEE", color: "#424242" },
  "Order Amount": { backgroundColor: "#EDE7F6", color: "#5E35B1" },
  "All Product": { backgroundColor: "#E3F2FD", color: "#1565C0" },
};

const renderTargetTypeCell = (params: GridRenderCellParams) => {
  const targetType = getTargetType(params.row.triggerType);
  return (
    <Chip
      label={targetType}
      size="small"
      sx={{ fontWeight: 500, ...TARGET_TYPE_SX[targetType] }}
    />
  );
};

// Reward / Stock 컬럼은 같은 줄 높이로 맞춰 행 단위로 나란히 보이게 한다
const REWARD_LINE_CLASS = "flex h-[26px] items-center gap-[6px]";

// 증정 제품: 모든 제품을 한 줄씩 노출 (Order Amount 는 구간 배지 + 구간 내 재고 최소 제품)
const renderRewardProductCell = (params: GridRenderCellParams) => {
  const rows = getRewardDisplayRows(params.row as PromotionRow);
  if (rows.length === 0) return "-";

  return (
    <div className="flex flex-col py-[5px] text-[13px]">
      {rows.map((item) => (
        <div key={item.key} className={REWARD_LINE_CLASS}>
          {item.rangeLabel && (
            <Chip
              label={item.rangeLabel}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: 11, fontWeight: 600 }}
            />
          )}
          <span className="truncate" title={item.product.productName}>
            {item.product.productName}
          </span>
          <span className="shrink-0 text-[#757575]">
            · {item.product.skuCode}
          </span>
          {item.otherCount > 0 && (
            <span className="shrink-0 text-[12px] text-[#9E9E9E]">
              lowest of {item.otherCount + 1}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

// 재고 (잔여 / 전체): Reward 행과 같은 순서. Order Amount 는 구간별 재고 최소 제품 기준
const STOCK_COLOR: Record<StockLevel, string> = {
  empty: "#C62828",
  low: "#B7791F",
  ok: "inherit",
};

const renderStockCell = (params: GridRenderCellParams) => {
  const rows = getRewardDisplayRows(params.row as PromotionRow);
  if (rows.length === 0) return "-";

  return (
    <div className="flex w-full flex-col items-end py-[5px] text-[13px]">
      {rows.map((item) => {
        const level = getStockLevel(item.product);
        return (
          <div
            key={item.key}
            className={REWARD_LINE_CLASS}
            style={{ color: STOCK_COLOR[level], fontWeight: 600 }}
          >
            {item.product.total === undefined
              ? "-"
              : `${getRemaining(item.product).toLocaleString()} / ${item.product.total.toLocaleString()}`}
          </div>
        );
      })}
    </div>
  );
};

export const COLUMNS_PROMOTION_LIST: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    minWidth: 60,
  },
  {
    field: "brand",
    headerName: "Brand",
    flex: 0.5,
    minWidth: 70,
  },
  {
    field: "corp",
    headerName: "Corp",
    flex: 0.5,
    minWidth: 60,
  },
  {
    field: "title",
    headerName: "Title",
    flex: 1.2,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams) => (
      <Link
        href={`/promotion/promotion-list/edit-v2/${params.row.id}`}
        style={{
          textDecoration: "underline",
          cursor: "pointer",
          color: "inherit",
        }}
      >
        {params.value}
      </Link>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    flex: 0.4,
    minWidth: 85,
    renderCell: renderStatusCell,
  },
  {
    field: "targetType",
    headerName: "Target Type",
    flex: 0.7,
    minWidth: 140,
    sortable: false,
    valueGetter: (_value, row) => getTargetType(row.triggerType),
    renderCell: renderTargetTypeCell,
  },
  {
    field: "rewardProducts",
    headerName: "Reward Product",
    flex: 2.4,
    minWidth: 440,
    sortable: false,
    cellClassName: "!py-[5px]",
    renderCell: renderRewardProductCell,
  },
  {
    field: "stock",
    headerName: "Stock (Remaining / Total)",
    // 검색 시점 기준 재고 — 헤더명 점선 밑줄로 툴팁 안내가 있음을 표시
    renderHeader: () => (
      <Tooltip title="As of the latest search. Re-run Search or Refresh to update.">
        <span className="underline decoration-dotted">
          Stock (Remaining / Total)
        </span>
      </Tooltip>
    ),
    flex: 1,
    minWidth: 210,
    align: "right",
    headerAlign: "right",
    sortable: false,
    cellClassName: "!py-[5px]",
    renderCell: renderStockCell,
  },
  {
    field: "triggerChannels",
    headerName: "Trigger Channels",
    flex: 1.2,
    minWidth: 180,
    cellClassName: "!py-[5px]",
    renderCell: (params: GridRenderCellParams) => (
      <ChannelChipsCell values={params.value as string[]} />
    ),
  },
  {
    field: "startDate",
    headerName: "Start Date",
    flex: 1,
    minWidth: 170,
  },
  {
    field: "endDate",
    headerName: "End Date",
    flex: 1,
    minWidth: 170,
    renderCell: (params: GridRenderCellParams) =>
      params.row.alwaysOn ? (
        <Chip label="Always-on" size="small" variant="outlined" />
      ) : (
        params.value || "-"
      ),
  },
  {
    field: "createdBy",
    headerName: "Created By",
    flex: 0.7,
    minWidth: 100,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    flex: 1,
    minWidth: 170,
  },
  {
    field: "updatedBy",
    headerName: "Updated By",
    flex: 0.7,
    minWidth: 100,
    renderCell: (params: GridRenderCellParams) => params.value || "-",
  },
];
