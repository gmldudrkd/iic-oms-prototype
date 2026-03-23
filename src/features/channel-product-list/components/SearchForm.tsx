import { Dispatch } from "react";
import { SetStateAction } from "react";
import { FieldValues, useFormContext } from "react-hook-form";

import { transformChannelProductSearchRequest } from "@/features/channel-product-list/models/transform";

import FormActions from "@/shared/components/form-elements/FormActions";
import {
  SearchFormContainer,
  SearchFormInputRow,
  SearchFormSelectRow,
} from "@/shared/components/SearchFormFields";
import { OmsChannelProductSearchRequestDTO } from "@/shared/generated/pim/types/Product";
import { useGetActiveChannelList } from "@/shared/hooks/useGetActiveChannelList";
import { cleanEmptyParams } from "@/shared/utils/cleanParams";

interface SearchFormProps {
  params: OmsChannelProductSearchRequestDTO;
  setParams: Dispatch<SetStateAction<OmsChannelProductSearchRequestDTO>>;
  mutate: (params: OmsChannelProductSearchRequestDTO) => void;
}

export default function SearchForm({
  params,
  setParams,
  mutate,
}: SearchFormProps) {
  const channelAvailabilityList = [
    { label: "Yes", value: "YES" },
    { label: "No", value: "NO" },
  ];
  const productInfoStatusList = [
    { label: "Complete", value: "COMPLETE" },
    { label: "Incomplete", value: "INCOMPLETE" },
  ];
  const productTypeList = [
    { label: "Bundle", value: "BUNDLE" },
    { label: "Single", value: "SINGLE" },
  ];

  // 📍 활성 채널 리스트 조회 API
  const { data: channelActiveList } = useGetActiveChannelList();

  const { reset, handleSubmit, control } = useFormContext();

  const onSubmit = (data: FieldValues) => {
    const requestData = transformChannelProductSearchRequest(
      data,
      params,
      channelActiveList?.length ?? 0,
    );
    const cleanedRequestData = cleanEmptyParams(requestData);

    if (JSON.stringify(cleanedRequestData) === JSON.stringify(params)) {
      mutate(params);
    } else {
      setParams(cleanedRequestData as OmsChannelProductSearchRequestDTO);
    }
  };

  return (
    <form className="rounded-[8px] border border-solid border-outlined">
      <SearchFormContainer
        columns={[
          {
            content: (
              <>
                <SearchFormInputRow
                  label="SKU Code"
                  control={control}
                  name="skuCode"
                  placeholder={`123456789\n123456789\n123456789`}
                  isMultiLine={true}
                />
                <SearchFormInputRow
                  label="SAP Code"
                  control={control}
                  name="sapCode"
                  placeholder={`123456789\n123456789\n123456789`}
                  isMultiLine={true}
                />
                <SearchFormInputRow
                  label="SAP Name"
                  control={control}
                  name="sapName"
                />
              </>
            ),
          },
          {
            content: (
              <>
                <SearchFormInputRow
                  label="Model Code"
                  control={control}
                  name="modelCode"
                  placeholder={`123456789\n123456789\n123456789`}
                  isMultiLine={true}
                />
                <SearchFormInputRow
                  label="UPC Code"
                  control={control}
                  name="upcCode"
                  placeholder={`123456789\n123456789\n123456789`}
                  isMultiLine={true}
                />
              </>
            ),
          },
          {
            content: (
              <>
                <SearchFormSelectRow
                  label="Channel"
                  control={control}
                  name="channel"
                  selectList={channelActiveList?.map((item) => ({
                    label: item.channelName,
                    value: item.channelName,
                  }))}
                  selectProps={{ multiple: true }}
                />
                <SearchFormSelectRow
                  label="Channel Availability"
                  control={control}
                  name="channelAvailability"
                  selectList={channelAvailabilityList}
                  selectProps={{ multiple: true }}
                />
                <SearchFormSelectRow
                  label="Product Info Status"
                  control={control}
                  name="productInfoStatus"
                  selectList={productInfoStatusList}
                  selectProps={{ multiple: true }}
                />
                <SearchFormSelectRow
                  label="Product Type"
                  control={control}
                  name="productType"
                  selectList={productTypeList}
                  selectProps={{ multiple: true }}
                />
              </>
            ),
          },
        ]}
      />

      <div className="flex justify-end p-[24px]">
        <FormActions
          onReset={() => reset()}
          onSubmitClick={handleSubmit(onSubmit)}
          hasStartIcon={true}
        />
      </div>
    </form>
  );
}
