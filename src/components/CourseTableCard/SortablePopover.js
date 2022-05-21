import { sortableContainer, sortableElement, sortableHandle } from "react-sortable-hoc";
import { MdDragHandle } from "react-icons/md";
import { Flex, Text, Badge, Spacer, IconButton } from "@chakra-ui/react";
import { RenderNolContentBtn } from "containers/CourseDrawerContainer";
import { hash_to_color_hex } from "utils/colorAgent";
import { FaTrashAlt } from "react-icons/fa";

// for future typescript used
// interface Prop {
//     courseData: dictionary of course obj w/ course_id as key;
//     courseList: list of course_id's to reorder;
//     prepareToRemoveCourseId: list of course_id's to remove;
//     onSortEnd: function to call when sort ends;
//     handlePrepareToDelete: function to call when delete button is clicked;
// }

function SortablePopover({ courseData, courseList, prepareToRemoveCourseId, onSortEnd, handlePrepareToDelete }) {
  const DragHandle = sortableHandle(() => <MdDragHandle cursor="row-resize" size="20" color="gray" />);

  const SortableElement = sortableElement(({ key, course }) => (
    <Flex className="sortableHelper" alignItems="center" my="1" key={"Sortable_" + key + "_Flex"}>
      <DragHandle key={"Sortable_" + key + "_DragHandle"} />
      <Badge ml="4" mr="1" variant="solid" bg={hash_to_color_hex(course._id, 0.9)} color="gray.600" key={"Sortable_" + key + "_Badge"}>
        {course.id}
      </Badge>
      <Text
        as={prepareToRemoveCourseId.includes(course._id) ? "del" : ""}
        fontSize="lg"
        color={prepareToRemoveCourseId.includes(course._id) ? "red.700" : "gray.500"}
        mx="1"
        fontWeight="700"
        isTruncated
        key={"Sortable_" + key + "_Text"}
      >
        {course.course_name}
      </Text>
      {RenderNolContentBtn(course, "", key)}
      <Spacer key={"Sortable_" + key + "_Spacer"} />
      <IconButton
        aria-label="Delete"
        variant={prepareToRemoveCourseId.includes(course._id) ? "solid" : "outline"}
        icon={<FaTrashAlt />}
        size="sm"
        colorScheme="red"
        key={"Sortable_" + key + "_IconButton"}
        onClick={() => {
          handlePrepareToDelete(course._id);
        }}
      />
    </Flex>
  ));

  const SortableContainer = sortableContainer(({ children }) => {
    return <Flex flexDirection="column">{children}</Flex>;
  });

  return (
    <SortableContainer useDragHandle onSortEnd={onSortEnd} lockAxis="y">
      {courseList.map((courseId, index) => {
        let course = courseData[courseId];
        return <SortableElement key={courseId} index={index} course={course} helperClass="sortableHelper" />;
      })}
    </SortableContainer>
  );
}

export default SortablePopover;
