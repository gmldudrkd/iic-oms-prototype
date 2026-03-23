import { Button } from "@mui/material";
import { GridRowModel } from "@mui/x-data-grid-pro";
import { useState } from "react";

import ModalItemBundler from "@/features/product-list/components/ModalItemBundler";
import usePostCreateBundle from "@/features/product-list/hooks/usePostCreateBundle";

import {
  BundleResponseDTO,
  CreateBundleRequestDTO,
} from "@/shared/generated/pim/types/Bundle";
import { OmsProductSearchRequestDTO } from "@/shared/generated/pim/types/Product";

interface Props {
  selectedRows: GridRowModel[];
  params: OmsProductSearchRequestDTO;
  refetch: (params: OmsProductSearchRequestDTO) => void;
}
export default function CreateBundle({ selectedRows, params, refetch }: Props) {
  const [open, setOpen] = useState(false);

  const onSuccess = (data: BundleResponseDTO) => {
    window.open(`/product/product-list/detail/${data.bundleId}`, "_blank");
    setOpen(false);
    refetch(params);
  };

  // 📍 번들 생성 API
  const { mutate, isPending } = usePostCreateBundle({ onSuccess });

  const handleCreate = (selectedProducts: GridRowModel[]) => {
    const requestData: CreateBundleRequestDTO = {
      bundleProducts: selectedProducts.map((product) => ({
        sapCode: product.sapCode,
        quantity: product.quantity,
      })),
      name: "", // 무시되는 값
      description: "", // 무시되는 값
    };

    mutate(requestData);
  };

  const handleButtonDisabled = (selectedProducts: GridRowModel[]) => {
    // 선택된 제품이 1개이고 수량이 1개 이하이면 번들 생성 불가

    return (
      selectedProducts.length === 0 ||
      (selectedProducts.length === 1 && selectedProducts[0].quantity <= 1) ||
      selectedProducts.length > 10
    );
  };

  return (
    <>
      <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
        Create Bundle
      </Button>
      <ModalItemBundler
        openModal={open}
        setOpenModal={setOpen}
        selectedRows={selectedRows}
        handleButtonDisabled={handleButtonDisabled}
        handleCreate={handleCreate}
        isPendingCreate={isPending}
      />
    </>
  );
}
