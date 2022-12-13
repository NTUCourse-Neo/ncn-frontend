import { Flex, Icon, Text } from "@chakra-ui/react";
import { FaCalendarWeek } from "react-icons/fa";
import Link from "next/link";

export default function CourseTableFloatingButton() {
  return (
    <Link href="/user/courseTable">
      <Flex
        as="button"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        position="fixed"
        top="70vh"
        right="0vw"
        zIndex={100}
        bg={"white"}
        border="1px solid #CCCCCC"
        borderRadius={"4px 0px 0px 4px"}
        sx={{
          w: "52px",
          p: "12px 16px",
          gap: "4px",
          filter: "drop-shadow(0px 0px 20.5932px rgba(85, 105, 135, 0.15))",
          cursor: "pointer",
        }}
        _hover={{
          boxShadow: "lg",
          transform: "translateY(-2px) scale(1.02)",
        }}
        transition="all 200ms"
      >
        <Icon as={FaCalendarWeek} boxSize="20px" color={"black"} />
        <Text
          mt={"6px"}
          sx={{
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "1.35",
            color: "#2D2D2D",
            letterSpacing: "0.05em",
          }}
        >
          我的課表
        </Text>
      </Flex>
    </Link>
  );
}
