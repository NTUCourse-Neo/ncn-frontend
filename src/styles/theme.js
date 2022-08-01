import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

const colors = {
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
};

const theme = extendTheme({ config, colors });

export default theme;
