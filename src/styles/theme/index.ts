import { extendTheme } from "@chakra-ui/react";
import Button from "@/styles/theme/component/button";

const config = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

const colors = {
  // current dark mode colors
  link: {
    light: "#2B6CB0",
    dark: "#90CDF4",
  },
  heading: {
    light: "#2D3748",
    dark: "#E2E8F0",
  },
  text: {
    light: "#4A5568",
    dark: "#CBD5E0",
  },
  card: {
    light: "#EDF2F7",
    dark: "#131720",
  },
  teal: {
    light: "#81E6D9",
    dark: "#1A202C",
  },
  headerBar: {
    light: "#EDF2F7",
    dark: "#1A202C",
  },
  // new design system colors
  primary: {
    main: "#1C2659",
    200: "#8A94BD",
    300: "#8A94BD",
    400: "#4856A1",
    500: "#4856A1",
    600: "#141D4D",
    700: "#141D4D",
    800: "#02061C",
    900: "#02061C",
  },
  secondary: {
    main: "#FA8236",
    200: "#FFCDAD",
    300: "#FFCDAD",
    400: "#FFA166",
    500: "#FFA166",
    600: "#C95C18",
    700: "#C95C18",
    800: "#9C3C02",
    900: "#9C3C02",
  },
  error: {
    main: "#CE0829",
    200: "#FFB399",
    300: "#FFB399",
    400: "#F56153",
    500: "#F56153",
    600: "#B21927",
    700: "#B21927",
    800: "#750C27",
    900: "#750C27",
  },
  warning: {
    main: "#FFD000",
    200: "#FFF291",
    300: "#FFF291",
    400: "#FFE240",
    500: "#FFE240",
    600: "#BF9F00",
    700: "#BF9F00",
    800: "#756000",
    900: "#756000",
  },
  success: {
    main: "#1CB854",
    200: "#A3F7A9",
    300: "#A3F7A9",
    400: "#4DD470",
    500: "#4DD470",
    600: "#149E53",
    700: "#149E53",
    800: "#086A49",
    900: "#086A49",
  },
  black: {
    core: "#000000",
    900: "#2d2d2d",
    800: "#4B4B4B",
    700: "#6F6F6F",
    600: "#909090",
    500: "#CCCCCC",
    400: "#ECECEC",
    300: "#F2F2F2",
    200: "#F6F6F6",
  },
};

const theme = extendTheme({
  config,
  colors,
  fonts: {
    heading: `'Noto Sans TC', sans-serif`,
    body: `'Noto Sans TC', sans-serif`,
  },
  components: {
    Button,
  },
});

export default theme;
