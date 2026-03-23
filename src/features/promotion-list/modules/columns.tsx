import { Chip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid-pro";
import Link from "next/link";

const renderStatusCell = (params: GridRenderCellParams) => {
  const statusColorMap: Record<
    string,
    "success" | "warning" | "error" | "default"
  > = {
    Active: "success",
    Upcoming: "warning",
    Expired: "default",
    Draft: "default",
  };

  const status = params.value as string;

  const customSxMap: Record<string, object> = {
    Expired: { backgroundColor: "#9E9E9E", color: "#FFFFFF" },
    Draft: { backgroundColor: "#42A5F5", color: "#FFFFFF" },
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

const renderMultiLineCell = (params: GridRenderCellParams) => {
  const values = params.value as string[];
  if (!values || values.length === 0) return "-";

  return (
    <div className="flex flex-col">
      {values.map((v, i) => (
        <span key={i} className="text-[13px]">
          {v}
        </span>
      ))}
    </div>
  );
};

const renderTriggerCell = (params: GridRenderCellParams) => {
  const value = params.value as string;
  if (!value) return "-";

  return (
    <div className="flex flex-col whitespace-pre-line text-[13px]">{value}</div>
  );
};

const renderRewardCell = (params: GridRenderCellParams) => {
  const value = params.value as string;
  if (!value) return "-";

  return (
    <div className="flex flex-col whitespace-pre-line text-[13px]">{value}</div>
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
        href={`/promotion/promotion-list/detail/${params.row.id}`}
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
    flex: 0.7,
    minWidth: 100,
    renderCell: renderStatusCell,
  },
  {
    field: "triggerChannels",
    headerName: "Trigger Channels",
    flex: 1.2,
    minWidth: 180,
    renderCell: renderMultiLineCell,
  },
  {
    field: "trigger",
    headerName: "Trigger",
    flex: 1.5,
    minWidth: 250,
    renderCell: renderTriggerCell,
  },
  {
    field: "reward",
    headerName: "Reward",
    flex: 1.5,
    minWidth: 250,
    renderCell: renderRewardCell,
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
];
