import {
  HStack,
  Text,
  Button,
  Icon,
  Flex,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";
import { useState, useMemo } from "react";
import {
  FaPlus,
  FaMinus,
  FaHeartbeat,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import useUserInfo from "hooks/useUserInfo";
import { fetchCourse } from "queries/course";
import useCourseTable from "hooks/useCourseTable";
import Head from "next/head";
import { useUser } from "@auth0/nextjs-auth0";
import { reportEvent } from "utils/ga";
import { GetServerSideProps } from "next";
import { Course } from "types/course";
import { ParsedUrlQuery } from "querystring";
import CustomBreadcrumb from "@/components/Breadcrumb";
import CourseDetailInfoContainer from "@/components/CourseInfo/CourseDetailInfoContainer";

interface PageProps {
  readonly code: string;
  readonly course: Course;
}
interface Params extends ParsedUrlQuery {
  readonly courseId: string;
}

export const getServerSideProps: GetServerSideProps<
  PageProps,
  Params
> = async ({ params }) => {
  if (!params) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }
  const { courseId } = params;
  const data = await fetchCourse(courseId);
  if (!data?.course) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }
  return {
    props: {
      code: courseId,
      course: data.course,
    },
  };
};

function ErrorPage() {
  return (
    <Flex h="95vh" pt="64px" justifyContent="center" alignItems="center">
      <Flex flexDirection="column" justifyContent="center" alignItems="center">
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
            onClick={() => {
              window.open(
                "https://github.com/NTUCourse-Neo/ncn-frontend/issues/new?assignees=&labels=bug&template=bug_report.md&title=",
                "_blank"
              );
              reportEvent("course_info_page", "click", "report_bug");
            }}
          >
            問題回報
          </Button>
          <Button
            variant="solid"
            colorScheme="teal"
            leftIcon={<FaHeartbeat />}
            onClick={() => {
              window.open("https://status.course.myntu.me/", "_blank");
              reportEvent("course_info_page", "click", "status_page");
            }}
          >
            服務狀態
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
}

function CourseInfoPage({ code, course }: PageProps) {
  const bgcolor = useColorModeValue("white", "black");
  const headingColor = useColorModeValue("heading.light", "heading.dark");
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
  const toast = useToast();

  const selected = useMemo(
    () => (courseTable?.courses ?? []).map((c) => c.id).includes(code),
    [courseTable, code]
  );
  const isFavorite = useMemo(
    () => (userInfo?.favorites ?? []).map((c) => c.id).includes(course.id),
    [userInfo, course.id]
  );
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);

  const handleAddCourse = async (course: Course) => {
    if (!isLoading && !isCourseTableLoading) {
      if (courseTableKey) {
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
    }
  };

  const handleAddFavorite = async (course_id: string, course_name: string) => {
    if (!isLoading) {
      if (userInfo) {
        setIsAddingFavorite(true);
        await addOrRemoveFavorite(course_id, course_name);
        setIsAddingFavorite(false);
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
    return <ErrorPage />;
  }

  return (
    <>
      <Head>
        <title>{`${course.name} - 課程資訊 | NTUCourse Neo`}</title>
        <meta
          name="description"
          content={`${course.name} 課程的詳細資訊 | NTUCourse Neo，全新的臺大選課網站。`}
        />
      </Head>
      <Flex w="100vw" justifyContent={"center"} alignItems="center" py={6}>
        <Flex flexDirection={"column"} w="80%">
          <CustomBreadcrumb
            pageItems={[
              {
                text: "首頁",
                href: "/",
              },
              {
                text: "課程搜尋結果",
                href: "/course",
              },
              {
                text: "課程大綱",
                href: `/courseinfo/${course.id}`,
              },
            ]}
          />
          <Flex
            w="100%"
            sx={{
              color: "#1A181C",
              fontWeight: 500,
              fontSize: "28px",
              lineHeight: "1.25",
              mt: 6,
              mb: 10,
            }}
          >
            {course.name}
          </Flex>
          <Flex w="100%" justify={"space-between"} alignItems="end">
            <Flex
              gap="32px"
              sx={{
                color: "#4b4b4b",
                fontWeight: 500,
                fontSize: "16px",
                lineHeight: "1.4",
              }}
            >
              <Flex gap={"6px"}>
                <Text>開課學期</Text>
                <Text>{`${course.semester.substring(
                  0,
                  3
                )}-${course.semester.substring(3, 4)}`}</Text>
              </Flex>
              <Flex gap={"6px"}>
                <Text>開課單位</Text>
                <Text>{`${course.provider.toUpperCase()}`}</Text>
              </Flex>
            </Flex>
            <Flex gap={"10px"}>
              <Button
                size="md"
                variant="outline"
                w="116px"
                sx={{
                  borderRadius: "4px",
                  filter: "drop-shadow(0px 1px 2px rgba(105, 81, 255, 0.05))",
                  p: "8px 16px",
                  gap: "6px",
                  alignItems: "center",
                }}
                isLoading={isLoading || isAddingFavorite}
                disabled={!userInfo}
                onClick={() => {
                  handleAddFavorite(course.id, course.name);
                  reportEvent(
                    "course_info_page",
                    isFavorite ? "remove_favorite" : "add_favorite",
                    course.id
                  );
                }}
              >
                <Icon as={isFavorite ? FaHeart : FaRegHeart} boxSize="18px" />
                <Text
                  sx={{
                    fontSize: "14px",
                    lineHeight: "1.4",
                  }}
                >
                  {isFavorite ? "移除收藏" : "加入收藏"}
                </Text>
              </Button>
              <Button
                w="145px"
                colorScheme={selected ? "red" : "primary"}
                leftIcon={selected ? <FaMinus /> : <FaPlus />}
                isLoading={isCourseTableLoading}
                onClick={() => {
                  handleAddCourse(course);
                  reportEvent(
                    "course_info_page",
                    selected ? "remove_course" : "add_course",
                    course.id
                  );
                }}
                disabled={course.semester !== process.env.NEXT_PUBLIC_SEMESTER}
                sx={{
                  borderRadius: "4px",
                  filter: "drop-shadow(0px 1px 2px rgba(105, 81, 255, 0.05))",
                  p: "8px 16px",
                  gap: "6px",
                  alignItems: "center",
                  fontSize: "14px",
                  lineHeight: "1.4",
                }}
              >
                {selected ? "從課表移除" : "加入預選課表"}
              </Button>
            </Flex>
          </Flex>
          <CourseDetailInfoContainer course={course} />
        </Flex>
      </Flex>
    </>
  );
}

export default CourseInfoPage;
