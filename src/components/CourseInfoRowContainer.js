import { useMemo } from "react";
import CourseInfoRow from "components/CourseInfoRow";
import {
  Box,
  Flex,
  Spacer,
  Accordion,
  useBreakpointValue,
} from "@chakra-ui/react";
import useUserInfo from "hooks/useUserInfo";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import { setHoveredCourseData } from "utils/hoverCourse";
import { useCourseTable } from "components/Providers/CourseTableProvider";

function CourseInfoRowContainer({ displayTable }) {
  const { userInfo } = useUserInfo();
  const { searchResult: courseInfo } = useCourseSearchingContext();
  const { courseTable } = useCourseTable();
  const selectedCourses = useMemo(() => {
    return courseTable?.courses ? courseTable?.courses.map((c) => c.id) : [];
  }, [courseTable]);
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  // const hide_scroll_bar = {
  //     '::-webkit-scrollbar': {
  //         display: "none"
  //     },
  // }
  return (
    <Box w="100%">
      <Flex direction="column" alignItems={"center"}>
        {courseInfo.map((course, index) => (
          <Accordion
            allowToggle
            w={{ base: "90vw", md: "100%" }}
            key={index}
            onMouseEnter={() => {
              if (displayTable && isDesktop) {
                // TODO: refactor course structure
                setHoveredCourseData(course);
              }
            }}
            onMouseLeave={() => {
              if (displayTable && isDesktop) {
                // TODO: refactor course structure
                setHoveredCourseData(null);
              }
            }}
          >
            <CourseInfoRow
              courseInfo={course}
              selected={selectedCourses.includes(course.id)}
              displayTable={displayTable}
              isfavorite={
                !userInfo
                  ? false
                  : userInfo.favorites.map((c) => c.id).includes(course.id)
              }
            />
            <Spacer my={{ base: 2, md: 1 }} />
          </Accordion>
        ))}
      </Flex>
    </Box>
  );
}
export default CourseInfoRowContainer;
