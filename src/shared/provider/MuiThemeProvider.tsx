"use client";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { LicenseInfo } from "@mui/x-license";

import theme from "@/shared/styles/theme";

export default function MuiThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const licenseKey = process.env.NEXT_PUBLIC_MUI_LICENSE_KEY || "";
  LicenseInfo.setLicenseKey(licenseKey);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
