import { Center } from "@chakra-ui/react";
import PaginationButton from "@/components/PaginationButton";

export default function TestPage() {
  return (
    <Center w="100vw" h="80vh">
      <Center h="80vh" w="10vw" bg="#fff">
        <PaginationButton
          numberOfPages={10}
          onClick={(page) => {
            console.log(`Page ${page} !`);
          }}
        />
      </Center>
    </Center>
  );
}
