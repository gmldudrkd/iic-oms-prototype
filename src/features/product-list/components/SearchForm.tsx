import { Dispatch, SetStateAction } from "react";
import { FieldValues, useFormContext } from "react-hook-form";

import { transformProductSearchRequest } from "@/features/product-list/modules/transform";

import FormActions from "@/shared/components/form-elements/FormActions";
import {
  SearchFormContainer,
  SearchFormInputRow,
  SearchFormSelectRow,
} from "@/shared/components/SearchFormFields";
import { OmsProductSearchRequestDTO } from "@/shared/generated/pim/types/Product";
import { cleanEmptyParams } from "@/shared/utils/cleanParams";

interface SearchFormProps {
  params: OmsProductSearchRequestDTO;
  setParams: Dispatch<SetStateAction<OmsProductSearchRequestDTO>>;
  mutate: (params: OmsProductSearchRequestDTO) => void;
}

export default function SearchForm({
  params,
  setParams,
  mutate,
}: SearchFormProps) {
  const { reset, handleSubmit, control } = useFormContext();

  const productInfoStatusList = [
    { label: "Complete", value: "COMPLETE" },
    { label: "Incomplete", value: "INCOMPLETE" },
  ];

  const productTypeList = [
    { label: "Bundle", value: "BUNDLE" },
    { label: "Single", value: "SINGLE" },
  ];

  const onSubmit = (data: FieldValues) => {
    const requestData = transformProductSearchRequest(data, params);

    const cleanedRequestData = cleanEmptyParams(requestData);
    if (JSON.stringify(cleanedRequestData) === JSON.stringify(params)) {
      mutate(params);
    } else {
      setParams(cleanedRequestData as OmsProductSearchRequestDTO);
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
                <SearchFormInputRow
                  label="SAP Name"
                  control={control}
                  name="sapName"
                />
                <SearchFormSelectRow
                  label={`Product Info\nStatus`}
                  control={control}
                  name="productInfoStatus"
                  selectList={productInfoStatusList}
                  selectProps={{ multiple: true }}
                />
                <SearchFormSelectRow
                  label={`Product Type`}
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
