import SearchIcon from "@mui/icons-material/Search";
import {
  FormControl,
  Autocomplete,
  TextField,
  InputAdornment,
  CircularProgress,
  AutocompleteRenderInputParams,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { useAddressSearch } from "@/features/header/hooks/useAddressSearch";
import {
  JusoApiResponse,
  OpenCageResponse,
} from "@/features/integrated-order-detail/models/types";
import {
  AddressFormProps,
  FormField,
  AddressAutocompleteProps,
} from "@/features/integrated-order-detail/modules/types";

import DaumAddressSearch, {
  DaumAddressResult,
} from "@/shared/components/DaumAddressSearch";

// 주소 폼 컴포넌트
export default function AddressForm({
  title,
  disabled,
  syncButton,
}: AddressFormProps) {
  const { control, getValues, setValue, trigger } = useFormContext();
  const [modalVisible, setModalVisible] = useState(false);
  // const isKrAddress = false;
  const isKrAddress = getValues("countryRegion") === "KR";

  // useAddressSearch 훅 사용
  const {
    inputValue,
    setInputValue,
    results,
    loading,
    handleInputChange,
    jusoSearchAPIError,
  } = useAddressSearch(getValues("address1"), isKrAddress);

  // 주소 폼 필드 정의
  const addressFields: FormField[] = useMemo(
    () => [
      {
        name: "recipientFirstName",
        label: "Recipient First Name",
        required: true,
      },
      {
        name: "recipientLastName",
        label: "Recipient Last Name",
        required: true,
      },
      {
        name: "phoneCountryNo",
        label: "Phone Country No",
        required: false,
        placeholder: "82",
      },
      { name: "recipientPhone", label: "Phone", required: true },
      // address1은 특별 처리
      { name: "address2", label: "Address 2", required: false },
      { name: "city", label: "City", required: false },
      { name: "stateProvince", label: "State/Province", required: true },
      { name: "postcode", label: "Postcode", required: true },
      {
        name: "countryRegion",
        label: "Country/Region",
        required: true,
        disabled: true, // 항상 비활성화
      },
    ],
    [],
  );

  // 텍스트 필드 렌더링 함수
  const renderTextField = useCallback(
    (fieldDef: FormField) => (
      <Controller
        key={fieldDef.name}
        control={control}
        name={fieldDef.name}
        rules={{
          required: fieldDef.required
            ? `${fieldDef.label} is required.`
            : false,
        }}
        render={({ field: inputField }) => (
          <TextField
            {...inputField}
            name={fieldDef.name}
            label={fieldDef.label}
            fullWidth={fieldDef.fullWidth !== false}
            size="small"
            disabled={fieldDef.disabled || disabled}
            required={fieldDef.required}
            sx={{ "& .MuiInputLabel-asterisk": { color: "error.main" } }}
            placeholder={fieldDef.placeholder ?? ""}
            onBeforeInput={(e: React.FormEvent<HTMLInputElement>) => {
              if (fieldDef.label === "Phone") {
                const inputEvent = e.nativeEvent as InputEvent;
                const data = inputEvent.data ?? "";
                const allowed = /^[0-9()+]+$/;
                if (data && !allowed.test(data)) {
                  e.preventDefault();
                }
              }
            }}
          />
        )}
      />
    ),
    [control, disabled],
  );

  // renderInput 함수
  const renderAddressInput = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <TextField
        {...params}
        label="Address 1"
        variant="outlined"
        required={true}
        sx={{ "& .MuiInputLabel-asterisk": { color: "error.main" } }}
        slotProps={{
          input: {
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: "0px" }}>
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          },
        }}
      />
    ),
    [loading],
  );

  // 주소 1에서 시/도/특별시 제거
  function removeStateCity(
    roadAddrPart1: string | null | undefined,
    siNm: string | null | undefined,
    sggNm: string | null | undefined,
  ): string {
    let addressLine = roadAddrPart1 || ""; // null이면 빈 문자열로 시작

    // siNm과 일치하는 부분 제거 (앞뒤 공백 고려하여 trim)
    if (siNm) {
      // replaceAll을 사용하면 해당 문자열이 여러 번 나와도 모두 제거됨
      addressLine = addressLine.replaceAll(siNm, "");
    }
    // sggNm과 일치하는 부분 제거 (앞뒤 공백 고려하여 trim)
    if (sggNm) {
      addressLine = addressLine.replaceAll(sggNm, "");
    }

    // 제거 후 남은 앞뒤 공백 및 중간의 여러 공백을 하나로 정리
    return addressLine.trim().replace(/\s+/g, " ");
  }

  // 주소 선택 시 다른 필드 업데이트 콜백
  const handleAddressSelect = useCallback(
    (selectedResult: JusoApiResponse | OpenCageResponse | null) => {
      if (selectedResult) {
        if (isKrAddress) {
          // 한국 주소 선택 시
          const jusoResult = selectedResult as JusoApiResponse;
          setValue(
            "address1",
            removeStateCity(
              jusoResult.roadAddr,
              jusoResult.siNm,
              jusoResult.sggNm,
            ),
          );
          setValue("address2", "");
          setValue("city", jusoResult.sggNm || "");
          setValue("stateProvince", jusoResult.siNm || "");
          setValue("postcode", jusoResult.zipNo || "");
        } else {
          // 글로벌 주소 선택 시
          const openCageResult = selectedResult as OpenCageResponse;
          const { components } = openCageResult;
          setValue(
            "address1",
            `${components.road || ""} ${components.house_number || ""}`.trim(),
          );
          setValue("address2", "");

          setValue("city", components.city || "");
          setValue("stateProvince", components.state || "");
          setValue("postcode", components.postcode || "");
          setValue("countryRegion", components.country_code || "");
        }

        setInputValue(getValues("address1") || "");
        trigger("address1").catch(console.error);
        trigger("address2").catch(console.error);
      } else {
        setValue("address1", "");
        trigger("address1").catch(console.error);
        trigger("address2").catch(console.error);
      }
    },
    [setValue, setInputValue, isKrAddress, trigger, getValues],
  );

  const handleDaumClose = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleDaumComplete = useCallback(
    (data: DaumAddressResult) => {
      setValue(
        "address1",
        removeStateCity(data.roadAddress, data.sido, data.sigungu),
      );
      setValue("address2", "");
      setValue("city", data.sigungu || "");
      setValue("stateProvince", data.sido || "");
      setValue("postcode", data.zonecode);
      setValue("countryRegion", "KR");
      setModalVisible(false);

      trigger("address1").catch(console.error);
      trigger("address2").catch(console.error);
    },
    [setValue, trigger],
  );

  return (
    <>
      {title && (
        <h2 className="flex items-center justify-between px-[16px] text-[14px] font-medium leading-[48px] text-text-secondary">
          <span>{title}</span>
          {syncButton}
        </h2>
      )}
      <div className="flex flex-col gap-[12px]">
        {/* 처음 세 필드: 수신자 이름과 전화번호 */}
        {renderTextField(addressFields[0])}
        {renderTextField(addressFields[1])}
        {renderTextField(addressFields[2])}
        {renderTextField(addressFields[3])}

        {/* 주소 1 + 검색 버튼 */}
        {jusoSearchAPIError ? (
          <div className="flex gap-[12px]">
            <FormControl fullWidth>
              <Controller
                name="address1"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address 1"
                    variant="outlined"
                    required={true}
                    size="small"
                    sx={{
                      "& .MuiInputLabel-asterisk": { color: "error.main" },
                    }}
                    slotProps={{
                      input: {
                        onClick: () => setModalVisible(true),
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{ marginRight: "0px" }}
                          >
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                    onClick={() => setModalVisible(true)}
                  />
                )}
              />
            </FormControl>
            {/* Daum 주소검색 모달 */}
            {modalVisible && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="mx-4 w-full max-w-md rounded-lg bg-white shadow-lg">
                  <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-lg font-semibold">배송지</h2>
                    <button
                      onClick={handleDaumClose}
                      className="rounded p-1 hover:bg-gray-100"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18 6L6 18M6 6L18 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4">
                    <DaumAddressSearch
                      onComplete={handleDaumComplete}
                      onClose={handleDaumClose}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-[12px]">
            <FormControl fullWidth>
              <Controller
                name="address1"
                control={control}
                rules={{ required: "주소 입력은 필수입니다." }}
                render={({ field }) => (
                  <AddressAutocomplete
                    field={field}
                    inputValue={inputValue}
                    onInputChange={(event, newValue, reason) => {
                      // eslint-disable-next-line no-void
                      void handleInputChange(event, newValue, reason);
                      field.onChange(newValue);
                    }}
                    options={results as (OpenCageResponse | JusoApiResponse)[]}
                    loading={loading}
                    renderAddressInput={renderAddressInput}
                    onAddressSelect={handleAddressSelect}
                    disabled={disabled}
                  />
                )}
              />
            </FormControl>
          </div>
        )}

        {/* 나머지 필드들 */}
        {addressFields.slice(4).map(renderTextField)}
      </div>
    </>
  );
}

// 주소 검색 컴포넌트
function AddressAutocomplete({
  field,
  inputValue,
  onInputChange,
  options,
  loading,
  renderAddressInput,
  onAddressSelect,
  disabled,
}: AddressAutocompleteProps) {
  // Autocomplete에 표시될 옵션 라벨 배열 생성
  const getAutocompleteOptions = (
    options: (OpenCageResponse | JusoApiResponse)[],
  ) => {
    return options.map((option) => {
      if ("roadAddr" in option) {
        return option.roadAddr || "";
      } else if ("formatted" in option) {
        return option.formatted || "";
      }
      return "";
    });
  };

  const convertedOptions = getAutocompleteOptions(options);

  const handleChange = (
    event: React.SyntheticEvent,
    selectedFormattedValue: string | null,
  ) => {
    field.onChange(selectedFormattedValue);

    if (selectedFormattedValue === null) {
      onAddressSelect?.(null);
      return;
    }

    const selectedObject = options.find((option) => {
      if (option && "roadAddr" in option) {
        return (option.roadAddr || "") === selectedFormattedValue;
      } else if (option && "formatted" in option) {
        return (option.formatted || "") === selectedFormattedValue;
      }
      return false;
    });

    onAddressSelect?.(selectedObject || null);
  };

  return (
    <Autocomplete
      {...field}
      value={field.value ?? null}
      inputValue={inputValue}
      onInputChange={onInputChange}
      onChange={handleChange}
      onBlur={field.onBlur}
      options={convertedOptions}
      loading={loading}
      loadingText="Searching..."
      noOptionsText={
        inputValue.length < 3
          ? "Type at least 3 characters"
          : "No results found"
      }
      filterOptions={(x) => x}
      size="small"
      disablePortal
      renderInput={(params) => renderAddressInput(params)}
      disabled={disabled}
      slotProps={{
        listbox: {
          sx: {
            maxHeight: "193px",
            overflow: "auto",
          },
        },
      }}
    />
  );
}
