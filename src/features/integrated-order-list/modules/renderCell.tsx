import { Chip } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid-pro";

export const renderCellForStatus = (params: {
  value: string;
  color?: string;
}) => {
  let chipColor: "primary" | "warning" | "success" | "info" | "default" =
    "primary";

  // 상태 값에 따라 색상 설정
  switch (params.color) {
    case "order":
      chipColor = "primary";
      break;
    case "return":
      chipColor = "warning";
      break;
    case "exchange":
      chipColor = "success";
      break;
    case "receiveMethod":
      chipColor = "info";
      break;
    case "default":
      chipColor = "default";
      break;
    default:
      chipColor = "primary";
      break;
  }

  if (params.value === "") return <span>-</span>;

  // Receive Method: custom colors per value
  if (params.color === "receiveMethod") {
    const receiveMethodColors: Record<string, string> = {
      Delivery: "#DB2777",
      "Store Pickup": "#9C27B0",
    };
    return (
      <Chip
        label={params.value}
        size="small"
        sx={{
          backgroundColor: receiveMethodColors[params.value] ?? "#9C27B0",
          color: "#fff",
        }}
      />
    );
  }

  return <Chip label={params.value} color={chipColor} size="small" />;
};

export const renderCellForShippingStatus = (params: { value: string[] }) => {
  return (
    <div className="w-full divide-y divide-solid divide-[#E0E0E0]">
      {params.value.length === 0 && (
        <div className="flex items-center px-[10px] py-[9px]">-</div>
      )}
      {params.value.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className="flex items-center px-[10px] py-[9px]"
        >
          <Chip label={item} size="small" />
        </div>
      ))}
    </div>
  );
};

export const returnGradeRenderCell = (params: GridRenderCellParams) => {
  return (
    <div className="flex flex-col">
      {Object.keys(params.row.gradeSummaries).map((key: string) => {
        if (key === "NONE") {
          return <span key={key}>-</span>;
        }
        return <span key={key}>{params.row.gradeSummaries[key] ?? "-"}</span>;
      })}
    </div>
  );
};
