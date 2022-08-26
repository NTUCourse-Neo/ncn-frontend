import type { ComponentStyleConfig } from "@chakra-ui/theme";

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
      bg: `${c}.500`,
      color: "white",
      _focus: {
        borderColor: `${c}.200`,
      },
      _pressed: {
        bg: `${c}.600`,
      },
      _hover: {
        bg: `${c}.600`,
        _disabled: {
          bg: `${c}.400`,
        },
      },
      _disabled: {
        bg: `${c}.400`,
        opacity: 1,
      },
    }),
    outline: ({ colorScheme: c }) => ({
      borderColor: `${c}.500`,
      color: `${c}.500`,
    }),
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
