import { Flex, HStack, Text, Icon, Center } from "@chakra-ui/react";
import { useState } from "react";
import { FiCalendar, FiHeart } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import type { IconType } from "react-icons";

interface PanelProps {
  layout: string;
  isOpen: boolean;
  title: string;
  onClick: () => void;
  icon: IconType;
  children?: React.ReactNode;
}
function Panel(props: PanelProps) {
  const { layout, isOpen, title, onClick, icon, children = null } = props;
  return (
    <Flex
      bg="white"
      w="100%"
      h={layout === "default" ? "45%" : "auto"}
      flexGrow={isOpen ? 1 : 0}
      justifyContent="start"
      flexDirection={"column"}
      transition="all 0.2s ease-in-out"
    >
      <Flex
        sx={{
          border: isOpen ? "1px solid white" : "1px solid #CCCCCC",
          p: "0px 8px",
          borderRadius: "4px",
          fontWeight: 500,
          fontSize: "16px",
          lineHeight: "44px",
          color: "#484848",
        }}
        justifyContent={"space-between"}
        alignItems={"center"}
        onClick={onClick}
        cursor="pointer"
      >
        <HStack alignItems={"center"}>
          <Center h="100%">
            <Icon as={icon} boxSize="22px" color={"black"} />
          </Center>
          <Text>{title}</Text>
        </HStack>
        <Icon
          as={FaChevronDown}
          transform={isOpen ? "rotate(180deg)" : ""}
          transition="all ease-in-out 0.4s"
        />
      </Flex>
      {isOpen ? (
        <Flex
          bg="white"
          w="100%"
          mt={"8px"}
          flex={"1 1 auto"}
          sx={{
            border: "1px solid #CCCCCC",
            borderRadius: "4px",
          }}
          overflowY="auto"
          flexDirection={"column"}
          transition="all 0.2s ease-in-out"
        >
          {children}
        </Flex>
      ) : null}
    </Flex>
  );
}

function UserCoursePanel() {
  const [layout, setLayout] = useState<"default" | "course" | "favorite">(
    "default"
  );
  return (
    <Flex flexDirection={"column"} h="100%" gap={8}>
      <Panel
        layout={layout}
        title="已加入課程"
        icon={FiCalendar}
        isOpen={layout === "default" || layout === "course"}
        onClick={() => {
          if (layout === "default") {
            setLayout("favorite");
          } else {
            setLayout("default");
          }
        }}
      >
        {Array.from({ length: 20 }).map((_, index) => (
          <Flex w="100%" key={index}>
            {index}
          </Flex>
        ))}
      </Panel>
      <Panel
        layout={layout}
        title="我的收藏"
        icon={FiHeart}
        isOpen={layout === "default" || layout === "favorite"}
        onClick={() => {
          if (layout === "default") {
            setLayout("course");
          } else {
            setLayout("default");
          }
        }}
      >
        {Array.from({ length: 20 }).map((_, index) => (
          <Flex w="100%" key={index}>
            {index}
          </Flex>
        ))}
      </Panel>
    </Flex>
  );
}

export default UserCoursePanel;
