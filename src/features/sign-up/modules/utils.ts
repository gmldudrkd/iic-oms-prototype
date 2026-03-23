// 패스워드 유효성 검사 함수
export const validatePassword = (password: string): string | true => {
  // 8자리 이상 검사
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  // 영문, 숫자, 특수문자 포함 여부 검사
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(
    password,
  );

  if (!hasLetter || !hasNumber || !hasSpecialChar) {
    return "Password must include letters, numbers, and special characters.";
  }

  return true;
};
