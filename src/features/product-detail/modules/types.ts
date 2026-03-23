import { ProductImageDTO } from "@/shared/generated/pim/types/Product";

export interface Channel {
  sapChannelCode: string;
  isActive: boolean;
}

export interface UploadedImage {
  frontInfo: {
    previewUrl: string;
    file: File | { name: string };
    isNew: boolean;
  };
  serverInfo?: ProductImageDTO & {
    displayOrder: number;
  };
}
