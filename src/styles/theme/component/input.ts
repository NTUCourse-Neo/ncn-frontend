import { ComponentStyleConfig } from "@chakra-ui/react";

const input: ComponentStyleConfig = {
  parts: ["field", "addon"],
  baseStyle: ({ colorScheme: c }) => ({
    field: {},
  }),
  sizes: {},
  variants: {
    outline: ({ colorScheme: c }) => ({
      field: {
        py: "10px",
        boxSizing: "border-box",
        borderRadius: "8px",
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
        border: "1px solid",
        borderColor: "#cccccc",
        bg: "inherit",
        color: "#2d2d2d",
        _placeholder: {
          color: "#909090",
        },
        _hover: {
          borderColor: "#909090",
        },
        _focusVisible: {
          zIndex: 1,
          borderColor: "#0D40C3",
          boxShadow: `outline`,
        },
        _disabled: {
          bg: "#F2F2F2",
          borderColor: "#cccccc",
          color: "#909090",
          opacity: 1,
        },

        _invalid: {
          borderColor: "#F56153",
          boxShadow: `0px 1px 2px rgba(0, 0, 0, 0.05)`,
          _focusVisible: {
            zIndex: 1,
            borderColor: "#F56153",
            boxShadow: `0px 0px 0px 4px #FDEEEC`,
          },
          _disabled: {
            bg: "#F2F2F2",
            borderColor: "#cccccc",
            color: "#909090",
            opacity: 1,
          },
        },
      },
    }),
  },
  defaultProps: {},
};

export default input;
