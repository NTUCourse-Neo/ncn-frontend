import { Flex, HStack, Text, Icon, Center } from "@chakra-ui/react";
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

interface CourseInfoCardProps {
  readonly course: Course;
}
function CourseInfoCard(props: CourseInfoCardProps) {
  const { course } = props;
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
      h={layout === "default" ? "45%" : "auto"}
      flexGrow={isOpen ? 1 : 0}
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
          transition="all 0.3s ease-in-out"
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
          <CourseInfoCard key={course.id} course={course} />
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
          <CourseInfoCard key={course.id} course={course} />
        ))}
      </Panel>
    </Flex>
  );
}

export default UserCoursePanel;
