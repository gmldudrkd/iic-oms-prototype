"use client";

import RootWrapper from "@/shared/provider/RootWrapper";

export default function layout({ children }: { children: React.ReactNode }) {
  return <RootWrapper>{children}</RootWrapper>;
}
