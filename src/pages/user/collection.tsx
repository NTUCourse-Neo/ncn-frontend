import { useMemo, useState } from "react";
import {
  Flex,
  Text,
  useToast,
  Box,
  HStack,
  VStack,
  Accordion,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { HashLoader } from "react-spinners";
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
import CourseInfoRow from "@/components/CourseInfoRow";
import Dropdown from "@/components/Dropdown";
import { ChevronDownIcon } from "@chakra-ui/icons";

const sortOptions = [
  {
    id: "add_time_asc",
    chinese: "加入時間（新→舊）",
    english: "Add Time (New→Old)",
  },
  {
    id: "add_time_desc",
    chinese: "加入時間（舊→新）",
    english: "Add Time (Old→New)",
  },
  {
    id: "limit_asc",
    chinese: "修課總人數 (遞增)",
    english: "Enrollment Limit (Ascending)",
  },
  {
    id: "limit_desc",
    chinese: "修課總人數 (遞減)",
    english: "Enrollment Limit (Descending)",
  },
  {
    id: "credits_asc",
    chinese: "學分數 (遞增)",
    english: "Credits (Ascending)",
  },
  {
    id: "credits_desc",
    chinese: "學分數 (遞減)",
    english: "Credits (Descending)",
  },
] as const;
type SortOption = typeof sortOptions[number]["id"];

export default function UserCollectionPage({
  user,
}: {
  readonly user: UserProfile;
}) {
  const [sortOption, setSortOption] = useState<SortOption>(sortOptions[0].id);
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
  const {
    courseTable,
    addOrRemoveCourse,
    isLoading: isCourseTableLoading,
  } = useCourseTable(userInfo?.course_tables?.[0] ?? null);

  const selectedCourses = useMemo(() => {
    return courseTable?.courses.map((c) => c.id) ?? [];
  }, [courseTable]);
  const favoriteList = useMemo(() => userInfo?.favorites ?? [], [userInfo]);
  const router = useRouter();

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
                <Flex
                  h="100%"
                  sx={{
                    color: "white",
                    fontWeight: 500,
                    fontSize: "12px",
                    alignItems: "center",
                  }}
                >
                  共 {favoriteList.length} 門收藏課程
                </Flex>
                <Flex>
                  <Dropdown
                    closeAfterClick={true}
                    reverse={false}
                    renderDropdownButton={() => (
                      <HStack
                        sx={{
                          border: "1px solid #CCCCCC",
                          borderRadius: "4px",
                          px: "12px",
                          bg: "white",
                          fontSize: "12px",
                          py: "5.5px",
                        }}
                      >
                        <Text minW="40px" noOfLines={1}>
                          排序：
                          {sortOptions.find(
                            (option) => option.id === sortOption
                          )?.chinese ?? "請選擇排序方式"}
                        </Text>
                        <ChevronDownIcon />
                      </HStack>
                    )}
                  >
                    <Box
                      sx={{
                        px: 2,
                        my: 2,
                      }}
                    >
                      <RadioGroup
                        value={sortOption}
                        onChange={(next) => {
                          setSortOption(next as SortOption);
                        }}
                        gap={2}
                      >
                        {sortOptions.map((option) => (
                          <Radio key={option.id} p={2} value={option.id}>
                            <Flex
                              w="120px"
                              sx={{
                                fontWeight: 500,
                                fontSize: "13px",
                                lineHeight: "1.4",
                                color: "#4b4b4b",
                              }}
                            >
                              {option.chinese}
                            </Flex>
                          </Radio>
                        ))}
                      </RadioGroup>
                    </Box>
                  </Dropdown>
                </Flex>
              </Flex>
              <Flex
                w="100%"
                minH="70vh"
                justifyContent={"center"}
                overflow={"auto"}
              >
                {favoriteList.length > 0 ? (
                  <Accordion
                    allowToggle
                    allowMultiple={false}
                    w={{ base: "90vw", md: "100%" }}
                  >
                    {favoriteList
                      .sort((a, b) => {
                        // TODO: implement sorting logic
                        // switch-case
                        return (a?.credits ?? 0) - (b?.credits ?? 0);
                      })
                      .map((course) => (
                        <CourseInfoRow
                          key={course.id}
                          courseInfo={course}
                          selected={selectedCourses.includes(course.id)}
                        />
                      ))}
                  </Accordion>
                ) : (
                  <Flex
                    flexGrow={1}
                    justify="center"
                    alignItems={"center"}
                    flexDirection={"column"}
                    color="#909090"
                  >
                    <Flex
                      sx={{
                        fontSize: "20px",
                        fontWeight: 500,
                        mb: 6,
                      }}
                    >
                      尚未收藏任何課程
                    </Flex>
                    <VStack
                      spacing={0}
                      sx={{
                        fontSize: "14px",
                      }}
                    >
                      <Flex>還在想要不要修這門課嗎？</Flex>
                      <Flex>先收藏起來慢慢考慮</Flex>
                    </VStack>
                  </Flex>
                )}
              </Flex>
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
