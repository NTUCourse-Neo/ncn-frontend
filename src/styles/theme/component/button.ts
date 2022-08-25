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
    solid: {
      bg: "primary.500",
      color: "white",
      _pressed: {
        bg: "primary.600",
      },
      _hover: {
        bg: "primary.600",
        _disabled: {
          bg: "primary.400",
        },
      },
      _disabled: {
        bg: "primary.400",
      },
    },
    outline: {
      borderColor: "primary.500",
      color: "primary.500",
    },
    soft: {
      border: "none",
      bg: "#96B7FF",
      color: "#0D40C3",
    },
  },
  defaultProps: {},
};

export default button;
