// Props
// | courseInfo: Obj
//
import { React, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Badge,
  Spacer,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Tag,
  TagLeftIcon,
  TagLabel,
  Button,
  Tooltip,
  useToast,
  Collapse,
  useBreakpointValue,
  Text,
  HStack,
  ButtonGroup,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaPlus, FaHeart, FaInfoCircle } from "react-icons/fa";
import { info_view_map } from "data/mapping_table";
import { hash_to_color_hex } from "utils/colorAgent";
import openPage from "utils/openPage";
import { getNolAddUrl } from "utils/getNolUrls";
import { useUserData } from "components/Providers/UserProvider";
import { useCourseTable } from "components/Providers/CourseTableProvider";
import { fetchCourseTable, patchCourseTable } from "queries/courseTable";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";
import handleFetch from "utils/CustomFetch";

const LOCAL_STORAGE_KEY = "NTU_CourseNeo_Course_Table_Key";

function DeptBadge({ course }) {
  if (
    !course.department ||
    course.department.length === 0 ||
    (course.department.length === 1 && course.department[0].length === 0)
  ) {
    return <></>;
  }
  if (course.department.length > 1) {
    const dept_str = course.department.join(", ");
    return (
      <Tooltip
        hasArrow
        placement="top"
        label={dept_str}
        bg="gray.600"
        color="white"
      >
        <Badge colorScheme="teal" variant="solid" mr="4px">
          多個系所
        </Badge>
      </Tooltip>
    );
  }
  return (
    <Badge colorScheme="blue" variant="solid" mr="4px">
      {course?.department[0] ?? ""}
    </Badge>
  );
}

function DrawerDataTag({ fieldName, label }) {
  const textColor = useColorModeValue("text.light", "text.dark");
  if (label === "" || label === null || label === undefined) {
    return <></>;
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
      <Heading as="h3" color={textColor} fontSize="sm" ml="4px">
        {label}
      </Heading>
    </Flex>
  );
}

function CourseDrawerContainer({ courseInfo }) {
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
        <DrawerDataTag fieldName={"課程識別碼"} label={courseInfo.course_id} />
        <DrawerDataTag fieldName={"課號"} label={courseInfo.course_code} />
        <DrawerDataTag fieldName={"班次"} label={courseInfo.class_id} />
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
        borderColor="gray.200"
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
            {courseInfo.limit === "" ? "無" : courseInfo.limit}
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
            {courseInfo.note === "" ? "無" : courseInfo.note}
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
          {["ceiba", "cool"].map((linkName) => {
            const url = courseInfo.url?.[linkName];
            if (!url || url === "") {
              return null;
            }
            return (
              <Button
                key={`${linkName}`}
                size="sm"
                mr="-px"
                onClick={() => openPage(url)}
              >
                {linkName.toUpperCase()}
              </Button>
            );
          })}
        </ButtonGroup>
        <ButtonGroup>
          <Button
            variant="ghost"
            colorScheme="blue"
            leftIcon={<FaPlus />}
            size="sm"
            onClick={() => openPage(getNolAddUrl(courseInfo), true)}
          >
            加入課程網
          </Button>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
}

function CourseInfoRow({
  courseInfo,
  selected,
  isfavorite,
  displayTags,
  displayTable,
}) {
  const rowColor = useColorModeValue("card.light", "card.dark");
  const textColor = useColorModeValue("text.light", "text.dark");
  const headingColor = useColorModeValue("heading.light", "heading.dark");
  const tooltipBg = useColorModeValue("gray.600", "gray.300");
  const tooltipText = useColorModeValue("white", "black");
  const selectedColor = useColorModeValue(
    hash_to_color_hex(courseInfo._id, 0.95),
    `${hash_to_color_hex(courseInfo._id, 0.45)}90`
  );
  const { setCourseTable } = useCourseTable();
  const router = useRouter();
  const { user: userInfo, setUser } = useUserData();

  const [addingCourse, setAddingCourse] = useState(false);
  const [addingFavoriteCourse, setAddingFavoriteCourse] = useState(false);

  const toast = useToast();
  const { user, isLoading } = useUser();

  const addCourseToTable = async (course) => {
    if (!isLoading) {
      setAddingCourse(true);

      let uuid;
      if (user) {
        // user mode
        if (userInfo.db.course_tables.length === 0) {
          uuid = null;
        } else {
          // use the first one
          uuid = userInfo.db.course_tables[0];
        }
      } else {
        // guest mode
        uuid = localStorage.getItem(LOCAL_STORAGE_KEY);
      }

      if (uuid) {
        // fetch course table from server
        let courseTable;
        try {
          courseTable = await fetchCourseTable(uuid);
          setCourseTable(courseTable);
        } catch (error) {
          if (
            error?.response?.status === 403 ||
            error?.response?.status === 404
          ) {
            // expired
            setCourseTable(null);
            toast({
              title: `新增 ${course.course_name} 失敗`,
              description: `您的課表已過期，請重新建立課表`,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
          toast({
            title: "取得課表資料失敗",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setAddingCourse(false);
          return;
        }
        if (courseTable) {
          // fetch course table success
          let res_table;
          let operation_str;
          if (courseTable.courses.includes(course._id)) {
            // course is already in course table, remove it.
            operation_str = "刪除";
            const new_courses = courseTable.courses.filter(
              (id) => id !== course._id
            );
            try {
              res_table = await patchCourseTable(
                uuid,
                courseTable.name,
                courseTable.user_id,
                courseTable.expire_ts,
                new_courses
              );
              setCourseTable(res_table);
            } catch (error) {
              if (
                error?.response?.status === 403 ||
                error?.response?.status === 404
              ) {
                // expired
                setCourseTable(null);
              }
              toast({
                title: `刪除 ${course.course_name} 失敗`,
                status: "error",
                duration: 3000,
                isClosable: true,
              });
              setAddingCourse(false);
              return;
            }
          } else {
            // course is not in course table, add it.
            operation_str = "新增";
            const new_courses = [...courseTable.courses, course._id];
            try {
              res_table = await patchCourseTable(
                uuid,
                courseTable.name,
                courseTable.user_id,
                courseTable.expire_ts,
                new_courses
              );
              setCourseTable(res_table);
            } catch (error) {
              if (
                error?.response?.status === 403 ||
                error?.response?.status === 404
              ) {
                // expired
                setCourseTable(null);
              }
              toast({
                title: `新增 ${course.course_name} 失敗`,
                status: "error",
                duration: 3000,
                isClosable: true,
              });
              setAddingCourse(false);
              return;
            }
          }
          if (res_table) {
            toast({
              title: `已${operation_str} ${course.course_name}`,
              description: `課表: ${courseTable.name}`,
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }
          // ELSE TOAST?
        }
      } else {
        // do not have course table id in local storage
        toast({
          title: `新增 ${course.course_name} 失敗`,
          description: `尚未建立課表`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setAddingCourse(false);
    }
  };

  const handleAddFavorite = async (course_id) => {
    if (!isLoading) {
      if (user) {
        setAddingFavoriteCourse(true);
        const favorite_list = [...userInfo.db.favorites];
        let new_favorite_list;
        let op_name;
        if (favorite_list.includes(course_id)) {
          // remove course from favorite list
          new_favorite_list = favorite_list.filter((id) => id !== course_id);
          op_name = "刪除";
        } else {
          // add course to favorite list
          new_favorite_list = [...favorite_list, course_id];
          op_name = "新增";
        }
        // API call
        try {
          const updatedUser = await handleFetch(`/api/user/addFavoriteCourse`, {
            new_favorite_list,
            user_id: userInfo.db._id,
          });
          setUser(updatedUser);
          toast({
            title: `${op_name}最愛課程成功`,
            //description: `請稍後再試`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setAddingFavoriteCourse(false);
        } catch (e) {
          // toast error
          toast({
            title: `${op_name}最愛課程失敗`,
            description: `請稍後再試`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setAddingFavoriteCourse(false);
          if (e?.response?.data?.msg === "access_token_expired") {
            router.push("/api/auth/login");
          }
        }
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

  return (
    <AccordionItem
      bg={selected ? selectedColor : rowColor}
      borderRadius="md"
      transition="all ease-in-out 500ms"
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
          alignItems="start"
        >
          <Flex
            flexDirection={{ base: "column", md: "row" }}
            alignItems={{ base: "start", md: "center" }}
            justifyContent="start"
            flexWrap="wrap"
            css={{ gap: "8px" }}
          >
            <Flex
              w="8vw"
              alignItems="center"
              justifyContent="start"
              display={{ base: "none", md: "flex" }}
            >
              <Tooltip
                hasArrow
                placement="top"
                label="課程流水號"
                bg={tooltipBg}
                color={tooltipText}
              >
                <Badge variant="outline" mr="4px">
                  {courseInfo.id}
                </Badge>
              </Tooltip>
              <DeptBadge course={courseInfo} />
            </Flex>
            <HStack>
              <Heading
                as="h3"
                size={useBreakpointValue({ base: "sm", md: "md" }) ?? "sm"}
                color={headingColor}
              >
                {courseInfo.course_name}
              </Heading>
              <Heading
                as="h3"
                size={useBreakpointValue({ base: "xs", md: "sm" }) ?? "xs"}
                color={textColor}
                fontWeight="500"
                display={{ base: "inline-block", md: "none" }}
              >
                {courseInfo.teacher}
              </Heading>
            </HStack>
            <HStack>
              <Tooltip
                hasArrow
                placement="top"
                label="課程流水號"
                bg={tooltipBg}
                color={tooltipText}
              >
                <Badge
                  variant="outline"
                  display={{ base: "inline-block", md: "none" }}
                >
                  {courseInfo.id}
                </Badge>
              </Tooltip>
              <Tooltip
                hasArrow
                placement="top"
                label={courseInfo.credit + " 學分"}
                bg={tooltipBg}
                color={tooltipText}
              >
                <Badge variant="outline" mx={{ base: 0, md: 4 }}>
                  {courseInfo.credit}
                </Badge>
              </Tooltip>
              <Flex display={{ base: "inline-block", md: "none" }}>
                <DeptBadge course={courseInfo} />
              </Flex>
            </HStack>
            <Heading
              as="h3"
              size="sm"
              color={textColor}
              fontWeight="500"
              display={{ base: "none", md: "flex" }}
            >
              {courseInfo.teacher}
            </Heading>
            <Collapse in={!displayTable}>
              <Tooltip
                hasArrow
                placement="top"
                label={courseInfo.time_loc}
                bg={tooltipBg}
                color={tooltipText}
              >
                <Badge
                  variant="outline"
                  ml={{ base: 0, md: 8 }}
                  size="lg"
                  w="150px"
                  noOfLines={1}
                  isTruncated
                >
                  {courseInfo.time_loc}
                </Badge>
              </Tooltip>
            </Collapse>
          </Flex>
          <Spacer />
          <Flex
            alignItems="start"
            justifyContent="start"
            mt={{ base: 4, md: 0 }}
            flexWrap="wrap"
            css={{ gap: "2px" }}
          >
            {displayTags.map((tag, index) => {
              if (tag === "area") {
                let display_str = "";
                let tooltip_str = "";
                if (courseInfo.area.length === 0) {
                  display_str = "無";
                  tooltip_str = info_view_map[tag].name + ": 無";
                } else if (courseInfo.area.length > 1) {
                  display_str = "多個領域";
                  tooltip_str = courseInfo.area
                    .map((area) => info_view_map[tag].map[area].full_name)
                    .join(", ");
                } else if (courseInfo[tag][0] === "g") {
                  display_str =
                    "通識 " + info_view_map[tag].map[courseInfo[tag][0]].code;
                  tooltip_str =
                    info_view_map[tag].name +
                    ": " +
                    info_view_map[tag].map[courseInfo[tag][0]].full_name;
                } else {
                  display_str =
                    info_view_map[tag].map[courseInfo[tag][0]].full_name;
                  tooltip_str =
                    info_view_map[tag].name +
                    ":" +
                    info_view_map[tag].map[courseInfo[tag][0]].full_name;
                }
                return (
                  <Tooltip
                    hasArrow
                    placement="top"
                    label={tooltip_str}
                    bg={tooltipBg}
                    color={tooltipText}
                    key={index}
                  >
                    <Tag
                      mx="2px"
                      variant="subtle"
                      colorScheme={info_view_map[tag].color}
                      hidden={courseInfo[tag] === -1}
                    >
                      <TagLeftIcon
                        boxSize="12px"
                        as={info_view_map[tag].logo}
                      />
                      <TagLabel>{display_str}</TagLabel>
                    </Tag>
                  </Tooltip>
                );
              }
              return (
                <Tooltip
                  hasArrow
                  placement="top"
                  label={info_view_map[tag].name}
                  bg={tooltipBg}
                  color={tooltipText}
                  key={index}
                >
                  <Tag
                    mx="2px"
                    variant="subtle"
                    colorScheme={info_view_map[tag].color}
                    hidden={courseInfo[tag] === -1}
                  >
                    <TagLeftIcon boxSize="12px" as={info_view_map[tag].logo} />
                    <TagLabel>
                      {info_view_map?.[tag]?.map?.[courseInfo?.[tag]] ??
                        courseInfo?.[tag] ??
                        "未知"}
                    </TagLabel>
                  </Tag>
                </Tooltip>
              );
            })}
          </Flex>
        </AccordionButton>
        <Flex
          alignItems="center"
          justifyContent="end"
          flexDirection={{ base: "column", md: "row" }}
        >
          <Button
            size="sm"
            colorScheme="blue"
            variant="ghost"
            onClick={() => {
              router.push(`/courseinfo/${courseInfo._id}`);
            }}
          >
            <HStack>
              <FaInfoCircle />
              <Text display={{ base: "none", md: "inline-block" }}>詳細</Text>
            </HStack>
          </Button>
          <Button
            size="sm"
            ml={{ base: 0, md: "20px" }}
            variant={isfavorite ? "solid" : "outline"}
            colorScheme={"red"}
            onClick={() => handleAddFavorite(courseInfo._id)}
            isLoading={addingFavoriteCourse}
          >
            <Box>
              <FaHeart />
            </Box>
          </Button>
          <Button
            size="sm"
            ml={{ base: 0, md: "20px" }}
            colorScheme={selected ? "red" : "blue"}
            onClick={() => addCourseToTable(courseInfo)}
            isLoading={addingCourse}
          >
            <Box
              transform={selected ? "rotate(45deg)" : ""}
              transition="all ease-in-out 200ms"
            >
              <FaPlus />
            </Box>
          </Button>
        </Flex>
      </Flex>
      <AccordionPanel>
        <CourseDrawerContainer courseInfo={courseInfo} />
      </AccordionPanel>
    </AccordionItem>
  );
}
export default CourseInfoRow;
