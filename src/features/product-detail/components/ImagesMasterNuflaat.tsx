import CancelIcon from "@mui/icons-material/Cancel";
import { Button, IconButton, Modal } from "@mui/material";
import Image from "next/image";
import React, { useState, useRef, useCallback } from "react";

import { UploadedImage } from "@/features/product-detail/modules/types";
import { validateImageFiles } from "@/features/product-detail/modules/utils";

import AlertDialog from "@/shared/components/dialog/AlertDialog";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import Title from "@/shared/components/text/Title";

interface ImagesMasterProps {
  skuCode: string;
  uploadedImages: UploadedImage[];
  setUploadedImages: (data: UploadedImage[]) => void;
}

export default function ImagesMasterNuflaat({
  skuCode,
  uploadedImages,
  setUploadedImages,
}: ImagesMasterProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] =
    useState<React.ReactNode | null>(null);

  const handleAddImage = () => {
    if (uploadedImages.length < 10 && !isUploading) {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } else if (isUploading) {
      alert("이미지 업로드 중에는 다른 기능을 사용할 수 없습니다.");
    } else {
      alert("최대 10장의 이미지만 업로드할 수 있습니다.");
    }
  };

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;
      if (files && files.length > 0) {
        setIsUploading(true);

        const allowedTypes = ["image/jpeg", "image/jpg"];
        const fileArray = Array.from(files).slice(
          0,
          10 - uploadedImages.length,
        );

        const loadImage = (file: File) =>
          new Promise<UploadedImage>((resolve, reject) => {
            if (!allowedTypes.includes(file.type)) {
              reject(`${file.name}은 .jpeg 형식만 가능합니다.`);
              return;
            }

            const img = new window.Image();
            const previewUrl = URL.createObjectURL(file);

            img.onload = () => {
              if (img.width !== 1920 && img.height !== 1920) {
                setOpenErrorDialog(
                  "Invalid image size. Only images with 1920x1920 resolution are allowed.",
                );
                reject(`${file.name}의 크기가 1920x1920이 아닙니다.`);
              } else if (files.length + uploadedImages.length > 10) {
                setOpenErrorDialog("You can upload up to 10 images.");
                reject("10개 이하 이미지 업로드 가능");
              } else {
                resolve({ frontInfo: { file, previewUrl, isNew: true } });
              }
            };

            img.onerror = () => reject(`${file.name} 이미지 로딩 실패`);
            img.src = previewUrl;
          });

        try {
          const newImages = await Promise.all(
            fileArray.map((file) => loadImage(file)),
          );
          const result = validateImageFiles(newImages, uploadedImages, skuCode);

          if (result.isValid) {
            setUploadedImages(
              [...uploadedImages, ...newImages].sort((a, b) =>
                a.frontInfo.file.name.localeCompare(b.frontInfo.file.name),
              ),
            );
          }

          if (!result.isValid) {
            setOpenErrorDialog(result.errorMessage);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      }
    },
    [uploadedImages, skuCode, setUploadedImages],
  );

  const handleRemoveImage = useCallback(
    (indexToRemove: number) => {
      setUploadedImages(
        uploadedImages.filter((_, index) => index !== indexToRemove),
      );
    },
    [uploadedImages, setUploadedImages],
  );

  return (
    <div className="mx-[24px] rounded-[5px] border border-outlined bg-white">
      <Title text="Images" variant="bordered">
        <div className="flex w-full items-center justify-between">
          <span className="text-[20px] text-error"> *</span>
          <div className="flex items-center gap-[8px]">
            <span className="text-[16px] font-normal leading-[20px]">
              ※ JPEG only (1920x1920)
            </span>
            <Button
              color="primary"
              onClick={handleAddImage}
              disabled={isUploading || uploadedImages.length >= 10}
            >
              Add
            </Button>
            <input
              type="file"
              accept=".jpeg, .jpg"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </div>
        </div>
      </Title>

      <div className="m-[24px]">
        {uploadedImages.length === 0 ? (
          <p className="w-full text-center text-text-secondary">No Image</p>
        ) : (
          <div className="flex flex-wrap gap-[10px]">
            {uploadedImages.map((image, index) => (
              <div
                key={index}
                className="h-[auto] w-[232px] rounded-[5px] border border-outlined p-[16px]"
              >
                <div className="relative">
                  <Image
                    src={image.frontInfo.previewUrl}
                    alt={image.frontInfo.previewUrl}
                    className="block h-auto w-full rounded-[5px] border border-outlined"
                    width={232}
                    height={232}
                  />

                  <IconButton
                    aria-label="remove"
                    onClick={() => handleRemoveImage(index)}
                    sx={{ position: "absolute", top: 0, right: 0 }}
                    disabled={isUploading}
                  >
                    <CancelIcon fontSize="large" />
                  </IconButton>
                </div>

                {/* file name */}
                <p className="mt-[10px] break-words text-[12px] font-bold">
                  {image.frontInfo.file.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 에러 알럿 */}
      <AlertDialog
        open={openErrorDialog !== null}
        setOpen={() => setOpenErrorDialog(null)}
        dialogTitle="Action Failed"
        dialogTitleClassNames="!bg-white !text-default"
        isButton={false}
        maxWidth="xs"
        buttonLabel="OK"
        postButtonClassNames="!font-bold"
        dialogContent={
          <span className="whitespace-pre-line">{openErrorDialog}</span>
        }
        dialogCloseLabel="OK"
        preventClose={false}
      />

      <Modal
        open={isUploading}
        aria-labelledby="image-uploading"
        aria-describedby="image-uploading"
      >
        <div className="flex h-full w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      </Modal>
    </div>
  );
}
