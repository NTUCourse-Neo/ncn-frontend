import { useState, useMemo, forwardRef } from "react";
import {
  Box,
  Flex,
  Heading,
  Badge,
  Spacer,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Button,
  Tooltip,
  useToast,
  Text,
  HStack,
  ButtonGroup,
  useColorModeValue,
  Icon,
  BoxProps,
  Center,
} from "@chakra-ui/react";
import { FaPlus, FaHeart, FaRegHeart } from "react-icons/fa";
import { info_view_map } from "data/mapping_table";
import openPage from "utils/openPage";
import { getNolAddUrl } from "utils/getNolUrls";
import useCourseTable from "hooks/useCourseTable";
import useNeoLocalStorage from "hooks/useNeoLocalStorage";
import { useUser } from "@auth0/nextjs-auth0";
import { parseCourseTimeLocation } from "utils/parseCourseSchedule";
import useUserInfo from "hooks/useUserInfo";
import { reportEvent } from "utils/ga";
import type { Course } from "types/course";

function DeptBadge({ course }: { readonly course: Course }) {
  if (course.departments.length === 0) {
    return null;
  }
  const dept_str = course.departments.map((d) => d.name_full).join(", ");
  const isMultipleDepts = course.departments.length > 1;
  const badgeContent = (
    <Badge
      bg="#ececec"
      color="#4B4B4B"
      variant="solid"
      maxWidth={"125px"}
      noOfLines={1}
    >
      <Text
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {isMultipleDepts
          ? "多個系所"
          : course?.departments?.[0]?.name_full ?? ""}
      </Text>
    </Badge>
  );
  return isMultipleDepts ? (
    <Tooltip
      hasArrow
      placement="top"
      label={dept_str}
      bg="gray.600"
      color="white"
    >
      {badgeContent}
    </Tooltip>
  ) : (
    badgeContent
  );
}

const CustomTag = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { children, ...restProps } = props;
  return (
    <Box
      ref={ref}
      sx={{
        border: "0.4px solid #4B4B4B",
        borderRadius: "2px",
      }}
      justifyContent="center"
      alignItems="center"
      padding={"2px 8px"}
      boxSizing="border-box"
      {...restProps}
    >
      <Text
        sx={{
          color: "#4b4b4b",
          fontSize: "12px",
          lineHeight: "1.4",
          fontWeight: 400,
        }}
        noOfLines={1}
        minW="25px"
        align={"start"}
      >
        {children}
      </Text>
    </Box>
  );
});
CustomTag.displayName = "CustomTag";

function DrawerDataTag({
  fieldName,
  label,
}: {
  readonly fieldName: string;
  readonly label: string;
}) {
  if (label === "") {
    return null;
  }
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="start"
      mr="4"
      minW="10vw"
    >
      <Badge variant="solid" colorScheme="gray">
        {fieldName}
      </Badge>
      <Heading as="h3" color={"text.light"} fontSize="sm" ml="4px">
        {label}
      </Heading>
    </Flex>
  );
}

function CourseDrawerContainer({
  courseInfo,
}: {
  readonly courseInfo: Course;
}) {
  return (
    <Flex
      px="1"
      flexDirection="column"
      width="100%"
      alignItems="start"
      justifyContent="space-between"
    >
      <Flex
        ml="2px"
        flexDirection="row"
        alignItems="center"
        justifyContent="start"
        flexWrap="wrap"
        css={{ gap: ".5rem" }}
      >
        <DrawerDataTag fieldName={"課程識別碼"} label={courseInfo.identifier} />
        <DrawerDataTag fieldName={"課號"} label={courseInfo.code} />
        <DrawerDataTag fieldName={"班次"} label={courseInfo?.class ?? "未知"} />
        <DrawerDataTag
          fieldName={info_view_map.enroll_method.name}
          label={info_view_map.enroll_method.map[courseInfo.enroll_method]}
        />
        <DrawerDataTag
          fieldName={info_view_map.language.name}
          label={info_view_map.language.map[courseInfo.language]}
        />
        <DrawerDataTag
          fieldName={"開課單位"}
          label={courseInfo.provider.toUpperCase()}
        />
      </Flex>
      <Spacer my="2" />
      <Flex
        w="100%"
        flexDirection="row"
        alignItems="start"
        justifyContent="start"
        borderRadius="md"
        border="2px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        flexWrap="wrap"
        css={{ gap: "4px" }}
      >
        <Flex
          w={{ base: "100%", md: "30%" }}
          flexDirection="column"
          alignItems="start"
          justifyContent="start"
          p="2"
        >
          <Heading
            as="h3"
            color={useColorModeValue("heading.light", "heading.dark")}
            fontSize="lg"
            ml="4px"
            mb="1"
          >
            修課限制
          </Heading>
          <Text
            fontSize="sm"
            color={useColorModeValue("text.light", "text.dark")}
            mx="4px"
          >
            {courseInfo?.limitation ?? "無"}
          </Text>
        </Flex>
        <Flex
          w={{ base: "100%", md: "60%" }}
          flexDirection="column"
          alignItems="start"
          justifyContent="start"
          p="2"
        >
          <Heading
            as="h3"
            color={useColorModeValue("heading.light", "heading.dark")}
            fontSize="lg"
            ml="4px"
            mb="1"
          >
            備註
          </Heading>
          <Text
            fontSize="sm"
            color={useColorModeValue("text.light", "text.dark")}
            mx="4px"
          >
            {courseInfo?.note || "無"}
          </Text>
        </Flex>
      </Flex>
      <Spacer my="2" />
      <Flex
        w="100%"
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "start", md: "center" }}
        justifyContent={{ base: "start", md: "space-between" }}
        flexWrap="wrap"
        css={{ gap: "2px" }}
      >
        <ButtonGroup size="sm" isAttached variant="outline" colorScheme="blue">
          {courseInfo?.cool_url ? (
            <Button
              size="sm"
              mr="-px"
              onClick={() => {
                if (courseInfo?.cool_url) {
                  openPage(courseInfo.cool_url);
                }
                reportEvent("course_info_row", "go_to_cool", courseInfo.id);
              }}
            >
              {"NTU COOL"}
            </Button>
          ) : null}
        </ButtonGroup>
        <ButtonGroup>
          <Button
            variant="ghost"
            colorScheme="blue"
            leftIcon={<FaPlus />}
            size="sm"
            onClick={() => {
              openPage(getNolAddUrl(courseInfo), true);
              reportEvent("course_info_row", "add_to_nol", courseInfo.id);
            }}
          >
            加入課程網
          </Button>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
}

export interface CourseInfoRowProps {
  readonly courseInfo: Course;
  readonly selected: boolean;
  readonly displayTable: boolean;
}
function CourseInfoRow({
  courseInfo,
  selected,
  displayTable,
}: CourseInfoRowProps) {
  const toast = useToast();

  const { neoLocalCourseTableKey } = useNeoLocalStorage();
  const { user } = useUser();
  const { userInfo, addOrRemoveFavorite, isLoading } = useUserInfo(
    user?.sub ?? null
  );
  const courseTableKey = userInfo
    ? userInfo?.course_tables?.[0] ?? null
    : neoLocalCourseTableKey;
  const {
    courseTable,
    isLoading: isCourseTableLoading,
    addOrRemoveCourse,
  } = useCourseTable(courseTableKey);

  const [addingCourse, setAddingCourse] = useState(false);
  const [addingFavoriteCourse, setAddingFavoriteCourse] = useState(false);
  const isFavorite = useMemo(
    () => (userInfo?.favorites ?? []).map((c) => c.id).includes(courseInfo.id),
    [userInfo, courseInfo.id]
  );

  const addCourseToTable = async (course: Course) => {
    if (!isLoading && !isCourseTableLoading) {
      setAddingCourse(true);
      if (courseTableKey && courseTable) {
        await addOrRemoveCourse(course);
      } else {
        // do not have course table id in local storage
        toast({
          title: `新增 ${course.name} 失敗`,
          description: `尚未建立課表`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setAddingCourse(false);
    }
  };

  const handleAddFavorite = async (course_id: string) => {
    if (!isLoading) {
      if (userInfo) {
        setAddingFavoriteCourse(true);
        await addOrRemoveFavorite(course_id);
        setAddingFavoriteCourse(false);
      } else {
        toast({
          title: `請先登入`,
          // description: `請先登入`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // data pieces
  const courseSerial = courseInfo.serial;
  const courseName = courseInfo.name;
  const teacherName = courseInfo.teacher;
  const deptBadge = useMemo(
    () => <DeptBadge course={courseInfo} />,
    [courseInfo]
  );
  const courseTimeLocationPairs = useMemo(
    () => parseCourseTimeLocation(courseInfo.schedules),
    [courseInfo]
  );
  // 必帶/必修/選修/其他
  const selectiveOrNot =
    info_view_map["requirement"]["map"][courseInfo.requirement];
  const courseArea = useMemo(() => {
    if (courseInfo.areas.length === 0) {
      return null;
    }
    const areasString = courseInfo.areas
      .map(
        (area) =>
          info_view_map["areas"]["map"]?.[area.area_id]?.full_name ?? null
      )
      .filter((x) => x !== null)
      .join(", ");
    return (
      <Tooltip label={areasString} placement="top" hasArrow>
        <CustomTag>{areasString.trim()}</CustomTag>
      </Tooltip>
    );
  }, [courseInfo]);
  // TODO: 領域專長 Tag

  return (
    <AccordionItem
      transition="all ease-in-out 100ms"
      _hover={{
        bg: "#f6f6f6",
      }}
      borderRadius="0"
      border="none"
      shadow="0px 1px 2px rgba(85, 105, 135, 0.25)"
    >
      <Flex
        alignItems="center"
        justifyContent="start"
        flexDirection="row"
        w="100%"
        pr="2"
        pl="2"
        py="1"
      >
        <AccordionButton
          flexDirection={{ base: "column", md: "row" }}
          alignItems="center"
          _hover={{
            bg: "#f6f6f6",
          }}
          gap={6}
        >
          <Flex
            w={{ base: "100%", md: "40%" }}
            flexDirection={"column"}
            gap={"4px"}
            lineHeight="1.6"
          >
            <Flex
              sx={{
                fontFamily: "Work Sans",
                fontSize: "14px",
                fontWeight: 500,
                color: "#4b4b4b",
              }}
            >
              {courseSerial}
            </Flex>
            <Flex
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#333333",
              }}
            >
              {courseName}
            </Flex>
            <Flex
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#6f6f6f",
              }}
            >
              {teacherName}
            </Flex>
            <Flex>{deptBadge}</Flex>
          </Flex>
          <Flex
            w={{ base: "100%", md: "20%" }}
            flexDirection="column"
            alignItems={"start"}
            sx={{
              fontSize: "14px",
              lineHeight: 1.6,
              fontWeight: 400,
              color: "#333333",
              fontFamily: "Work Sans",
            }}
          >
            {courseTimeLocationPairs.map((pair, index) => {
              return (
                <Text key={`${index}-${pair.time}-${pair.location}`}>
                  {pair.time}
                </Text>
              );
            })}
          </Flex>
          <Flex w={{ base: "100%", md: "20%" }} flexDirection={"column"}>
            <HStack spacing={"4px"}>
              <CustomTag>{selectiveOrNot}</CustomTag>
              {courseArea}
            </HStack>
            <Flex></Flex>
          </Flex>
          <Flex w={{ base: "100%", md: "15%" }}>
            <Button
              size="sm"
              ml={{ base: 0, md: "10px" }}
              variant="unstyled"
              colorScheme={"red"}
              onClick={(e) => {
                e.preventDefault();
                handleAddFavorite(courseInfo.id);
                reportEvent(
                  "course_info_row",
                  isFavorite ? "remove_favorite" : "add_favorite",
                  courseInfo.id
                );
              }}
              isLoading={addingFavoriteCourse}
            >
              <Center w="100%" h="24px">
                {<Icon as={isFavorite ? FaHeart : FaRegHeart} boxSize="16px" />}
              </Center>
            </Button>
            <Tooltip
              label="非當學期課程"
              hasArrow
              shouldWrapChildren
              placement="top"
              isDisabled={
                courseInfo.semester === process.env.NEXT_PUBLIC_SEMESTER
              }
            >
              <Button
                size="sm"
                ml={{ base: 0, md: "10px" }}
                colorScheme={selected ? "red" : "blue"}
                onClick={(e) => {
                  e.preventDefault();
                  addCourseToTable(courseInfo);
                  reportEvent(
                    "course_info_row",
                    selected ? "remove_course" : "add_course",
                    courseInfo.id
                  );
                }}
                isLoading={addingCourse}
                disabled={
                  courseInfo.semester !== process.env.NEXT_PUBLIC_SEMESTER
                }
                variant="outline"
                borderRadius={"full"}
                w="60px"
              >
                {selected ? "移除" : "加入"}
              </Button>
            </Tooltip>
          </Flex>
        </AccordionButton>
      </Flex>
      <AccordionPanel>
        <CourseDrawerContainer courseInfo={courseInfo} />
      </AccordionPanel>
    </AccordionItem>
  );
}
export default CourseInfoRow;
