import type { ComponentStyleConfig } from "@chakra-ui/theme";

const tag: ComponentStyleConfig = {
  parts: ["container", "label"],
  baseStyle: {
    container: {
      borderRadius: "full",
      justifyContent: "center",
      alignItems: "center",
    },
    label: {
      textStyle: "caption1",
    },
  },
  sizes: {
    sm: {
      container: {
        py: 0.5,
        px: 2,
      },
    },
    md: {
      container: {
        py: 0.75,
        px: 2.5,
      },
    },
    lg: {
      container: {
        py: 1.25,
        px: 3,
      },
    },
  },
  variants: {
    solid: ({ colorScheme: c }) => ({
      container: {
        boxSizing: "border-box",
      },
    }),
  },
  defaultProps: {
    size: "md",
    variant: "solid",
    colorScheme: "primary",
  },
};

export default tag;
