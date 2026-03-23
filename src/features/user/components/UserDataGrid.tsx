"use client";

import { ThemeProvider, Button, Chip } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { useState } from "react";

import RequestPermissionModal from "@/features/user/components/RequestPermissionModal";
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

const isPrototype = process.env.NEXT_PUBLIC_PROTOTYPE_MODE === "true";

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

const MOCK_EMAIL = "monster9999@gentlemonster.com";
const MOCK_REASON = "서주아(이)란 회원이라 일지사에서 제한 권한을 요청합니다.";

const MOCK_PERMISSIONS: UserRequestRow[] = [
  {
    id: "GM-KR-0",
    requestedDate: "2025.12.02 00:00:00",
    brand: { name: "GM", description: "Gentle Monster" } as EnumResponse,
    corp: "KR" as UserCreateConfirmRequestCorporationEnum,
    role: "Manager",
    requestedReason: MOCK_REASON,
    status: "AWAITING" as UserResponsePermissionRequestStatusEnum,
    email: MOCK_EMAIL,
  },
  {
    id: "TAM-KR-0",
    requestedDate: "2025.12.02 00:00:00",
    brand: { name: "TAM", description: "Tamburins" } as EnumResponse,
    corp: "KR" as UserCreateConfirmRequestCorporationEnum,
    role: "Manager",
    requestedReason: MOCK_REASON,
    status: "AWAITING" as UserResponsePermissionRequestStatusEnum,
    email: MOCK_EMAIL,
  },
  {
    id: "NUO-KR-0",
    requestedDate: "2025.12.02 00:00:00",
    brand: { name: "NUO", description: "Nudake" } as EnumResponse,
    corp: "KR" as UserCreateConfirmRequestCorporationEnum,
    role: "Manager",
    requestedReason: MOCK_REASON,
    status: "APPROVAL" as UserResponsePermissionRequestStatusEnum,
    email: MOCK_EMAIL,
  },
  {
    id: "ATS-KR-0",
    requestedDate: "2025.12.02 00:00:00",
    brand: { name: "ATS", description: "Atiissu" } as EnumResponse,
    corp: "KR" as UserCreateConfirmRequestCorporationEnum,
    role: "Manager",
    requestedReason: MOCK_REASON,
    status: "APPROVAL" as UserResponsePermissionRequestStatusEnum,
    email: MOCK_EMAIL,
  },
  {
    id: "NUF-KR-0",
    requestedDate: "2025.12.02 00:00:00",
    brand: { name: "NUF", description: "Nuflaat" } as EnumResponse,
    corp: "KR" as UserCreateConfirmRequestCorporationEnum,
    role: "Manager",
    requestedReason: MOCK_REASON,
    status: "APPROVAL" as UserResponsePermissionRequestStatusEnum,
    email: MOCK_EMAIL,
  },
  {
    id: "GM-US-0",
    requestedDate: "2025.12.02 00:00:00",
    brand: { name: "GM", description: "Gentle Monster" } as EnumResponse,
    corp: "US" as UserCreateConfirmRequestCorporationEnum,
    role: "Manager",
    requestedReason: MOCK_REASON,
    status: "APPROVAL" as UserResponsePermissionRequestStatusEnum,
    email: MOCK_EMAIL,
  },
  {
    id: "GM-JP-0",
    requestedDate: "2025.12.02 00:00:00",
    brand: { name: "GM", description: "Gentle Monster" } as EnumResponse,
    corp: "JP" as UserCreateConfirmRequestCorporationEnum,
    role: "Manager",
    requestedReason: MOCK_REASON,
    status: "APPROVAL" as UserResponsePermissionRequestStatusEnum,
    email: MOCK_EMAIL,
  },
  {
    id: "GM-AU-0",
    requestedDate: "2025.12.02 00:00:00",
    brand: { name: "GM", description: "Gentle Monster" } as EnumResponse,
    corp: "AU" as UserCreateConfirmRequestCorporationEnum,
    role: "Manager",
    requestedReason: MOCK_REASON,
    status: "APPROVAL" as UserResponsePermissionRequestStatusEnum,
    email: MOCK_EMAIL,
  },
  {
    id: "GM-TW-0",
    requestedDate: "2025.12.02 00:00:00",
    brand: { name: "GM", description: "Gentle Monster" } as EnumResponse,
    corp: "TW" as UserCreateConfirmRequestCorporationEnum,
    role: "Manager",
    requestedReason: MOCK_REASON,
    status: "APPROVAL" as UserResponsePermissionRequestStatusEnum,
    email: MOCK_EMAIL,
  },
  {
    id: "GM-SG-0",
    requestedDate: "2025.12.02 00:00:00",
    brand: { name: "GM", description: "Gentle Monster" } as EnumResponse,
    corp: "SG" as UserCreateConfirmRequestCorporationEnum,
    role: "Manager",
    requestedReason: MOCK_REASON,
    status: "AWAITING" as UserResponsePermissionRequestStatusEnum,
    email: MOCK_EMAIL,
  },
  {
    id: "TAM-JP-0",
    requestedDate: "2025.12.02 00:00:00",
    brand: { name: "TAM", description: "Tamburins" } as EnumResponse,
    corp: "JP" as UserCreateConfirmRequestCorporationEnum,
    role: "Manager",
    requestedReason: MOCK_REASON,
    status: "AWAITING" as UserResponsePermissionRequestStatusEnum,
    email: MOCK_EMAIL,
  },
];

export default function UserDataGrid({
  data,
}: {
  data: UserResponse | null | undefined;
}) {
  const { AWAITING, REJECTED } = UserResponsePermissionRequestStatusEnum;
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedRow, setSelectedRow] = useState<UserRequestRow | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const { mutate } = usePatchSignupConfirm();
  const { timezone } = useTimezoneStore();

  const rows = isPrototype
    ? MOCK_PERMISSIONS
    : (data?.permissions.flatMap((permission) =>
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
      ) ?? []);

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
      flex: 0.7,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === AWAITING
              ? "warning"
              : params.value === "APPROVAL"
                ? "success"
                : "primary"
          }
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
      renderCell: (params) => {
        if (params.row.status === AWAITING) {
          return (
            <div className="flex gap-2">
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => handleActionClick("approve", params.row)}
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                color="warning"
                size="small"
                onClick={() => handleActionClick("reject", params.row)}
              >
                Reject
              </Button>
            </div>
          );
        }
        return (
          <Button
            variant="text"
            color="primary"
            size="small"
            onClick={() => handleActionClick("reject", params.row)}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  return (
    <ThemeProvider theme={MUIDataGridTheme}>
      <DataGridPro
        rows={rows}
        columns={COLUMNS}
        getRowId={(row) => row.id}
        getRowHeight={() => "auto"}
        style={{ border: "none" }}
        hideFooter
        sx={{
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            py: "8px",
          },
        }}
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

      {/* Request Permission Modal */}
      <RequestPermissionModal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        onSubmit={(selected, reason) => {
          console.log("Request Permission:", selected, reason);
          setRequestModalOpen(false);
        }}
      />
    </ThemeProvider>
  );
}
