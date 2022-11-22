import {
  Flex,
  Text,
  Stat,
  StatLabel as ChakraStatLabel,
  StatNumber as ChakraStatNumber,
  StatNumberProps,
  HStack,
  Icon,
  Box,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  useColorModeValue,
  FlexProps,
  StatLabelProps,
  Center,
  Skeleton,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { PieChart } from "react-minimal-pie-chart";
import {
  FaCircle,
  FaExclamationTriangle,
  FaQuestionCircle,
} from "react-icons/fa";
import { useUser } from "@auth0/nextjs-auth0";
import Image from "next/image";
import { useCourseEnrollData, useSyllabusData } from "hooks/useCourseInfo";
import {
  syllabusFields,
  syllabusFieldSource as syllabusTitle,
  SyllabusFieldName,
} from "types/course";
import { customScrollBarCss } from "@/styles/customScrollBar";
import { useInView } from "react-intersection-observer";
import { CoffeeOutlineIcon } from "@/components/CustomIcons";

function StatNumber(props: StatNumberProps) {
  return (
    <ChakraStatNumber
      textAlign="center"
      sx={{
        fontWeight: 500,
        fontSize: "18px",
        lineHeight: 1.4,
        color: "#2d2d2d",
      }}
      {...props}
    />
  );
}

function StatLabel(props: StatLabelProps) {
  return (
    <ChakraStatLabel
      textAlign="center"
      sx={{
        fontSize: "12px",
        lineHeight: 1.4,
        color: "#4b4b4b",
      }}
      {...props}
    />
  );
}

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

interface PanelWrapperProps {
  readonly children: JSX.Element;
  readonly isLoading: boolean;
  readonly loadingFallback?: JSX.Element;
}
function PanelWrapper({
  isLoading,
  loadingFallback = <LoadingPanel title="載入中..." height="100%" />,
  children,
}: PanelWrapperProps): JSX.Element {
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
          mt="6"
          flexDirection="row"
          justifyContent="center"
          alignItems={{ base: "start", lg: "center" }}
          flexWrap="wrap"
        >
          <Stat>
            <StatNumber>{courseEnrollStatus.enrolled}</StatNumber>
            <StatLabel>已選上</StatLabel>
          </Stat>
          <Stat>
            <StatNumber>{courseEnrollStatus.enrolled_other}</StatNumber>
            <StatLabel>外系已選上</StatLabel>
          </Stat>
          <Stat>
            <StatNumber>{courseEnrollStatus.registered}</StatNumber>
            <StatLabel>登記</StatLabel>
          </Stat>
          <Stat>
            <StatNumber>{courseEnrollStatus.remain}</StatNumber>
            <StatLabel>剩餘</StatLabel>
          </Stat>
        </Flex>
      )}
    </PanelWrapper>
  );
}

interface PanelBlockProps extends FlexProps {
  readonly title: string;
  readonly content: string | null;
  readonly blockH: number;
  readonly isLoading?: boolean;
  readonly index?: number;
}
function PanelBlock(props: PanelBlockProps) {
  const {
    isLoading = false,
    title,
    content: rawContent,
    blockH,
    index = 0,
    ...restProps
  } = props;
  const contentRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const { ref: reachBottomDetecter, inView } = useInView({
    /* Optional options */
    threshold: 0,
  });
  const scrollable =
    contentRef.current?.clientHeight &&
    contentContainerRef.current?.clientHeight
      ? contentRef.current?.clientHeight >
        contentContainerRef.current?.clientHeight
      : false;

  const content =
    rawContent === null ? (
      <Center h="100%" ref={contentRef}>
        <Flex
          flexDirection={"column"}
          justifyContent="center"
          alignItems={"center"}
        >
          <CoffeeOutlineIcon color="#909090" boxSize={"40px"} />
          <Flex
            mt={2}
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: 1.4,
              color: "#909090",
            }}
          >{`尚未提供`}</Flex>
        </Flex>
      </Center>
    ) : (
      <Box ref={contentRef}>
        {rawContent.split("\n").map((item, index) => {
          return (
            <Text key={index} mb={1}>
              {item.trim()}
            </Text>
          );
        })}
      </Box>
    );
  return (
    <Skeleton isLoaded={!isLoading} speed={1 + index * 0.2}>
      <Flex
        bg="#f6f6f6"
        gap={"10px"}
        borderRadius={"4px"}
        flexDirection="column"
        h={`${blockH}px`}
        position="relative"
        {...restProps}
      >
        <Flex
          sx={{
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: 1.4,
            color: "#2d2d2d",
          }}
          pt="16px"
          px="24px"
        >
          {title}
        </Flex>
        <Flex
          ref={contentContainerRef}
          flexDirection={"column"}
          sx={{
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: 1.4,
            color: "#6f6f6f",
            ...customScrollBarCss,
          }}
          pb="16px"
          px="24px"
          flexGrow={1}
          overflowY={"auto"}
        >
          {content}
          <Box ref={reachBottomDetecter} h="2px" bg="transparent" />
        </Flex>
        {scrollable && !inView ? (
          <Box
            w="100%"
            h="36px"
            position="absolute"
            bottom={0}
            sx={{
              bg: "linear-gradient(180deg, rgba(246, 246, 246, 0.12) 0%, rgba(246, 246, 246, 0.599779) 24.59%, #F6F6F6 62.79%)",
              borderRadius: "0px 0px 4px 4px",
            }}
          />
        ) : null}
      </Flex>
    </Skeleton>
  );
}

export function SyllabusPanel({ courseId }: { readonly courseId: string }) {
  const { data: syllabusData, isLoading } = useSyllabusData(courseId);

  const leftBlocks: { section: SyllabusFieldName; h: number }[] = [
    { section: "intro", h: 320 },
    { section: "objective", h: 320 },
    { section: "requirement", h: 320 },
  ];
  const rightBlocks: { section: SyllabusFieldName; h: number }[] = [
    { section: "material", h: 240 },
    { section: "specify", h: 240 },
  ];

  return (
    <Flex w="100%" justify={"space-between"} mt={6}>
      <Flex w="48%" gap={4} flexDirection="column">
        {leftBlocks.map((block, index) => {
          const section = block.section;
          const content = syllabusData?.syllabus?.[section] || null;
          return (
            <PanelBlock
              title={syllabusTitle[section]}
              content={content}
              blockH={block.h}
              isLoading={isLoading}
              index={index}
            />
          );
        })}
      </Flex>
      <Flex w="48%" gap={4} flexDirection="column">
        <Flex
          bg="#f6f6f6"
          gap={"10px"}
          borderRadius={"4px"}
          flexDirection="column"
          h={`320px`}
          position="relative"
          flexGrow={1}
        />
        {rightBlocks.map((block, index) => {
          const section = block.section;
          const content = syllabusData?.syllabus?.[section] ?? null;
          return (
            <PanelBlock
              title={syllabusTitle[section]}
              content={content}
              blockH={block.h}
              isLoading={isLoading}
              index={index}
            />
          );
        })}
        <PanelBlock
          title={"針對學生困難提供學生調整方式"}
          content={null}
          blockH={144}
          isLoading={isLoading}
          index={2}
        />
      </Flex>
    </Flex>
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
