import PageClient from "@/app/(auth)/product/product-list/detail/product-master/[sku]/PageClient";

export function generateStaticParams() {
  return [{ sku: "GM-KUK-001-BLK" }, { sku: "AT-LPM-001-RSE" }];
}

export default function Page() {
  return <PageClient />;
}
