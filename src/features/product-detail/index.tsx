import { Button } from "@mui/material";
import { GridRowModel } from "@mui/x-data-grid";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import ImagesMasterAtiissu from "@/features/product-detail/components/ImagesMasterAtiissu";
import ImagesMasterNuflaat from "@/features/product-detail/components/ImagesMasterNuflaat";
import PaidPackagingOptions from "@/features/product-detail/components/PaidPackagingOptions";
import PriceMaster from "@/features/product-detail/components/PriceMaster";
import ProductInformation from "@/features/product-detail/components/ProductInformation";
import ProductMaster from "@/features/product-detail/components/ProductMaster";
import Sales from "@/features/product-detail/components/Sales";
import useGetProductDetail from "@/features/product-detail/hooks/useGetProductDetail";
import usePatchUpdateProduct from "@/features/product-detail/hooks/usePatchUpdateProduct";
import usePostUploadImages from "@/features/product-detail/hooks/usePostUploadImages";
import { transformProductDetail } from "@/features/product-detail/models/transforms";
import { transformRequestData } from "@/features/product-detail/models/transforms";
import {
  Channel,
  UploadedImage,
} from "@/features/product-detail/modules/types";

import AlertDialog from "@/shared/components/dialog/AlertDialog";
import { BRAND_ID_LIST } from "@/shared/constants";
import { S3UploadResponseDTO } from "@/shared/generated/pim/types/Upload";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { ApiError } from "@/shared/types";

export default function ProductDetail() {
  const { openSnackbar } = useSnackbarStore();
  const params = useParams();
  const { sku } = params as { sku: string };
  const { timezone } = useTimezoneStore();
  const [openErrorDialog, setOpenErrorDialog] = useState<string | null>(null);

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [rowsPaidPackagingOptions, setRowsPaidPackagingOptions] = useState<
    GridRowModel[]
  >([]);
  const [rowsSales, setRowsSales] = useState<GridRowModel[]>([]);

  // Product Information Form
  const methodsProductInfo = useForm();
  // Sales Availability by Channel Form
  const methodsSales = useForm<{ channel: Channel[] }>({
    defaultValues: { channel: [] },
  });

  const mergeUploadedImageData = (data: S3UploadResponseDTO[]) => {
    return uploadedImages.map((image, index) => {
      const matched = data.find(
        (item) => image.frontInfo.file?.name === item.originalFileName,
      );
      return {
        ...image,
        serverInfo: {
          ...(matched ? matched : image.serverInfo),
          displayOrder: index + 1,
        } as UploadedImage["serverInfo"],
      };
    });
  };

  // 📍 상품 상세 조회 API 호출
  const { data, isLoading } = useGetProductDetail(sku as string);
  const brandId = data?.brandId;
  const isAtiissu = brandId === BRAND_ID_LIST.ATIISSU;

  // 📍 이미지 업로드 API 호출
  const { mutate: mutateUploadImages, isPending: isUploadImagePending } =
    usePostUploadImages({
      onSuccess: (data) => {
        const newImages = mergeUploadedImageData(data);
        const requestData = transformRequestData({
          images: newImages,
          methodsProductInfo,
          methodsSales,
          paidPackagingOptions: rowsPaidPackagingOptions,
        });
        mutateUpdateProduct({ sku, requestData });
      },
      onError: (error: ApiError) => {
        setOpenErrorDialog(error.errorMessage ?? "Failed to upload images");
      },
    });

  // 📍 상품 수정 API 호출
  const { mutate: mutateUpdateProduct, isPending } = usePatchUpdateProduct({
    onSuccess: (data) => {
      const transformedData = transformProductDetail(data, timezone);

      // 이미지 변환 시간 고려하여 10초 뒤에 이미지 업데이트
      setTimeout(() => {
        setUploadedImages(transformedData.dataImagesMaster as UploadedImage[]);
      }, 10000);
      resetDetail(transformedData, false);
      openSnackbar({
        alertTitle: "Update Successful",
        message: "Your changes have been successfully applied.",
        severity: "success",
      });
    },
    onError: (error: ApiError) => {
      setOpenErrorDialog(error.errorMessage ?? "Failed to update product");
    },
  });

  const onSubmit = async () => {
    const requestData = transformRequestData({
      images: uploadedImages,
      methodsProductInfo,
      methodsSales,
      paidPackagingOptions: rowsPaidPackagingOptions,
    });

    const hasNewImage = uploadedImages.some((image) => image.frontInfo.isNew);

    if (hasNewImage) {
      // 새로운 이미지 업로드 했을 경우
      const formData = new FormData();
      uploadedImages.forEach((image) => {
        if (image.frontInfo.isNew && image.frontInfo.file) {
          formData.append("files", image.frontInfo.file as File);
        }
      });
      mutateUploadImages(formData);
    } else {
      // 새로운 이미지 업로드 없을 경우
      mutateUpdateProduct({ sku, requestData });
    }
  };

  const handleSave = async () => {
    // 폼 유효성 검사 및 빈 값 체크
    const emptyPriceMaster = data?.dataPriceMaster?.some(
      (item: { unitPrice: number | null }) =>
        item.unitPrice === null || item.unitPrice === undefined,
    );
    const emptyPaidPackagingOptions = rowsPaidPackagingOptions
      .map((item) => item.unitPrice)
      .some((item) => item === null || item === undefined);

    if (emptyPriceMaster || emptyPaidPackagingOptions) {
      openSnackbar({
        message: "Price information is required.",
        severity: "error",
      });
      return;
    }

    const isValid = await methodsProductInfo.trigger();

    if (!isValid) {
      const fields = Object.keys(methodsProductInfo.getValues());
      const errorFields = fields
        .map((field) => methodsProductInfo.getFieldState(field).error?.message)
        .filter((msg) => !!msg);
      setOpenErrorDialog(`Please fill in ${errorFields.join(", ")}`);
      return;
    }

    if (uploadedImages.length === 0) {
      setOpenErrorDialog("Please upload at least one image.");
      return;
    }

    // 폼 제출
    await methodsProductInfo.handleSubmit(onSubmit)();
  };

  const SaveButton = ({ className }: { className: string }) => {
    return (
      <Button
        variant="contained"
        color="primary"
        className={className}
        onClick={handleSave}
        disabled={isPending || isUploadImagePending}
      >
        {isPending || isUploadImagePending ? "Saving..." : "Save"}
      </Button>
    );
  };

  const resetDetail = useCallback(
    (
      data: ReturnType<typeof transformProductDetail>,
      isImageUpdate: boolean = true,
    ) => {
      const methodsSalesReset = data.dataSales?.map((row) => ({
        channelName: row.channelName,
        isActive: row.availability,
      }));

      methodsProductInfo.reset(data.productInfo);
      methodsSales.reset({ channel: methodsSalesReset });
      setRowsSales(data.dataSales || []);

      if (isImageUpdate) {
        setUploadedImages(data.dataImagesMaster as UploadedImage[]);
      }
    },
    [methodsProductInfo, methodsSales],
  );

  useEffect(() => {
    if (data) {
      resetDetail(data);
    }
  }, [data, resetDetail]);

  return (
    <div className="relative flex flex-col gap-[24px]">
      <div className="absolute right-[24px] top-[-70px]">
        <SaveButton className="w-[88px]" />
      </div>

      {<ProductMaster data={data?.productMaster || []} isLoading={isLoading} />}
      {<PriceMaster data={data?.dataPriceMaster || []} isLoading={isLoading} />}
      {
        <PaidPackagingOptions
          data={data?.dataPaidPackagingOptions || []}
          isLoading={isLoading}
          rows={rowsPaidPackagingOptions}
          setRows={setRowsPaidPackagingOptions}
        />
      }
      {/* Atiissu 상품 이미지 업로드 */}
      {isAtiissu && (
        <ImagesMasterAtiissu
          modelCode={data?.productMaster?.[0]?.modelCode || null}
          sapCode={data?.productMaster?.[0]?.sapCode || ""}
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
        />
      )}
      {/* Nuflaat 상품 이미지 업로드 */}
      {!isAtiissu && (
        <ImagesMasterNuflaat
          skuCode={sku as string}
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
        />
      )}
      <FormProvider {...methodsProductInfo}>
        <ProductInformation />
      </FormProvider>
      <FormProvider {...methodsSales}>
        <Sales rows={rowsSales} isLoading={isLoading} />
      </FormProvider>

      <SaveButton className="w-[120px] self-center" />

      {/* 에러 알럿 */}
      <AlertDialog
        open={openErrorDialog !== null}
        setOpen={() => setOpenErrorDialog(null)}
        isButton={false}
        maxWidth="xs"
        buttonLabel="OK"
        postButtonClassNames="!font-bold"
        dialogContent={openErrorDialog}
        dialogCloseLabel="OK"
        preventClose={false}
      />
    </div>
  );
}
