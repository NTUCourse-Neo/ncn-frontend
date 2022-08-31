import { extendTheme } from "@chakra-ui/react";
import Button from "@/styles/theme/component/button";
import Tag from "@/styles/theme/component/tag";
import Checkbox from "@/styles/theme/component/checkbox";
import Radio from "@/styles/theme/component/radio";
import Switch from "@/styles/theme/component/switch";
import Input from "@/styles/theme/component/input";
import Textarea from "@/styles/theme/component/textarea";
import textStyles from "@/styles/theme/textStyle";
import shadows from "@/styles/theme/shadows";

const config = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

const breakpoints = {
  sm: "30em",
  md: "48em",
  lg: "64em",
  xl: "80em",
  "2xl": "96em",
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
    main: "#0D40C3",
    200: "#96B7FF",
    300: "#96B7FF",
    400: "#4681FF",
    500: "#0D40C3",
    600: "#002F94",
    700: "#002F94",
    800: "#081D59",
    900: "#081D59",
  },
  secondary: {
    main: "#FFB300",
    200: "#FFE199",
    300: "#FFE199",
    400: "#FFCA4D",
    500: "#FFB300",
    600: "#D69600",
    700: "#D69600",
    800: "#875F00",
    900: "#875F00",
  },
  error: {
    main: "#CE0829",
    200: "#FFB399",
    300: "#FFB399",
    400: "#F56153",
    500: "#CE0829",
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
    500: "#FFD000",
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
    500: "#1CB854",
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
  breakpoints,
  textStyles,
  shadows,
  fonts: {
    heading: `'Noto Sans TC', sans-serif`,
    body: `'Noto Sans TC', sans-serif`,
  },
  components: {
    Button,
    Tag,
    Checkbox,
    Radio,
    Switch,
    Input,
    Textarea,
  },
});

export default theme;
