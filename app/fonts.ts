import localFont from "next/font/local";

export const SequelSansFont = localFont({
  src: [
    {
      path: "../public/font/Sequel Sans Black Body.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/font/Sequel Sans Heavy Body.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/font/Sequel Sans Bold Body.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/font/Sequel Sans Semi Bold Body.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/font/Sequel Sans Medium Body.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/font/Sequel Sans Roman Body.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/font/Sequel Sans Light Body.otf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-sequel-sans",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Roboto",
    "Segoe UI",
    "Ubuntu",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
}); 