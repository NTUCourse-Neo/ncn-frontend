import { React, useEffect, useState, useMemo } from "react";
import { Flex, Text, useToast, Box, Spacer, Accordion } from "@chakra-ui/react";
import SkeletonRow from "components/SkeletonRow";
import { HashLoader, BeatLoader } from "react-spinners";
import CourseInfoRow from "components/CourseInfoRow";
import { useUserData } from "components/Providers/UserProvider";
import { fetchFavoriteCourses } from "queries/course";
import { useDisplayTags } from "components/Providers/DisplayTagsProvider";
import { useCourseTable } from "components/Providers/CourseTableProvider";
import { fetchCourseTable } from "queries/courseTable";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import handleFetch from "utils/CustomFetch";
import Head from "next/head";
import { useRouter } from "next/router";

export default function UserMyPage({ user }) {
  const { setUser, user: userInfo } = useUserData();
  const toast = useToast();
  const { courseTable, setCourseTable } = useCourseTable();
  const { displayTags } = useDisplayTags();
  const [favorite_list, setFavorite_list] = useState([]);
  const [Loading, setLoading] = useState(true);
  const router = useRouter();
  const userLoading = !userInfo;

  const selectedCourses = useMemo(() => {
    return courseTable?.courses;
  }, [courseTable]);

  // fetch userInfo
  useEffect(() => {
    // fetch on render
    const fetchUserInfo = async () => {
      if (user) {
        try {
          const user_data = await handleFetch("/api/user", {
            user_id: user?.sub,
          });
          await setUser(user_data);
          const course_tables = user_data.db.course_tables;
          // console.log(course_tables);
          if (course_tables.length === 0) {
            setCourseTable(null);
          } else {
            // pick the first table
            try {
              const course_table = await fetchCourseTable(course_tables[0]);
              setCourseTable(course_table);
            } catch (e) {
              if (e?.response?.status === 403 || e?.response?.status === 404) {
                // expired
                setCourseTable(null);
                return;
              }
              toast({
                title: "取得課表資料失敗.",
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            }
          }
        } catch (e) {
          toast({
            title: "取得用戶資料失敗.",
            description: "請聯繫客服(?)",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          if (e?.response?.data?.msg === "access_token_expired") {
            router.push("/api/auth/login");
          }
        }
      }
    };

    fetchUserInfo();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const fetchFavoriteCoursesById = async () => {
      setLoading(true);
      // console.log(userInfo);
      if (userInfo.db.favorites.length >= 0) {
        try {
          const courses = await fetchFavoriteCourses(userInfo.db.favorites);
          // console.log(courses);
          setFavorite_list(courses);
        } catch (e) {
          // console.log(e);
          toast({
            title: "載入最愛課程失敗.",
            description: "請聯繫客服(?)",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }
      }
    };

    if (userInfo) {
      fetchFavoriteCoursesById();
      setLoading(false);
    }
  }, [userInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  if (userLoading) {
    return (
      <Box maxW="screen-md" h="95vh" mx="auto" overflow="visible" p="64px">
        <Flex
          h="90vh"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
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
      <Flex h={{ base: "90vh", md: "95vh" }} w="100vw">
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
            {Loading ? <BeatLoader size={8} color="teal" /> : <></>}
            <Text
              fontSize="md"
              fontWeight="medium"
              color="gray.400"
              my="2"
              ml="1"
            >
              {Loading
                ? "載入中"
                : `我的最愛課程 共有 ${favorite_list.length} 筆結果`}
            </Text>
          </Flex>
          <Box w={{ base: "100%", md: "80%", lg: "70%" }}>
            <Flex direction="column" alignItems={"center"}>
              {favorite_list.map((course, index) => (
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
                    displayTags={displayTags}
                    displayTable={false}
                    isfavorite={
                      userInfo === null
                        ? false
                        : userInfo.db.favorites.includes(course.id)
                    }
                  />
                  <Spacer my={{ base: 2, md: 1 }} />
                </Accordion>
              ))}
            </Flex>
          </Box>

          <Box ml="48vw" transition="all 500ms ease-in-out">
            <SkeletonRow loading={Loading} />
          </Box>
        </Flex>
      </Flex>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired();
