import { ComponentStyleConfig } from "@chakra-ui/react";

const textarea: ComponentStyleConfig = {
  baseStyle: {
    outline: "none",
  },
  sizes: {},
  variants: {
    outline: {
      boxSizing: "border-box",
      borderRadius: "4px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#cccccc",
      color: "#424242",
      textStyle: "body2",

      _placeholder: {
        color: "#909090",
      },
      _hover: {
        borderColor: "#0D40C3",
      },
      _focusVisible: {
        shadow: "none",
        borderColor: "#96B7FF",
        borderWidth: "3px",
      },

      _disabled: {
        bg: "#f2f2f2",
        border: "3px solid #CCCCCC",
        color: "#909090",
        opacity: 1,
      },
    },
  },
  defaultProps: {},
};

export default textarea;
