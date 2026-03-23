import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  styled,
  Box,
  Typography,
} from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { useFormContext } from "react-hook-form";

import { ExtendedUserCreateRequest } from "@/features/sign-up/models/types";
import {
  CORPORATION_OPTIONS,
  AVAILABLE_BRANDS,
  BRAND_ABBREVIATIONS,
} from "@/features/sign-up/modules/constants";

import {
  UserCreateRequestPermissionBrandEnum,
  UserCreateRequestPermissionCorporationsEnum,
} from "@/shared/generated/auth/types/Auth";

interface BrandCorpTableProps {
  handleSelectBrands: (
    brand: UserCreateRequestPermissionBrandEnum,
    corporation: UserCreateRequestPermissionCorporationsEnum,
    checked: boolean,
  ) => void;
  isSelected: (
    brand: UserCreateRequestPermissionBrandEnum,
    corporation: UserCreateRequestPermissionCorporationsEnum,
  ) => boolean;
}

export default function BrandCorpTable({
  handleSelectBrands,
  isSelected,
}: BrandCorpTableProps) {
  const methods = useFormContext<ExtendedUserCreateRequest>();

  const StyledTableCell = styled(TableCell)({
    width: "42px",
    padding: "0px",
    border: `1px solid ${blueGrey[50]}`,
    borderCollapse: "collapse",
    color: blueGrey[400],
  });

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {/* 브랜드 헤더 */}
              {AVAILABLE_BRANDS.map((brand) => {
                const corpCount = CORPORATION_OPTIONS[brand].length;
                return (
                  <StyledTableCell
                    key={brand}
                    align="center"
                    colSpan={corpCount}
                    sx={{ backgroundColor: blueGrey[100] }}
                  >
                    {BRAND_ABBREVIATIONS[brand]}
                  </StyledTableCell>
                );
              })}
            </TableRow>
            <TableRow>
              {/* 법인 코드 헤더 */}
              {AVAILABLE_BRANDS.map((brand) =>
                CORPORATION_OPTIONS[brand].map((corp) => (
                  <StyledTableCell
                    key={`${brand}-${corp.value}`}
                    align="center"
                  >
                    {corp.value}
                  </StyledTableCell>
                )),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {/* 체크박스 */}
              {AVAILABLE_BRANDS.map((brand) =>
                CORPORATION_OPTIONS[brand].map((corp) => (
                  <StyledTableCell
                    key={`${brand}-${corp.value}`}
                    align="center"
                  >
                    <Checkbox
                      id={`${brand}-${corp.value}`}
                      checked={isSelected(brand, corp.enum)}
                      onChange={(e) =>
                        handleSelectBrands(brand, corp.enum, e.target.checked)
                      }
                      size="small"
                    />
                  </StyledTableCell>
                )),
              )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {methods.formState.errors.permissions && (
        <Typography color="error" variant="caption">
          {methods.formState.errors.permissions.message}
        </Typography>
      )}
    </Box>
  );
}
