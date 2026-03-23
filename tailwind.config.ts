const config: {
  theme: {
    extend: {
      fontFamily: { [key: string]: string[] };
      colors: { [key: string]: string };
      keyframes: {
        [key: string]: { [key: string]: { [key: string]: string } };
      };
      animation: { [key: string]: string };
    };
    screens: {
      tablet: { raw: string };
      smartphone: { raw: string };
      desktop: { raw: string };
      wide: { raw: string };
      mobile: { raw: string };
    };
  };
  content: string[];
  safelist: string[];
} = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    screens: {
      smartphone: { raw: "(max-width: 767px)" },
      tablet: { raw: "(min-width: 768px) and (max-width: 1023px)" },
      mobile: { raw: "(max-width: 1023px)" },
      desktop: { raw: "(min-width: 1024px)" },
      wide: { raw: "(min-width: 1921px)" },
    },
    extend: {
      colors: {
        default: "var(--color-default)",
        "light-black": "var(--color-light-black)",
        primary: "var(--color-primary)",
        "primary-dark": "var(--color-primary-dark)",
        "nav-selected": "var(--color-nav-selected)",
        "cell-selected": "var(--color-cell-selected)",
        "cell-error": "var(--color-cell-error)",
        "image-error": "var(--color-image-error)",
        error: "var(--color-error)",
        "error-light": "var(--color-error-light)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-disabled": "var(--color-text-disabled)",
        order: "var(--color-order)",
        "order-opacity": "var(--color-order-opacity)",
        return: "var(--color-return)",
        "return-opacity": "var(--color-return-opacity)",
        exchange: "var(--color-exchange)",
        "exchange-opacity": "var(--color-exchange-opacity)",
        outlined: "var(--color-outlined)",
      },
      fontFamily: {
        gm: ["var(--font-gm-serif)"],
        pretendard: ["var(--font-pretendard)"],
      },
      keyframes: {
        "loading-dots": {
          "0%": { opacity: "0.2" },
          "20%": { opacity: "1" },
          "100%": { opacity: "0.2" },
        },
      },
      animation: {
        "loading-dots": "loading-dots 1.4s ease-in-out infinite",
      },
    },
  },
  safelist: [
    "border-b-order",
    "border-b-return",
    "border-b-exchange",
    "bg-order-opacity",
    "bg-return-opacity",
    "bg-exchange-opacity",
    "text-order",
    "text-return",
    "text-exchange",
  ],
};
export default config;
