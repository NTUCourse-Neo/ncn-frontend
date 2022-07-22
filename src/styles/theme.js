import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

const colors = {
  link: {
    light: "#2B6CB0",
    dark: "#2B6CB0",
  },
  heading: {
    light: "#2D3748",
    dark: "#CBD5E0",
  },
  text: {
    light: "#4A5568",
    dark: "#A0AEC0",
  },
  card: {
    light: "#EDF2F7",
    dark: "#4A5568",
  },
};

const theme = extendTheme({ config, colors });

export default theme;
