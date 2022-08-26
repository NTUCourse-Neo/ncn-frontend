import { Box, Center } from "@chakra-ui/react";

export default function TestPage() {
  return (
    <Center h="80vh" w="100vw" bg="#fff">
      <Box
        boxShadow={"drop-shadow-2xl"}
        bg="#fff"
        w="50px"
        h="50px"
        borderRadius={"5px"}
      />
    </Center>
  );
}
