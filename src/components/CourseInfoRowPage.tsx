import { useMemo } from "react";
import CourseInfoRow from "components/CourseInfoRow";
import { Accordion, useBreakpointValue, Center, Flex } from "@chakra-ui/react";
import useUserInfo from "hooks/useUserInfo";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
// import { setHoveredCourseData } from "utils/hoverCourse";
import useCourseTable from "hooks/useCourseTable";
import { useUser } from "@auth0/nextjs-auth0";
import useNeoLocalStorage from "hooks/useNeoLocalStorage";
import useSearchResult from "hooks/useSearchResult";
import SkeletonRow from "@/components/SkeletonRow";

interface CourseInfoRowPageProps {
  readonly displayTable: boolean;
  readonly pageIndex: number;
}
export default function CourseInfoRowPage({
  displayTable,
  pageIndex,
}: CourseInfoRowPageProps): JSX.Element | null {
  const { search } = useCourseSearchingContext();
  const { courses, isLoading, error } = useSearchResult(search, pageIndex);
  const { neoLocalCourseTableKey } = useNeoLocalStorage();
  const { user } = useUser();
  const { userInfo } = useUserInfo(user?.sub ?? null);
  const courseTableKey = userInfo
    ? userInfo?.course_tables?.[0] ?? null
    : neoLocalCourseTableKey;
  const { courseTable } = useCourseTable(courseTableKey);
  const selectedCourses = useMemo(() => {
    return courseTable?.courses ? courseTable?.courses.map((c) => c.id) : [];
  }, [courseTable]);
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  if (error) {
    return (
      <Center
        h="55vh"
        w="100%"
        sx={{
          color: "#909090",
          lineHeight: 1.4,
        }}
      >
        發生錯誤
      </Center>
    );
  }
  if (isLoading) {
    return <SkeletonRow isLoading={isLoading} />;
  }
  if (courses.length === 0) {
    return (
      <Center
        h="55vh"
        w="100%"
        flexDirection={"column"}
        sx={{
          color: "#909090",
          lineHeight: 1.4,
        }}
        gap={3}
      >
        <Flex
          sx={{
            fontSize: "20px",
            fontWeight: 500,
          }}
        >
          搜尋不到任何課程
        </Flex>
        <Flex
          sx={{
            fontSize: "14px",
          }}
        >
          請試著把搜尋範圍拉大或換個搜尋方式
        </Flex>
      </Center>
    );
  }
  return (
    <Accordion
      allowToggle
      allowMultiple={false}
      w={{ base: "90vw", md: "100%" }}
      onMouseEnter={() => {
        // if (displayTable && isDesktop) {
        //   setHoveredCourseData(course);
        // }
      }}
      onMouseLeave={() => {
        // if (displayTable && isDesktop) {
        //   setHoveredCourseData(null);
        // }
      }}
    >
      {courses.map((course, index) => (
        <CourseInfoRow
          courseInfo={course}
          selected={selectedCourses.includes(course.id)}
          displayTable={displayTable}
          key={course.id}
        />
      ))}
    </Accordion>
  );
}
