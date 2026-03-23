export default function TotalResult({
  totalResult,
  classNames,
}: {
  totalResult: number | string;
  classNames?: string;
}) {
  return (
    <p className={`text-black/54 mb-[8px] text-[14px] ${classNames}`}>
      <strong className="text-[14px] font-bold">
        {totalResult.toLocaleString()}&nbsp;
      </strong>
      results
    </p>
  );
}
