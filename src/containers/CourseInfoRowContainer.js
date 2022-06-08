import { React } from "react";
import CourseInfoRow from "components/CourseInfoRow";
import { Box, Flex, Spacer, Accordion } from "@chakra-ui/react";
import { useSelector } from "react-redux";

function CourseInfoRowContainer({ courseInfo, w, setHoveredCourse, selectedCourses, displayTable, displayTags }) {
  const userInfo = useSelector((state) => state.user);

  // const hide_scroll_bar = {
  //     '::-webkit-scrollbar': {
  //         display: "none"
  //     },
  // }

  const renderCourseInfoRow = () => {
    return courseInfo.map((info, index) => {
      return (
        <Accordion
          allowToggle
          w={{ base: "90vw", md: w }}
          key={index}
          onMouseEnter={() => setHoveredCourse(info)}
          onMouseLeave={() => {
            setHoveredCourse(null);
          }}
        >
          <CourseInfoRow
            id={info["id"]}
            index={index}
            courseInfo={info}
            selected={selectedCourses.includes(info._id)}
            setHoveredCourse={setHoveredCourse}
            displayTags={displayTags}
            displayTable={displayTable}
            isfavorite={userInfo === null ? false : userInfo.db.favorites.includes(info._id)}
          />
          <Spacer my={{ base: 2, md: 1 }} />
        </Accordion>
      );
    });
  };
  return (
    <Box>
      <Flex direction="column">{renderCourseInfoRow()}</Flex>
    </Box>
  );
}
export default CourseInfoRowContainer;
