import { useMemo } from "react";
import CourseInfoRow from "components/CourseInfoRow";
import { Box, Flex, Spacer, Accordion } from "@chakra-ui/react";
import { useUserData } from "components/Providers/UserProvider";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";

function CourseInfoRowContainer({ displayTable }) {
  const { user: userInfo } = useUserData();
  const { displayTags, searchResult: courseInfo, course_table: courseTable, setHoveredCourseData } = useCourseSearchingContext();
  const selectedCourses = useMemo(() => {
    return courseTable?.courses;
  }, [courseTable]);

  // const hide_scroll_bar = {
  //     '::-webkit-scrollbar': {
  //         display: "none"
  //     },
  // }
  return (
    <Box w="100%">
      <Flex direction="column" alignItems={"center"}>
        {courseInfo.map((info, index) => (
          <Accordion
            allowToggle
            w={{ base: "90vw", md: "100%" }}
            key={index}
            onMouseEnter={() => {
              if (displayTable) {
                setHoveredCourseData(info);
              }
            }}
            onMouseLeave={() => {
              if (displayTable) {
                setHoveredCourseData(null);
              }
            }}
          >
            <CourseInfoRow
              id={info["id"]}
              index={index}
              courseInfo={info}
              selected={selectedCourses && selectedCourses.includes(info._id)}
              displayTags={displayTags}
              displayTable={displayTable}
              isfavorite={userInfo === null ? false : userInfo.db.favorites.includes(info._id)}
            />
            <Spacer my={{ base: 2, md: 1 }} />
          </Accordion>
        ))}
      </Flex>
    </Box>
  );
}
export default CourseInfoRowContainer;
