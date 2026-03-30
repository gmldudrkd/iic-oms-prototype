import PageClient from "./PageClient";

export function generateStaticParams() {
  return [
    { sku: "GM-KUK-001-BLK" },
    { sku: "GM-KUK-002-WHT" },
    { sku: "AT-LPM-001-RSE" },
    { sku: "AT-LPM-002-CRL" },
    { sku: "NF-BDL-001" },
    { sku: "GM-SUN-001-TRT" },
  ];
}

export default function Page() {
  return <PageClient />;
}
