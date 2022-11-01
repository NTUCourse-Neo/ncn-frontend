import { useState, useMemo, forwardRef } from "react";
import {
  Box,
  Flex,
  Badge,
  Spacer,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Button,
  Tooltip,
  Text,
  HStack,
  ButtonGroup,
  BoxProps,
  Icon,
  Center,
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { info_view_map } from "data/mapping_table";
import openPage from "utils/openPage";
import useCourseTable from "hooks/useCourseTable";
import { useUser } from "@auth0/nextjs-auth0";
import { parseCourseTimeLocation } from "utils/parseCourseSchedule";
import useUserInfo from "hooks/useUserInfo";
import { reportEvent } from "utils/ga";
import type { Course } from "types/course";
import { useRouter } from "next/router";
import { IoWarningOutline } from "react-icons/io5";
import useNeoToast from "@/hooks/useNeoToast";

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
  readonly label: string | string[] | null;
}) {
  return (
    <Flex
      flexDirection="row"
      alignItems="start"
      justifyContent="start"
      mr="4"
      w="100%"
      sx={{
        fontSize: "12px",
        lineHeight: "1.6",
        fontWeight: 500,
        color: "#333333",
      }}
    >
      <Box>{fieldName}</Box>
      <Box
        ml="8px"
        sx={{
          fontWeight: 400,
        }}
      >
        {!label ? (
          "-"
        ) : typeof label === "string" ? (
          label
        ) : (
          <>
            {label.map((t, i) => (
              <Flex key={`${t}-${i}`}>{t}</Flex>
            ))}
          </>
        )}
      </Box>
    </Flex>
  );
}

function CourseDrawerContainer({
  courseInfo,
}: {
  readonly courseInfo: Course;
}) {
  const router = useRouter();
  const courseTimeLocationPairs = parseCourseTimeLocation(courseInfo.schedules);
  const hasDifferentLocation = courseTimeLocationPairs.length > 1;
  return (
    <Flex
      px="1"
      flexDirection="column"
      width="100%"
      alignItems="start"
      justifyContent="space-between"
    >
      <Flex
        py="12px"
        flexDirection="row"
        w="100%"
        alignItems="start"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <Box w="33%" gap="6px">
          <DrawerDataTag
            fieldName={"課程識別碼"}
            label={courseInfo.identifier}
          />
          <DrawerDataTag fieldName={"課號"} label={courseInfo.code} />
          <DrawerDataTag
            fieldName={info_view_map.enroll_method.name}
            label={
              info_view_map.enroll_method["map"]?.[courseInfo.enroll_method] ??
              null
            }
          />
        </Box>
        <Box w="33%" gap="6px">
          <DrawerDataTag fieldName={"班次"} label={courseInfo?.class || ""} />
          <DrawerDataTag
            fieldName={"學分數"}
            label={`${courseInfo.credits ? courseInfo.credits.toFixed(1) : ""}`}
          />
          <DrawerDataTag fieldName={"修課學生年級"} label={"unavailable"} />
        </Box>
        <Box w="33%" gap="6px">
          <DrawerDataTag
            fieldName={"上課地點"}
            label={
              hasDifferentLocation
                ? courseTimeLocationPairs.map((p) => `${p.location}(${p.time})`)
                : courseTimeLocationPairs?.[0]?.location || "-"
            }
          />
          <DrawerDataTag
            fieldName={"修課總人數"}
            label={`${courseInfo.slot} 人`}
          />
          <DrawerDataTag
            fieldName={info_view_map.language.name}
            label={info_view_map.language.map[courseInfo.language]}
          />
        </Box>
      </Flex>
      <Spacer my="2" />
      <Flex
        w="100%"
        bg="white"
        flexDirection="column"
        alignItems="start"
        justifyContent="start"
        borderRadius="4px"
        gap={"12px"}
        p={4}
      >
        {courseInfo?.limitation ? (
          <Flex
            w="100%"
            flexDirection="column"
            alignItems="start"
            justifyContent="start"
            gap={2}
          >
            <HStack
              spacing={1}
              color="error.main"
              sx={{
                fontSize: "12px",
                lineHeight: "1.4",
                fontWeight: 500,
              }}
            >
              <Center h="100%">
                <IoWarningOutline />
              </Center>
              <Text> 修課限制 </Text>
            </HStack>
            <Text
              mx="2px"
              sx={{
                fontSize: "12px",
                lineHeight: "1.4",
                fontWeight: 400,
                color: "#2d2d2d",
              }}
            >
              {courseInfo?.limitation ?? "無"}
            </Text>
          </Flex>
        ) : null}
        <Flex
          w="100%"
          flexDirection="column"
          alignItems="start"
          justifyContent="start"
          gap={2}
        >
          <HStack
            spacing={1}
            color="#6f6f6f"
            sx={{
              fontSize: "12px",
              lineHeight: "1.4",
              fontWeight: 500,
            }}
          >
            <Text> 備註 </Text>
          </HStack>
          <Text
            sx={{
              fontSize: "12px",
              lineHeight: "1.4",
              fontWeight: 400,
              color: "#6f6f6f",
            }}
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
        justifyContent={{ base: "start", md: "end" }}
        flexWrap="wrap"
        css={{ gap: "2px" }}
      >
        <ButtonGroup>
          {courseInfo?.cool_url ? (
            <Button
              variant="outline"
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
          <Button
            onClick={() => {
              router.push(`/courseinfo/${courseInfo.id}`);
            }}
          >
            查看課程大綱
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
  const toast = useNeoToast();

  const { user } = useUser();
  const { userInfo, addOrRemoveFavorite, isLoading } = useUserInfo(
    user?.sub ?? null
  );
  const courseTableKey = userInfo?.course_tables?.[0] ?? null;
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
        toast("operation_failed", "尚未建立課表");
      }
      setAddingCourse(false);
    }
  };

  const handleAddFavorite = async (course_id: string, course_name: string) => {
    if (!isLoading) {
      if (userInfo) {
        setAddingFavoriteCourse(true);
        await addOrRemoveFavorite(course_id, course_name);
        setAddingFavoriteCourse(false);
      } else {
        toast("operation_failed", "請先登入");
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
      {({ isExpanded }) => (
        <>
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
                    handleAddFavorite(courseInfo.id, courseInfo.name);
                    reportEvent(
                      "course_info_row",
                      isFavorite ? "remove_favorite" : "add_favorite",
                      courseInfo.id
                    );
                  }}
                  isLoading={addingFavoriteCourse}
                >
                  <Center w="100%" h="24px">
                    {
                      <Icon
                        as={isFavorite ? FaHeart : FaRegHeart}
                        boxSize="16px"
                      />
                    }
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
                    colorScheme={selected ? "error" : "primary"}
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
          {isExpanded ? (
            <Box borderTop="1px solid #CCCCCC" h="0" mx="3%" />
          ) : null}
          <AccordionPanel px="24px" bg="#f6f6f6">
            <CourseDrawerContainer courseInfo={courseInfo} />
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
}
export default CourseInfoRow;
