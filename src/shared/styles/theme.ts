"use client";

import {
  createTheme,
  Theme,
  ThemeOptions,
  TypeText,
} from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    confirm: Palette["primary"];
    cancel: Palette["primary"];
    text: TypeText;
  }

  interface PaletteOptions {
    confirm?: PaletteOptions["primary"];
    cancel?: PaletteOptions["primary"];
    text?: Partial<TypeText>;
  }
}

declare module "@mui/material/Button" {}
// 기본 테마 설정
const defaultOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "rgba(66, 165, 245, 1)",
      light: "rgba(66, 165, 245, 1)",
      dark: "rgba(66, 165, 245, 1)",
      contrastText: "#fff",
    },
    secondary: {
      main: "rgba(158, 158, 158, 1)",
      light: "rgba(158, 158, 158, 1)",
      dark: "rgba(158, 158, 158, 1)",
      contrastText: "#fff",
    },
    confirm: {
      main: "rgba(66, 165, 245, 1)",
      light: "rgba(66, 165, 245, 0.6)",
      dark: "rgba(66, 165, 245, 1)",
      contrastText: "#fff",
    },
    cancel: {
      main: "rgba(0, 0, 0, 0.12)",
      light: "rgba(0, 0, 0, 0.12)",
      dark: "rgba(0, 0, 0, 0.12)",
      contrastText: "rgba(0, 0, 0, 0.38)",
    },
    text: {
      secondary: "rgba(0, 0, 0, 0.60)",
    },
  },
  typography: {
    allVariants: {
      fontFamily: "var(--font-pretendard)",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "outlined" as const,
      },
      styleOverrides: {
        root: ({ ownerState }) => ({
          gap: "4px",
          minHeight: "36px",
          px: "10px",
          py: "7px",
          fontSize: "13px",
          lineHeight: 1,
          textTransform: "none",
          ...(ownerState.variant === "contained" && {
            borderColor: "transparent",
            color: "#fff",
          }),
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&.Mui-disabled": {
              backgroundColor: "rgba(0, 0, 0, 0.12)",
            },
            "&.Mui-disabled .MuiInputBase-input::placeholder": {
              WebkitTextFillColor: "rgba(0, 0, 0, 0.8 )", // disabled 상태에서 placeholder 색상 변경
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        asterisk: {
          color: "rgba(244, 67, 54, 1)",
        },
      },
    },
  },
};

//

// 기본 테마 생성
export const theme = createTheme(defaultOptions as ThemeOptions);

export const HeaderCustomTheme = createTheme({
  ...defaultOptions,
  components: {
    ...defaultOptions.components,
    // 헤더(AppBar) 스타일 적용
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#292929", // 헤더 배경색
          color: "#FFFFFF !important",
          fontSize: "20px",
          fontWeight: "500",
          boxShadow:
            "0px 1px 10px 0px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 2px 4px -1px rgba(0, 0, 0, 0.20);",
          "& .MuiStack-root": {
            display: "flex",
            alignItems: "center",
            "& .MuiSvgIcon-root": {
              color: "#FFFFFF",
            },
          },
          "& .css-yzjoij": {
            height: "auto",
          },
          "& .MuiTypography-root": {
            color: "#FFFFFF",
            fontSize: "20px",
            fontWeight: "500",
          },
        },
      },
    },

    // 네비게이션(Drawer) 스타일 적용
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#292929",
          fontSize: "16px",
          color: "#FFFFFF !important",

          // 상위 메뉴 스타일
          "& .MuiListItem-root": {
            color: "#FFFFFF !important",
          },
          span: {
            color: "#FFFFFF",
          },

          // 하위 메뉴 스타일 (우선순위 문제 해결)
          "& .MuiListItem-button": {
            color: "#FFFFFF !important",
          },

          // 하위 메뉴 active 상태
          "& .Mui-selected, & .Mui-selected:hover": {
            background: "rgba(255, 255, 255, 0.08) !important",
            borderRadius: "4px",
            color: "#FFFFFF",
          },
          "& .Mui-selected span ": {
            color: "#FFFFFF !important",
          },
        },
      },
    },

    MuiListItem: {
      styleOverrides: {
        root: {
          color: "#FFFFFF !important",
          "& svg": {
            color: "#FFFFFF !important",
          },
          "&.Mui-selected, &.Mui-selected:hover": {
            background: "rgba(255, 255, 255, 0.08) !important",
            borderRadius: "4px",
            "& svg": {
              color: "#FFFFFF",
            },
          },
        },
      },
    },
  },
});

// MUI DataGrid 테마 설정
export const MUIDataGridTheme: Theme = createTheme({
  ...defaultOptions,
  components: {
    ...defaultOptions.components,
    MuiDataGrid: {
      defaultProps: { localeText: { noRowsLabel: "No data" } },
      styleOverrides: {
        root: {
          overflow: "hidden",
          borderRadius: 0,
          border: 0,
          outline: "none!important",
          "--unstable_DataGrid-radius:": "0",
          "& *": { outline: "none !important" },
          ".MuiSkeleton-root": {
            height: "56px !important",
          },
          "& .MuiDataGrid-main": {
            ".MuiDataGrid-virtualScroller": {
              ".MuiDataGrid-topContainer": {
                /* HEADERS */
                ".MuiDataGrid-columnHeaders": {
                  "& .MuiDataGrid-columnHeader, & .MuiDataGrid-filler, & .MuiDataGrid-scrollbarFiller":
                    {
                      backgroundColor: "#757575",
                      color: "#ffffff",
                      cursor: "default",
                    },
                  "& .MuiDataGrid-columnHeader": {
                    "& .MuiCheckbox-root, & .Mui-checked, .MuiDataGrid-iconButtonContainer svg":
                      {
                        color: "#fff",
                      },
                  },
                },
                "& .MuiDataGrid-columnHeaders:hover .MuiDataGrid-columnSeparator":
                  { display: "none" },
                ".MuiDataGrid-columnSeparator svg": { display: "none" },
              },
              ".MuiDataGrid-virtualScrollerContent": {
                /* ROWS */
                "& .MuiDataGrid-row.Mui-selected": {
                  backgroundColor: "transparent",
                },
                // "& .MuiDataGrid-row:hover, & .MuiDataGrid-row.Mui-selected:hover":
                //   {
                //     backgroundColor: "transparent",
                //   },
              },
              ".MuiDataGrid-cell": {
                display: "flex",
                alignItems: "center",
                whiteSpace: "normal !important",
                wordWrap: "break-word",
                wordBreak: "break-all",
                overflow: "visible",
                lineHeight: "normal",
              },
              ".MuiDataGrid-cellEmpty": {
                padding: "0px",
              },
            },
          },
        },
      },
    },
  } as ThemeOptions["components"],
});

// MUI DataGrid Order Detail 테마 설정
export const MUIDataGridOrderDetailTheme: Theme = createTheme({
  ...defaultOptions,
  components: {
    ...defaultOptions.components,
    MuiDataGrid: {
      defaultProps: { localeText: { noRowsLabel: "No data" } },
      styleOverrides: {
        root: {
          overflow: "hidden",
          borderRadius: 0,
          border: 0,
          outline: "none!important",
          "--unstable_DataGrid-radius:": "0",
          "& .MuiDataGrid-main": {
            ".MuiDataGrid-virtualScroller": {
              ".MuiDataGrid-topContainer": {
                /* HEADERS */
                ".MuiDataGrid-columnHeaders": {
                  "& .MuiDataGrid-columnHeader, & .MuiDataGrid-filler, & .MuiDataGrid-scrollbarFiller":
                    {
                      backgroundColor: "#757575",
                      color: "#fff",
                      cursor: "default",
                    },
                  "& .MuiDataGrid-columnHeader": {
                    "& .MuiCheckbox-root, & .Mui-checked, .MuiDataGrid-iconButtonContainer svg":
                      {
                        color: "#fff",
                      },
                  },
                  "& .MuiDataGrid-columnHeader:focus .MuiDataGrid-columnSeparator, & .MuiDataGrid-columnHeader--siblingFocused .MuiDataGrid-columnSeparator":
                    {
                      opacity: 1,
                    },
                  "& .MuiDataGrid-columnHeader:focus": {
                    outline: "none !important",
                  },
                },
              },
              ".MuiDataGrid-virtualScrollerContent": {
                /* ROWS */
                "& .MuiDataGrid-row.Mui-selected": {
                  backgroundColor: "transparent",
                },
                "& .MuiDataGrid-row:hover, & .MuiDataGrid-row.Mui-selected:hover":
                  {
                    backgroundColor: "transparent",
                  },
              },
              ".MuiDataGrid-cell": {
                display: "flex",
                alignItems: "center",
                whiteSpace: "normal !important",
                wordWrap: "break-word",
                wordBreak: "break-all",
                overflow: "visible",
                lineHeight: "normal",
              },
              ".MuiDataGrid-cellEmpty": {
                padding: "0px",
              },
            },
          },
        },
      },
    },
  } as ThemeOptions["components"],
});

// MUI DataTable 테마 설정
export const MUIDataTableTheme: Theme = createTheme({
  ...defaultOptions,
  components: {
    ...defaultOptions.components,
    MUIDataTable: {
      defaultProps: { localeText: { noRowsLabel: "No data" } },
      styleOverrides: {
        root: {
          width: "100%",
          height: "100%",
          boxShadow: "none!important",
        },
      },
    },
    MUIDataTableHeadCell: {
      styleOverrides: {
        root: {
          backgroundColor: "#f0f0f0",
          "& > span": {
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          },
          Button: {
            textTransform: "none",
            whiteSpace: "nowrap",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          justifyContent: "center",
          textAlign: "center",
          backgroundColor: "red !important",
        },
      },
    },
  } as ThemeOptions["components"],
});

export default theme;
