"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { MENU } from "@/features/navigation/modules/constants";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // MENU의 첫 번째 메뉴의 경로로 리다이렉션
    if (MENU && MENU.length > 0) {
      router.push(`/${MENU[0].segment}/${MENU[0].children?.[0]?.segment}`);
    }
  }, [router]);

  // 리다이렉션 되는 동안 보여질 내용
  return <div />;
}
