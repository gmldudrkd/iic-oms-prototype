import { DashboardLayout } from "@toolpad/core";
import { Router } from "@toolpad/core";
import { AppProvider } from "@toolpad/core/AppProvider";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";

import Header from "@/features/header/index";
import { MENU } from "@/features/navigation/modules/constants";

import { useRouteStore } from "@/shared/stores/useRouteStore";
import { HeaderCustomTheme } from "@/shared/styles/theme";

import DynamicLogo from "@/public/logo/DynamicLogo";

export default function RootWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const nextRouter = useRouter();
  const { updateRoute } = useRouteStore();

  useEffect(() => {
    updateRoute(pathname);
  }, [pathname, updateRoute]);

  const router: Router = {
    pathname,
    navigate: (path: string | URL) => {
      const targetPath = path.toString();
      const normalizedPath = targetPath.replace(/^\//, "");

      const matchedMenu = MENU.find((menu) => {
        return menu.segment === normalizedPath;
      });

      if (matchedMenu?.children?.length) {
        // 자식이 있는 메뉴인 경우 첫 번째 자식으로 이동
        const childPath = `/${normalizedPath}/${matchedMenu.children[0].segment}`;
        nextRouter.push(childPath);
      } else {
        // 자식이 없는 메뉴인 경우 해당 경로로 이동
        nextRouter.push(targetPath);
      }
    },
    searchParams: new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : "",
    ),
  };

  // 특정 페이지에서 네비게이션 & 헤더를 숨기기 위한 페이지 목록
  const hideLayoutPages = [
    "/error",
    "/login",
    "/403",
    "/404",
    "/product/product-list/detail/product-master",
  ];
  const shouldHideLayout = hideLayoutPages.some((page) =>
    pathname.startsWith(page),
  );

  return (
    <AppProvider
      navigation={MENU}
      router={router}
      branding={{
        logo: <DynamicLogo logoType="iic" />,
        title: "IIC OMS",
      }}
      theme={HeaderCustomTheme}
      className="bg-[#E0E0E0]"
    >
      {shouldHideLayout ? (
        <div>{children}</div>
      ) : (
        <DashboardLayout
          className="px-[24px]"
          slots={{ toolbarActions: () => <Header /> }}
          sidebarExpandedWidth={220}
        >
          <div id="content-wrapper">{children}</div>
        </DashboardLayout>
      )}
    </AppProvider>
  );
}
