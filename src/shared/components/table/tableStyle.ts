import { styled } from "@mui/material/styles";
export const DetailGrid = styled("div")(({ theme: _theme }) => ({
  position: "relative",
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  width: "100%",
  borderBottom: "1px solid rgba(0,0,0,0.12)",
  "&:last-of-type": {
    borderBottom: "0 none",
  },
  "& > div, & .customDiv > div": {
    display: "flex",
    overflow: "hidden",

    "&:nth-of-type(-n+2) > *": {
      borderTop: "0 none",
    },
    "&:nth-of-type(odd) > h3": {
      borderLeft: "0 none",
    },
    "& h3": {
      display: "flex",
      gap: "8px",
      justifyContent: "flex-start",
      alignItems: "center",
      width: "220px",
      padding: "12px 16px",
      background: "rgba(33, 150, 243, 0.08)",
      borderTop: "1px solid #E0E0E0",
      borderLeft: "1px solid #E0E0E0",
      fontWeight: "700",
    },
    "& > div": {
      flex: "1",
      padding: "12px 16px",
      borderTop: "1px solid #E0E0E0",
      borderLeft: "1px solid #E0E0E0",
    },
    "& ul.lang-list": {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      "& li": {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        "& p": {
          width: "40px",
          display: "flex",
          justifyContent: "flex-end",
        },
      },
    },
    "& ul.collection-list": {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      "& li": {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "52px",
      },
    },
    "& .MuiTextField-root": {
      width: "100%",
    },
    "& .MuiFormControlLabel-root": {
      gap: "12px",
      marginLeft: "0",
      marginRight: "0",

      "& .MuiTypography-root": {
        fontSize: "13px",
      },
    },
  },
  "& .customDiv > div": {
    padding: " 0 !important",
    border: "0 !important",
  },
}));

export const DetailGridSingle = styled("div")(({ theme: _theme }) => ({
  position: "relative",
  display: "grid",
  gridTemplateColumns: "1fr",
  width: "100%",
  borderBottom: "1px solid rgba(0,0,0,0.12)",
  "&:last-of-type": {
    borderBottom: "0 none",
  },
  "& .customDiv": {
    borderTop: "1px solid rgba(0,0,0,0.12)",
  },
  "& .customDiv:first-of-type": {
    borderTop: "0 none",
  },
  "& > div, & .customDiv > div": {
    display: "flex",
    overflow: "hidden",

    "&:first-of-type > *": {
      borderTop: "0 none",
    },
    "& h3": {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      width: "220px",
      padding: "12px 16px",
      background: "rgba(33, 150, 243, 0.08)",
      borderTop: "1px solid #E0E0E0",
      borderLeft: "0 none",
      fontSize: "16px",
      fontWeight: "700",
    },

    "& > div": {
      flex: "1",
      padding: "12px 16px",
      borderTop: "1px solid #E0E0E0",
      borderLeft: "1px solid #E0E0E0",
    },
    "& ul.lang-list": {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      "& li": {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        "& p": {
          width: "40px",
          display: "flex",
          justifyContent: "flex-end",
        },
      },
    },
    "& ul.collection-list": {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      "& li": {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "52px",
      },
    },
    "& .MuiFormControlLabel-root": {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: "12px",
      marginLeft: "0",
      marginRight: "0",

      "> .MuiTextField-root": {
        width: "100%",
      },

      "& .MuiTypography-root": {
        fontSize: "13px",
      },
    },
  },
  "& .customDiv > div": {
    padding: "0 !important",
    border: "0 !important",
  },
}));

export const Cell = styled("div")(({ theme: _theme }) => ({
  display: "flex",
  alignItems: "center",
  minHeight: "64px",
}));
