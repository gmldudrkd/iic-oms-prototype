import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import SearchIcon from "@mui/icons-material/Search";
import {
  Checkbox,
  ClickAwayListener,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  List,
  Radio,
  ListItem,
  Popper,
  RadioGroup,
  TextField,
  ThemeProvider,
  CircularProgress,
} from "@mui/material";
import { GridRowModel } from "@mui/x-data-grid-pro";
import { useCallback, useRef } from "react";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from "react-hook-form";

import { Option } from "@/features/product-list/modules/types";

import { MUIDataGridTheme } from "@/shared/styles/theme";

interface SearchSingleInputProps {
  anchorEl: HTMLElement | null;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  selectedProducts: GridRowModel[];
  setSelectedProducts: (selectedProducts: GridRowModel[]) => void;
  productOptions: Option[];
  placeholder: string;
  mutate: (searchValue: string) => void;
  isPending: boolean;
}

export default function SearchSingleInput({
  anchorEl,
  setAnchorEl,
  selectedProducts,
  setSelectedProducts,
  productOptions,
  placeholder,
  mutate,
  isPending,
}: SearchSingleInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { control } = useFormContext();

  // 상품 선택
  const toggleProductSelection = (product: Option) => {
    const { sapName, sapCode, skuCode, quantity, unitPrice } = product;

    const newSelectedProducts = selectedProducts.find(
      (product) => product.sapCode === sapCode,
    )
      ? selectedProducts.filter((product) => product.sapCode !== sapCode)
      : [
          ...selectedProducts,
          {
            id: sapCode,
            sapName,
            sapCode,
            skuCode,
            quantity,
            selected: true,
            unitPrice,
          },
        ];

    setSelectedProducts(newSelectedProducts);
  };

  // 상품 선택 여부 확인
  const isProductSelected = (sapCode: string) => {
    return selectedProducts.some(
      (product) => product.sapCode === sapCode && product.selected,
    );
  };

  // 검색 옵션 리스트 열기
  const openSearchPopper = useCallback(
    (value: string) => {
      setAnchorEl(inputRef.current);

      if (value.trim() !== "") {
        mutate(value);
      }
    },
    [inputRef, setAnchorEl, mutate],
  );

  // single 검색
  const handleChangeSearch =
    (field: ControllerRenderProps<FieldValues, "searchSingle">) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      field.onChange(e);
      if (e.target.value.trim() !== "") {
        mutate(e.target.value);
      }
    };

  // 라디오 필드 렌더링
  const renderRadioGroup = ({ field }: FieldValues) => {
    return (
      <RadioGroup
        {...field}
        row
        sx={{
          gap: "10px",
          "& > label.MuiFormControlLabel-root": {
            gap: "0px",
            "& span.MuiTypography-root": { fontSize: "16px" },
          },
        }}
      >
        {["SAP Name", "SAP Code"].map((type) => (
          <FormControlLabel
            key={type}
            value={type}
            label={type}
            control={<Radio />}
            onClick={() => setAnchorEl(null)}
          />
        ))}
      </RadioGroup>
    );
  };

  return (
    <ThemeProvider theme={MUIDataGridTheme}>
      <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
        <FormControl>
          <Controller
            control={control}
            name="searchSingle"
            render={({ field }) => {
              return (
                <div className="flex items-center gap-2">
                  <FormControl sx={{ width: "45%" }}>
                    <Controller
                      control={control}
                      name="searchSAP"
                      render={renderRadioGroup}
                    />
                  </FormControl>

                  <TextField
                    ref={inputRef}
                    fullWidth
                    autoComplete="off"
                    sx={{ flex: 1, "& .MuiInputBase-root": { padding: "0px" } }}
                    placeholder={placeholder}
                    value={field.value}
                    onChange={handleChangeSearch(field)}
                    onFocus={() => openSearchPopper(field.value)}
                    size="small"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{ marginRight: "4px" }}
                          >
                            <IconButton
                              onClick={() => openSearchPopper(field.value)}
                            >
                              {isPending ? (
                                <CircularProgress size={20} />
                              ) : (
                                <SearchIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <Popper
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    sx={{ zIndex: 1300, width: anchorEl?.clientWidth }}
                  >
                    <List
                      dense
                      sx={{
                        bgcolor: "background.paper",
                        boxShadow: 3,
                        maxHeight: "300px",
                        overflow: "auto",
                      }}
                    >
                      {productOptions.length === 0 && (
                        <ListItem>No results found</ListItem>
                      )}
                      {productOptions.map((option) => {
                        return (
                          <ListItem
                            key={String(option.sapCode)}
                            onClick={() => toggleProductSelection(option)}
                            sx={{ cursor: "pointer", padding: "10px 0" }}
                          >
                            <Checkbox
                              icon={<CheckBoxOutlineBlankIcon />}
                              checkedIcon={<CheckBoxIcon />}
                              checked={isProductSelected(option.sapCode)}
                            />
                            {option.sapName} / {option.sapCode}
                          </ListItem>
                        );
                      })}
                    </List>
                  </Popper>
                </div>
              );
            }}
          />
        </FormControl>
      </ClickAwayListener>
    </ThemeProvider>
  );
}
