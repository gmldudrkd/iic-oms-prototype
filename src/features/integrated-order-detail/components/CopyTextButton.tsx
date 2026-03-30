import { CheckOutlined, FileCopyOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState, useEffect } from "react";

interface CopyTextButtonProps {
  text: string;
  className?: string;
}

export default function CopyTextButton({
  text,
  className = "",
}: CopyTextButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 부모 버튼의 onClick 이벤트 방지

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <IconButton
      aria-label="copy shipment number"
      className={`pointer-events-auto ${className}`}
      onClick={handleCopy}
      size="small"
    >
      {isCopied ? (
        <CheckOutlined fontSize="small" />
      ) : (
        <FileCopyOutlined fontSize="small" />
      )}
    </IconButton>
  );
}
