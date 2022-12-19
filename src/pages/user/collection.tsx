import { useMemo } from "react";
import {
  Flex,
  Text,
  useToast,
  Box,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import useCourseTable from "hooks/useCourseTable";
import { withPageAuthRequired, UserProfile } from "@auth0/nextjs-auth0";
import Head from "next/head";
import useUserInfo from "hooks/useUserInfo";
import CustomBreadcrumb from "@/components/Breadcrumb";
import {
  Panel,
  PanelPlaceholder,
  SkeletonBox,
  CourseInfoCard,
} from "@/components/UserCoursePanel";
import { FiCalendar } from "react-icons/fi";
import { useRouter } from "next/router";

export default function UserCollectionPage({
  user,
}: {
  readonly user: UserProfile;
}) {
  const { userInfo, isLoading, addOrRemoveFavorite } = useUserInfo(
    user?.sub ?? null,
    {
      onErrorCallback: (e, k, c) => {
        toast({
          title: "取得用戶資料失敗.",
          description: "請聯繫客服(?)",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      },
    }
  );
  const toast = useToast();
  const {
    courseTable,
    addOrRemoveCourse,
    isLoading: isCourseTableLoading,
  } = useCourseTable(userInfo?.course_tables?.[0] ?? null);

  const bgColor = useColorModeValue("white", "black");
  const selectedCourses = useMemo(() => {
    return courseTable?.courses.map((c) => c.id) ?? [];
  }, [courseTable]);
  const favoriteList = useMemo(() => userInfo?.favorites ?? [], [userInfo]);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{`我的收藏 | NTUCourse Neo`}</title>
        <meta
          name="description"
          content={`我的收藏頁面 | NTUCourse Neo，全新的臺大選課網站。`}
        />
      </Head>
      <Flex
        w="100vw"
        h="93vh"
        direction="row"
        justifyContent="center"
        alignItems="start"
        overflow="auto"
        bg={"black.100"}
      >
        <Flex
          w="100vw"
          h="93vh"
          flexDirection={"row"}
          gap={10}
          justifyContent="start"
          alignItems="start"
          overflowY={"auto"}
          overflowX={"hidden"}
          position="relative"
          px="10%"
        >
          <Flex
            w={"75%"}
            flexDirection={"column"}
            py={8}
            sx={{
              transition: "all 0.3s ease-in-out",
            }}
          >
            <CustomBreadcrumb
              pageItems={[
                {
                  text: "首頁",
                  href: "/",
                },
                {
                  text: "我的收藏",
                  href: "/user/collection",
                },
              ]}
            />
            <Flex
              w="100%"
              mt={6}
              mb={6}
              alignItems="end"
              justifyContent={"space-between"}
            >
              <HStack>
                <Text
                  sx={{
                    fontWeight: 500,
                    fontSize: "28px",
                    lineHeight: 1.4,
                  }}
                >
                  我的收藏
                </Text>
              </HStack>
            </Flex>
            <Box
              sx={{
                borderRadius: "4px",
                shadow: "0px 3px 8px rgba(75, 75, 75, 0.08)",
                bg: "#ffffff",
                border: "1px solid rgba(204, 204, 204, 0.4)",
              }}
            >
              <Flex
                sx={{
                  w: "100%",
                  bg: "#002F94",
                  h: "46px",
                  borderRadius: "4px 4px 0px 0px",
                  pl: 4,
                  pr: 8,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Flex h="100%">{/* blue bar */}</Flex>
              </Flex>
              <Flex
                w="100%"
                minH="70vh"
                justifyContent={"center"}
                alignItems="center"
                overflow={"auto"}
                pt={4}
                px={4}
                pb={12}
              ></Flex>
            </Box>
          </Flex>
          <Flex
            w={"25%"}
            sx={{
              transition: "all 2s ease-in-out",
            }}
            h="92vh"
            py={8}
            flexDirection={"column"}
            position="sticky"
            top={0}
          >
            <Panel
              title={`已加入課程 (${courseTable?.courses?.length ?? 0})`}
              icon={FiCalendar}
              isOpen={true}
              onClick={() => {}}
              fixedHeight={true}
            >
              {isCourseTableLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonBox key={i} />)
              ) : (courseTable?.courses ?? []).length > 0 ? (
                courseTable?.courses.map((course) => (
                  <CourseInfoCard
                    key={course.id}
                    course={course}
                    menuOptions={[
                      {
                        chinese: "查看課程大綱",
                        english: "View Course Outline",
                        callback: () => {
                          router.push(`/courseinfo/${course.id}`);
                        },
                      },
                      {
                        chinese: "移除",
                        english: "Remove",
                        callback: () => {
                          addOrRemoveCourse(course);
                        },
                        isRemove: true,
                      },
                    ]}
                  />
                ))
              ) : (
                <PanelPlaceholder
                  title={"尚未加入任何課程"}
                  desc={"加入課程並可在「我的課表」中檢視"}
                />
              )}
            </Panel>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired();
