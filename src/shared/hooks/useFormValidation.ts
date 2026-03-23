import { useState, useEffect } from "react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";

// 필수 값 체크
// 사용법 : const isFormValid = useFormValidation(methods, fieldRequired);
export function useFormValidation<T extends FieldValues>(
  methods: UseFormReturn<T>,
  requiredFields: readonly string[], // readonly 배열 허용
) {
  const [isFormValid, setIsFormValid] = useState(false);
  const { watch, getValues, trigger } = methods;

  useEffect(() => {
    const validateForm = async () => {
      const values = getValues();
      const isValid = requiredFields.every((field) => !!values[field]);
      setIsFormValid(isValid);

      // 필수 필드 유효성 검사 실행 (비동기 처리)
      await trigger(requiredFields as Path<T>[]);
    };

    const subscription = watch(async () => {
      await validateForm();
    });

    return () => subscription.unsubscribe();
  }, [watch, getValues, requiredFields, trigger]);

  return isFormValid;
}
