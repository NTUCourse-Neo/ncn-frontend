import { React } from "react";
import CourseInfoRow from "components/CourseInfoRow";
import { Box, Flex, Spacer, Accordion } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { setHoveredCourse } from "actions/index";

function CourseInfoRowContainer({ selectedCourses, displayTable }) {
  const userInfo = useSelector((state) => state.user);
  const displayTags = useSelector((state) => state.display_tags);
  const courseInfo = useSelector((state) => state.search_results);
  const dispatch = useDispatch();

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
              dispatch(setHoveredCourse(info));
            }}
            onMouseLeave={() => {
              dispatch(setHoveredCourse(null));
            }}
          >
            <CourseInfoRow
              id={info["id"]}
              index={index}
              courseInfo={info}
              selected={selectedCourses.includes(info._id)}
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
