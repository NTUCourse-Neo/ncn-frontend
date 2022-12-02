import { Flex, useToast, Box, HStack, Text, Center } from "@chakra-ui/react";
import { HashLoader } from "react-spinners";
import useCourseTable from "hooks/useCourseTable";
import { withPageAuthRequired, UserProfile } from "@auth0/nextjs-auth0";
import Head from "next/head";
import useUserInfo from "hooks/useUserInfo";
import CustomBreadcrumb from "@/components/Breadcrumb";
import UserCoursePanel from "@/components/UserCoursePanel";
import { CalendarOutlineIcon } from "@/components/CustomIcons";
import CourseTable from "@/components/CourseTable";

export default function CourseTablePage({
  user,
}: {
  readonly user: UserProfile;
}) {
  const { userInfo, isLoading } = useUserInfo(user?.sub ?? null, {
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
  const { courseTable } = useCourseTable(userInfo?.course_tables?.[0] ?? null);

  if (isLoading) {
    return (
      <Box maxW="screen-md" h="95vh" mx="auto" overflow="visible" p="64px">
        <Flex
          h="90vh"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
          bg={"white"}
        >
          <HashLoader size="60px" color="teal" />
        </Flex>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>{`預選課表 | NTUCourse Neo`}</title>
        <meta
          name="description"
          content={`我的預選課表 | NTUCourse Neo，全新的臺大選課網站。`}
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
          justifyContent="center"
          alignItems="start"
          overflowY={"auto"}
          overflowX={"hidden"}
          position="relative"
        >
          <Flex w="60%" flexDirection={"column"} py={8}>
            <CustomBreadcrumb
              pageItems={[
                {
                  text: "首頁",
                  href: "/",
                },
                {
                  text: "預選課表",
                  href: "/user/courseTable",
                },
              ]}
            />
            <Flex
              w="100%"
              mt={2}
              mb={3}
              alignItems="center"
              justifyContent={"space-between"}
            >
              <HStack>
                <Center>
                  <CalendarOutlineIcon boxSize={"22px"} />
                </Center>
                <Text
                  sx={{
                    fontSize: "24px",
                    lineHeight: 1.4,
                  }}
                >
                  預選課表
                </Text>
              </HStack>
              <Flex
                sx={{
                  letterSpacing: "0.02em",
                  border: "0.5px solid #000000",
                  borderRadius: "4px",
                  p: "6px 12px",
                }}
              >
                總計{" "}
                {(courseTable?.courses ?? []).reduce<number>((acc, course) => {
                  return acc + (course.credits ?? 0);
                }, 0)}{" "}
                學分
              </Flex>
            </Flex>
            <Box
              w="100%"
              overflow={"auto"}
              sx={{
                borderRadius: "4px",
              }}
            >
              <CourseTable courses={courseTable?.courses ?? []} />
            </Box>
          </Flex>
          <Flex
            w="20%"
            h="92vh"
            py={8}
            flexDirection={"column"}
            position="sticky"
            top={0}
          >
            <UserCoursePanel />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired();
