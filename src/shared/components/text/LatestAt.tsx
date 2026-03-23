import { convertUTCtoKST } from "@/shared/utils/formatDate";

// 백에서 UCT로 받는 값 KST로 변환
export default function LatestAt({
  latestTime,
  classNames,
}: {
  latestTime: string;
  classNames?: string;
}) {
  return (
    <span className={`flex justify-end text-black/40 ${classNames}`}>
      Latest published at: {convertUTCtoKST(latestTime)}
    </span>
  );
}
