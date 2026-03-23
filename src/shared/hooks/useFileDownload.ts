import { useCallback } from "react";

export default function useFileDownload() {
  const downloadFile = useCallback((blob: Blob, filename: string) => {
    // Blob 유효성 검사
    if (!blob || !(blob instanceof Blob)) {
      console.error("유효하지 않은 Blob 객체입니다.");
      throw new Error("유효하지 않은 Blob 객체입니다.");
    }

    try {
      // Blob URL 생성
      const url = window.URL.createObjectURL(blob);

      // 임시 다운로드 링크 생성
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      // 링크를 DOM에 추가하고 클릭
      document.body.appendChild(link);
      link.click();

      // 정리 작업
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("파일 다운로드 오류:", error);
      throw new Error("파일 다운로드에 실패했습니다.");
    }
  }, []);

  const downloadFromResponse = useCallback(
    async (response: Response) => {
      try {
        // Content-Disposition 헤더에서 파일명 추출
        const contentDisposition = response.headers.get("content-disposition");
        let filename = "download.xlsx"; // 기본 파일명

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
          );
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, "");
          }
        }

        // Response를 Blob으로 변환
        const blob = await response.blob();

        // 파일 다운로드
        downloadFile(blob, filename);
      } catch (error) {
        console.error("파일 다운로드 오류:", error);
        throw new Error("파일 다운로드에 실패했습니다.");
      }
    },
    [downloadFile],
  );

  return { downloadFile, downloadFromResponse };
}
