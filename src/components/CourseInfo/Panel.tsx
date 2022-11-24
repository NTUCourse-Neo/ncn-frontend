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
  FlexProps,
  StatLabelProps,
  Center,
  Skeleton,
  Tag,
  TagLabel,
  TagLeftIcon,
} from "@chakra-ui/react";
import React, { useRef, forwardRef } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { FaCircle } from "react-icons/fa";
import { useCourseEnrollData, useSyllabusData } from "hooks/useCourseInfo";
import {
  syllabusFieldSource as syllabusTitle,
  SyllabusFieldName,
} from "types/course";
import { customScrollBarCss } from "@/styles/customScrollBar";
import { useInView } from "react-intersection-observer";
import { CoffeeOutlineIcon } from "@/components/CustomIcons";
import { ArrowForwardIcon } from "@chakra-ui/icons";

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

interface PanelPlaceholderProps extends FlexProps {
  readonly title?: string;
}
const PanelPlaceholder = forwardRef<HTMLDivElement, PanelPlaceholderProps>(
  (props, ref) => {
    const { title } = props;
    return (
      <Center h="100%" ref={ref}>
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
          >
            {title || `尚未提供`}
          </Flex>
        </Flex>
      </Center>
    );
  }
);
PanelPlaceholder.displayName = "PanelPlaceholder";

export function EnrollStatusPanel({
  courseSerial,
}: {
  readonly courseSerial: string | null;
}) {
  const { data: courseEnrollStatus, isLoading } =
    useCourseEnrollData(courseSerial);
  return (
    <Skeleton
      isLoaded={isLoading}
      w="33%"
      startColor="black.200"
      endColor="black.500"
      sx={{
        borderRadius: "4px",
      }}
    >
      <Flex
        w="100%"
        flexDirection="column"
        sx={{
          bg: "#F6F6F6",
          borderRadius: "4px",
          pt: 4,
          px: 4,
          pb: 6,
        }}
      >
        <Flex
          sx={{
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: 1.4,
            color: "#2d2d2d",
          }}
          cursor="default"
        >
          已選人數
          <Tag colorScheme={"secondary"} size="sm" ml={3}>
            <TagLeftIcon as={ArrowForwardIcon} color={"#BBF7D0"} />
            <TagLabel>即時</TagLabel>
          </Tag>
        </Flex>
        {!courseEnrollStatus || courseSerial === null ? (
          <PanelPlaceholder title="無法取得課程即時資訊" />
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
      </Flex>
    </Skeleton>
  );
}

interface PanelBlockProps extends FlexProps {
  readonly title: string;
  readonly content: string | JSX.Element | null;
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
      <PanelPlaceholder ref={contentRef} />
    ) : typeof rawContent === "string" ? (
      <Box ref={contentRef}>
        {rawContent.split("\n").map((item, index) => {
          return (
            <Text key={index} mb={1}>
              {item.trim()}
            </Text>
          );
        })}
      </Box>
    ) : (
      rawContent
    );
  return (
    <Skeleton
      isLoaded={!isLoading}
      speed={1 + index * 0.2}
      startColor="black.200"
      endColor="black.500"
    >
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
  const pieChartData = syllabusData?.grade
    ? (syllabusData?.grade.filter((g) => g.color !== null) as {
        title?: string | number;
        color: string;
        value: number;
        key?: string | number;
        [key: string]: unknown;
      }[]) // Type def: https://github.com/toomuchdesign/react-minimal-pie-chart/blob/master/src/commonTypes.ts
    : undefined;

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
              key={section}
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
        <PanelBlock
          title={"評量方式"}
          blockH={320}
          isLoading={isLoading}
          index={3}
          content={
            !syllabusData || !syllabusData.grade ? null : (
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
                          color={"text.light"}
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
                            <Text
                              fontSize="md"
                              fontWeight="600"
                              color={"heading.light"}
                            >
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
                              <Text
                                fontSize="md"
                                fontWeight="600"
                                color="gray.700"
                              >
                                {item.title}
                              </Text>
                            </HStack>
                          </PopoverHeader>
                          <PopoverBody>
                            {item.comment === "" ? (
                              <Text
                                fontSize="md"
                                fontWeight="400"
                                color="gray.700"
                              >
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
            )
          }
        />
        {rightBlocks.map((block, index) => {
          const section = block.section;
          const content = syllabusData?.syllabus?.[section] ?? null;
          return (
            <PanelBlock
              key={section}
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
