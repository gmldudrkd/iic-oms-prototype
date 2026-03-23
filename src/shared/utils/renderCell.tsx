import { GridRenderCellParams } from "@mui/x-data-grid-pro";
import Image from "next/image";
import Link from "next/link";

/**
 * 이미지 셀 함수
 * @param params DataGrid 셀 파라미터
 * @param value 이미지 URL
 * @returns Image 컴포넌트
 */
export const renderCellImage = (params: { value: string }) => {
  if (params.value === null) return null;
  const src = params.value;

  return (
    <Image
      src={src}
      alt={`${src} image`}
      className="m-auto"
      width={32}
      height={32}
    />
  );
};

/**
 * 다중 라인 셀 함수
 * @param params DataGrid 셀 파라미터
 * @param props 옵션 (isRightAlign: 오른쪽 정렬 여부)
 * @returns 다중 라인 셀 컴포넌트
 */
export const renderCellMultiLine = (
  params: GridRenderCellParams,
  props: { isRightAlign?: boolean; subfix?: string } = {},
) => {
  const { isRightAlign = false, subfix = "" } = props;

  if (!Array.isArray(params.value)) {
    return (
      <div className="flex h-full w-full flex-col justify-around">
        {params.value ?? "-"}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-around">
      {params.value.length === 0 && (
        <div className="box-content flex h-full min-h-[24px] items-center px-[10px] py-[9px]">
          -
        </div>
      )}
      {params.value.map((item: string, index: number) => (
        <div
          key={`${item}-${index}`}
          className={`box-content flex h-full min-h-[24px] items-center border-b border-solid border-[#E0E0E0] px-[10px] py-[9px] last-of-type:border-b-0 ${isRightAlign ? "justify-end" : "justify-start"}`}
        >
          {item ?? "-"} {subfix}
        </div>
      ))}
    </div>
  );
};

/**
 * 라우팅 셀 함수
 * @param params DataGrid 셀 파라미터
 * @param detailUrl 상세 URL
 * @returns Link 컴포넌트
 */
export const renderCellRouting = (
  params: GridRenderCellParams,
  detailUrl: string,
) => {
  return (
    <Link
      href={detailUrl}
      className="text-primary !no-underline"
      target="_blank"
    >
      {params.value}
    </Link>
  );
};

/**
 * spanning null value check RenderCell 함수
 * @param params DataGrid 셀 파라미터
 * @param field  row에서 뽑아올 key
 * @param nullCheck "null" 문자열도 빈 값으로 처리할지 여부
 */
export const renderCellSpanningNullCheck = (
  params: GridRenderCellParams,
  field: string,
  nullCheck: boolean = true,
) => {
  let value: string = params.row[field] ?? "";
  value = value.split("^")[0]; // ^ 앞 부분만 사용

  const isNull = nullCheck && value === "null";
  const display = isNull || !value ? "-" : value;

  return (
    <div key={params.row.id}>
      <span>{display}</span>
    </div>
  );
};
