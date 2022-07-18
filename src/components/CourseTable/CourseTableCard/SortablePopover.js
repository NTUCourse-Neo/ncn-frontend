import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { MdDragHandle } from "react-icons/md";
import styles from "components/CourseTable/CourseTableCard/CourseTableCard.module.css";
import {
  Flex,
  Text,
  Badge,
  Spacer,
  IconButton,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { hash_to_color_hex } from "utils/colorAgent";
import { FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import { FaInfoCircle } from "react-icons/fa";

// for future typescript used
// interface Prop {
//     courseData: dictionary of course obj w/ course_id as key;
//     courseList: list of course_id's to reorder;
//     prepareToRemoveCourseId: list of course_id's to remove;
//     onSortEnd: function to call when sort ends;
//     handlePrepareToDelete: function to call when delete button is clicked;
// }

const DragHandle = sortableHandle(() => (
  <MdDragHandle cursor="row-resize" size="20" color="gray" />
));

const SortableElement = sortableElement(
  ({ course, prepareToRemoveCourseId, handlePrepareToDelete }) => {
    const router = useRouter();
    const badgeColor = useColorModeValue(
      hash_to_color_hex(course.id, 0.9),
      hash_to_color_hex(course.id, 0.8)
    );
    const textColor = useColorModeValue("gray.500", "gray.400");
    const removeColor = useColorModeValue("red.700", "red.300");
    return (
      <Flex className={styles.sortableHelper} alignItems="center" my="1">
        <DragHandle />
        <Badge ml="4" mr="1" variant="solid" bg={badgeColor} color="gray.600">
          {course.serial}
        </Badge>
        <Text
          as={prepareToRemoveCourseId.includes(course.id) ? "del" : ""}
          fontSize="lg"
          color={
            prepareToRemoveCourseId.includes(course.id)
              ? removeColor
              : textColor
          }
          mx="1"
          fontWeight="700"
          noOfLines={1}
          isTruncated
        >
          {course.name}
        </Text>
        <Button
          variant="ghost"
          colorScheme="blue"
          leftIcon={<FaInfoCircle />}
          size="sm"
          onClick={() => {
            router.push(`/courseinfo/${course.id}`);
          }}
        />
        <Spacer />
        <IconButton
          aria-label="Delete"
          variant={
            prepareToRemoveCourseId.includes(course.id) ? "solid" : "outline"
          }
          icon={<FaTrashAlt />}
          size="sm"
          colorScheme="red"
          onClick={() => {
            handlePrepareToDelete(course.id);
          }}
        />
      </Flex>
    );
  }
);

const SortableContainer = sortableContainer(({ children }) => {
  return <Flex flexDirection="column">{children}</Flex>;
});

function SortablePopover({
  courseData,
  courseList,
  prepareToRemoveCourseId,
  onSortEnd,
  handlePrepareToDelete,
}) {
  return (
    <SortableContainer useDragHandle onSortEnd={onSortEnd} lockAxis="y">
      {courseList.map((courseId, index) => {
        const course = courseData[courseId];
        return (
          <SortableElement
            key={courseId}
            index={index}
            course={course}
            helperClass="sortableHelper"
            prepareToRemoveCourseId={prepareToRemoveCourseId}
            handlePrepareToDelete={handlePrepareToDelete}
          />
        );
      })}
    </SortableContainer>
  );
}

export default SortablePopover;
