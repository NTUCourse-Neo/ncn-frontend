import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Icon,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const ThemeToggleButton = () => {
  const { toggleColorMode } = useColorMode();
  const IconColor = useColorModeValue("orange.600", "purple.700");

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <motion.div
        style={{ display: "inline-block" }}
        key={useColorModeValue("light", "dark")}
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <Button
          aria-label="Toggle theme"
          variant="ghost"
          onClick={toggleColorMode}
          w="5"
          mx={{ base: 2, md: 1 }}
          _focus={{ border: "none" }}
        >
          {useColorModeValue(
            <Icon as={SunIcon} color={IconColor} boxSize="5" />,
            <Icon as={MoonIcon} color={IconColor} boxSize="5" />
          )}
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThemeToggleButton;
