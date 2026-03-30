import PageClient from "./PageClient";

export function generateStaticParams() {
  return [
    { promotionId: "999" },
    { promotionId: "998" },
    { promotionId: "997" },
    { promotionId: "996" },
    { promotionId: "995" },
    { promotionId: "994" },
    { promotionId: "993" },
    { promotionId: "992" },
    { promotionId: "991" },
    { promotionId: "990" },
    { promotionId: "989" },
    { promotionId: "988" },
    { promotionId: "987" },
    { promotionId: "986" },
  ];
}

export default function Page() {
  return <PageClient />;
}
