import { AppBar, Skeleton, Toolbar } from "@mui/material";
import { useParams } from "next/navigation";

import useGetProductDetail from "@/features/product-detail/hooks/useGetProductDetail";
import {
  productMasterFieldsAT,
  productMasterFieldsNF,
} from "@/features/product-detail/modules/constants";

import {
  DetailGrid,
  Cell,
  DetailGridSingle,
} from "@/shared/components/table/tableStyle";
import { convertToLineBreak } from "@/shared/utils/stringUtils";

export default function ProductMasterDetail() {
  const params = useParams();
  const { sku } = params;

  // 📍 상품 상세 데이터 조회 API
  const { data, isLoading } = useGetProductDetail(sku as string);

  const getSubLabel = (subLabel: string) => {
    if (!subLabel) return null;
    return <span className="ml-[0px] mt-[2px] text-sm">({subLabel})</span>;
  };

  const brandId = data?.brandId;
  const productMasterData = data?.productMasterDetail?.[brandId as "AT" | "NF"];
  const productMasterFields =
    brandId === "AT" ? productMasterFieldsAT : productMasterFieldsNF;

  return (
    <div className="h-screen bg-[#F5F5F5]">
      <AppBar sx={{ backgroundColor: "primary.main" }} position="static">
        <Toolbar>Product Master Detail</Toolbar>
      </AppBar>

      <div className="mx-[24px] mt-[24px] rounded-[5px] border border-outlined bg-white">
        {productMasterFields.map((row, rowIndex) => {
          // 두 개 칼럼
          if (row.length > 1) {
            return (
              <DetailGrid key={rowIndex}>
                {row.map(({ label, key, subLabel }) => (
                  <div key={label}>
                    <h3 className="!gap-0">
                      {label} {subLabel && getSubLabel(subLabel)}
                    </h3>
                    <Cell>
                      {isLoading ? (
                        <Skeleton variant="text" width="100%" height="20px" />
                      ) : (
                        productMasterData?.[
                          key as keyof typeof productMasterData
                        ] || "-"
                      )}
                    </Cell>
                  </div>
                ))}
              </DetailGrid>
            );
          }

          // 한 개 칼럼
          return (
            <DetailGridSingle key={rowIndex}>
              {row.map(({ label, key, subLabel }) => (
                <div key={label}>
                  <h3>
                    {label} {subLabel && getSubLabel(subLabel)}
                  </h3>
                  <Cell className="flex-start align-start flex-col !items-start justify-center">
                    {isLoading ? (
                      <Skeleton variant="text" width="100%" height="20px" />
                    ) : (
                      convertToLineBreak(
                        productMasterData?.[
                          key as keyof typeof productMasterData
                        ] || "-",
                      )
                    )}
                  </Cell>
                </div>
              ))}
            </DetailGridSingle>
          );
        })}
      </div>
    </div>
  );
}
