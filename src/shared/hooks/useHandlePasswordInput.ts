import { useState } from "react";

export default function useHandlePasswordInput() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return {
    showPassword,
    handleClickShowPassword,
    handleMouseDownPassword,
    handleMouseUpPassword,
  };
}
