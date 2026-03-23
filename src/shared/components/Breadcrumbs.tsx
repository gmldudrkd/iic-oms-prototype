"use client";

import { Breadcrumbs } from "@mui/material";
import Link from "@mui/material/Link";
import { useRouter } from "next/navigation";
import * as React from "react";

interface BreadcrumbItem {
  href: string;
  label: string;
}

export default function BreadcrumbsComponent({
  items,
}: {
  items: BreadcrumbItem[];
}) {
  const router = useRouter();

  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        {items.map((item, index) => (
          <Link
            key={index}
            underline="none"
            color="inherit"
            onClick={() => router.push(item.href)}
            className="text-black/87 text-[16px]"
            sx={{ fontWeight: index === 1 ? "bold" : "regular" }}
          >
            {item.label}
          </Link>
        ))}
      </Breadcrumbs>
    </div>
  );
}
