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
import useCourseTable from "hooks/useCourseTable";
import { useUser } from "@auth0/nextjs-auth0";
import useNeoLocalStorage from "hooks/useNeoLocalStorage";
import useSearchResult from "hooks/useSearchResult";

function CourseInfoRowPage({ displayTable, pageIndex }) {
  const { search } = useCourseSearchingContext();
  const { courses, isLoading, error } = useSearchResult(search, pageIndex);
  const { neoLocalCourseTableKey } = useNeoLocalStorage();
  const { user } = useUser();
  const { userInfo } = useUserInfo(user?.sub);
  const courseTableKey = userInfo
    ? userInfo?.course_tables?.[0] ?? null
    : neoLocalCourseTableKey;
  const { courseTable } = useCourseTable(courseTableKey);
  const selectedCourses = useMemo(() => {
    return courseTable?.courses ? courseTable?.courses.map((c) => c.id) : [];
  }, [courseTable]);
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  if (isLoading || error) {
    return <></>;
  }
  return courses.map((course, index) => (
    <Accordion
      allowToggle
      w={{ base: "90vw", md: "100%" }}
      key={index}
      onMouseEnter={() => {
        if (displayTable && isDesktop) {
          setHoveredCourseData(course);
        }
      }}
      onMouseLeave={() => {
        if (displayTable && isDesktop) {
          setHoveredCourseData(null);
        }
      }}
    >
      <CourseInfoRow
        courseInfo={course}
        selected={selectedCourses.includes(course.id)}
        displayTable={displayTable}
      />
      <Spacer my={{ base: 2, md: 1 }} />
    </Accordion>
  ));
}

function CourseInfoRowContainer({ displayTable }) {
  const { pageNumber } = useCourseSearchingContext();

  const pages = useMemo(() => {
    const res = [];
    for (let i = 0; i < pageNumber; i++) {
      res.push(
        <CourseInfoRowPage key={i} displayTable={displayTable} pageIndex={i} />
      );
    }
    return res;
  }, [pageNumber, displayTable]);

  return (
    <Box w="100%">
      <Flex direction="column" alignItems={"center"}>
        {pages}
      </Flex>
    </Box>
  );
}
export default CourseInfoRowContainer;
