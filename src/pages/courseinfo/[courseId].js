import {
  HStack,
  Tag,
  Text,
  ButtonGroup,
  Button,
  Spacer,
  Icon,
  Flex,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  MenuDivider,
  useToast,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";
import CourseDetailInfoContainer from "components/CourseInfo/CourseDetailInfoContainer";
import { useState, useEffect, useMemo } from "react";
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
import useUserInfo from "hooks/useUserInfo";
import { fetchCourse } from "queries/course";
import useCourseTable from "hooks/useCourseTable";
import useNeoLocalStorage from "hooks/useNeoLocalStorage";
import { patchCourseTable } from "queries/courseTable";
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
  const bgcolor = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("heading.light", "heading.dark");
  const { user } = useUser();
  const { userInfo, refetch, isLoading } = useUserInfo(user?.sub);
  const { neoLocalCourseTableKey } = useNeoLocalStorage();
  const courseTableKey = userInfo
    ? userInfo?.course_tables?.[0] ?? null
    : neoLocalCourseTableKey;
  const {
    courseTable,
    isLoading: isCourseTableLoading,
    refetch: refetchCourseTable,
  } = useCourseTable(courseTableKey);
  const router = useRouter();
  const toast = useToast();

  const [copiedLinkClicks, setCopiedLinkClicks] = useState(0);
  const [copyWord, setCopyWord] = useState(
    copyWordList.find((word) => word.count <= copiedLinkClicks)
  );
  Moment.locale("zh-tw");

  const selected = useMemo(
    () => (courseTable?.courses ?? []).map((c) => c.id).includes(code),
    [courseTable, code]
  );
  const isFavorite = useMemo(
    () => userInfo?.favorites.map((c) => c.id).includes(course.id) ?? false,
    [userInfo, course.id]
  );

  useEffect(() => {
    setCopyWord(copyWordList.find((word) => word.count <= copiedLinkClicks));
  }, [copiedLinkClicks]);

  const handleAddCourse = async (course) => {
    if (!isLoading && !isCourseTableLoading) {
      if (courseTableKey) {
        // fetch course table success
        let operation_str;
        try {
          if (courseTable.courses.map((c) => c.id).includes(course.id)) {
            // course is already in course table, remove it.
            operation_str = "刪除";
            await patchCourseTable(
              courseTableKey,
              courseTable.name,
              courseTable.user_id,
              courseTable.expire_ts,
              courseTable.courses
                .map((c) => c.id)
                .filter((id) => id !== course.id)
            );
            refetchCourseTable();
          } else {
            // course is not in course table, add it.
            operation_str = "新增";
            await patchCourseTable(
              courseTableKey,
              courseTable.name,
              courseTable.user_id,
              courseTable.expire_ts,
              [...courseTable.courses.map((c) => c.id), course.id]
            );
            refetchCourseTable();
          }
          toast({
            title: `已${operation_str} ${course.name}`,
            description: `課表: ${courseTable.name}`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } catch (e) {
          toast({
            title: `新增 ${course.name} 失敗`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
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
    }
  };

  const handleAddFavorite = async (course_id) => {
    if (!isLoading) {
      if (userInfo) {
        const favorite_list = userInfo.favorites.map((c) => c.id);
        try {
          if (favorite_list.includes(course_id)) {
            await handleFetch(`/api/user/removeFavoriteCourse`, {
              course_id: course_id,
            });
          } else {
            await handleFetch(`/api/user/addFavoriteCourse`, {
              course_id: course_id,
            });
          }
          refetch();
          toast({
            title: `更改最愛課程成功`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } catch (error) {
          toast({
            title: `更改最愛課程失敗`,
            description: `請稍後再試`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          if (error?.response?.status === 401) {
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
              width={64}
              height={64}
              layout="fixed"
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
          <title>{`${course.name} - 課程資訊 | NTUCourse Neo`}</title>
          <meta
            name="description"
            content={`${course.name} 課程的詳細資訊 | NTUCourse Neo，全新的臺大選課網站。`}
          />
        </Head>
        <Flex
          pt="64px"
          w="100%"
          justifyContent={"center"}
          position={{ base: "fixed", lg: "static" }}
          zIndex={{ base: 100, lg: 0 }}
          bg={bgcolor}
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
                {course.serial ? (
                  <Tag size="md" colorScheme="blue" w="fit-content">
                    <Text fontWeight="800" fontSize={{ base: "md", lg: "lg" }}>
                      {course.serial}
                    </Text>
                  </Tag>
                ) : null}
                <CopyToClipboard
                  text={`${process.env.NEXT_PUBLIC_BASE_URL}/courseinfo/${course.id}`}
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
                  color={headingColor}
                  maxW={{ base: "100px", md: "30vw" }}
                  isTruncated
                  noOfLines={1}
                >
                  {course.name}
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
                  isLoading={isLoading || isCourseTableLoading}
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
                isLoading={isLoading || isCourseTableLoading}
                disabled={!userInfo}
                onClick={() => {
                  handleAddFavorite(course.id);
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
                text={`${process.env.NEXT_PUBLIC_BASE_URL}/courseinfo/${course.id}`}
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
                isLoading={isLoading || isCourseTableLoading}
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
                    handleAddFavorite(course.id);
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
