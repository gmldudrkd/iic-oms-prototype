import { FormControl } from "@mui/material";
import dayjs from "dayjs";
import { isEqual } from "lodash";
import { Dispatch, SetStateAction } from "react";
import { FieldValues, SubmitHandler, useFormContext } from "react-hook-form";

import OrderAttributeField from "@/features/integrated-order-list/components/OrderAttributeField";
import { PeriodPickerField } from "@/features/integrated-order-list/components/PeriodPickerField";
import { SelectCheckboxField } from "@/features/integrated-order-list/components/SelectCheckboxField";
import {
  GROUPED_STATUS_FILTER_ORDER,
  GROUPED_STATUS_FILTER_SHIPPING,
  GROUPED_STATUS_FILTER_RETURN,
  GROUPED_STATUS_FILTER_EXCHANGE,
  GROUPED_STATUS_FILTER_RESHIPMENT,
  SEARCH_KEY_TYPE_ORDER,
  SEARCH_KEY_TYPE_RETURN,
  SEARCH_KEY_TYPE_EXCHANGE,
  SEARCH_KEY_TYPE_RESHIPMENT,
} from "@/features/integrated-order-list/modules/constants";

import FormActions from "@/shared/components/form-elements/FormActions";
import SelectTextField from "@/shared/components/form-elements/SelectTextField";
import {
  ExchangeSearchRequest,
  ExchangeSearchRequestChannelTypesEnum,
} from "@/shared/generated/oms/types/Exchange";
import {
  OrderSearchRequest,
  OrderSearchRequestChannelTypesEnum,
} from "@/shared/generated/oms/types/Order";
import {
  ReshipmentSearchRequest,
  ReshipmentSearchRequestChannelTypesEnum,
} from "@/shared/generated/oms/types/Reshipment";
import {
  ReturnSearchRequest,
  ReturnSearchRequestChannelTypesEnum,
} from "@/shared/generated/oms/types/Return";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { useUserPermissionStore } from "@/shared/stores/useUserPermissionStore";
import { convertToArray } from "@/shared/utils/stringUtils";

interface SearchFormProps {
  group: "order" | "return" | "exchange" | "reshipment";
  params:
    | OrderSearchRequest
    | ReturnSearchRequest
    | ExchangeSearchRequest
    | ReshipmentSearchRequest;
  setParams: Dispatch<
    SetStateAction<
      | OrderSearchRequest
      | ReturnSearchRequest
      | ExchangeSearchRequest
      | ReshipmentSearchRequest
    >
  >;
  refetch: () => void;
}
export default function SearchForm({
  group,
  params,
  setParams,
  refetch,
}: SearchFormProps) {
  const { handleSubmit, reset, watch, setValue } = useFormContext();
  const { timezone } = useTimezoneStore();

  // 현재 선택된 searchKeyType을 감시
  const currentSearchKeyType = watch("searchKeyType");

  // 멀티라인 필드
  const isMultiLineField =
    currentSearchKeyType === "originOrderNos" ||
    currentSearchKeyType === "shipmentNos" ||
    currentSearchKeyType === "skus" ||
    currentSearchKeyType === "returnNos" ||
    currentSearchKeyType === "exchangeNos" ||
    currentSearchKeyType === "reshipmentNos";

  const getStatusFilter = () => {
    switch (group) {
      case "order":
        return [GROUPED_STATUS_FILTER_ORDER, GROUPED_STATUS_FILTER_SHIPPING];
      case "return":
        return [GROUPED_STATUS_FILTER_RETURN];
      case "exchange":
        return [GROUPED_STATUS_FILTER_EXCHANGE];
      case "reshipment":
        return [GROUPED_STATUS_FILTER_RESHIPMENT];
      default:
        return [GROUPED_STATUS_FILTER_ORDER, GROUPED_STATUS_FILTER_SHIPPING];
    }
  };
  const getSearchKeyType = () => {
    switch (group) {
      case "order":
        return SEARCH_KEY_TYPE_ORDER;
      case "return":
        return SEARCH_KEY_TYPE_RETURN;
      case "exchange":
        return SEARCH_KEY_TYPE_EXCHANGE;
      case "reshipment":
        return SEARCH_KEY_TYPE_RESHIPMENT;
    }
  };

  const statusFilter = getStatusFilter();
  const searchKeyType = getSearchKeyType();
  const { selectedPermission } = useUserPermissionStore();

  const channelTypesList = selectedPermission.flatMap((item) => {
    return item.corporations.flatMap((corp) => {
      return corp.channels.map((channel) => {
        return {
          label: channel.description,
          value: channel.name,
        };
      });
    });
  });

  // 검색 폼 제출 이벤트 핸들러 수정
  const onSubmit = (data: FieldValues) => {
    const searchData = data;
    const {
      searchKeyType,
      searchKeyword,
      statusFilter,
      shippingStatusFilter,
      channelTypes,
      period,
      orderAttributeFilter,
    } = searchData;

    let newParams = {};

    const allChannelTypes = channelTypesList.map((channel) => channel.value) as
      | OrderSearchRequestChannelTypesEnum[]
      | ReturnSearchRequestChannelTypesEnum[]
      | ExchangeSearchRequestChannelTypesEnum[]
      | ReshipmentSearchRequestChannelTypesEnum[];

    if (group === "order") {
      newParams = {
        channelTypes: channelTypes.length > 0 ? channelTypes : allChannelTypes,
        from: dayjs(period?.[0]).tz(timezone).toISOString(),
        to: dayjs(period?.[1]).tz(timezone).toISOString(),
        orderStatuses: statusFilter,
        shipmentStatuses: shippingStatusFilter,
        receiveMethods: orderAttributeFilter.receiveMethods,
        types: orderAttributeFilter.types,
        tags: orderAttributeFilter.tags,
        ordererEmail:
          searchKeyType === "ordererEmail" ? searchKeyword : undefined,
        ordererName:
          searchKeyType === "ordererName" ? searchKeyword : undefined,
        ordererPhone:
          searchKeyType === "ordererPhone" ? searchKeyword : undefined,
        originOrderNos:
          searchKeyType === "originOrderNos"
            ? convertToArray(searchKeyword)
            : undefined,
        shipmentNos:
          searchKeyType === "shipmentNos"
            ? convertToArray(searchKeyword)
            : undefined,
        purchaseNo: searchKeyType === "purchaseNo" ? searchKeyword : undefined,
        skus:
          searchKeyType === "skus" ? convertToArray(searchKeyword) : undefined,
        page: 0,
        size: params.size,
      };
    }

    if (group === "return") {
      newParams = {
        channelTypes: channelTypes.length > 0 ? channelTypes : allChannelTypes,
        from: dayjs(period?.[0]).tz(timezone).toISOString(),
        to: dayjs(period?.[1]).tz(timezone).toISOString(),
        returnStatuses: statusFilter,
        ordererEmail:
          searchKeyType === "ordererEmail" ? searchKeyword : undefined,
        ordererName:
          searchKeyType === "ordererName" ? searchKeyword : undefined,
        ordererPhone:
          searchKeyType === "ordererPhone" ? searchKeyword : undefined,
        originOrderNos:
          searchKeyType === "originOrderNos"
            ? convertToArray(searchKeyword)
            : undefined,
        returnNos:
          searchKeyType === "returnNos"
            ? convertToArray(searchKeyword)
            : undefined,
        purchaseNo: searchKeyType === "purchaseNo" ? searchKeyword : undefined,
        trackingNo: searchKeyType === "trackingNo" ? searchKeyword : undefined,
        page: 0,
        size: params.size,
      };
    }

    if (group === "exchange") {
      newParams = {
        channelTypes: channelTypes.length > 0 ? channelTypes : allChannelTypes,
        from: dayjs(period?.[0]).tz(timezone).toISOString(),
        to: dayjs(period?.[1]).tz(timezone).toISOString(),
        exchangeStatuses: statusFilter,
        ordererEmail:
          searchKeyType === "ordererEmail" ? searchKeyword : undefined,
        ordererName:
          searchKeyType === "ordererName" ? searchKeyword : undefined,
        ordererPhone:
          searchKeyType === "ordererPhone" ? searchKeyword : undefined,
        originOrderNos:
          searchKeyType === "originOrderNos"
            ? convertToArray(searchKeyword)
            : undefined,
        exchangeNos:
          searchKeyType === "exchangeNos"
            ? convertToArray(searchKeyword)
            : undefined,
        purchaseNo: searchKeyType === "purchaseNo" ? searchKeyword : undefined,
        trackingNo: searchKeyType === "trackingNo" ? searchKeyword : undefined,
        page: 0,
        size: params.size,
      };
    }

    if (group === "reshipment") {
      newParams = {
        channelTypes: channelTypes.length > 0 ? channelTypes : allChannelTypes,
        from: dayjs(period?.[0]).tz(timezone).toISOString(),
        to: dayjs(period?.[1]).tz(timezone).toISOString(),
        reshipmentStatuses: statusFilter,
        ordererEmail:
          searchKeyType === "ordererEmail" ? searchKeyword : undefined,
        ordererName:
          searchKeyType === "ordererName" ? searchKeyword : undefined,
        ordererPhone:
          searchKeyType === "ordererPhone" ? searchKeyword : undefined,
        originOrderNos:
          searchKeyType === "originOrderNos"
            ? convertToArray(searchKeyword)
            : undefined,
        reshipmentNos:
          searchKeyType === "reshipmentNos"
            ? convertToArray(searchKeyword)
            : undefined,
        trackingNo: searchKeyType === "trackingNo" ? searchKeyword : undefined,
        page: 0,
        size: params.size,
      };
    }

    if (isEqual(params, newParams)) {
      refetch();
    } else {
      setParams(
        newParams as
          | OrderSearchRequest
          | ReturnSearchRequest
          | ExchangeSearchRequest
          | ReshipmentSearchRequest,
      );
    }
  };

  const onReset = () => {
    reset();
    setValue(
      "channelTypes",
      channelTypesList.map((channel) => channel.value),
    );
  };

  return (
    <form
      className="flex items-start justify-between gap-[16px] py-[24px]"
      onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
    >
      <div className="search-form w-full">
        <div className="flex flex-wrap items-start gap-[16px]">
          {/* 날짜 검색 */}
          <div className="flex w-[260px] items-center gap-[8px]">
            <FormControl fullWidth>
              <PeriodPickerField name="period" />
            </FormControl>
          </div>
          {/* 상태 검색 */}
          <div className="flex w-[260px] items-center gap-[8px]">
            <FormControl fullWidth>
              <SelectCheckboxField
                name="statusFilter"
                labelName={
                  group === "order" ? `Order Status Filter` : `Status Filter`
                }
                selectList={statusFilter[0]}
                selectProps={{ multiple: true }}
              />
            </FormControl>
          </div>
          {group === "order" && (
            <div className="flex w-[260px] items-center gap-[8px]">
              <FormControl fullWidth>
                <SelectCheckboxField
                  name="shippingStatusFilter"
                  labelName="Shipping Status Filter"
                  selectList={statusFilter[1]}
                  selectProps={{ multiple: true }}
                />
              </FormControl>
            </div>
          )}
          {/* 채널 검색 */}
          <div className="flex w-[260px] items-center gap-[8px]">
            <FormControl fullWidth>
              <SelectCheckboxField
                name="channelTypes"
                labelName="Channel Filter"
                selectList={channelTypesList}
                selectProps={{ multiple: true }}
              />
            </FormControl>
          </div>

          {/* Order Attribute Filter */}
          {group === "order" && (
            <div className="flex w-[330px] items-center gap-[8px]">
              <FormControl fullWidth>
                <OrderAttributeField />
              </FormControl>
            </div>
          )}

          {/* 검색 타입 검색 */}
          <div className="flex items-center gap-[8px]">
            <FormControl fullWidth>
              <SelectTextField
                name="searchKeyword"
                selectName="searchKeyType"
                selectList={searchKeyType}
                isMultiLine={isMultiLineField}
              />
            </FormControl>
          </div>
        </div>
      </div>
      <FormActions onReset={onReset} />
    </form>
  );
}
