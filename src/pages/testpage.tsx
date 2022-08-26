import { Button, Text, Center } from "@chakra-ui/react";

export default function TestPage() {
  return (
    <Center h="80vh" w="100vw">
      <Button>
        <Text textStyle={"subtitle"}>Hello world</Text>
      </Button>
    </Center>
  );
}
