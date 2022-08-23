import {
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
  SortableHandle as sortableHandle,
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
  Center,
} from "@chakra-ui/react";
import { hash_to_color_hex } from "utils/colorAgent";
import { FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import { FaInfoCircle } from "react-icons/fa";
import { reportEvent } from "utils/ga";
import React from "react";
import { Course } from "types/course";

const DragHandle = sortableHandle(() => (
  <Center>
    <MdDragHandle cursor="row-resize" size="20" color="gray" />
  </Center>
));

interface SortableElementProps {
  readonly course: Course;
  readonly prepareToRemoveCourseId: string[];
  readonly handlePrepareToDelete: (courseId: string) => void;
  readonly helperClass: string;
}
const SortableElement = sortableElement<SortableElementProps>(
  ({
    course,
    prepareToRemoveCourseId,
    handlePrepareToDelete,
  }: SortableElementProps) => {
    const router = useRouter();
    if (!course) {
      return null;
    }
    const badgeColor = useColorModeValue(
      hash_to_color_hex(course.id, 0.9, 0.8),
      hash_to_color_hex(course.id, 0.3, 0.3)
    );
    const textColor = useColorModeValue("gray.500", "gray.200");
    const removeColor = useColorModeValue("red.700", "red.300");
    return (
      <Flex className={styles.sortableHelper} alignItems="center" my="1">
        <DragHandle />
        <Badge ml="2" mr="1" variant="solid" bg={badgeColor} color={textColor}>
          {course.serial}
        </Badge>
        <Text
          as={prepareToRemoveCourseId.includes(course.id) ? "del" : undefined}
          fontSize="sm"
          color={
            prepareToRemoveCourseId.includes(course.id)
              ? removeColor
              : textColor
          }
          mx="1"
          fontWeight="700"
          noOfLines={1}
        >
          {course.name}
        </Text>
        <Button
          variant="ghost"
          colorScheme="blue"
          leftIcon={<FaInfoCircle />}
          size="sm"
          onClick={() => {
            reportEvent("course_table_card_popover", "click", "course_info");
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

const SortableContainer = sortableContainer<{
  readonly children: React.ReactNode;
}>(({ children }: { readonly children: React.ReactNode }) => {
  return <Flex flexDirection="column">{children}</Flex>;
});

function SortablePopover(props: {
  readonly courseData: {
    readonly [key: string]: Course;
  };
  readonly courseList: string[];
  readonly prepareToRemoveCourseId: string[];
  readonly onSortEnd: ({
    oldIndex,
    newIndex,
  }: {
    readonly oldIndex: number;
    readonly newIndex: number;
  }) => void;
  readonly handlePrepareToDelete: (courseId: string) => void;
}) {
  const {
    courseData,
    courseList,
    prepareToRemoveCourseId,
    onSortEnd,
    handlePrepareToDelete,
  } = props;
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
