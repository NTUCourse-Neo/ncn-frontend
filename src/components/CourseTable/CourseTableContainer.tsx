import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Center,
  Box,
  Text,
  Skeleton,
  Tooltip,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { useState, useCallback } from "react";
import CourseTableCard from "components/CourseTable/CourseTableCard/CourseTableCard";
import { weekdays_map, Weekday } from "data/mapping_table";
import { hash_to_color_hex } from "utils/colorAgent";
import { hoverCourseState } from "utils/hoverCourse";
import { useSnapshot } from "valtio";
import { reportEvent } from "utils/ga";
import { TimeMap } from "@/utils/parseCourseTime";
import { Course, Interval } from "types/course";
import { intervals } from "constant";

function HoverCourseIndicator({
  hoveredCourse,
}: {
  readonly hoveredCourse: Course;
}) {
  const course = hoveredCourse;
  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        borderRadius="lg"
        boxShadow="lg"
        w="100%"
        p={2}
        h="3vh"
        border="2px"
        borderColor={hash_to_color_hex(course.id, 0.8)}
        borderStyle="dashed"
      >
        <Text fontSize="xs" width={"100%"} align="center" noOfLines={1}>
          {course.name}
        </Text>
      </Button>
    </div>
  );
}

function CourseTableContainer(props: {
  readonly courses: {
    readonly [key: string]: Course;
  };
  readonly loading: boolean;
  readonly courseTimeMap: TimeMap;
}) {
  const { courses, loading, courseTimeMap } = props;
  const days: Weekday[] = ["1", "2", "3", "4", "5"];
  const intervalTextColor = useColorModeValue("gray.300", "gray.600");

  const [activeDayCol, setActiveDayCol] = useState<"0" | Weekday>("0");
  const { hoveredCourse, hoveredCourseTimeMap } = useSnapshot(hoverCourseState);
  const renderIntervalContent = useCallback(
    (days: Weekday[], interval: Interval, i: number) => {
      const fullWidth = days.length === 1;
      return days.map((day, j) => {
        const intervalCourseIds = courseTimeMap?.[day]?.[interval];
        const intervalHoveredCourseIds =
          hoveredCourse && hoveredCourseTimeMap?.[day]?.[interval];
        // hover course has been in courseTable already, show solid border in this case
        const isOverlapped = intervalCourseIds
          ? (courseTimeMap?.[day]?.[interval] ?? []).includes(
              hoveredCourseTimeMap?.[day]?.[interval]?.[0] ?? ""
            )
          : false;
        if (loading) {
          return (
            <Td key={`${day}-${i}-${j}`}>
              <Skeleton borderRadius="lg" speed={1 + (i + j) * 0.1}>
                <Box h="12" w="4vw" />
              </Skeleton>
            </Td>
          );
        }
        // no courses & hoverCourse
        if (!intervalCourseIds && !intervalHoveredCourseIds) {
          return (
            <Td key={`${day}-${i}-${j}`}>
              <Flex
                w={
                  fullWidth ? "100%" : { base: "70px", md: "110px", lg: "4vw" }
                }
                h="4vh"
                mb="1"
                justifyContent="center"
                alignItems="center"
              >
                <Text color={intervalTextColor} fontSize="5xl" fontWeight="700">
                  {" "}
                  {interval}
                </Text>
              </Flex>
            </Td>
          );
        }
        return (
          <Td key={`${day}-${i}-${j}`}>
            <Flex
              w={fullWidth ? "100%" : { base: "70px", md: "110px", lg: "4vw" }}
              minH="4vh"
              mb="1"
              direction={"column"}
              justifyContent="center"
              alignItems="center"
            >
              {intervalHoveredCourseIds && !isOverlapped ? (
                <HoverCourseIndicator hoveredCourse={hoveredCourse} />
              ) : null}
              {intervalCourseIds ? (
                <CourseTableCard
                  courseInitialOrder={courseTimeMap?.[day]?.[interval] ?? []}
                  courseData={courses}
                  interval={interval}
                  day={weekdays_map[day]}
                  hoverId={
                    isOverlapped
                      ? hoveredCourseTimeMap?.[day]?.[interval]?.[0] ?? ""
                      : ""
                  }
                />
              ) : null}
            </Flex>
          </Td>
        );
      });
    },
    [
      courseTimeMap,
      courses,
      hoveredCourse,
      hoveredCourseTimeMap,
      loading,
      intervalTextColor,
    ]
  );

  return (
    <Table variant="simple" colorScheme="blue" borderRadius="lg" w="100%">
      <Thead>
        {activeDayCol === "0" ? (
          <Tr>
            {days.map((day, j) => {
              return (
                <Th
                  onClick={() => {
                    setActiveDayCol(day);
                    reportEvent("course_table", "click", "expand_day");
                  }}
                  cursor="pointer"
                  key={`${day}-${j}`}
                >
                  <Tooltip
                    hasArrow
                    placement="top"
                    label="點擊展開單日"
                    bg="gray.600"
                    color="white"
                  >
                    <Center w={{ base: "70px", md: "110px", lg: "4vw" }}>
                      {weekdays_map[day]}
                    </Center>
                  </Tooltip>
                </Th>
              );
            })}
          </Tr>
        ) : (
          <Tr>
            <Th
              onClick={() => {
                setActiveDayCol("0");
                reportEvent("course_table", "click", "collapse_day");
              }}
              cursor="pointer"
            >
              <Tooltip
                hasArrow
                placement="top"
                label="點擊收合"
                bg="gray.600"
                color="white"
              >
                <Center>{weekdays_map[activeDayCol]}</Center>
              </Tooltip>
            </Th>
          </Tr>
        )}
      </Thead>
      <Tbody>
        {intervals.map((interval, i) => {
          if (activeDayCol === "0") {
            return (
              <Tr key={`${interval}-${i}`}>
                {renderIntervalContent(days, interval, i)}
              </Tr>
            );
          }
          return (
            <Tr key={`${interval}-${i}`}>
              {renderIntervalContent([activeDayCol], interval, i)}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}

export default CourseTableContainer;
