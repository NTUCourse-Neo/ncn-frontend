import {
  Flex,
  Box,
  Td as ChakraTd,
  TableCellProps,
  BoxProps,
  Circle,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { CourseTable } from "@/types/courseTable";
import { Course } from "@/types/course";
import { CourseTableCellProps } from "@/components/CourseTable/NeoCourseTable";
import { intervals, days } from "@/constant";
import NeoCourseTable, {
  // tabs,
  CourseOrderListTabId,
} from "@/components/CourseTable/NeoCourseTable";
import {
  intervalToNumber,
  numberToInterval,
} from "@/utils/intervalNumberConverter";
import { intervalSource } from "@/types/course";
import { customScrollBarCss } from "styles/customScrollBar";
import { CloseIcon } from "@chakra-ui/icons";

interface TdProps extends TableCellProps {
  readonly children: React.ReactNode;
  readonly isFirstDay: boolean;
  readonly isLastDay: boolean;
  readonly isFirstInterval: boolean;
  readonly isLastInterval: boolean;
  readonly dayIndex: number;
  readonly intervalIndex: number;
  readonly tableCellProperty: CourseTableCellProps;
}
const Td: React.FC<TdProps> = ({
  children,
  isFirstDay,
  isLastDay,
  isFirstInterval,
  isLastInterval,
  dayIndex,
  intervalIndex,
  tableCellProperty,
  ...rest
}) => {
  const id = `${dayIndex + 1}-${intervalIndex}`;

  return (
    <ChakraTd
      sx={{
        boxSizing: "border-box",
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
        borderTop: `${tableCellProperty.borderWidth}px solid #CCCCCC${
          isFirstInterval ? "" : "80"
        }`,
        borderLeft: `${tableCellProperty.borderWidth}px solid #CCCCCC${
          isFirstDay ? "" : "80"
        }`,
        borderRight: `${
          isLastDay ? tableCellProperty.borderWidth : 0
        }px solid #CCCCCC`,
        borderBottom: `${
          isLastInterval ? tableCellProperty.borderWidth : 0
        }px solid #CCCCCC`,
        overflow: "visible",
        position: "relative",
      }}
      {...rest}
    >
      <Box
        sx={{
          zIndex: 98,
          position: "absolute",
          top: 0,
          left: 0,
          bg: "linear-gradient(0deg, rgba(204, 204, 204, 0.24), rgba(204, 204, 204, 0.24)), #FFFFFF",
          opacity: 0.32,
          w: "100%",
          h: "100%",
        }}
      />
      <Box
        position="absolute"
        sx={{
          top: 0,
          left: 0,
          zIndex: 100,
        }}
      >
        {children}
      </Box>
    </ChakraTd>
  );
};
interface CourseOrderTableCardProps extends BoxProps {
  readonly numberOfCourses: number;
  readonly intervalCourseOrderDict: IntervalCourseOrderDict;
  readonly dayIndex: number;
  readonly intervalIndex: number;
}
function CourseOrderTableCard(props: CourseOrderTableCardProps) {
  const {
    numberOfCourses,
    intervalCourseOrderDict,
    dayIndex,
    intervalIndex,
    ...restProps
  } = props;
  const numberBg =
    numberOfCourses >= 1
      ? numberOfCourses > 5
        ? numberOfCourses > 10
          ? numberOfCourses >= 20
            ? "#072164"
            : "#0D40C4"
          : "#4575F3"
        : "#7499F6"
      : "#ffffff";
  const coursesStr = Object.values(intervalCourseOrderDict)
    .reduce((acc, courseOrders) => {
      return [...acc, ...courseOrders];
    }, [])
    .map((courseOrder) => courseOrder.course.name)
    .join(", ");
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        sx={{
          position: "relative",
          bg: "#ffffff",
          borderRadius: "10px",
          boxShadow: "2px 2px 12px 0px rgba(75, 75, 75, 0.12)",
          cursor: "pointer",
          py: "9px",
          pl: "8px",
          pr: "22px",
          overflow: "hidden",
          transition: "all 0.2s ease-in-out",
        }}
        onClick={onOpen}
        {...restProps}
      >
        <Flex w="100%" h="100%" gap={2}>
          <Flex alignItems={"center"}>
            <Circle
              size="30px"
              sx={{
                bg: numberBg,
                fontWeight: 500,
                fontSize: "11px",
                color: "#ffffff",
              }}
            >
              {`${numberOfCourses > 1 ? "+" : ""}${numberOfCourses}`}
            </Circle>
          </Flex>
          <Flex
            w="70%"
            flexDirection={"column"}
            sx={{
              fontSize: "11px",
              color: "#4b4b4b",
              textAlign: "left",
            }}
          >
            <Flex maxW="100%">包含</Flex>
            <Box
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {coursesStr}
            </Box>
          </Flex>
        </Flex>
      </Box>
      <Modal size="xl" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="850px" overflowY="hidden">
          <ModalHeader
            py={6}
            px={8}
            borderRadius="4px"
            sx={{
              shadow: "0px 32px 64px -12px rgba(85, 105, 135, 0.08)",
              color: "#2d2d2d",
              fontWeight: 500,
              fontSize: "20px",
              lineHeight: 1.4,
            }}
          >
            <Flex alignItems="center" w="100%" justifyContent={"space-between"}>
              <Flex gap={6} alignItems="center">
                <Text>{`星期${days[dayIndex]}`}</Text>
                <Text>{`第 ${intervalIndex} 節`}</Text>
                <Text
                  sx={{
                    fontSize: "16px",
                    color: "#909090",
                  }}
                >
                  {`${
                    intervalSource[numberToInterval(intervalIndex)].startAt
                  }~${intervalSource[numberToInterval(intervalIndex)].endAt}`}
                </Text>
              </Flex>
              <CloseIcon
                boxSize="14px"
                sx={{
                  color: "#2d2d2d",
                  cursor: "pointer",
                }}
                onClick={onClose}
              />
            </Flex>
          </ModalHeader>
          <ModalBody px={0}>
            <Box
              pt={8}
              px={16}
              pb={16}
              h="60vh"
              overflowY="scroll"
              sx={{
                fontFamily: "SF Pro Text",
                fontSize: "14px",
                lineHeight: "18px",
                letterSpacing: "-0.078px",
                color: "#2d2d2d",
              }}
              __css={customScrollBarCss}
            >
              {"123"}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

type CourseOrder = {
  course: Course;
  order: number;
};
type IntervalCourseOrderDict = {
  [tab in CourseOrderListTabId]: CourseOrder[];
};
type CourseTableCourseOrderDict = {
  [key: `${number}-${number}`]: IntervalCourseOrderDict;
};

function getNumberOfCourses(intervalCourseOrderDict: IntervalCourseOrderDict) {
  return Object.values(intervalCourseOrderDict).reduce(
    (acc, courseOrderList) => {
      return acc + courseOrderList.length;
    },
    0
  );
}

// TODO: refactor after integrated with new backend
function getCourseTableCourseOrderDict(
  courseTable: CourseTable | null
): CourseTableCourseOrderDict {
  if (courseTable === null) return {};
  const res: CourseTableCourseOrderDict = {};
  days.forEach((day, dayIndex) => {
    intervals.forEach((interval, intervalIndex) => {
      const key = `${dayIndex + 1}-${intervalIndex}` as `${number}-${number}`;
      res[key] = {
        Common: [],
        Chinese: [],
        ForeignLanguage: [],
        Calculus: [],
      } as IntervalCourseOrderDict;
    });
  });

  // process Common courses
  courseTable.courses.forEach((course, courseIndex) => {
    const { schedules } = course;
    schedules.forEach((schedule) => {
      const { weekday, interval: intervalString } = schedule;
      const interval = intervalToNumber(intervalString);
      const key = `${weekday}-${interval}` as `${number}-${number}`;
      res[key] = {
        ...res[key],
        Common: [
          ...res[key]["Common"],
          {
            course: course,
            order: courseIndex + 1,
          },
        ],
      };
    });
  });
  // TODO: add other tabs

  return res;
}

interface CourseOrderTableProps {
  readonly courseTable: CourseTable | null;
  readonly tableCellProperty: CourseTableCellProps;
}

export default function CourseOrderTable(props: CourseOrderTableProps) {
  const { courseTable, tableCellProperty } = props;
  const courseTableCourseOrderDict = courseTable
    ? getCourseTableCourseOrderDict(courseTable)
    : {};

  return (
    <Flex
      w="100%"
      minH="70vh"
      justifyContent={"center"}
      alignItems="center"
      overflow={"auto"}
      pt={4}
      px={4}
      pb={12}
    >
      <NeoCourseTable
        tableCellProperty={tableCellProperty}
        renderCustomCell={(dayIndex, intervalIndex) => {
          return (
            <Td
              key={`${dayIndex + 1}-${intervalIndex}`}
              minW={`${tableCellProperty.w}px`}
              w={`${tableCellProperty.w}px`}
              maxW={`${tableCellProperty.w}px`}
              minH={`${tableCellProperty.h}px`}
              h={`${tableCellProperty.h}px`}
              isFirstDay={dayIndex === 0}
              isLastDay={dayIndex === days.length - 1}
              isFirstInterval={intervalIndex === 0}
              isLastInterval={intervalIndex === intervals.length - 1}
              dayIndex={dayIndex}
              intervalIndex={intervalIndex}
              tableCellProperty={tableCellProperty}
            >
              {getNumberOfCourses(
                courseTableCourseOrderDict?.[
                  `${dayIndex + 1}-${intervalIndex}`
                ] ?? {}
              ) > 0 ? (
                <CourseOrderTableCard
                  w={`${tableCellProperty.w - tableCellProperty.borderWidth}px`}
                  h={`${tableCellProperty.h - tableCellProperty.borderWidth}px`}
                  dayIndex={dayIndex}
                  intervalIndex={intervalIndex}
                  numberOfCourses={getNumberOfCourses(
                    courseTableCourseOrderDict?.[
                      `${dayIndex + 1}-${intervalIndex}`
                    ] ?? {}
                  )}
                  intervalCourseOrderDict={
                    courseTableCourseOrderDict?.[
                      `${dayIndex + 1}-${intervalIndex}`
                    ] ?? {}
                  }
                />
              ) : null}
            </Td>
          );
        }}
      />
    </Flex>
  );
}
