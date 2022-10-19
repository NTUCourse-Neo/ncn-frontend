import { Button, Center } from "@chakra-ui/react";
import useNeoToast from "@/hooks/useNeoToast";

export default function TestPage() {
  const toast = useNeoToast();
  return (
    <Center w="100vw" h="80vh">
      <Center h="80vh" w="10vw" bg="#fff">
        <Button
          onClick={() => {
            toast("add_favorite", "森林生物多樣性哈囉導論", {}, () => {
              console.log("undo");
            });
          }}
        >
          123
        </Button>
        <Button
          onClick={() => {
            toast("remove_favorite", "森林", {}, () => {
              console.log("undo");
            });
          }}
        >
          123
        </Button>
      </Center>
    </Center>
  );
}
