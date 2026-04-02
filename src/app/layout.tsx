"use client";

import { ReactNode, useEffect } from "react";

import MuiThemeProvider from "@/shared/provider/MuiThemeProvider";
import NextAuthProvider from "@/shared/provider/NextAuthProvider";
import SnackBarProvider from "@/shared/provider/SnackBarProvider";
import TanstackQueryProvider from "@/shared/provider/TanstackQueryProvider";
import "@/shared/styles/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
    document.title = environment
      ? `IIC OMS | ${environment.toUpperCase()}`
      : "IIC OMS";
  }, []);

  return (
    <html lang="en">
      <head>
        <script
          src="https://cdn.jsdelivr.net/npm/agentation@latest/dist/browser.js"
          defer
        />
      </head>
      <body>
        {/* auth */}
        <NextAuthProvider>
          <TanstackQueryProvider>
            <MuiThemeProvider>
              <SnackBarProvider>{children}</SnackBarProvider>
            </MuiThemeProvider>
          </TanstackQueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
