import {
  Flex,
  useToast,
  Box,
  HStack,
  Text,
  Center,
  Table,
  Tbody,
  Tr,
  Th as ChakraTh,
  Td as ChakraTd,
  TableColumnHeaderProps,
  TableCellProps,
  TableContainer,
  Thead,
} from "@chakra-ui/react";
import { HashLoader } from "react-spinners";
import useCourseTable from "hooks/useCourseTable";
import { withPageAuthRequired, UserProfile } from "@auth0/nextjs-auth0";
import Head from "next/head";
import useUserInfo from "hooks/useUserInfo";
import CustomBreadcrumb from "@/components/Breadcrumb";
import UserCoursePanel from "@/components/UserCoursePanel";
import { CalendarOutlineIcon } from "@/components/CustomIcons";
import { intervals } from "@/constant";

interface ThProps extends TableColumnHeaderProps {
  readonly children: React.ReactNode;
}
const Th: React.FC<ThProps> = ({ children, ...rest }) => {
  return (
    <ChakraTh
      sx={{
        textAlign: "center",
        lineHeight: 1.4,
        color: "#2d2d2d",
        fontWeight: 400,
        fontSize: "14px",
      }}
      {...rest}
    >
      {children}
    </ChakraTh>
  );
};

interface TdProps extends TableCellProps {
  readonly children: React.ReactNode;
  readonly isFirstDay: boolean;
  readonly isLastDay: boolean;
  readonly isFirstInterval: boolean;
  readonly isLastInterval: boolean;
}
const Td: React.FC<TdProps> = ({
  children,
  isFirstDay,
  isLastDay,
  isFirstInterval,
  isLastInterval,
  ...rest
}) => {
  return (
    <ChakraTd
      sx={{
        textAlign: "center",
        lineHeight: 1.4,
        color: "#2d2d2d",
        fontWeight: 400,
        fontSize: "14px",
        borderRadius: `${isFirstDay && isFirstInterval ? "4px" : "0px"} ${
          isLastDay && isFirstInterval ? "4px" : "0px"
        } ${isLastDay && isLastInterval ? "4px" : "0px"} ${
          isFirstDay && isLastInterval ? "4px" : "0px"
        }`,
        borderTop: `1px solid ${isFirstInterval ? "#909090" : "#ECECEC"}`,
        borderLeft: `1px solid ${isFirstDay ? "#909090" : "#ECECEC"}`,
        borderBottom: `1px solid ${isLastInterval ? "#909090" : "#ECECEC"}`,
        borderRight: `1px solid ${isLastDay ? "#909090" : "#ECECEC"}`,
      }}
      {...rest}
    >
      {children}
    </ChakraTd>
  );
};

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

  const days = ["一", "二", "三", "四", "五", "六", "日"];

  const tableCellProperty = {
    w: 120,
    h: 50,
  } as const;

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
              <TableContainer>
                <Table
                  variant={"unstyled"}
                  sx={{
                    borderCollapse: "separate",
                    borderSpacing: "0 0",
                  }}
                >
                  <Thead>
                    <Tr>
                      {days.map((day) => {
                        return (
                          <Th key={day}>
                            <Center minW={`${tableCellProperty.w}px`}>
                              {day}
                            </Center>
                          </Th>
                        );
                      })}
                    </Tr>
                  </Thead>
                  <Flex w="100%" h="8px" />
                  <Tbody
                    sx={{
                      border: "1px solid #909090",
                      borderRadius: "4px",
                    }}
                  >
                    {Array.from({ length: intervals.length }, (_, i) => {
                      return (
                        <Tr
                          key={i}
                          sx={{
                            borderRadius: "4px",
                          }}
                        >
                          {days.map((day, j) => {
                            return (
                              <Td
                                key={j}
                                minW={`${tableCellProperty.w}px`}
                                minH={`${tableCellProperty.h}px`}
                                isFirstDay={j === 0}
                                isLastDay={j === days.length - 1}
                                isFirstInterval={i === 0}
                                isLastInterval={i === intervals.length - 1}
                              >
                                123
                              </Td>
                            );
                          })}
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
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
