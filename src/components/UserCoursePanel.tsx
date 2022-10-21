import {
  Flex,
  HStack,
  Text,
  Icon,
  Center,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiCalendar, FiHeart } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import type { IconType } from "react-icons";
import { useUser } from "@auth0/nextjs-auth0";
import useNeoLocalStorage from "hooks/useNeoLocalStorage";
import useCourseTable from "@/hooks/useCourseTable";
import useUserInfo from "@/hooks/useUserInfo";
import { Course } from "@/types/course";
import { BsThreeDotsVertical } from "react-icons/bs";
import { parseCourseTimeLocation } from "@/utils/parseCourseSchedule";

interface CourseInfoCardMenuOption {
  chinese: string;
  english: string;
  callback: () => void;
  isRemove?: boolean;
}

interface CourseInfoCardProps {
  readonly course: Course;
  readonly menuOptions: CourseInfoCardMenuOption[];
}
function CourseInfoCard(props: CourseInfoCardProps) {
  const { course, menuOptions } = props;
  const timeLocation = parseCourseTimeLocation(course.schedules);
  return (
    <Flex
      w="100%"
      sx={{
        shadow: "0px 1px 2px rgba(112, 123, 139, 0.25)",
      }}
      flexDirection="column"
      p={4}
      gap={1}
    >
      <Flex w="100%">
        <Flex
          flexGrow={1}
          sx={{
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#333333",
          }}
        >
          {course.name}
        </Flex>
        <Flex>
          <Menu flip={false}>
            <MenuButton>
              <Center
                h="24px"
                w="24px"
                borderRadius={"12px"}
                cursor="pointer"
                sx={{
                  _hover: {
                    bg: "black.300",
                  },
                }}
              >
                <Icon as={BsThreeDotsVertical} boxSize="20px" color={"black"} />
              </Center>
            </MenuButton>
            <MenuList
              minW="0"
              w={"fit-content"}
              sx={{
                shadow:
                  "0px 20px 24px -4px rgba(85, 105, 135, 0.04), 0px 8px 8px -4px rgba(85, 105, 135, 0.02)",
                border: "0.5px solid #6F6F6F",
                borderRadius: "6px",
                p: "8px 24px",
              }}
            >
              {menuOptions.map((option, index) => {
                return (
                  <>
                    {index !== 0 ? <Divider /> : null}
                    <Flex>
                      <MenuItem
                        py="8px"
                        sx={{
                          fontSize: "14px",
                          lineHeight: "1.4",
                          color: option?.isRemove ? "#F56153" : "#4b4b4b",
                        }}
                        transition="all 0.2s ease-in-out"
                      >
                        {option.chinese}
                      </MenuItem>
                    </Flex>
                  </>
                );
              })}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Flex
        sx={{
          fontSize: "12px",
          lineHeight: "1.6",
          color: "#6f6f6f",
        }}
      >
        {course?.teacher}
      </Flex>
      <Flex
        sx={{
          fontSize: "12px",
          lineHeight: "1.6",
          color: "#333333",
        }}
      >
        {timeLocation.map((pair) => pair.time).join(" / ")}
      </Flex>
    </Flex>
  );
}

interface PanelProps {
  readonly layout: string;
  readonly isOpen: boolean;
  readonly title: string;
  readonly onClick: () => void;
  readonly icon: IconType;
  readonly children?: React.ReactNode;
}
function Panel(props: PanelProps) {
  const { layout, isOpen, title, onClick, icon, children = null } = props;
  return (
    <Flex
      bg="white"
      w="100%"
      h={layout === "default" ? "45%" : isOpen ? "90%" : "8%"}
      flexGrow={isOpen ? 1 : 0}
      overflow="hidden"
      justifyContent="start"
      flexDirection={"column"}
      transition="all 0.3s ease-in-out"
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
      <Flex
        bg="white"
        w="100%"
        mt={"8px"}
        flex={"1 1 auto"}
        sx={{
          border: `1px solid ${isOpen ? `#CCCCCC` : `white`}`,
          borderRadius: "4px",
        }}
        overflowY="auto"
        flexDirection={"column"}
        transition="all 0.3s ease-in-out"
      >
        {isOpen ? children : null}
      </Flex>
    </Flex>
  );
}

function UserCoursePanel() {
  const [layout, setLayout] = useState<"default" | "course" | "favorite">(
    "default"
  );
  const { neoLocalCourseTableKey } = useNeoLocalStorage();
  const { user } = useUser();
  const { userInfo } = useUserInfo(user?.sub ?? null);
  const courseTableKey = userInfo
    ? userInfo?.course_tables?.[0] ?? null
    : neoLocalCourseTableKey;
  const { courseTable } = useCourseTable(courseTableKey);

  return (
    <Flex flexDirection={"column"} h="100%" gap={8}>
      <Panel
        layout={layout}
        title={`已加入課程 (${courseTable?.courses.length})`}
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
        {courseTable?.courses.map((course) => (
          <CourseInfoCard
            key={course.id}
            course={course}
            menuOptions={[
              {
                chinese: "查看課程大綱",
                english: "View Course Outline",
                callback: () => {},
              },
              {
                chinese: "移除",
                english: "Remove",
                callback: () => {},
                isRemove: true,
              },
            ]}
          />
        ))}
      </Panel>
      <Panel
        layout={layout}
        title={`我的收藏 (${userInfo?.favorites.length})`}
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
        {userInfo?.favorites.map((course) => (
          <CourseInfoCard
            key={course.id}
            course={course}
            menuOptions={[
              {
                chinese: "查看課程大綱",
                english: "View Course Outline",
                callback: () => {},
              },
              {
                chinese: "加入課表",
                english: "Add to Course Table",
                callback: () => {},
              },
              {
                chinese: "移除",
                english: "Remove",
                callback: () => {},
                isRemove: true,
              },
            ]}
          />
        ))}
      </Panel>
    </Flex>
  );
}

export default UserCoursePanel;
