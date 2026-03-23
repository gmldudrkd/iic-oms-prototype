import { Button } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { DataGridPro, GridRowParams } from "@mui/x-data-grid-pro";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import { useGetChannelListWithFetch } from "@/features/channel-list/hooks/useGetChannelListWithFetch";
import { transformChannelData } from "@/features/channel-list/models/transform";
import { COLUMNS } from "@/features/channel-list/modules/columns";

import TotalResult from "@/shared/components/text/TotalResult";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { useUserPermissionStore } from "@/shared/stores/useUserPermissionStore";
import { MUIDataGridTheme } from "@/shared/styles/theme";

export default function ChannelList() {
  const router = useRouter();
  const { timezone } = useTimezoneStore();
  const { selectedPermission } = useUserPermissionStore();

  const { data } = useGetChannelListWithFetch();

  const rows = useMemo(() => {
    return transformChannelData(data ?? [], timezone, selectedPermission);
  }, [data, timezone, selectedPermission]);

  const handleRowClick = useCallback(
    (params: GridRowParams) => {
      router.push(`/channel/channel-list/detail/${params.row.id}`);
    },
    [router],
  );

  const handleAddNewChannel = useCallback(() => {
    router.push("/channel/channel-list/add");
  }, [router]);

  return (
    <ThemeProvider theme={MUIDataGridTheme}>
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col border-b border-outlined bg-white px-[24px] pb-[24px]">
          <Button
            variant="contained"
            color="primary"
            className="w-fit self-end"
            onClick={handleAddNewChannel}
          >
            Add New Channel
          </Button>
        </div>

        <div className="border-[1px] border-solid border-[#E0E0E0] bg-white p-[24px]">
          <TotalResult totalResult={rows.length} />
          <DataGridPro
            columns={COLUMNS}
            rows={rows}
            disableColumnMenu
            onRowClick={handleRowClick}
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
