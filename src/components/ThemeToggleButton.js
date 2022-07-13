import { motion, AnimatePresence } from "framer-motion";
import { Button, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const ThemeToggleButton = () => {
  const { toggleColorMode } = useColorMode();
  const IconColor = useColorModeValue("orange.600", "purple.500");

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <motion.div
        style={{ display: "inline-block" }}
        key={useColorModeValue("light", "dark")}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <Button
          aria-label="Toggle theme"
          bg={"teal.300"}
          onClick={toggleColorMode}
          _focus={{ border: "none" }}
        >
          {useColorModeValue(
            <SunIcon color={IconColor} />,
            <MoonIcon color={IconColor} />
          )}
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThemeToggleButton;
