import { Flex, useToast, Box, HStack, Text } from "@chakra-ui/react";
import { HashLoader } from "react-spinners";
import useCourseTable from "hooks/useCourseTable";
import { withPageAuthRequired, UserProfile } from "@auth0/nextjs-auth0";
import Head from "next/head";
import useUserInfo from "hooks/useUserInfo";
import CustomBreadcrumb from "@/components/Breadcrumb";
import UserCoursePanel from "@/components/UserCoursePanel";
import CourseTable from "@/components/CourseTable";
import { useState } from "react";
import CourseOrderList from "@/components/CourseTable/CourseOrderList";
import CourseOrderTable from "@/components/CourseTable/CourseOrderTable";
import InfoModal from "@/components/CourseTable/InfoModal";

const tabs = [
  {
    id: "courseTable",
    label: "首選課表",
  },
  {
    id: "courseOrder",
    label: "志願序排序",
    displayModes: [
      {
        id: "all",
        label: "全部排序",
      },
      {
        id: "interval",
        label: "節次排序",
      },
    ],
  },
] as const;
type TabId = typeof tabs[number]["id"];
type DisplayModeId = typeof tabs[1]["displayModes"][number]["id"];

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

  const [tabId, setTabId] = useState<TabId>("courseTable");
  const [displayModeId, setDisplayModeId] = useState<DisplayModeId>("all");
  const tabContentMap: Record<TabId, JSX.Element> = {
    courseTable: (
      <CourseTable
        courseTable={courseTable}
        tableCellProperty={{
          w: 160,
          h: 50,
          borderWidth: 1,
        }}
      />
    ),
    courseOrder:
      displayModeId === "all" ? (
        <CourseOrderList />
      ) : (
        <CourseOrderTable
          courseTable={courseTable}
          tableCellProperty={{
            w: 160,
            h: 50,
            borderWidth: 1,
          }}
        />
      ),
  };
  const hideUserCoursePanel =
    tabId === "courseOrder" && displayModeId === "all";

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
          justifyContent="start"
          alignItems="start"
          overflowY={"auto"}
          overflowX={"hidden"}
          position="relative"
          px="10%"
        >
          <Flex
            w={hideUserCoursePanel ? "100%" : "75%"}
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
                  text: "預選課表",
                  href: "/user/courseTable",
                },
              ]}
            />
            <Flex
              w="100%"
              mt={2}
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
                  預選課表
                </Text>
                <InfoModal />
              </HStack>
              <Flex
                sx={{
                  letterSpacing: "0.02em",
                  p: "6px 12px",
                  fontSize: "14px",
                  lineHeight: 1.4,
                  color: "#2D2D2D",
                  alignItems: "end",
                }}
              >
                <Text>總計</Text>
                <Text
                  sx={{
                    fontWeight: 500,
                    fontSize: "28px",
                    lineHeight: 1.25,
                    mx: 2,
                    alignItems: "end",
                  }}
                >
                  {(courseTable?.courses ?? []).reduce<number>(
                    (acc, course) => {
                      return acc + (course.credits ?? 0);
                    },
                    0
                  )}
                </Text>
                <Text>學分</Text>
              </Flex>
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
                <Flex h="100%">
                  {tabs.map((tab) => {
                    const isSelected = tab.id === tabId;
                    return (
                      <Flex
                        key={tab.id}
                        sx={{
                          h: "100%",
                          w: "fit-content",
                          fontWeight: 500,
                          mx: 6,
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out",
                          color: isSelected ? "#ffffff" : "#ffffff56",
                          borderBottom: isSelected
                            ? "2px solid #ffffff"
                            : "2px solid transparent",
                        }}
                        justifyContent="center"
                        alignItems="center"
                        onClick={() => {
                          setTabId(tab.id);
                        }}
                      >
                        {tab.label}
                      </Flex>
                    );
                  })}
                </Flex>
                {tabId === "courseOrder" ? (
                  <Flex
                    sx={{
                      bg: "#081D59",
                      h: "60%",
                      borderRadius: "full",
                    }}
                  >
                    {tabs[1].displayModes.map((mode) => {
                      const isSelected = mode.id === displayModeId;
                      return (
                        <Flex
                          key={mode.id}
                          h="auto"
                          sx={{
                            color: isSelected ? "#2d2d2d" : "#ffffff",
                            bg: isSelected ? "#ffffff" : "transparent",
                            transition: "all 0.2s ease-in-out",
                            cursor: "pointer",
                            borderRadius: "full",
                            px: "10px",
                            fontWeight: 500,
                            fontSize: "12px",
                            justifyContent: "center",
                            alignItems: "center",
                            m: 1,
                            position: "relative",
                            flexDirection: "column",
                          }}
                          onClick={() => {
                            setDisplayModeId(mode.id);
                          }}
                        >
                          {mode.label}
                        </Flex>
                      );
                    })}
                  </Flex>
                ) : null}
              </Flex>
              {tabContentMap[tabId]}
            </Box>
          </Flex>
          <Flex
            w={hideUserCoursePanel ? "0%" : "25%"}
            display={hideUserCoursePanel ? "none" : "flex"}
            sx={{
              transition: "all 2s ease-in-out",
            }}
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
