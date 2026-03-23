import { Chip, Table, TableRow, TableCell, TableBody } from "@mui/material";

interface TableRowsProps {
  data: (string | number | null | undefined)[]; // key-value 형태
  chip?: string[]; // Chip 스타일을 적용할 필드
  actions?: {
    [key: string]:
      | React.ReactNode
      | ((value: string | number | null | undefined) => React.ReactNode);
  }; // 특정 key에 대한 액션 (AlertDialog, 버튼 등)
}

export default function CustomTableRows({
  data,
  chip = [],
  actions = {},
}: TableRowsProps) {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell
            width="20%"
            className="table-header bg-[rgba(33,150,243,0.08)]"
          >
            {data[0]}
          </TableCell>
          <TableCell
            width={data.length > 2 ? "30%" : "80%"}
            className="table-cell break-keep"
          >
            <div className="flex items-center justify-between">
              {/* ✅ 기본 Value 출력 */}
              {chip.includes(String(data[0])) ? (
                data[1] ? (
                  <Chip className="!bg-primary !text-white" label={data[1]} />
                ) : (
                  "-"
                )
              ) : (
                (data[1] ?? "-")
              )}

              {/* ✅ actions[key]가 있으면 추가 출력 */}
              {data[0] &&
                actions[data[0] as string] &&
                (typeof actions[data[0] as string] === "function"
                  ? (actions[data[0] as string] as Function)(data[1])
                  : actions[data[0] as string])}
            </div>
          </TableCell>
          {data.length > 2 && (
            <>
              <TableCell
                width="20%"
                className="table-header bg-[rgba(33,150,243,0.08)]"
              >
                {data[2]}
              </TableCell>
              <TableCell width="30%" className="table-cell break-keep">
                {chip.length > 0 &&
                typeof data[2] === "string" &&
                chip.includes(data[2]) ? (
                  data[3] ? (
                    <Chip className="!bg-primary !text-white" label={data[3]} />
                  ) : (
                    "-"
                  )
                ) : (
                  (data[3] ?? "-")
                )}
              </TableCell>
            </>
          )}
        </TableRow>
      </TableBody>
    </Table>
  );
}
