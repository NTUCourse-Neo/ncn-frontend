import {
  Flex,
  Text,
  Image,
  HStack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaHeartbeat, FaSignInAlt } from "react-icons/fa";
import Link from "next/link";
import { reportEvent } from "utils/ga";

export default function ErrorPage() {
  const handleOpenPage = (page: string) => {
    window.open(page, "_blank");
  };
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyItems="center"
      w="100%"
      minH="95vh"
      overflow="visible"
      px={{ base: "2vw", md: "10vw", lg: "15vw" }}
      py="64px"
      bg={useColorModeValue("white", "black")}
    >
      <Image
        w="80%"
        alt=""
        mt="5vh"
        src={`img/not_found.svg`}
        pointerEvents="none"
      />
      <Text fontSize="4xl" color="gray.500" m="2vh">
        有東西出錯了 😥
      </Text>
      <Flex direction={"column"} alignItems={"center"}>
        <HStack spacing={2} wrap="wrap">
          <Text fontSize="xl" color="gray.500" fontWeight={500}>
            請嘗試重新
          </Text>
          <Link href={"/api/auth/login"}>
            <Button size="xs" colorScheme="blue" leftIcon={<FaSignInAlt />}>
              登入
            </Button>
          </Link>
        </HStack>
        <Text fontSize="xl" color="gray.500">
          若狀況仍未解決，請回報此問題。
        </Text>
      </Flex>
      <HStack spacing={2} mt="4">
        <Button
          variant="outline"
          onClick={() => {
            handleOpenPage(
              "https://github.com/NTUCourse-Neo/ncn-frontend/issues/new?assignees=&labels=bug&template=bug_report.md&title="
            );
            reportEvent("404", "click", "report_bug");
          }}
          colorScheme="teal"
        >
          回報問題
        </Button>
        <Button
          variant="solid"
          colorScheme="teal"
          leftIcon={<FaHeartbeat />}
          onClick={() => {
            handleOpenPage("https://status.course.myntu.me/");
            reportEvent("404", "click", "view_status");
          }}
        >
          服務狀態
        </Button>
      </HStack>
    </Flex>
  );
}
