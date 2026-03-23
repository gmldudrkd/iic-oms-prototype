"use client";

import { Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid-pro";

import PermissionCell from "@/features/user-list/components/PermissionCell";
import { UserListItem } from "@/features/user-list/modules/mockUserList";

export const USER_LIST_COLUMNS: GridColDef<UserListItem>[] = [
  {
    field: "id",
    headerName: "ID",
    width: 60,
  },
  {
    field: "requestedDate",
    headerName: "Requested Date",
    flex: 1,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1.5,
    renderCell: (params) => (
      <span
        style={{
          textDecoration: "underline",
          textUnderlineOffset: "2px",
          cursor: "pointer",
        }}
      >
        {params.value}
      </span>
    ),
  },
  {
    field: "approveStatus",
    headerName: "Approval Status",
    width: 140,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={params.value === "AWAITING" ? "warning" : "success"}
        size="small"
      />
    ),
  },
  {
    field: "permissions",
    headerName: "Permissions",
    flex: 2,
    sortable: false,
    filterable: false,
    renderCell: (params) => <PermissionCell permissions={params.value} />,
  },
];
