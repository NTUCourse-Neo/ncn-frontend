import {
  Flex,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  HStack,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  Icon,
  Box,
  Button,
  Tag,
  VStack,
  StatHelpText,
  Divider,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Spacer,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";
import {
  FaCircle,
  FaRss,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
} from "react-icons/fa";
import { IoMdOpen } from "react-icons/io";
import BetaBadge from "components/BetaBadge";
import { info_view_map } from "data/mapping_table";
import { hash_to_color_hex_with_hue } from "utils/colorAgent";
import PTTContentRowContainer from "components/CourseInfo/PTTContentRowContainer";
import SignUpCard from "components/CourseInfo/SignUpCard";
import SignUpReportForm from "components/CourseInfo/SignUpReportForm";
import { getCourseSyllabusData } from "queries/course";
import handleFetch from "utils/CustomFetch";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import Image from "next/image";
import parseCourseSchedlue from "utils/parseCourseSchedule";

function DataSourceTag({ source }) {
  return (
    <HStack spacing="2">
      <FaRss color="gray" size="12" />
      <Text
        fontSize="sm"
        textAlign="center"
        color={useColorModeValue("gray.500", "gray.400")}
      >
        資料來源: {source}
      </Text>
    </HStack>
  );
}

function LoadingPanel({ title, ...restProps }) {
  return (
    <Flex
      w="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      {...restProps}
    >
      <VStack>
        <Image
          alt=""
          src={"/img/parrot/parrot.gif"}
          height={32}
          width={32}
          layout="fixed"
        />
        <Text
          fontSize="lg"
          fontWeight="800"
          color="gray.500"
          textAlign="center"
        >
          {title}
        </Text>
      </VStack>
    </Flex>
  );
}

function PanelPlaceholder({
  title = "暫無資訊",
  isEmpty = true,
  ...restProps
}) {
  return (
    <Flex
      w="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      {...restProps}
    >
      <Icon
        as={isEmpty ? FaQuestionCircle : FaExclamationTriangle}
        boxSize="32px"
        color="gray.500"
      />
      <Text
        mt="2"
        fontSize="lg"
        fontWeight="800"
        color="gray.500"
        textAlign="center"
      >
        {title}
      </Text>
    </Flex>
  );
}

function UnauthenticatedPanel({ ...restProps }) {
  const router = useRouter();
  return (
    <Flex
      flexDirection={"column"}
      py={2}
      my={3}
      h="100%"
      w="100%"
      align="center"
      justify="center"
      {...restProps}
    >
      <Icon as={FaInfoCircle} boxSize="32px" color="gray.500" />
      <Text
        mt="2"
        fontSize="lg"
        fontWeight="800"
        color="gray.500"
        textAlign="center"
      >
        會員專屬功能
      </Text>
      <Button
        rightIcon={<FaChevronRight />}
        size="md"
        my={2}
        py={2}
        colorScheme="blue"
        fontSize="md"
        fontWeight="800"
        onClick={() => {
          router.push("/api/auth/login");
        }}
      >
        來去登入
      </Button>
    </Flex>
  );
}

function PanelWrapper({
  isLoading,
  loadingFallback = <LoadingPanel title="載入中..." height="100%" />,
  isUnauth,
  unauthFallback = <UnauthenticatedPanel />,
  children,
}) {
  if (isLoading) {
    return loadingFallback;
  }
  if (isUnauth) {
    return unauthFallback;
  }
  return <>{children}</>;
}

function SignUpPanel({
  isLoading,
  isUnauth,
  course,
  SignUpPostData,
  setSignUpPostData,
  fetchSignUpPostData,
  signUpCardIdx,
  setSignUpCardIdx,
}) {
  const textColor = useColorModeValue("text.light", "text.dark");
  return (
    <PanelWrapper
      isLoading={isLoading}
      isUnauth={isUnauth}
      loadingFallback={
        <LoadingPanel title="努力跑加簽大地中..." height="100%" />
      }
    >
      {!SignUpPostData ? (
        <PanelPlaceholder title="無加簽相關資訊" height="100%" />
      ) : SignUpPostData.length === 0 ? (
        <Flex
          w="100%"
          h="100%"
          mt="4"
          flexDirection="column"
          justifyContent="center"
          alignItems={{ base: "start", lg: "center" }}
        >
          <PanelPlaceholder title="無加簽相關資訊" h="100%" pt="0" />
          <HStack w="100%" pr="8" mt="8" justify="end">
            <SignUpReportForm
              courseId={course.id}
              haveSubmitted={SignUpPostData.some((obj) => obj.is_owner)}
              submitCallback={fetchSignUpPostData}
            />
          </HStack>
        </Flex>
      ) : (
        <Flex
          w="100%"
          h="100%"
          mt="4"
          flexDirection="column"
          justifyContent="center"
          alignItems={{ base: "start", lg: "center" }}
        >
          <SignUpCard
            post={SignUpPostData[signUpCardIdx]}
            SignUpPostData={SignUpPostData}
            setSignUpPostData={setSignUpPostData}
            fetchSignUpPostData={fetchSignUpPostData}
          />
          <HStack w="100%" pr="8" mt="8">
            <HStack>
              <IconButton
                size="md"
                variant="ghost"
                icon={<FaChevronLeft />}
                onClick={() =>
                  setSignUpCardIdx(
                    signUpCardIdx === 0
                      ? SignUpPostData.length - 1
                      : signUpCardIdx - 1
                  )
                }
              />
              <IconButton
                size="md"
                variant="ghost"
                icon={<FaChevronRight />}
                onClick={() =>
                  setSignUpCardIdx((signUpCardIdx + 1) % SignUpPostData.length)
                }
              />
              <Text
                fontSize="sm"
                fontWeight="800"
                color={textColor}
                textAlign="center"
              >
                {signUpCardIdx + 1}/{SignUpPostData.length}
              </Text>
            </HStack>
            <Spacer />
            <SignUpReportForm
              courseId={course.id}
              haveSubmitted={SignUpPostData.some((obj) => obj.is_owner)}
              submitCallback={fetchSignUpPostData}
            />
          </HStack>
        </Flex>
      )}
    </PanelWrapper>
  );
}

function EnrollStatusPanel({ isLoading, isUnauth, CourseEnrollStatus }) {
  return (
    <PanelWrapper
      isLoading={isLoading}
      isUnauth={isUnauth}
      loadingFallback={
        <LoadingPanel title="努力取得資訊中..." height="100%" pt={8} />
      }
    >
      {!CourseEnrollStatus ? (
        <PanelPlaceholder
          title="無法取得課程即時資訊"
          isEmpty={false}
          h="100%"
          pt="8"
        />
      ) : (
        <Flex
          w="100%"
          mt="4"
          flexDirection="row"
          justifyContent="center"
          alignItems={{ base: "start", lg: "center" }}
          flexWrap="wrap"
        >
          <Stat>
            <StatLabel>選上</StatLabel>
            <StatNumber>{CourseEnrollStatus.enrolled}</StatNumber>
            <StatHelpText>人</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>選上外系</StatLabel>
            <StatNumber>{CourseEnrollStatus.enrolled_other}</StatNumber>
            <StatHelpText>人</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>登記</StatLabel>
            <StatNumber>{CourseEnrollStatus.registered}</StatNumber>
            <StatHelpText>人</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>剩餘</StatLabel>
            <StatNumber>{CourseEnrollStatus.remain}</StatNumber>
            <StatHelpText>空位</StatHelpText>
          </Stat>
        </Flex>
      )}
    </PanelWrapper>
  );
}

function NTURatingPanel({ isLoading, isUnauth, NTURatingData }) {
  return (
    <PanelWrapper
      isLoading={isLoading}
      isUnauth={isUnauth}
      loadingFallback={
        <LoadingPanel title="查詢評價中..." height="100%" pt={8} />
      }
    >
      {!NTURatingData ? (
        <Flex h="100%" flexDirection="column" alignItems="center">
          <PanelPlaceholder title="無評價資訊" h="100%" pt="8" />
          <Button
            mt="4"
            colorScheme="blue"
            variant="outline"
            size="sm"
            rightIcon={<IoMdOpen />}
            onClick={() =>
              window.open(
                "https://rating.myntu.me/?referrer=ntucourse_neo",
                "_blank"
              )
            }
          >
            前往 NTURating 撰寫評價
          </Button>
        </Flex>
      ) : (
        <Flex h="100%" flexDirection="column" alignItems="start">
          <Text fontSize="md" fontWeight="600" color="gray.700">
            NTURating 上共有 {NTURatingData.count} 筆評價
          </Text>
          <HStack w="100%" justify="space-between" my="2">
            <Stat>
              <StatLabel>甜度</StatLabel>
              <StatNumber>{NTURatingData.sweety}</StatNumber>
              <StatHelpText>平均值</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>涼度</StatLabel>
              <StatNumber>{NTURatingData.breeze}</StatNumber>
              <StatHelpText>平均值</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>紮實度</StatLabel>
              <StatNumber>{NTURatingData.workload}</StatNumber>
              <StatHelpText>平均值</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>品質</StatLabel>
              <StatNumber>{NTURatingData.quality}</StatNumber>
              <StatHelpText>平均值</StatHelpText>
            </Stat>
          </HStack>
          <Button
            colorScheme="blue"
            variant="outline"
            size="sm"
            rightIcon={<IoMdOpen />}
            onClick={() =>
              window.open(
                NTURatingData.url + "?referrer=ntucourse_neo",
                "_blank"
              )
            }
          >
            前往 NTURating 查看該課程評價
          </Button>
        </Flex>
      )}
    </PanelWrapper>
  );
}

function PTTReviewPanel({ isLoading, isUnauth, PTTReviewData }) {
  return (
    <PanelWrapper
      isLoading={isLoading}
      isUnauth={isUnauth}
      loadingFallback={
        <LoadingPanel title="努力爬文中..." height="100%" pt={8} />
      }
    >
      {!PTTReviewData ? (
        <PanelPlaceholder title="無相關貼文資訊" h="100%" pt="8" />
      ) : (
        <PTTContentRowContainer info={PTTReviewData} height="150px" />
      )}
    </PanelWrapper>
  );
}

function PTTExamPanel({ isLoading, isUnauth, PTTExamData }) {
  return (
    <PanelWrapper
      isLoading={isLoading}
      isUnauth={isUnauth}
      loadingFallback={
        <LoadingPanel title="努力爬文中..." height="100%" pt={8} />
      }
    >
      {!PTTExamData ? (
        <PanelPlaceholder title="無相關貼文資訊" h="100%" pt="8" />
      ) : (
        <PTTContentRowContainer info={PTTExamData} height="150px" />
      )}
    </PanelWrapper>
  );
}

function SyllabusPanel({ isLoading, isUnauth, SyllabusData }) {
  const headingColor = useColorModeValue("heading.light", "heading.dark");
  const textColor = useColorModeValue("text.light", "text.dark");
  return (
    <PanelWrapper isLoading={isLoading} isUnauth={isUnauth}>
      {!SyllabusData ? (
        <PanelPlaceholder title="無課程大綱資訊" h="100%" pt="8" />
      ) : (
        <Flex
          w="100%"
          my="4"
          flexDirection="column"
          justifyContent="start"
          alignItems="start"
          wordBreak="break-all"
          overflow="auto"
        >
          {Object.keys(SyllabusData.syllabus).map((key) => {
            const line = SyllabusData.syllabus[key].split("\n");
            const content = line.map((item, index) => {
              return (
                <Text
                  key={syllabusTitle[key] + "content" + index}
                  mb="0.5"
                  fontSize="md"
                  fontWeight="400"
                  color={textColor}
                >
                  {item.trim()}
                </Text>
              );
            });

            return (
              <React.Fragment key={syllabusTitle[key]}>
                <Text fontSize="lg" fontWeight="600" color={headingColor}>
                  {syllabusTitle[key]}
                </Text>
                {SyllabusData.syllabus[key] !== "" ? (
                  content
                ) : (
                  <Text
                    key={syllabusTitle[key] + "content"}
                    fontSize="md"
                    fontWeight="400"
                    color="gray.600"
                  >
                    無
                  </Text>
                )}
              </React.Fragment>
            );
          })}
        </Flex>
      )}
    </PanelWrapper>
  );
}

function GradePolicyPanel({ isLoading, isUnauth, SyllabusData }) {
  const headingColor = useColorModeValue("heading.light", "heading.dark");
  const textColor = useColorModeValue("text.light", "text.dark");
  return (
    <PanelWrapper
      isLoading={isLoading}
      isUnauth={isUnauth}
      loadingFallback={
        <LoadingPanel title="查看配分中..." height="100%" pt={8} />
      }
    >
      {!SyllabusData || !SyllabusData.grade ? (
        <PanelPlaceholder title="無評分相關資訊" h="100%" pt="8" />
      ) : (
        <Flex
          my="4"
          flexDirection={{ base: "column", lg: "row" }}
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Box w="200px" h="200px">
            <PieChart
              lineWidth={50}
              label={({ dataEntry }) => dataEntry.value + "%"}
              labelPosition={75}
              data={SyllabusData.grade}
              labelStyle={() => ({
                fill: "white",
                fontSize: "10px",
                fontFamily: "sans-serif",
              })}
            />
          </Box>
          <VStack mt={{ base: 4, lg: 0 }} align="start">
            {SyllabusData.grade.map((item, index) => {
              const line = item.comment.split("\n");
              const content = line.map((item, index) => {
                return (
                  <Text
                    key={"SyllabusDataContent" + index}
                    mb="1"
                    fontSize="md"
                    fontWeight="400"
                    color={textColor}
                  >
                    {item.trim()}
                  </Text>
                );
              });
              return (
                <Popover key={"SyllabusData" + index}>
                  <PopoverTrigger>
                    <HStack justify="start" cursor="pointer">
                      <Icon as={FaCircle} size="20px" color={item.color} />
                      <Text fontSize="lg" fontWeight="800" color={item.color}>
                        {item.value}%
                      </Text>
                      <Text fontSize="md" fontWeight="600" color={headingColor}>
                        {item.title}
                      </Text>
                    </HStack>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>
                      <HStack>
                        <Text fontSize="lg" fontWeight="800" color={item.color}>
                          {item.value}%
                        </Text>
                        <Text fontSize="md" fontWeight="600" color="gray.700">
                          {item.title}
                        </Text>
                      </HStack>
                    </PopoverHeader>
                    <PopoverBody>
                      {item.comment === "" ? (
                        <Text fontSize="md" fontWeight="400" color="gray.700">
                          無詳細資訊
                        </Text>
                      ) : (
                        content
                      )}
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              );
            })}
          </VStack>
        </Flex>
      )}
    </PanelWrapper>
  );
}

const syllabusTitle = {
  intro: "概述",
  objective: "目標",
  requirement: "要求",
  office_hour: "Office Hour",
  material: "參考書目",
  specify: "指定閱讀",
};

function CourseDetailInfoContainer({ course }) {
  const toast = useToast();
  const { user, isLoading: isAuth0Loading } = useUser();
  const router = useRouter();

  // Course live data
  const [CourseEnrollStatus, setCourseEnrollStatus] = useState(null);
  const [NTURatingData, setNTURatingData] = useState(null);
  const [PTTReviewData, setPTTReviewData] = useState(null);
  const [PTTExamData, setPTTExamData] = useState(null);
  const [SyllabusData, setSyllabusData] = useState(null);
  const [SignUpPostData, setSignUpPostData] = useState(null);

  // Live data loading states
  const [isLoadingEnrollInfo, setIsLoadingEnrollInfo] = useState(true);
  const [isLoadingRatingData, setIsLoadingRatingData] = useState(true);
  const [isLoadingPTTReviewData, setIsLoadingPTTReviewData] = useState(true);
  const [isLoadingPTTExamData, setIsLoadingPTTExamData] = useState(true);
  const [isLoadingSyllabusData, setIsLoadingSyllabusData] = useState(true);
  const [isLoadingSignUpPostData, setIsLoadingSignUpPostData] = useState(true);

  // useEffect(()=>{
  //   console.log('Form: ', signUpCardForm);
  // },[signUpCardForm])

  const [signUpCardIdx, setSignUpCardIdx] = useState(0);

  async function fetchCourseEnrollData() {
    setIsLoadingEnrollInfo(true);
    let data;
    try {
      data = await handleFetch("/api/course/enrollInfo", {
        courseId: course.serial,
      });
    } catch (error) {
      setIsLoadingEnrollInfo(false);
      toast({
        title: "錯誤",
        description: "無法取得課程即時資訊",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      if (error?.response?.data?.msg === "access_token_expired") {
        router.push("/api/auth/login");
      }
      return;
    }
    setCourseEnrollStatus(data);
    setIsLoadingEnrollInfo(false);
  }
  async function fetchNTURatingData() {
    setIsLoadingRatingData(true);
    let data;
    try {
      data = await handleFetch("/api/course/ntuRating", {
        courseId: course.id,
      });
    } catch (error) {
      console.log(error);
      setIsLoadingRatingData(false);
      toast({
        title: "無法取得 NTURating 評價資訊",
        description: "請洽 rating.myntu.me",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      if (error?.response?.data?.msg === "access_token_expired") {
        router.push("/api/auth/login");
      }
      return;
    }
    setNTURatingData(data);
    setIsLoadingRatingData(false);
  }
  async function fetchPTTReviewData() {
    setIsLoadingPTTReviewData(true);
    let data;
    try {
      data = await handleFetch("/api/course/ptt", {
        courseId: course.id,
        type: "review",
      });
    } catch (error) {
      setIsLoadingPTTReviewData(false);
      toast({
        title: "無法取得 PTT 貼文資訊",
        description: "請洽 ptt.cc",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      if (error?.response?.data?.msg === "access_token_expired") {
        router.push("/api/auth/login");
      }
      return;
    }
    setPTTReviewData(data);
    setIsLoadingPTTReviewData(false);
  }
  async function fetchPTTExamData() {
    setIsLoadingPTTExamData(true);
    let data;
    try {
      data = await handleFetch("/api/course/ptt", {
        courseId: course.id,
        type: "exam",
      });
    } catch (error) {
      setIsLoadingPTTExamData(false);
      toast({
        title: "無法取得 PTT 貼文資訊",
        description: "請洽 ptt.cc",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      if (error?.response?.data?.msg === "access_token_expired") {
        router.push("/api/auth/login");
      }
      return;
    }
    setPTTExamData(data);
    setIsLoadingPTTExamData(false);
  }
  async function fetchSyllabusData() {
    setIsLoadingSyllabusData(true);
    let data;
    try {
      data = await getCourseSyllabusData(course.id);
    } catch (error) {
      setIsLoadingSyllabusData(false);
      toast({
        title: "無法取得課程大綱資訊",
        description: "請洽台大課程網",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (data && data.grade) {
      data.grade.forEach((grade) => {
        grade.color = hash_to_color_hex_with_hue(grade.title, {
          min: 180,
          max: 200,
        });
      });
    }
    setSyllabusData(data);
    setIsLoadingSyllabusData(false);
  }
  async function fetchSignUpPostData() {
    setIsLoadingSignUpPostData(true);
    let data;
    try {
      data = await handleFetch("/api/social/getByCourseId", {
        course_id: course.id,
      });
    } catch (error) {
      setIsLoadingSignUpPostData(false);
      toast({
        title: "無法取得加簽資訊",
        description: "請稍後再試一次",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      if (error?.response?.data?.msg === "access_token_expired") {
        router.push("/api/auth/login");
      }
      return;
    }
    setSignUpPostData(data);
    setSignUpCardIdx(0);
    setIsLoadingSignUpPostData(false);
  }

  useEffect(() => {
    fetchSyllabusData();
    if (!isAuth0Loading && user) {
      fetchCourseEnrollData();
      fetchSignUpPostData();
      fetchNTURatingData();
      fetchPTTReviewData();
      fetchPTTExamData();
    } else if (!isAuth0Loading && !user) {
      setIsLoadingEnrollInfo(false);
      setIsLoadingRatingData(false);
      setIsLoadingPTTReviewData(false);
      setIsLoadingPTTExamData(false);
      setIsLoadingSignUpPostData(false);
    }
  }, [isAuth0Loading, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const course_codes_1 = [
    { title: "流水號", value: course.serial },
    { title: "課號", value: course.code },
    { title: "課程識別碼", value: course.identifier },
    { title: "班次", value: course?.class ?? "無" },
  ];
  const course_codes_2 = [
    { title: "人數上限", value: course.slot },
    {
      title: "必選修",
      value: info_view_map.requirement.map[course.requirement],
    },
    { title: "開課學期", value: course.semester },
    { title: "授課語言", value: info_view_map.language.map[course.language] },
  ];
  const headingColor = useColorModeValue("heading.light", "heading.dark");
  const textColor = useColorModeValue("text.light", "text.dark");

  return (
    <Flex
      w="100%"
      minH="83vh"
      pt={{ base: "150px", lg: 0 }}
      flexDirection={{ base: "column", lg: "row" }}
      flexWrap="wrap"
      justify={"center"}
    >
      {/* COL 1 */}
      <Flex w={{ base: "100%", lg: "30%" }} flexDirection={"column"}>
        {/* Box1 */}
        <Flex
          bg={useColorModeValue("gray.100", "gray.600")}
          my="1vh"
          px="6"
          py="4"
          borderRadius="xl"
          flexDirection="column"
          flexGrow={1}
          flexShrink={1}
        >
          <Text fontSize="2xl" fontWeight="800" color={headingColor}>
            詳細資料
          </Text>
          <Flex
            mt="4"
            justifyContent="start"
            alignItems="start"
            flexWrap="wrap"
            gap="2"
          >
            <Flex mr="16" flexDirection="column" flexWrap="wrap">
              {course_codes_1.map((item, index) => {
                return (
                  <Stat key={"code_stats_1" + index}>
                    <StatLabel>{item.title}</StatLabel>
                    <StatNumber>{item.value}</StatNumber>
                  </Stat>
                );
              })}
            </Flex>
            <Flex mr="16" flexDirection="column" flexWrap="wrap">
              {course_codes_2.map((item, index) => {
                return (
                  <Stat key={"code_stats_2" + index}>
                    <StatLabel>{item.title}</StatLabel>
                    <StatNumber>{item.value}</StatNumber>
                  </Stat>
                );
              })}
            </Flex>
            <Flex flexDirection="column" flexWrap="wrap">
              <Stat>
                <StatLabel>系所</StatLabel>
                <StatNumber>
                  <HStack spacing="2">
                    {course.departments.length === 0 ? (
                      <Tag colorScheme="blackAlpha" size="lg">
                        無資訊
                      </Tag>
                    ) : (
                      <Flex flexDirection={"row"} flexWrap="wrap">
                        {course.departments.map((department, index) => {
                          return (
                            <Tag
                              key={"department_" + index}
                              colorScheme="blue"
                              size="lg"
                              m={1}
                            >
                              {department.name_full}
                            </Tag>
                          );
                        })}
                      </Flex>
                    )}
                  </HStack>
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>學分</StatLabel>
                <StatNumber>{course.credits}</StatNumber>
              </Stat>
              {course.enroll_method ? (
                <Stat>
                  <StatLabel>加簽方式</StatLabel>
                  <StatNumber>
                    <HStack spacing="2">
                      <Tag
                        colorScheme="blue"
                        size="lg"
                        fontWeight="800"
                        fontSize="xl"
                      >
                        {course.enroll_method}
                      </Tag>
                      <Text>
                        {info_view_map.enroll_method.map[course.enroll_method]}
                      </Text>
                    </HStack>
                  </StatNumber>
                </Stat>
              ) : null}
              <Stat>
                <StatLabel>開課單位</StatLabel>
                <StatNumber>{course.provider.toUpperCase()}</StatNumber>
              </Stat>
            </Flex>
          </Flex>
          <Divider mt="4" mb="4" borderColor="gray.300" />
          {course?.limitation && (
            <VStack mt="2" align="start">
              <Text
                fontSize="md"
                textAlign="center"
                color={headingColor}
                fontWeight="700"
              >
                修課限制
              </Text>
              <Text fontSize="sm" color={textColor} align="start">
                {course.limitation}
              </Text>
            </VStack>
          )}
          {course?.note && (
            <VStack mt="2" align="start">
              <Text
                fontSize="md"
                textAlign="center"
                color={headingColor}
                fontWeight="700"
              >
                備註
              </Text>
              <Text fontSize="sm" color={textColor} align="start">
                {course.note}
              </Text>
            </VStack>
          )}
          <Divider mt="4" mb="4" borderColor="gray.300" />
          <Text fontSize="lg" color={headingColor} fontWeight="700">
            節次資訊
          </Text>
          <Text fontSize="sm" color="gray.600">
            {parseCourseSchedlue(course) ?? "無資訊"}
          </Text>
        </Flex>
        {/* Box2 */}
        <Flex
          bg={useColorModeValue("gray.100", "gray.600")}
          my="1vh"
          px="6"
          py="4"
          borderRadius="xl"
          flexDirection="column"
          justifyContent="space-between"
          flexGrow={1}
          flexShrink={1}
        >
          <Tabs variant="soft-rounded" size="sm">
            <HStack spacing="4">
              <Text fontSize="2xl" fontWeight="800" color={headingColor}>
                選課資訊
              </Text>
              <TabList>
                <Tab>
                  <Icon mr="2" w="2" as={FaCircle} color="red.600" />
                  即時
                </Tab>
              </TabList>
            </HStack>
            <TabPanels my="3">
              <TabPanel>
                <EnrollStatusPanel
                  isLoading={isLoadingEnrollInfo || isAuth0Loading}
                  isUnauth={!user}
                  CourseEnrollStatus={CourseEnrollStatus}
                />
              </TabPanel>
              <TabPanel></TabPanel>
            </TabPanels>
          </Tabs>
          <DataSourceTag source={"臺大選課系統"} />
        </Flex>
      </Flex>
      {/* COL 2 */}
      <Flex
        w={{ base: "100%", lg: "30%" }}
        mx={{ base: 0, lg: "1%" }}
        flexDirection={"column"}
      >
        {/* Box3 */}
        <Flex
          bg={useColorModeValue("gray.100", "gray.600")}
          my="1vh"
          px="6"
          py="4"
          borderRadius="xl"
          flexDirection="column"
          flexGrow={1}
          flexShrink={1}
        >
          <Text fontSize="2xl" fontWeight="800" color={headingColor}>
            加簽資訊
            <BetaBadge content="beta" size="sm" />
          </Text>
          <SignUpPanel
            isLoading={isLoadingSignUpPostData || isAuth0Loading}
            isUnauth={!user}
            course={course}
            SignUpPostData={SignUpPostData}
            setSignUpPostData={setSignUpPostData}
            fetchSignUpPostData={fetchSignUpPostData}
            signUpCardIdx={signUpCardIdx}
            setSignUpCardIdx={setSignUpCardIdx}
          />
        </Flex>
        {/* Box4 */}
        <Flex
          bg={useColorModeValue("gray.100", "gray.600")}
          my="1vh"
          px="6"
          py="4"
          borderRadius="xl"
          flexDirection="column"
          justifyContent="space-between"
          flexGrow={1}
          flexShrink={1}
        >
          <Tabs h="100%" variant="soft-rounded" size="sm">
            <HStack spacing="4">
              <Text fontSize="2xl" fontWeight="800" color={headingColor}>
                評價
                <BetaBadge content="preview" size="sm" />
              </Text>
              <TabList>
                <Tab color={textColor}>PTT</Tab>
                <Tab color={textColor}>NTURating</Tab>
              </TabList>
            </HStack>
            <TabPanels>
              <TabPanel>
                <PTTReviewPanel
                  isLoading={isLoadingPTTReviewData || isAuth0Loading}
                  isUnauth={!user}
                  PTTReviewData={PTTReviewData}
                />
              </TabPanel>
              <TabPanel>
                <NTURatingPanel
                  isLoading={isLoadingRatingData || isAuth0Loading}
                  isUnauth={!user}
                  NTURatingData={NTURatingData}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
          <DataSourceTag source="PTT NTUCourse, NTURating" />
        </Flex>
        {/* Box5 */}
        <Flex
          bg={useColorModeValue("gray.100", "gray.600")}
          my="1vh"
          px="6"
          py="4"
          borderRadius="xl"
          flexDirection="column"
          justifyContent="space-between"
          flexGrow={1}
          flexShrink={1}
        >
          <Tabs variant="soft-rounded" size="sm">
            <HStack spacing="4">
              <Text fontSize="2xl" fontWeight="800" color={headingColor}>
                考古題資訊
                <BetaBadge content="preview" size="sm" />
              </Text>
              <TabList>
                <Tab>PTT</Tab>
              </TabList>
            </HStack>
            <TabPanels>
              <TabPanel>
                <PTTExamPanel
                  isLoading={isLoadingPTTExamData || isAuth0Loading}
                  isUnauth={!user}
                  PTTExamData={PTTExamData}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
          <DataSourceTag source="PTT NTU-Exam" />
        </Flex>
      </Flex>
      {/* COL 3 */}
      <Flex w={{ base: "100%", lg: "30%" }} flexDirection={"column"}>
        {/* Box6 */}
        <Flex
          bg={useColorModeValue("gray.100", "gray.600")}
          h={{ base: "", md: "55vh" }}
          my="1vh"
          px="6"
          py="4"
          borderRadius="xl"
          flexDirection="column"
          justifyContent="space-between"
          flexGrow={1}
          flexShrink={1}
        >
          <VStack h="95%" align="start">
            <Text fontSize="2xl" fontWeight="800" color={headingColor}>
              課程大綱
            </Text>
            <SyllabusPanel
              isLoading={isLoadingSyllabusData}
              isUnauth={null}
              SyllabusData={SyllabusData}
            />
          </VStack>
          <DataSourceTag source="臺大課程網" />
        </Flex>
        {/* Box7 */}
        <Flex
          bg={useColorModeValue("gray.100", "gray.600")}
          h={{ base: "", md: "31vh" }}
          my="1vh"
          px="6"
          py="4"
          borderRadius="xl"
          flexDirection="column"
          justifyContent="space-between"
          flexGrow={1}
          flexShrink={1}
        >
          <Text fontSize="2xl" fontWeight="800" color={headingColor}>
            評分方式
          </Text>
          <GradePolicyPanel
            isLoading={isLoadingSyllabusData}
            isUnauth={null}
            SyllabusData={SyllabusData}
          />
          <DataSourceTag source="臺大課程網" />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default CourseDetailInfoContainer;
