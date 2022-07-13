import {
  HStack,
  Tag,
  Text,
  ButtonGroup,
  Button,
  Spacer,
  Icon,
  Flex,
  Image,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  MenuDivider,
  useToast,
  Stack,
} from "@chakra-ui/react";
import CourseDetailInfoContainer from "components/CourseInfo/CourseDetailInfoContainer";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Moment from "moment";
import { IoMdOpen } from "react-icons/io";
import {
  FaPlus,
  FaMinus,
  FaHeartbeat,
  FaHeart,
  FaAngleDown,
} from "react-icons/fa";
import { BiCopy } from "react-icons/bi";
import { getNolAddUrl, getNolUrl } from "utils/getNolUrls";
import openPage from "utils/openPage";
import { useUserData } from "components/Providers/UserProvider";
import { fetchCourse } from "queries/course";
import { useCourseTable } from "components/Providers/CourseTableProvider";
import { fetchCourseTable, patchCourseTable } from "queries/courseTable";
import Head from "next/head";
import { useUser } from "@auth0/nextjs-auth0";
import handleFetch from "utils/CustomFetch";

const copyWordList = [
  { count: 100, word: "複製終結者!!", color: "purple.600", bg: "purple.50" },
  { count: 50, word: "終極複製!!", color: "red.600", bg: "red.50" },
  { count: 25, word: "超級複製!!", color: "orange.600", bg: "orange.50" },
  { count: 10, word: "瘋狂複製!!", color: "yellow.600", bg: "yellow.50" },
  { count: 3, word: "三倍複製!", color: "green.600", bg: "green.50" },
  { count: 2, word: "雙倍複製!", color: "green.600", bg: "green.50" },
  { count: 1, word: "已複製", color: "green.600", bg: "green.50" },
  { count: 0, word: "複製連結", color: "gray.600", bg: "white" },
];

const LOCAL_STORAGE_KEY = "NTU_CourseNeo_Course_Table_Key";

export async function getServerSideProps({ params }) {
  const { courseId } = params;
  const course = await fetchCourse(courseId);
  return {
    props: {
      code: courseId,
      course,
    },
  };
}

function CourseInfoPage({ code, course }) {
  const { setUser, user: userInfo } = useUserData();
  const { setCourseTable } = useCourseTable();
  const router = useRouter();
  const toast = useToast();

  const [copiedLinkClicks, setCopiedLinkClicks] = useState(0);
  const [copyWord, setCopyWord] = useState(
    copyWordList.find((word) => word.count <= copiedLinkClicks)
  );
  Moment.locale("zh-tw");

  const [addingCourse, setAddingCourse] = useState(false);
  const [addingFavoriteCourse, setAddingFavoriteCourse] = useState(false);
  const [selected, setSelected] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user, isLoading } = useUser();

  useEffect(() => {
    setCopyWord(copyWordList.find((word) => word.count <= copiedLinkClicks));
  }, [copiedLinkClicks]);

  // get selected & isFavorite init state
  useEffect(() => {
    const getInitState = async () => {
      setAddingCourse(true);
      setAddingFavoriteCourse(true);
      let uuid;
      if (user) {
        // user mode, if no userInfo, log in first
        if (!userInfo) {
          let user_data;
          try {
            user_data = await handleFetch(`/api/user`, {
              user_id: user.sub,
            });
          } catch (e) {
            router.push("/api/auth/login");
          }
          await setUser(user_data);

          if (user_data.db.course_tables.length === 0) {
            uuid = null;
          } else {
            // use the first one
            uuid = user_data.db.course_tables[0];
          }
          // determine isFavorite init state
          if (user_data.db.favorites.includes(code)) {
            setIsFavorite(true);
          } else {
            setIsFavorite(false);
          }
        } else {
          if (userInfo.db.course_tables.length === 0) {
            uuid = null;
          } else {
            // use the first one
            uuid = userInfo.db.course_tables[0];
          }
          // determine isFavorite init state
          if (userInfo.db.favorites.includes(code)) {
            setIsFavorite(true);
          } else {
            setIsFavorite(false);
          }
        }
      } else {
        // guest mode
        uuid = localStorage.getItem(LOCAL_STORAGE_KEY);
      }
      if (uuid) {
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
          }
          toast({
            title: "取得課表資料失敗",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setAddingCourse(false);
          setAddingFavoriteCourse(false);
          return;
        }
        // determine init state
        if (courseTable && courseTable.courses.includes(code)) {
          setSelected(true);
        } else {
          setSelected(false);
        }
      }

      setAddingCourse(false);
      setAddingFavoriteCourse(false);
    };

    if (!isLoading) {
      getInitState();
    }
  }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddCourse = async (course) => {
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

        if (courseTable === null) {
          // get course_tables/:id return null (expired)
          // show error and break the function
          toast({
            title: `新增 ${course.course_name} 失敗`,
            description: `您的課表已過期，請重新建立課表`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } else {
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
            setSelected(!selected);
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
          setIsFavorite(!isFavorite);
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

  if (!course) {
    return (
      <Flex h="95vh" pt="64px" justifyContent="center" alignItems="center">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <HStack>
            <Image
              w="64px"
              src={"/img/parrot/ultrafastparrot.gif"}
              alt="Loading Parrot"
            />
          </HStack>
          <Text mt="8" mb="4" fontSize="3xl" fontWeight="600" color="gray.500">
            喔哦! 找不到課程資料
          </Text>
          <HStack>
            <Button
              variant="solid"
              onClick={() =>
                window.open("https://www.surveycake.com/s/LzWd6", "_blank")
              }
            >
              問題回報
            </Button>
            <Button
              variant="solid"
              colorScheme="teal"
              leftIcon={<FaHeartbeat />}
              onClick={() =>
                window.open("https://status.course.myntu.me/", "_blank")
              }
            >
              服務狀態
            </Button>
          </HStack>
        </Flex>
      </Flex>
    );
  } else {
    return (
      <>
        <Head>
          <title>{`${course.course_name} - 課程資訊 | NTUCourse Neo`}</title>
          <meta
            name="description"
            content={`${course.course_name} 課程的詳細資訊 | NTUCourse Neo，全新的臺大選課網站。`}
          />
        </Head>
        <Flex
          pt="64px"
          w="100%"
          justifyContent={"center"}
          position={{ base: "fixed", lg: "static" }}
          zIndex={{ base: 100, lg: 0 }}
          bg="white"
        >
          <HStack
            my="2"
            mx="4%"
            spacing="4"
            w="100%"
            align="center"
            pt={2}
            pb={1}
          >
            <Stack direction={{ base: "column", lg: "row" }}>
              <HStack>
                {course.id ? (
                  <Tag size="md" colorScheme="blue" w="fit-content">
                    <Text fontWeight="800" fontSize={{ base: "md", lg: "lg" }}>
                      {course.id}
                    </Text>
                  </Tag>
                ) : null}
                <CopyToClipboard
                  text={"https://course.myntu.me/courseinfo/" + course._id}
                >
                  <Button
                    rightIcon={<Icon as={BiCopy} color={copyWord.color} />}
                    variant="ghost"
                    size="xs"
                    bg={copyWord.bg}
                    color={copyWord.color}
                    onClick={() => setCopiedLinkClicks(copiedLinkClicks + 1)}
                    display={{ base: "inline-block", lg: "none" }}
                  >
                    {copyWord.word}
                  </Button>
                </CopyToClipboard>
              </HStack>
              <HStack>
                <Text
                  fontSize={{ base: "xl", lg: "3xl" }}
                  fontWeight="800"
                  color="gray.700"
                  maxW={{ base: "100px", md: "30vw" }}
                  isTruncated
                  noOfLines={1}
                >
                  {course.course_name}
                </Text>
                <Text
                  fontSize={{ base: "md", lg: "2xl" }}
                  fontWeight="500"
                  color="gray.500"
                >
                  {course.teacher}
                </Text>
              </HStack>
            </Stack>
            <Spacer display={{ base: "inline-block", lg: "none" }} />
            <Text
              fontWeight="500"
              fontSize={{ base: "sm", lg: "md" }}
              color="gray.200"
            >
              {Moment(new Date()).format("HH:mm")} 更新
            </Text>
            <Spacer display={{ base: "none", lg: "inline-block" }} />
            <HStack spacing="2" display={{ base: "none", lg: "flex" }}>
              <ButtonGroup isAttached>
                <Button
                  key={"NolContent_Button_" + code + "_addToCourseTable"}
                  mr="-px"
                  size="md"
                  colorScheme={selected ? "red" : "blue"}
                  variant="outline"
                  leftIcon={selected ? <FaMinus /> : <FaPlus />}
                  isLoading={addingCourse || isLoading}
                  onClick={() => {
                    handleAddCourse(course);
                  }}
                >
                  {selected ? "從課表移除" : "加入課表"}
                </Button>
                <Button
                  key={"NolContent_Button_" + code + "_addToNol"}
                  size="md"
                  colorScheme="blue"
                  variant="outline"
                  leftIcon={<FaPlus />}
                  onClick={() => openPage(getNolAddUrl(course), true)}
                >
                  課程網
                </Button>
              </ButtonGroup>
              <Button
                key={"NolContent_Button_" + code + "_addToFavorite"}
                size="md"
                colorScheme="red"
                variant={isFavorite ? "solid" : "outline"}
                leftIcon={<FaHeart />}
                isLoading={addingFavoriteCourse}
                disabled={!userInfo}
                onClick={() => {
                  handleAddFavorite(course._id);
                }}
              >
                {isFavorite ? "已加入最愛" : "加入最愛"}
              </Button>
              <Button
                key={"NolContent_Button_" + code + "_OpenNol"}
                size="md"
                rightIcon={<IoMdOpen />}
                onClick={() => window.open(getNolUrl(course), "_blank")}
              >
                課程網資訊
              </Button>
              <CopyToClipboard
                text={"https://course.myntu.me/courseinfo/" + course._id}
              >
                <Button
                  rightIcon={<Icon as={BiCopy} color={copyWord.color} />}
                  variant="ghost"
                  size="md"
                  bg={copyWord.bg}
                  color={copyWord.color}
                  onClick={() => setCopiedLinkClicks(copiedLinkClicks + 1)}
                >
                  {copyWord.word}
                </Button>
              </CopyToClipboard>
            </HStack>
            <Menu>
              <MenuButton
                isLoading={addingCourse || isLoading || addingFavoriteCourse}
                as={Button}
                rightIcon={<FaAngleDown />}
                display={{ base: "inline-block", lg: "none" }}
              >
                功能
              </MenuButton>
              <MenuList display={{ base: "inline-block", lg: "none" }}>
                <MenuItem
                  key={"NolContent_Button_" + code + "_addToCourseTable"}
                  mr="-px"
                  size="md"
                  color={selected ? "red.500" : "blue.600"}
                  variant="ghost"
                  icon={selected ? <FaMinus /> : <FaPlus />}
                  onClick={() => {
                    handleAddCourse(course);
                  }}
                >
                  {selected ? "從課表移除" : "加入課表"}
                </MenuItem>
                <MenuItem
                  key={"NolContent_Button_" + code + "_addToNol"}
                  size="md"
                  color="blue.600"
                  variant="ghost"
                  icon={<FaPlus />}
                  onClick={() => openPage(getNolAddUrl(course), true)}
                >
                  課程網
                </MenuItem>
                <MenuItem
                  key={"NolContent_Button_" + code + "_addToFavorite"}
                  size="md"
                  color="red.500"
                  variant={"ghost"}
                  icon={isFavorite ? <FaMinus /> : <FaHeart />}
                  disabled={!userInfo}
                  onClick={() => {
                    handleAddFavorite(course._id);
                  }}
                >
                  {isFavorite ? "從最愛移除" : "加入最愛"}
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  icon={<IoMdOpen />}
                  onClick={() => window.open(getNolUrl(course), "_blank")}
                >
                  課程網資訊
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
        <CourseDetailInfoContainer course={course} />
      </>
    );
  }
}

export default CourseInfoPage;
