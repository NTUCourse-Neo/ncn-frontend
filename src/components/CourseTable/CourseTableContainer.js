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
} from "@chakra-ui/react";
import * as React from "react";
import { useState, useCallback } from "react";
import CourseTableCard from "components/CourseTable/CourseTableCard/CourseTableCard";
import { weekdays_map } from "data/mapping_table";
import { hash_to_color_hex } from "utils/colorAgent";
import { hoverCourseState } from "utils/hoverCourse";
import { useSnapshot } from "valtio";

function HoverCourseIndicator({ hoveredCourse }) {
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
        p={0}
        h="3vh"
        border="2px"
        borderColor={hash_to_color_hex(course.id, 0.7)}
        borderStyle="dashed"
      >
        <Text
          fontSize="xs"
          width={"100%"}
          align="center"
          isTruncated
          noOfLines={1}
        >
          {course.name}
        </Text>
      </Button>
    </div>
  );
}

function CourseTableContainer({ courses, loading, courseTimeMap }) {
  const days = ["1", "2", "3", "4", "5"];
  const interval = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "A",
    "B",
    "C",
    "D",
  ];
  const [activeDayCol, setActiveDayCol] = useState(0);
  const { hoveredCourse, hoveredCourseTimeMap } = useSnapshot(hoverCourseState);

  const renderIntervalContent = useCallback(
    (days, interval, i) => {
      const fullWidth = days.length === 1;
      return days.map((day, j) => {
        const intervalCourseIds = courseTimeMap?.[day]?.[interval];
        const intervalHoveredCourseIds =
          hoveredCourse && hoveredCourseTimeMap?.[day]?.[interval];
        // hover course has been in courseTable already, show solid border in this case
        const isOverlapped = intervalCourseIds
          ? courseTimeMap?.[day]?.[interval].includes(
              hoveredCourseTimeMap?.[day]?.[interval]?.[0]
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
                  fullWidth
                    ? "100%"
                    : { base: "70px", md: "110px", lg: "100px" }
                }
                h="4vh"
                mb="1"
                justifyContent="center"
                alignItems="center"
              >
                <Text color="gray.300" fontSize="5xl" fontWeight="700">
                  {interval}
                </Text>
              </Flex>
            </Td>
          );
        }
        return (
          <Td key={`${day}-${i}-${j}`}>
            <Flex
              w={
                fullWidth ? "100%" : { base: "70px", md: "110px", lg: "100px" }
              }
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
                  courseInitialOrder={courseTimeMap[day][interval]}
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
    [courseTimeMap, courses, hoveredCourse, hoveredCourseTimeMap, loading]
  );

  return (
    <Table variant="simple" colorScheme="blue" borderRadius="lg" w="100%">
      <Thead>
        {activeDayCol === 0 ? (
          <Tr>
            {days.map((day, j) => {
              return (
                <Th
                  onClick={() => setActiveDayCol(day)}
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
                    <Center>{weekdays_map[day]}</Center>
                  </Tooltip>
                </Th>
              );
            })}
          </Tr>
        ) : (
          <Tr>
            <Th onClick={() => setActiveDayCol(0)} cursor="pointer">
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
        {interval.map((interval, i) => {
          if (activeDayCol === 0) {
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
