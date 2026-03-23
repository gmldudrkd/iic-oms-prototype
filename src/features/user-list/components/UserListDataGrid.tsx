"use client";

import { ThemeProvider } from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { useRouter } from "next/navigation";

import { USER_LIST_COLUMNS } from "@/features/user-list/modules/columns";
import { UserListItem } from "@/features/user-list/modules/mockUserList";

import TotalResult from "@/shared/components/text/TotalResult";
import { MUIDataGridTheme } from "@/shared/styles/theme";

interface UserListDataGridProps {
  data: UserListItem[];
}

export default function UserListDataGrid({ data }: UserListDataGridProps) {
  const router = useRouter();

  const handleRowClick = (email: string) => {
    router.push(`/user/${encodeURIComponent(email)}`);
  };

  return (
    <div className="mx-[24px] mt-[24px] flex flex-col rounded-[5px] border border-outlined bg-white p-[24px]">
      <TotalResult totalResult={data.length} />

      <ThemeProvider theme={MUIDataGridTheme}>
        <DataGridPro
          rows={data}
          columns={USER_LIST_COLUMNS}
          getRowId={(row) => `${row.id}-${row.email}`}
          getRowHeight={() => "auto"}
          onCellClick={(params) => {
            if (params.field === "email") {
              handleRowClick(params.row.email);
            }
          }}
          disableColumnMenu
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnSorting
          hideFooter
          style={{ border: "none" }}
          sx={{
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              py: "8px",
            },
          }}
        />
      </ThemeProvider>
    </div>
  );
}
