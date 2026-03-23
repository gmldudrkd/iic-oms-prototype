// check 시 날짜를 무기한으로 설정하는 hook
// 사용 예시
// const { isIndefinite, handleIndefiniteChange } = useIndefiniteDate({
//   onEndDateChange: (date) => {
//     console.log(date);
//   },
// ex) 9999-12-31T23:59:59
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

interface UseIndefiniteDateProps {
  onEndDateChange: (date: Dayjs | null) => void;
}

export const useIndefiniteDate = ({
  onEndDateChange,
}: UseIndefiniteDateProps) => {
  const [isIndefinite, setIsIndefinite] = useState(false);

  const handleIndefiniteChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsIndefinite(event.target.checked);
    if (event.target.checked) {
      const farFutureDate = dayjs("9999-12-31T23:59:59");
      onEndDateChange(farFutureDate);
    } else {
      onEndDateChange(null);
    }
  };

  return {
    isIndefinite,
    handleIndefiniteChange,
  };
};
