// 파일 경로: src/shared/utils/imageUtils.ts

/**
 * 이미지 URL이 유효하지 않을 경우 기본 플레이스홀더 이미지 URL을 반환합니다.
 * @param url - 원본 이미지 URL (null 또는 undefined일 수 있음)
 * @param defaultUrl - 사용할 기본 이미지 URL (기본값: 플레이스홀더)
 * @returns 유효한 이미지 URL 또는 기본 URL
 */
export function getDefaultImageUrl(
  url: string | null | undefined,
  defaultUrl: string = "https://placehold.co/50x50", // 기본 플레이스홀더 URL
): string {
  return url ? url : defaultUrl;
}

/**
 * 이미지 파일의 크기(너비, 높이)를 가져옵니다.
 * @param file - 이미지 파일
 * @returns Promise<{ width: number; height: number }>
 */
export const getImageSize = (
  file: File,
): Promise<{ width: number; height: number }> =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image"));
    };
    img.src = URL.createObjectURL(file);
  });

/**
 * 이미지 파일들의 크기를 검증합니다.
 * @param files - 검증할 이미지 파일 배열
 * @param requiredSize - 필수 이미지 크기 (기본값: 1920)
 * @throws {Error} 이미지 크기가 일치하지 않을 경우
 */
export const validateImageSize = async (
  files: File[],
  requiredSize: number = 1920,
): Promise<void> => {
  for (const file of files) {
    const { width, height } = await getImageSize(file);
    if (width !== requiredSize || height !== requiredSize) {
      throw new Error(
        `Invalid image size. Only images with ${requiredSize}x${requiredSize} resolution are allowed.`,
      );
    }
  }
};
