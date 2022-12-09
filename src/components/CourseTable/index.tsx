import { Course } from "@/types/course";
import {
  Flex,
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
  Box,
  Fade,
} from "@chakra-ui/react";
import CourseTableCard from "@/components/CourseTable/CourseTableCard";
import { intervals, days } from "@/constant";
import { customScrollBarCss } from "@/styles/customScrollBar";
import { useState, useMemo } from "react";
import { usePopper } from "react-popper";
import Portal from "@/components/Portal";
import { CourseRLE } from "@/utils/courseTableRle";
import { CourseTableCardPortal } from "@/components/CourseTable/CourseTableCard";
import { courses2courseTableRle } from "@/utils/courseTableRle";
import { hoverCourseState } from "@/utils/hoverCourse";
import { useSnapshot } from "valtio";
import { intervalToNumber } from "@/utils/intervalNumberConverter";

interface CourseTableCellProps {
  readonly w: number;
  readonly h: number;
  readonly borderWidth: number;
}

interface ThProps extends TableColumnHeaderProps {
  readonly children: React.ReactNode;
}
const Th: React.FC<ThProps> = ({ children, ...rest }) => {
  return (
    <ChakraTh
      sx={{
        textAlign: "center",
        lineHeight: 1.4,
        color: "#1A181C",
        fontWeight: 500,
        fontSize: "18px",
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
  readonly dayIndex: number;
  readonly intervalIndex: number;
  readonly openPortal: string | null;
  readonly setOpenPortal: (id: string | null) => void;
  readonly coursesOnTable: string[];
  readonly courseRle: CourseRLE | null;
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
  openPortal,
  setOpenPortal,
  coursesOnTable,
  courseRle,
  tableCellProperty,
  ...rest
}) => {
  const id = `${dayIndex + 1}-${intervalIndex}`;
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "right-start",
    strategy: "fixed",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  // hover feature
  const { hoveredCourse } = useSnapshot(hoverCourseState);
  const isHovered = useMemo(() => {
    if (!hoveredCourse) return false;
    const { schedules } = hoveredCourse;
    const timeMatched = schedules.some(
      (schedule) =>
        schedule.weekday === dayIndex + 1 &&
        intervalToNumber(schedule.interval) === intervalIndex
    );
    return !coursesOnTable.includes(hoveredCourse.id) && timeMatched;
  }, [coursesOnTable, hoveredCourse, dayIndex, intervalIndex]);

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
      {isHovered ? (
        <Box
          sx={{
            zIndex: 99,
            position: "absolute",
            top: `-${tableCellProperty.borderWidth}px`,
            left: `-${tableCellProperty.borderWidth}px`,
            border: `1px solid #D69600`,
            bg: "#FFCA4D",
            opacity: 1,
            w: `${tableCellProperty.w + tableCellProperty.borderWidth}px`,
            h: `${tableCellProperty.h + tableCellProperty.borderWidth}px`,
          }}
        />
      ) : null}
      <Box
        position="absolute"
        sx={{
          top: 0,
          left: 0,
          zIndex: 100,
        }}
        ref={setReferenceElement}
        onClick={
          children !== null
            ? () => {
                if (openPortal === id) {
                  setOpenPortal(null);
                } else {
                  setOpenPortal(id);
                }
              }
            : undefined
        }
      >
        {children}
      </Box>
      <Portal>
        <Box
          ref={setPopperElement}
          style={{ ...styles.popper, zIndex: 200 }}
          {...attributes.popper}
        >
          <Fade in={id === openPortal} unmountOnExit>
            {courseRle ? (
              <CourseTableCardPortal
                courseRle={courseRle}
                dayIndex={dayIndex}
                intervalIndex={intervalIndex}
                onClose={() => {
                  setOpenPortal(null);
                }}
              />
            ) : null}
          </Fade>
        </Box>
      </Portal>
    </ChakraTd>
  );
};

interface CourseTableProps {
  readonly courses: Course[];
  readonly tableCellProperty: CourseTableCellProps;
}

function CourseTable(props: CourseTableProps) {
  const { courses, tableCellProperty } = props;
  const [openPortal, setOpenPortal] = useState<string | null>(null);

  const coursesRle = useMemo(() => courses2courseTableRle(courses), [courses]);
  const coursesOnTable: string[] = useMemo(() => {
    return Object.values(coursesRle).map(
      (courseRle) => courseRle?.course?.id ?? ""
    );
  }, [coursesRle]);

  return (
    <Flex overflowX={"auto"}>
      <Flex flexDirection={"column"}>
        <Box h={`${tableCellProperty.h + 8}px`} />
        {intervals.map((interval) => (
          <Center
            key={interval}
            sx={{
              h: `${tableCellProperty.h}px`,
              w: 12,
              fontWeight: 500,
              fontSize: "18px",
              lineHeight: 1.4,
              color: "#1A181C",
            }}
          >
            {interval}
          </Center>
        ))}
      </Flex>
      <TableContainer sx={customScrollBarCss}>
        <Table
          variant={"unstyled"}
          sx={{
            borderCollapse: "separate",
            borderSpacing: "0 0",
          }}
        >
          <Thead>
            <Tr h={`${tableCellProperty.h}px`}>
              {days.map((day) => {
                return (
                  <Th
                    key={day}
                    w={`${tableCellProperty.w}px`}
                    maxW={`${tableCellProperty.w}px`}
                  >
                    <Center>{day}</Center>
                  </Th>
                );
              })}
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <ChakraTd h="8px" p="0" m="0">
                {null}
              </ChakraTd>
            </Tr>
          </Tbody>
          <Tbody
            sx={{
              border: "1px solid #909090",
              borderRadius: "4px",
            }}
          >
            {Array.from({ length: intervals.length }, (_, intervalIndex) => {
              return (
                <Tr
                  key={intervalIndex}
                  sx={{
                    borderRadius: "4px",
                  }}
                  h={`${tableCellProperty.h}px`}
                  maxH={`${tableCellProperty.h}px`}
                >
                  {days.map((day, dayIndex) => {
                    return (
                      <Td
                        key={dayIndex}
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
                        openPortal={openPortal}
                        setOpenPortal={setOpenPortal}
                        coursesOnTable={coursesOnTable}
                        courseRle={
                          coursesRle?.[`${dayIndex + 1}-${intervalIndex}`] ??
                          null
                        }
                        tableCellProperty={tableCellProperty}
                      >
                        {coursesRle?.[`${dayIndex + 1}-${intervalIndex}`] ? (
                          <CourseTableCard
                            isActive={
                              openPortal === `${dayIndex + 1}-${intervalIndex}`
                            }
                            courseRle={
                              coursesRle[`${dayIndex + 1}-${intervalIndex}`]
                            }
                            h={
                              coursesRle[`${dayIndex + 1}-${intervalIndex}`]
                                .duration *
                                tableCellProperty.h -
                              tableCellProperty.borderWidth
                            }
                            w={`${
                              tableCellProperty.w -
                              tableCellProperty.borderWidth
                            }px`}
                          />
                        ) : null}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
}

export default CourseTable;
