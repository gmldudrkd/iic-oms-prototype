import Title from "@/shared/components/text/Title";

export default function OrderInfoWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-[24px] rounded-[5px] border border-outlined bg-white">
      <Title text={title} variant="bordered" />
      {children}
    </div>
  );
}
