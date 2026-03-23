import { TableCell } from "@mui/material";

// SapIf 렌더링 컴포넌트
export default function SapIfCell({
  sapIf,
}: {
  sapIf: { sap: string; if: string; resultAt: string }[];
}) {
  return (
    <TableCell>
      {sapIf.length === 0
        ? "-"
        : sapIf.map((item, index) => (
            <div key={index} className="flex gap-[10px]">
              <div>
                <span>{item.sap}</span>
                <span> / </span>
                <span
                  className={`${item.if === "Success" ? "text-primary" : "text-error"}`}
                >
                  {item.if}
                </span>
              </div>
              <span className="text-text-secondary">{item.resultAt}</span>
            </div>
          ))}
    </TableCell>
  );
}
