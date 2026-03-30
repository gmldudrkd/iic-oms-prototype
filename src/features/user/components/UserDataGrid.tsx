"use client";

import { ThemeProvider, Button, Chip } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { useState } from "react";

import { usePatchSignupConfirm } from "@/features/user/hooks/usePatchSignupConfirm";
import { MODAL_CONFIG } from "@/features/user/modules/constants";

import ModalBump from "@/shared/components/modal/ModalBump";
import {
  UserCreateConfirmRequestBrandEnum,
  UserCreateConfirmRequestConfirmEnum,
  UserCreateConfirmRequestCorporationEnum,
} from "@/shared/generated/auth/types/Auth";
import {
  UserResponse,
  UserResponsePermissionRequestStatusEnum,
} from "@/shared/generated/auth/types/User";
import { EnumResponse } from "@/shared/generated/oms/types/common";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { MUIDataGridTheme } from "@/shared/styles/theme";
import { getLocalTime } from "@/shared/utils/formatDate";

type ModalType = "approve" | "reject" | null;

interface UserRequestRow {
  id: string;
  requestedDate: string;
  brand: EnumResponse;
  corp: UserCreateConfirmRequestCorporationEnum;
  role: string;
  requestedReason: string;
  status: UserResponsePermissionRequestStatusEnum;
  email: string;
}

export default function UserDataGrid({
  data,
}: {
  data: UserResponse | null | undefined;
}) {
  const { AWAITING, REJECTED } = UserResponsePermissionRequestStatusEnum;
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedRow, setSelectedRow] = useState<UserRequestRow | null>(null);
  const { mutate } = usePatchSignupConfirm();
  const { timezone } = useTimezoneStore();

  const rows =
    data?.permissions.flatMap((permission) =>
      permission.requests
        .map((req, j) => ({
          id: `${permission.brand?.name}-${req.corporation}-${j}`,
          requestedDate: getLocalTime(req.requestedAt, timezone),
          brand: permission.brand,
          corp: req.corporation as unknown as UserCreateConfirmRequestCorporationEnum,
          role: req.role.charAt(0) + req.role.slice(1).toLowerCase(),
          requestedReason: req.reason,
          status: req.status,
          email: data?.email ?? "",
        }))
        .filter((req) => req.status !== REJECTED),
    ) ?? [];

  const handleActionClick = (type: ModalType, rowData: UserRequestRow) => {
    setSelectedRow(rowData);
    setModalType(type);
  };

  const handleModalClose = () => {
    setModalType(null);
    setSelectedRow(null);
  };

  const handleConfirm = () => {
    if (!selectedRow) return;

    const requestData = {
      brand: selectedRow.brand.name as UserCreateConfirmRequestBrandEnum,
      confirm:
        modalType === "approve"
          ? UserCreateConfirmRequestConfirmEnum.APPROVE
          : UserCreateConfirmRequestConfirmEnum.REJECT,
      corporation: selectedRow.corp,
      email: selectedRow.email,
      reason: selectedRow.requestedReason,
    };

    mutate(requestData);
    handleModalClose();
  };

  const COLUMNS: GridColDef<UserRequestRow>[] = [
    {
      field: "requestedDate",
      headerName: "Requested Date",
      type: "string",
      flex: 1,
    },
    {
      field: "brand",
      headerName: "Brand",
      flex: 0.5,
      renderCell: (params) => (
        <>{params.value.description ?? params.value.name} </>
      ),
    },
    { field: "corp", headerName: "Corp", flex: 0.5 },
    { field: "role", headerName: "Role", flex: 0.5 },
    { field: "requestedReason", headerName: "Requested Reason", flex: 2 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === AWAITING ? "warning" : "primary"}
          size="small"
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: (params) =>
        params.row.status === AWAITING && (
          <div className="flex gap-2">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleActionClick("approve", params.row)}
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              color="warning"
              onClick={() => handleActionClick("reject", params.row)}
            >
              Reject
            </Button>
          </div>
        ),
    },
  ];

  return (
    <ThemeProvider theme={MUIDataGridTheme}>
      <DataGridPro
        rows={rows}
        columns={COLUMNS}
        getRowId={(row) => row.id}
        style={{ border: "none" }}
        hideFooter
      />

      {modalType && (
        <ModalBump
          open={!!modalType}
          setOpen={(open) => !open && handleModalClose()}
          text={MODAL_CONFIG[modalType].text}
          dialogCloseLabel="Cancel"
          dialogConfirmLabel={MODAL_CONFIG[modalType].confirmLabel}
          handleClose={handleModalClose}
          handlePost={handleConfirm}
          postButtonClassNames={MODAL_CONFIG[modalType]?.postButtonClassNames}
          closeButtonClassNames="!text-default"
        />
      )}
    </ThemeProvider>
  );
}
