// 이 훅은 셀 값을 선택할 수 있는 옵션을 제공합니다.
// 예를 들어, 셀 값이 10이면, 1부터 10까지의 옵션을 제공합니다.
// 옵션을 선택하면, 셀 값이 변경됩니다.

import { GridRenderCellParams } from "@mui/x-data-grid-pro";
import { useState, useEffect, useMemo, useRef } from "react";

// 이벤트 타입 정의
interface ChangeEventType {
  target: {
    value: string | number;
  };
}

// 메뉴 아이템 타입 정의
interface MenuItem {
  key: number;
  value: number;
  label: string;
}

export function useSelectCell(params: GridRenderCellParams) {
  const { value } = params;
  const [localValue, setLocalValue] = useState(value);
  const previousValueRef = useRef(value);
  const [valueChanged, setValueChanged] = useState(false);

  useEffect(() => {
    setLocalValue(value);
    previousValueRef.current = value;
    setValueChanged(false);
  }, [value]);

  const handleChange = (event: ChangeEventType) => {
    const newValue = event.target.value;
    setLocalValue(newValue);
    setValueChanged(previousValueRef.current !== newValue);
  };

  const menuItems = useMemo<MenuItem[]>(() => {
    const numValue = parseInt(String(value), 10);
    const itemCount = !isNaN(numValue) && numValue > 0 ? numValue : 5;

    return Array.from({ length: itemCount }, (_, index) => ({
      key: index + 1,
      value: index + 1,
      label: String(index + 1),
    }));
  }, [value]);

  return {
    localValue,
    handleChange,
    menuItems,
    valueChanged,
    previousValue: previousValueRef.current,
  };
}
