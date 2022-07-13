import { Flex, Text, Image, HStack, Button } from "@chakra-ui/react";
import { FaHeartbeat } from "react-icons/fa";
import Link from "next/link";

export default function ErrorPage() {
  const handleOpenPage = (page) => {
    window.open(page, "_blank");
  };
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyItems="center"
      maxW={{ base: "100vw", md: "80vw", lg: "70vw" }}
      mx="auto"
      overflow="visible"
      p="64px"
    >
      <Image alt="" mt="5vh" src={`https://http.cat/404`} />
      <Text fontSize="4xl" color="gray.500" mt="2vh">
        Oops, something went wrong 😥
      </Text>
      <Flex direction={"column"}>
        <Text fontSize="xl" color="gray.500" fontWeight={500}>
          1. Try to login again
          <Link href={"/api/auth/login"}>
            <a> ➡️ </a>
          </Link>
        </Text>
        <Text fontSize="xl" color="gray.500">
          2. If it doesn't help, report issue
        </Text>
      </Flex>
      <HStack spacing={2} mt="4">
        <Button
          variant="solid"
          onClick={() => handleOpenPage("https://www.surveycake.com/s/LzWd6")}
        >
          點我回報問題 🥺
        </Button>
        <Button
          variant="solid"
          colorScheme="teal"
          leftIcon={<FaHeartbeat />}
          onClick={() => handleOpenPage("https://status.course.myntu.me/")}
        >
          服務狀態
        </Button>
      </HStack>
    </Flex>
  );
}
