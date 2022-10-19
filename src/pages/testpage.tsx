import { Button, Center } from "@chakra-ui/react";
import useNeoToast from "@/hooks/useNeoToast";

export default function TestPage() {
  const toast = useNeoToast();
  return (
    <Center w="100vw" h="80vh">
      <Center h="80vh" w="10vw" bg="#fff">
        <Button
          onClick={() => {
            toast("remove_course", "title", "desc");
          }}
        >
          123
        </Button>
      </Center>
    </Center>
  );
}
