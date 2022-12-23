import type { ComponentStyleConfig } from "@chakra-ui/theme";
import { getToken } from "@chakra-ui/react";

const button: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: 400,
    borderRadius: "6px",
    py: 2,
    px: 4,
  },
  sizes: {},
  variants: {
    solid: ({ colorScheme: c }) => ({
      boxSizing: "border-box",
      bg: `${c}.500`,
      color: "white",
      _focus: {
        borderColor: `${c}.200`,
      },
      _active: {
        opacity: 0.8,
        _disabled: {
          opacity: 1,
        },
      },
      _hover: {
        bg: `${c}.600`,
        _disabled: {
          bg: `${c}.400`,
          color: "#ffffff56",
        },
      },
      _disabled: {
        bg: `${c}.400`,
        color: "#ffffff56",
        opacity: 1,
      },
    }),
    outline: ({ colorScheme: c, theme }) => {
      const themeDict = getToken<string>("colors", `${c}.500`);
      return {
        boxSizing: "border-box",
        borderColor: `${c}.500`,
        color: `${c}.500`,
        _active: {
          opacity: 0.8,
          _disabled: {
            opacity: 1,
          },
        },
        _focus: {
          bg: `${c}.400`,
          color: "white",
        },
        _hover: {
          borderWidth: "2px",
          _disabled: {
            borderWidth: "1px",
            color: `${themeDict(theme)}56`,
            opacity: 1,
          },
        },
        _disabled: {
          color: `${themeDict(theme)}56`,
          opacity: 1,
        },
      };
    },
    soft: ({ colorScheme: c }) => ({
      border: "none",
      bg: `${c}.200`,
      color: `${c}.500`,
    }),
  },
  defaultProps: {
    colorScheme: "primary",
    variant: "solid",
  },
};

export default button;
