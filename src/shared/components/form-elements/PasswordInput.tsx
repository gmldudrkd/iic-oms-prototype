"use client";
// 눈 토글 있는 패스워드 인풋

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  FormControl,
  IconButton,
  InputAdornment,
  FormHelperText,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface PasswordInputProps<T extends FieldValues = FieldValues> {
  name: string;
  control: Control<T>;
  error?: string;
  shrink?: boolean;
  label?: string;
  placeholder?: string;
  maxLength?: number;
}

export default function PasswordInput<T extends FieldValues = FieldValues>({
  name,
  control,
  error,
  shrink,
  label,
  placeholder,
  maxLength,
}: PasswordInputProps<T>) {
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

  return (
    <div className="w-full">
      <Controller
        name={name as Path<T>}
        control={control}
        render={({ field }) => (
          <FormControl
            variant="outlined"
            error={!!error}
            sx={{ width: "100%" }}
          >
            <TextField
              variant="outlined"
              error={!!error}
              label={label ?? "Password"}
              placeholder={placeholder}
              slotProps={{
                htmlInput: {
                  maxLength: maxLength,
                  autoComplete: "new-password",
                  name: `export-${name}`,
                },
                inputLabel: { shrink: shrink },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword
                            ? "hide the password"
                            : "display the password"
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              type={showPassword ? "text" : "password"}
              sx={{ width: "100%" }}
              helperText={error}
              {...field}
            />
            {error && <FormHelperText error>{error}</FormHelperText>}
          </FormControl>
        )}
      />
    </div>
  );
}
