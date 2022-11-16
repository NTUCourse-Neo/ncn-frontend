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
import React from "react";
import { PieChart } from "react-minimal-pie-chart";
import {
  FaCircle,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaChevronRight,
  FaInfoCircle,
} from "react-icons/fa";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import Image from "next/image";
import { useCourseEnrollData, useSyllabusData } from "hooks/useCourseInfo";
import { reportEvent } from "utils/ga";
import {
  syllabusFields,
  syllabusFieldSource as syllabusTitle,
} from "types/course";

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
