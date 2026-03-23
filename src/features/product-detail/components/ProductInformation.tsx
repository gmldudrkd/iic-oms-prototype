import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { Cell } from "@/shared/components/table/tableStyle";
import { DetailGridSingle } from "@/shared/components/table/tableStyle";
import Title from "@/shared/components/text/Title";

export default function ProductInformation() {
  return (
    <div className="mx-[24px] rounded-[5px] border border-outlined bg-white">
      <Title text="Product Information" variant="bordered" />
      <DualLanguageField
        label="Product Name"
        koField="nameKO"
        enField="nameEN"
        required
      />
      <DualLanguageField
        label="Product Description"
        koField="descriptionKO"
        enField="descriptionEN"
        required
        multiline
        rows={5}
      />
      <DualLanguageField
        label="Collection Name"
        koField="collectionNameKO"
        enField="collectionNameEN"
      />
      <DualLanguageField
        label="Internal Search Keyword"
        koField="internalSearchKeywordKO"
        enField="internalSearchKeywordEN"
      />
    </div>
  );
}

interface Props {
  label: string;
  koField: string;
  enField: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

const DualLanguageField = ({
  label,
  koField,
  enField,
  required,
  multiline,
  rows,
}: Props) => {
  const { register } = useFormContext();

  return (
    <DetailGridSingle>
      <div>
        <h3>
          {label} {required && <span className="ml-[4px] text-error">*</span>}
        </h3>
        <Cell className="gap-[32px]">
          <div className="flex flex-1 gap-[16px]">
            <h4 className="mt-[8px] font-bold text-primary">KO</h4>
            <TextField
              {...register(koField, {
                required: required ? `${label} KO` : false,
                validate: (value) => required && value.trim() !== "",
              })}
              placeholder="Enter here"
              size="small"
              fullWidth
              multiline={multiline}
              rows={rows}
            />
          </div>
          <div className="flex flex-1 gap-[16px]">
            <h4 className="mt-[8px] font-bold text-primary">EN</h4>
            <TextField
              {...register(enField, {
                required: required ? `${label} EN` : false,
                validate: (value) => required && value.trim() !== "",
              })}
              placeholder="Enter here"
              size="small"
              fullWidth
              multiline={multiline}
              rows={rows}
            />
          </div>
        </Cell>
      </div>
    </DetailGridSingle>
  );
};
