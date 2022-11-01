const customScrollBarCss = {
  "&::-webkit-scrollbar": {
    w: "15px",
  },
  "&::-webkit-scrollbar-track": {
    bg: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: `#909090`,
    border: "4px solid transparent",
    backgroundClip: "padding-box",
    borderRadius: "9999px",
  },
};

const generateScrollBarCss = (bg: string, thumbColor: string) => {
  return {
    "&::-webkit-scrollbar": {
      w: "15px",
    },
    "&::-webkit-scrollbar-track": {
      bg,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: thumbColor,
      border: `4px solid ${bg}`,
      backgroundClip: "padding-box",
      borderRadius: "9999px",
    },
  };
};

export { customScrollBarCss, generateScrollBarCss };
