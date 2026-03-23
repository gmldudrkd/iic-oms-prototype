import { GridRowModel } from "@mui/x-data-grid";
import { UseFormReturn } from "react-hook-form";

import { Channel } from "@/features/product-detail/modules/types";
import { UploadedImage } from "@/features/product-detail/modules/types";

import {
  MmSizeDTO,
  OmsProductResponseDTO,
  ProductImageDTO,
  ProductInformationResponseDTO,
  ProductUpdateRequestDTO,
  SalesAndDistributionSettingDTO,
} from "@/shared/generated/pim/types/Product";
import { getLocalTime } from "@/shared/utils/formatDate";

/**
 * 수정 요청 데이터로 변환
 * @param uploadedImages 이미지 데이터
 * @param methodsProductInfo 상품 정보 데이터
 * @param methodsSales 채널 데이터
 * @returns 수정 요청 데이터
 */
export const transformRequestData = ({
  images,
  methodsProductInfo,
  paidPackagingOptions,
  methodsSales,
}: {
  images: UploadedImage[];
  methodsProductInfo: UseFormReturn;
  paidPackagingOptions: GridRowModel[];
  methodsSales: UseFormReturn<{ channel: Channel[] }>;
}) => {
  const transformInfo = () => {
    const data = methodsProductInfo.getValues();
    const language = ["EN", "KO"];
    const result = language.map((lang) => ({
      language: lang,
      name: data[`name${lang}`],
      description: data[`description${lang}`],
      collection: data[`collectionName${lang}`] ?? "",
      internalSearchKeyword: data[`internalSearchKeyword${lang}`] ?? "",
    }));

    return result;
  };

  const assets = images.map((image) => image.serverInfo);
  const productInformation = transformInfo();
  const packages: { sku: string; quantity: number }[] =
    paidPackagingOptions.map((option) => ({
      sku: option.skuCode,
      quantity: option.quantity,
    }));
  const { channel } = methodsSales.getValues();

  const requestData = { assets, productInformation, packages, channel };
  // @ts-ignore
  // TODO : string 타입에서 변환 필요 @대영님
  return requestData as ProductUpdateRequestDTO;
};

/**
 * 상품 상세 데이터 변환
 * @param data OmsProductResponseDTO
 * @param timezone string
 * @returns { productMaster: GridRowModel[], dataPriceMaster: GridRowModel[], dataPaidPackagingOptions: GridRowModel[], dataImagesMaster: GridRowModel[], productInfo: any, dataSales: GridRowModel[] }
 */
export const transformProductDetail = (
  data: OmsProductResponseDTO,
  timezone: string,
) => {
  const { isBundle } = data;

  // Product Master
  const transformProductMaster = (item: OmsProductResponseDTO) => {
    return {
      id: item.sapCode,
      skuCode: item.sku,
      sapCode: item.sapCode,
      quantity: item.qty,
      sapName: item.sapName,
      category: item.categoryName3,
      modelCode: item.modelCode || "-",
      modelName: item.modelName || "-",
    };
  };

  const getProductMasterBundle = data.bundleProducts.map(
    (product: OmsProductResponseDTO) => transformProductMaster(product),
  );
  const productMaster = isBundle
    ? getProductMasterBundle
    : [transformProductMaster(data)];
  // -----------

  // Price Master
  const transformPriceMaster = (item: OmsProductResponseDTO) => ({
    id: item.sapCode,
    skuCode: item.sku,
    sapCode: item.sapCode,
    quantity: item.qty,
    sapName: item.sapName,
    currency: item.priceMasters?.[0]?.currency,
    unitPrice: item.priceMasters?.[0]?.price,
    startDatetime: item.priceMasters?.[0]?.startedAt
      ? getLocalTime(item.priceMasters?.[0]?.startedAt, timezone)
      : "-",
    endDatetime: item.priceMasters?.[0]?.endedAt
      ? getLocalTime(item.priceMasters?.[0]?.endedAt, timezone)
      : "-",
  });

  const getPriceMasterBundle = data.bundleProducts?.map(
    (product: OmsProductResponseDTO) => transformPriceMaster(product),
  );
  const dataPriceMaster = isBundle
    ? getPriceMasterBundle
    : [transformPriceMaster(data)];
  // -----------

  // Paid Packaging Options
  const dataPaidPackagingOptions: {}[] = data.paidPackageMasters?.map(
    (item: OmsProductResponseDTO) => ({
      id: item.sapCode,
      skuCode: item.sku,
      sapCode: item.sapCode,
      sapName: item.sapName,
      quantity: item.qty,
      unitPrice: item.priceMasters?.[0]?.price,
      totalPrice: (item.priceMasters?.[0]?.price ?? 0) * item.qty,
    }),
  );
  // -----------

  // Images Master
  const dataImagesMaster = data.assets
    ?.map((image: ProductImageDTO) => ({
      frontInfo: {
        previewUrl: image.cloudFrontUrl,
        file: { name: image.originalFileName },
        isNew: false,
      },
      serverInfo: {
        ...image,
      },
    }))
    .sort(
      (a, b) =>
        (a.serverInfo.displayOrder ?? 0) - (b.serverInfo.displayOrder ?? 0),
    );
  // -----------

  // Product Information
  let productInfo = {};
  data.productInformation?.forEach((info: ProductInformationResponseDTO) => {
    productInfo = {
      ...productInfo,
      [`name${info.languageCode}`]: info.name,
      [`description${info.languageCode}`]: info.description,
      [`collectionName${info.languageCode}`]: info.collectionName,
      [`internalSearchKeyword${info.languageCode}`]: info.internalSearchKeyword,
    };
  });
  // -----------

  // Sales Availability by Channel
  const dataSales = data.salesAndDistributionSettings?.map(
    (channel: SalesAndDistributionSettingDTO, index: number) => ({
      id: channel.channelId,
      index: index,
      availability: channel.availability,
      channelNo: channel.channelId,
      channelName: channel.channelName,
      channelType: channel.channelType,
      channelSapCode: channel.sapChannelCode,
      channelSapName: channel.sapChannelName,
    }),
  );
  // -----------

  // Product Master Detail
  const productMasterNuflaat = {
    skuCode: data.sku,
    collectionName: data.collectionName,
    sapCode: data.sapCode,
    color: data.color,
    sapName: data.sapName,
    material: data.visualTexture,
    category: data.categoryName3,
    sizeMm: data.size ? `${data.size} mm` : null,
    modelCode: data.modelCode,
    netWeight: data.netWeight ? `${data.netWeight}g` : null,
    modelName: data.modelName,
    countryOfOrigin: data.countryOfManufacture,
    upcCode: data.upcCode,
    lineName: data.lineName,
    hsCode: data.hsCode,
    operationalStatus: data.status,
    releaseDate: data.releaseDate,
    salesGrade: data.salesGrade,
    season: data.season,
    designGrade: data.designGrade,
    capacity: data.capacity
      ? `${data.capacity}${data.capacityUnit?.trim() || "ml"}`
      : null,
    careInstructionsKo: data.careInstructionsKo,
    careInstructionsEn: data.careInstructionsEn,
  };

  const getMmSize = (mmSize: MmSizeDTO) => {
    let result = "";
    result += `Circum: ${mmSize.circumference ?? "-"} / `;
    result += `Height: ${mmSize.depth ?? "-"} / `;
    result += `Brim length: ${mmSize.brimSize ?? "-"}`;
    return result;
  };

  const convertHyphen = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }
    return String(value);
  };

  const productMasterRaw = {
    sapCode: data.sapCode,
    collectionName: data.collectionName,
    sapName: data.sapName,
    color: data.color,
    category: data.categoryName3, // categoryName3 만 사용하면 될지?
    visualTexture: data.visualTexture,
    modelCode: data.modelCode,
    size: data.size,
    modelName: data.modelName,
    mmSize: getMmSize(
      data.mmSize ?? { circumference: 0, depth: 0, brimSize: 0 },
    ),
    upcCode: data.upcCode,
    netWeight: data.netWeight,
    hsCode: data.hsCode,
    outerFabricEn: data.outerFabricEn,
    releaseDate: data.releaseDate,
    outerFabricKo: data.outerFabricKo,
    season: data.season,
    liningEn: data.liningEn,
    countryOfManufacture: data.countryOfManufacture,
    liningKo: data.liningKo,
  };

  // Product Master
  const productMasterAtiissu = Object.entries(productMasterRaw).reduce<
    Record<string, string>
  >((acc, [key, value]) => {
    acc[key] = convertHyphen(value);
    return acc;
  }, {});
  // -----------

  return {
    brandId: data.brandId,
    productMaster,
    dataPriceMaster,
    dataPaidPackagingOptions,
    dataImagesMaster,
    productInfo,
    dataSales,
    productMasterDetail: {
      AT: productMasterAtiissu,
      NF: productMasterNuflaat,
    },
  };
};
