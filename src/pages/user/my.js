import { React, useMemo } from "react";
import {
  Flex,
  Text,
  useToast,
  Box,
  Spacer,
  Accordion,
  useColorModeValue,
} from "@chakra-ui/react";
import SkeletonRow from "components/SkeletonRow";
import { HashLoader, BeatLoader } from "react-spinners";
import CourseInfoRow from "components/CourseInfoRow";
import useCourseTable from "hooks/useCourseTable";
import useNeoLocalStorage from "hooks/useNeoLocalStorage";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Head from "next/head";
import useUserInfo from "hooks/useUserInfo";

export default function UserMyPage({ user }) {
  const { userInfo, isLoading } = useUserInfo(user?.sub, {
    onErrorCallback: (e, k, c) => {
      toast({
        title: "取得用戶資料失敗.",
        description: "請聯繫客服(?)",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    },
  });
  const toast = useToast();
  const { neoLocalCourseTableKey } = useNeoLocalStorage();
  const courseTableKey = userInfo
    ? userInfo?.course_tables?.[0] ?? null
    : neoLocalCourseTableKey;
  const { courseTable } = useCourseTable(courseTableKey);

  const bgColor = useColorModeValue("white", "black");
  const selectedCourses = useMemo(() => {
    return courseTable?.courses.map((c) => c.id);
  }, [courseTable]);
  const favoriteList = useMemo(() => userInfo?.favorites ?? [], [userInfo]);

  if (isLoading) {
    return (
      <Box maxW="screen-md" h="95vh" mx="auto" overflow="visible" p="64px">
        <Flex
          h="90vh"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
          bg={bgColor}
        >
          <HashLoader size="60px" color="teal" />
        </Flex>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>{`我的收藏 | NTUCourse Neo`}</title>
        <meta
          name="description"
          content={`我的收藏頁面 | NTUCourse Neo，全新的臺大選課網站。`}
        />
      </Head>
      <Flex h={{ base: "90vh", md: "95vh" }} w="100vw" bg={bgColor}>
        <Flex
          w="100vw"
          direction="column"
          justifyContent="start"
          alignItems="center"
          overflow="auto"
          transition="all 500ms ease-in-out"
          pt="64px"
        >
          <Flex flexDirection="row" alignItems="center" justifyContent="start">
            {!userInfo ? <BeatLoader size={8} color="teal" /> : <></>}
            <Text
              fontSize="md"
              fontWeight="medium"
              color="gray.400"
              my="2"
              ml="1"
            >
              {!userInfo
                ? "載入中"
                : `我的最愛課程 共有 ${favoriteList.length} 筆結果`}
            </Text>
          </Flex>
          <Box w={{ base: "100%", md: "80%", lg: "70%" }}>
            <Flex direction="column" alignItems={"center"}>
              {favoriteList.map((course, index) => (
                <Accordion
                  allowToggle
                  w={{ base: "90vw", md: "100%" }}
                  key={index}
                >
                  <CourseInfoRow
                    courseInfo={course}
                    selected={
                      selectedCourses && selectedCourses.includes(course.id)
                    }
                    displayTable={false}
                  />
                  <Spacer my={{ base: 2, md: 1 }} />
                </Accordion>
              ))}
            </Flex>
          </Box>

          <Box ml="48vw" transition="all 500ms ease-in-out">
            <SkeletonRow loading={!userInfo} />
          </Box>
        </Flex>
      </Flex>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired();
