import { Button, Center } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

export default function TestPage() {
  return (
    <Center h="80vh" w="100vw">
      <Button
        leftIcon={<AddIcon />}
        rightIcon={<AddIcon />}
        aria-label=""
        colorScheme="primary"
        borderRadius={"full"}
      >
        Small Button
      </Button>
    </Center>
  );
}
