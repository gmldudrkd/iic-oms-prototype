import { FormControl } from "@mui/material";
import { useMemo, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import InputRenderer from "@/features/channel-detail/components/InputRenderer";
import SelectRenderer from "@/features/channel-detail/components/SelectRenderer";
import SwitchRenderer from "@/features/channel-detail/components/SwitchRenderer";
import { useGetSAPChannelList } from "@/features/channel-detail/hooks/useGetSAPChannelList";
import { transformSAPChannelData } from "@/features/channel-list/models/transform";
import useGetUserPermission from "@/features/header/hooks/useGetUserPermission";

import {
  DetailGrid,
  DetailGridSingle,
} from "@/shared/components/table/tableStyle";
import Title from "@/shared/components/text/Title";
import { OnlineStoreResponse } from "@/shared/generated/sap/types/MasterStore";
import { useUserPermissionStore } from "@/shared/stores/useUserPermissionStore";

export default function ChannelAddDetailForm({ isEdit }: { isEdit: boolean }) {
  const { data: userPermissionData } = useGetUserPermission();
  const userPermission = userPermissionData?.brands;
  const { selectedPermission } = useUserPermissionStore();
  const { data: dataSAPChannelList } = useGetSAPChannelList(userPermission);
  const transformedSAPChannelList = useMemo(() => {
    return transformSAPChannelData(
      dataSAPChannelList as OnlineStoreResponse[],
      selectedPermission,
    );
  }, [dataSAPChannelList, selectedPermission]);

  const { control, watch, setValue, reset } = useFormContext();
  const sapChannelCode = watch("sapChannelCode");
  const [channelList, setChannelList] = useState<
    { code: string; name: string; brand: string }[]
  >([]);

  useEffect(() => {
    if (isEdit) return;
    reset();
    setChannelList(transformedSAPChannelList);
  }, [dataSAPChannelList, transformedSAPChannelList, reset, isEdit]);

  useEffect(() => {
    if (!sapChannelCode) return;

    const selectedChannel = channelList.find(
      (item) => item.code === sapChannelCode,
    );

    if (selectedChannel) {
      setValue("sapChannelName", selectedChannel.name);
      setValue("brand", selectedChannel.brand);
    }
  }, [sapChannelCode, channelList, setValue]);

  const channelCodeList = useMemo(() => {
    return channelList.map((item: { code: string; name: string }) => ({
      label: `${item.code} (${item.name})`,
      value: item.code,
    }));
  }, [channelList]);

  const channelTypeList = useMemo(() => {
    return [
      { label: "Own", value: "OWN" },
      { label: "External", value: "EXTERNAL" },
    ];
  }, []);

  return (
    <div className="border-border-primary mx-[24px] rounded-[5px] border border-solid bg-white">
      <Title text="Channel Information" variant="bordered" />
      <DetailGrid>
        <div>
          <h3>Channel Name</h3>
          <InputRenderer
            control={control}
            name="channelName"
            placeholder="Auto-generated"
            readOnly
          />
        </div>
        <div>
          <h3>
            SAP Channel Code <span className="text-error">*</span>
          </h3>
          <FormControl size="small">
            <SelectRenderer
              control={control}
              name="sapChannelCode"
              selectList={channelCodeList}
              selectProps={{ disabled: isEdit }}
            />
          </FormControl>
        </div>
      </DetailGrid>
      <DetailGrid>
        <div>
          <h3>
            Channel Type <span className="text-error">*</span>
          </h3>
          <FormControl size="small">
            <SelectRenderer
              control={control}
              name="category"
              selectList={channelTypeList}
            />
          </FormControl>
        </div>
        <div>
          <h3>
            SAP Channel Name <span className="text-error">*</span>
          </h3>
          <InputRenderer
            control={control}
            name="sapChannelName"
            placeholder="Select SAP Channel Code"
            readOnly
          />
        </div>
      </DetailGrid>
      <DetailGridSingle>
        <div>
          <h3>
            Active <span className="text-error">*</span>
          </h3>
          <FormControl>
            <SwitchRenderer control={control} name="isActive" />
          </FormControl>
        </div>
      </DetailGridSingle>
    </div>
  );
}
