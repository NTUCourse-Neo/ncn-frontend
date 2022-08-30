import type { ComponentStyleConfig } from "@chakra-ui/theme";

const Switch: ComponentStyleConfig = {
  parts: ["track", "container"],
  baseStyle: ({ colorScheme: c }) => ({
    track: {
      borderWidth: "1px",
      borderColor: "transparent",
      _hover: {
        borderColor: `${c}.600`,
      },
      _focusVisible: {
        borderColor: `#B6ABED`,
      },
      _disabled: {
        bg: "#909090",
        opacity: 1,
        _hover: {
          borderColor: "transparent",
        },
      },

      _checked: {
        _hover: {
          bg: `${c}.600`,
        },
        _disabled: {
          bg: "#909090",
          opacity: 1,
          _hover: {
            borderColor: "transparent",
          },
        },
      },
    },
  }),
  sizes: {},
  variants: {},
  defaultProps: {},
};

export default Switch;
