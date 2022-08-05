import {
  Flex,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  HStack,
  Icon,
  Box,
  Button,
  VStack,
  StatHelpText,
  Divider,
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
  FlexProps,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";
import {
  FaCircle,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
} from "react-icons/fa";
import { IoMdOpen } from "react-icons/io";
import PTTContentRowContainer from "components/CourseInfo/PTTContentRowContainer";
import SignUpCard from "components/CourseInfo/SignUpCard";
import SignUpSubmitForm from "components/CourseInfo/SignUpSubmitForm";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  useCourseEnrollData,
  useNTURatingData,
  usePTTReviewData,
  usePTTExamData,
  useSyllabusData,
  useSignUpPostData,
} from "hooks/useCourseInfo";
import { reportEvent } from "utils/ga";
import {
  syllabusFields,
  syllabusFieldSource as syllabusTitle,
} from "@/types/course";

interface LoadingPanelProps extends FlexProps {
  readonly title: string;
}
function LoadingPanel({ title, ...restProps }: LoadingPanelProps) {
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

interface PanelPlaceholderProps extends FlexProps {
  readonly title: string;
  readonly isEmpty?: boolean;
}
function PanelPlaceholder({
  title = "暫無資訊",
  isEmpty = true,
  ...restProps
}: PanelPlaceholderProps) {
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

function UnauthenticatedPanel({ ...restProps }: FlexProps) {
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
          reportEvent("member_only_panel", "click", "login");
          router.push("/api/auth/login");
        }}
      >
        來去登入
      </Button>
    </Flex>
  );
}

interface PanelWrapperProps {
  readonly children: JSX.Element;
  readonly isLoading: boolean;
  readonly isUnauth: boolean | null;
  readonly loadingFallback?: JSX.Element;
  readonly unauthFallback?: JSX.Element;
}
function PanelWrapper({
  isLoading,
  loadingFallback = <LoadingPanel title="載入中..." height="100%" />,
  isUnauth,
  unauthFallback = <UnauthenticatedPanel />,
  children,
}: PanelWrapperProps): JSX.Element {
  if (isUnauth) {
    return unauthFallback;
  }
  if (isLoading) {
    return loadingFallback;
  }
  return <>{children}</>;
}

export function SignUpPanel({ courseId }: { readonly courseId: string }) {
  const { user, isLoading: isAuth0Loading } = useUser();
  const {
    data: signUpPostData,
    isLoading,
    mutate,
  } = useSignUpPostData(courseId);
  const [signUpCardIdx, setSignUpCardIdx] = useState(0);
  const textColor = useColorModeValue("text.light", "text.dark");

  // trigger after delete sign up card
  useEffect(() => {
    if (
      Array.isArray(signUpPostData) &&
      signUpCardIdx >= signUpPostData.length
    ) {
      setSignUpCardIdx(Math.max(signUpPostData.length - 1, 0));
    }
  }, [signUpPostData, setSignUpCardIdx, signUpCardIdx]);

  return (
    <PanelWrapper
      isLoading={isLoading || isAuth0Loading}
      isUnauth={!user}
      loadingFallback={
        <LoadingPanel title="努力跑加簽大地中..." height="100%" />
      }
    >
      {!signUpPostData ? (
        <PanelPlaceholder title="無加簽相關資訊" height="100%" />
      ) : signUpPostData.length === 0 ? (
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
            <SignUpSubmitForm
              courseId={courseId}
              haveSubmitted={signUpPostData.some((obj) => obj.is_owner)}
              mutate={mutate}
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
          <SignUpCard post={signUpPostData[signUpCardIdx]} mutate={mutate} />
          <HStack w="100%" pr="8" mt="8">
            <HStack>
              <IconButton
                aria-label="prev"
                size="md"
                variant="ghost"
                icon={<FaChevronLeft />}
                onClick={() =>
                  setSignUpCardIdx(
                    signUpCardIdx === 0
                      ? signUpPostData.length - 1
                      : signUpCardIdx - 1
                  )
                }
              />
              <IconButton
                aria-label="next"
                size="md"
                variant="ghost"
                icon={<FaChevronRight />}
                onClick={() =>
                  setSignUpCardIdx((signUpCardIdx + 1) % signUpPostData.length)
                }
              />
              <Text
                fontSize="sm"
                fontWeight="800"
                color={textColor}
                textAlign="center"
              >
                {signUpCardIdx + 1}/{signUpPostData.length}
              </Text>
            </HStack>
            <Spacer />
            <SignUpSubmitForm
              courseId={courseId}
              haveSubmitted={signUpPostData.some((obj) => obj.is_owner)}
              mutate={mutate}
            />
          </HStack>
        </Flex>
      )}
    </PanelWrapper>
  );
}

export function EnrollStatusPanel({
  courseSerial,
}: {
  readonly courseSerial: string | null;
}) {
  const { user, isLoading: isAuth0Loading } = useUser();
  const { data: courseEnrollStatus, isLoading } =
    useCourseEnrollData(courseSerial);
  return (
    <PanelWrapper
      isLoading={isLoading || isAuth0Loading}
      isUnauth={!user}
      loadingFallback={
        <LoadingPanel title="努力取得資訊中..." height="100%" pt={8} />
      }
    >
      {!courseEnrollStatus || courseSerial === null ? (
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
            <StatNumber>{courseEnrollStatus.enrolled}</StatNumber>
            <StatHelpText>人</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>選上外系</StatLabel>
            <StatNumber>{courseEnrollStatus.enrolled_other}</StatNumber>
            <StatHelpText>人</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>登記</StatLabel>
            <StatNumber>{courseEnrollStatus.registered}</StatNumber>
            <StatHelpText>人</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>剩餘</StatLabel>
            <StatNumber>{courseEnrollStatus.remain}</StatNumber>
            <StatHelpText>空位</StatHelpText>
          </Stat>
        </Flex>
      )}
    </PanelWrapper>
  );
}

export function NTURatingPanel({ courseId }: { readonly courseId: string }) {
  const { user, isLoading: isAuth0Loading } = useUser();
  const { data: ntuRatingData, isLoading } = useNTURatingData(courseId);
  return (
    <PanelWrapper
      isLoading={isLoading || isAuth0Loading}
      isUnauth={!user}
      loadingFallback={
        <LoadingPanel title="查詢評價中..." height="100%" pt={8} />
      }
    >
      {!ntuRatingData ? (
        <Flex h="100%" flexDirection="column" alignItems="center">
          <PanelPlaceholder title="無評價資訊" h="100%" pt="8" />
          <Button
            mt="4"
            colorScheme="blue"
            variant="outline"
            size="sm"
            rightIcon={<IoMdOpen />}
            onClick={() => {
              window.open(
                "https://rating.myntu.me/?referrer=ntucourse_neo",
                "_blank"
              );
              reportEvent("rating_panel", "click_external", "nturating");
            }}
          >
            前往 NTURating 撰寫評價
          </Button>
        </Flex>
      ) : (
        <Flex h="100%" flexDirection="column" alignItems="start">
          <Text fontSize="md" fontWeight="600" color="gray.700">
            NTURating 上共有 {ntuRatingData.count} 筆評價
          </Text>
          <HStack w="100%" justify="space-between" my="2">
            <Stat>
              <StatLabel>甜度</StatLabel>
              <StatNumber>{ntuRatingData.sweety}</StatNumber>
              <StatHelpText>平均值</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>涼度</StatLabel>
              <StatNumber>{ntuRatingData.breeze}</StatNumber>
              <StatHelpText>平均值</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>紮實度</StatLabel>
              <StatNumber>{ntuRatingData.workload}</StatNumber>
              <StatHelpText>平均值</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>品質</StatLabel>
              <StatNumber>{ntuRatingData.quality}</StatNumber>
              <StatHelpText>平均值</StatHelpText>
            </Stat>
          </HStack>
          <Button
            colorScheme="blue"
            variant="outline"
            size="sm"
            rightIcon={<IoMdOpen />}
            onClick={() => {
              window.open(
                ntuRatingData?.url + "?referrer=ntucourse_neo",
                "_blank"
              );
              reportEvent("rating_panel", "click_external", ntuRatingData?.url);
            }}
          >
            前往 NTURating 查看該課程評價
          </Button>
        </Flex>
      )}
    </PanelWrapper>
  );
}

export function PTTReviewPanel({ courseId }: { readonly courseId: string }) {
  const { user, isLoading: isAuth0Loading } = useUser();
  const { data: pttReviewData, isLoading } = usePTTReviewData(courseId);
  return (
    <PanelWrapper
      isLoading={isLoading || isAuth0Loading}
      isUnauth={!user}
      loadingFallback={
        <LoadingPanel title="努力爬文中..." height="100%" pt={8} />
      }
    >
      {!pttReviewData || !Array.isArray(pttReviewData) ? (
        <PanelPlaceholder title="無相關貼文資訊" h="100%" pt="8" />
      ) : (
        <PTTContentRowContainer info={pttReviewData} height="150px" />
      )}
    </PanelWrapper>
  );
}

export function PTTExamPanel({ courseId }: { readonly courseId: string }) {
  const { user, isLoading: isAuth0Loading } = useUser();
  const { data: pttExamData, isLoading } = usePTTExamData(courseId);
  return (
    <PanelWrapper
      isLoading={isLoading || isAuth0Loading}
      isUnauth={!user}
      loadingFallback={
        <LoadingPanel title="努力爬文中..." height="100%" pt={8} />
      }
    >
      {!pttExamData || !Array.isArray(pttExamData) ? (
        <PanelPlaceholder title="無相關貼文資訊" h="100%" pt="8" />
      ) : (
        <PTTContentRowContainer info={pttExamData} height="150px" />
      )}
    </PanelWrapper>
  );
}

export function SyllabusPanel({ courseId }: { readonly courseId: string }) {
  const { data: syllabusData, isLoading } = useSyllabusData(courseId);
  const headingColor = useColorModeValue("heading.light", "heading.dark");
  const textColor = useColorModeValue("text.light", "text.dark");

  return (
    <PanelWrapper isLoading={isLoading} isUnauth={null}>
      {!syllabusData || !syllabusData?.syllabus ? (
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
          {syllabusFields.map((key) => {
            const line = syllabusData.syllabus[key].split("\n");
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
                <Text
                  flexBasis="20%"
                  mb="1"
                  fontSize="lg"
                  fontWeight="600"
                  color={headingColor}
                >
                  {syllabusTitle[key]}
                </Text>
                {syllabusData.syllabus[key] !== "" ? (
                  content
                ) : (
                  <Text
                    key={syllabusTitle[key] + "content"}
                    fontSize="md"
                    fontWeight="400"
                    color="gray.500"
                  >
                    無
                  </Text>
                )}
                <Divider my="4" />
              </React.Fragment>
            );
          })}
        </Flex>
      )}
    </PanelWrapper>
  );
}

export function GradePolicyPanel({ courseId }: { readonly courseId: string }) {
  const { data: syllabusData, isLoading } = useSyllabusData(courseId);
  const headingColor = useColorModeValue("heading.light", "heading.dark");
  const textColor = useColorModeValue("text.light", "text.dark");
  const pieChartData = syllabusData?.grade
    ? (syllabusData?.grade.filter((g) => g.color !== null) as {
        title?: string | number;
        color: string;
        value: number;
        key?: string | number;
        [key: string]: unknown;
      }[]) // Type def: https://github.com/toomuchdesign/react-minimal-pie-chart/blob/master/src/commonTypes.ts
    : undefined;
  return (
    <PanelWrapper
      isLoading={isLoading}
      isUnauth={null}
      loadingFallback={
        <LoadingPanel title="查看配分中..." height="100%" pt={8} />
      }
    >
      {!syllabusData || !syllabusData.grade ? (
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
              data={pieChartData}
              labelStyle={() => ({
                fill: "white",
                fontSize: "10px",
                fontFamily: "sans-serif",
              })}
            />
          </Box>
          <VStack mt={{ base: 4, lg: 0 }} align="start">
            {syllabusData.grade.map((item, index) => {
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
                      <Icon
                        as={FaCircle}
                        size="20px"
                        color={item.color ?? "current"}
                      />
                      <Text
                        fontSize="lg"
                        fontWeight="800"
                        color={item.color ?? "current"}
                      >
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
                        <Text
                          fontSize="lg"
                          fontWeight="800"
                          color={item.color ?? "current"}
                        >
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
