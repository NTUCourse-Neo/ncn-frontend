import type { ComponentStyleConfig } from "@chakra-ui/theme";

const radio: ComponentStyleConfig = {
  parts: ["control"],
  baseStyle: ({ colorScheme: c }) => ({
    control: {
      boxSizing: "border-box",
      boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
      borderRadius: "24px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: `#cccccc`,
      _hover: {
        borderColor: `${c}.500`,
        bg: `${c}.200`,
        _disabled: {
          bg: "#cccccc",
          borderColor: "#909090",
          color: "#909090",
        },
      },
      _disabled: {
        bg: "#cccccc",
        borderColor: "#909090",
        color: "#909090",
      },

      _checked: {
        bg: `${c}.200`,
        borderColor: `${c}.600`,
        color: "white",

        // the DOT in the box
        _before: {
          content: `""`,
          display: "inline-block",
          pos: "relative",
          w: "50%",
          h: "50%",
          borderRadius: "50%",
          bg: `${c}.500`,
        },

        _hover: {
          bg: `${c}.200`,
          borderColor: `${c}.800`,
          // the DOT in the box
          _before: {
            content: `""`,
            display: "inline-block",
            pos: "relative",
            w: "50%",
            h: "50%",
            borderRadius: "50%",
            bg: `${c}.600`,
          },
        },

        _disabled: {
          bg: "#cccccc",
          borderColor: "#909090",
          color: "#909090",
          _before: {
            content: `""`,
            display: "inline-block",
            pos: "relative",
            w: "50%",
            h: "50%",
            borderRadius: "50%",
            bg: `#909090`,
          },
        },
      },

      _indeterminate: {
        bg: `${c}.500`,
        borderColor: `${c}.600`,
        color: "white",
        _hover: {
          bg: `${c}.600`,
          borderColor: `${c}.800`,
        },
        _disabled: {
          bg: "#cccccc",
          borderColor: "#909090",
          color: "#909090",
        },
      },

      _focusVisible: {
        boxShadow: "0px 0px 0px 4px #BBF7D0",
      },

      _invalid: {
        borderColor: "red.500",
      },
    },
  }),
  sizes: {},
  variants: {},
  defaultProps: {},
};

export default radio;
