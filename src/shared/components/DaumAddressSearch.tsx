"use client";

import { useEffect, useRef } from "react";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: DaumAddressResult) => void;
        onclose?: () => void;
        width?: number | string;
        height?: number | string;
      }) => {
        embed: (element: HTMLElement | null) => void;
      };
    };
  }
}

export interface DaumAddressResult {
  address: string;
  addressType: "R" | "J"; // R: 도로명, J: 지번
  bname: string;
  buildingName: string;
  jibunAddress: string;
  roadAddress: string;
  sido: string;
  sigungu: string;
  zonecode: string;
  bname1: string;
  bname2: string;
  roadname: string;
  roadnameCode: string;
  buildingCode: string;
  apartment: "Y" | "N";
  jibunAddressEnglish: string;
  roadAddressEnglish: string;
}

interface DaumAddressSearchProps {
  onComplete: (data: DaumAddressResult) => void;
  onClose?: () => void;
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function DaumAddressSearch({
  onComplete,
  onClose,
  className = "",
  width = "100%",
  height = 500,
}: DaumAddressSearchProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadDaumPostcode = () => {
      if (elementRef.current) {
        elementRef.current.innerHTML = ""; // 🔑 기존 embed 초기화
      }

      if (window.daum && window.daum.Postcode) {
        new window.daum.Postcode({
          oncomplete: (data: DaumAddressResult) => {
            onComplete(data);
          },
          onclose: () => {
            onClose?.();
          },
          width,
          height,
        }).embed(elementRef.current);
      }
    };

    // Daum 우편번호 서비스 스크립트가 이미 로드되어 있는지 확인
    if (window.daum) {
      loadDaumPostcode();
    } else {
      // 스크립트 동적 로드
      const script = document.createElement("script");
      script.src =
        "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.async = true;
      script.onload = loadDaumPostcode;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [onComplete, onClose, width, height]);

  return <div ref={elementRef} className={className} />;
}
