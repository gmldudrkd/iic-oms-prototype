const sanitizeFileName = (fileName: string) => {
  return fileName.replace(/[^가-힣a-zA-Z0-9\\-_.()\\[\\] ]/g, "");
};

export function downloadBlobFile(
  blob: Blob,
  response: Response,
  defaultFileNameFormat: string,
) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  const fileName = convertFileName(response, defaultFileNameFormat);

  link.setAttribute("download", fileName);

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}

const convertFileName = (response: Response, defaultFileNameFormat: string) => {
  const contentDisposition = response.headers.get("Content-Disposition");

  if (contentDisposition && contentDisposition.includes("filename*=")) {
    const startIndex = contentDisposition.indexOf("filename*=UTF-8''");
    if (startIndex !== -1) {
      let serverFileName = contentDisposition.substring(
        startIndex + "filename*=UTF-8''".length,
      );
      try {
        serverFileName = decodeURIComponent(serverFileName);
        serverFileName = sanitizeFileName(serverFileName);
        return serverFileName;
      } catch {
        return defaultFileNameFormat;
      }
    }
  }
  return defaultFileNameFormat;
};
