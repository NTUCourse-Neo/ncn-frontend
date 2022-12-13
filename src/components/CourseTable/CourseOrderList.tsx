import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

const tabs = [
  {
    id: "Common",
    label: "一般科目",
  },
  {
    id: "Chinese",
    label: "國文",
  },
  {
    id: "ForeignLanguage",
    label: "英外文",
  },
  {
    id: "Calculus",
    label: "微積分",
  },
] as const;
type CourseOrderListTabId = typeof tabs[number]["id"];

export default function CourseOrderList() {
  const [activeTabId, setActiveTabId] = useState<CourseOrderListTabId>(
    tabs[0].id
  );

  return (
    <Flex w="100%" h="70vh" flexDirection={"column"}>
      <Flex
        h="44px"
        pl={4}
        alignItems="center"
        shadow="0px 20px 24px -4px rgba(85, 105, 135, 0.04), 0px 8px 8px -4px rgba(85, 105, 135, 0.02)"
      >
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id;
          return (
            <Flex
              key={tab.id}
              mx={6}
              h="100%"
              alignItems={"center"}
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: 1.4,
                color: isActive ? "#2d2d2d" : "#2d2d2d50",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                borderTop: "2px solid transparent",
                borderBottom: isActive
                  ? "2px solid #1A181C"
                  : "2px solid transparent",
              }}
              onClick={() => {
                setActiveTabId(tab.id);
              }}
            >
              {tab.label}
            </Flex>
          );
        })}
      </Flex>
      <Flex flexGrow={1}>666</Flex>
      <Flex
        h="56px"
        shadow="0px -0.5px 0px #909090"
        alignItems="center"
        justifyContent={"space-between"}
        p="10px 32px"
      >
        <Flex></Flex>
        <Flex gap="28px">
          <Button
            variant={"unstyled"}
            sx={{
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: 1.4,
              h: "36px",
            }}
          >
            還原此次變更
          </Button>
          <Button
            sx={{
              borderRadius: "full",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: 1.4,
              shadow: "0px 1px 2px rgba(105, 81, 255, 0.05)",
              p: "8px 16px",
              h: "36px",
            }}
          >
            儲存
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
