import * as React from "react";
import { useState } from "react";
import { arrayMoveImmutable as arrayMove } from "array-move";
import "components/CourseTableCard/CourseTableCard.css";
import {
  Flex,
  Text,
  Button,
  useDisclosure,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Badge,
  PopoverFooter,
  Spacer,
  Tag,
  TagLeftIcon,
  ScaleFade,
  useToast,
} from "@chakra-ui/react";
import { hash_to_color_hex } from "utils/colorAgent";
import { FaExclamationTriangle } from "react-icons/fa";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import SortablePopover from "components/CourseTableCard/SortablePopover";

function CourseBox({ courseId, courseData, isOpen, hoverId }) {
  const course = courseData?.[courseId];
  if (!course) {
    return <></>;
  }

  return (
    <Tooltip label={course.course_name} placement="top" hasArrow>
      <Button
        bg={hash_to_color_hex(course._id, isOpen ? 0.7 : 0.8)}
        borderRadius="md"
        boxShadow="lg"
        mb="1"
        p="2"
        w={{ base: "70px", md: "75px", lg: "100px" }}
        h="3vh"
        border={"2px"}
        borderColor={hoverId === courseId ? hash_to_color_hex(course._id, 0.5) : "transparent"}
      >
        <Text fontSize="xs" isTruncated>
          {` ${course.course_name} `}
        </Text>
      </Button>
    </Tooltip>
  );
}

function CourseTableCard({ courseInitialOrder, courseData, day, interval, hoverId }) {
  const { course_table, patchCourseTable } = useCourseSearchingContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  /*
        state design concept:
        when open Popover, overwrite the courseList by courseOrder
        when click save, overwrite the courseOrder by courseList
    */
  // initial order of courses
  const courseOrder = courseInitialOrder;
  // temp state (buffer), used for decide the NEW course order / dispatch to server, when press "save"
  const [courseList, setCourseList] = useState([]);
  const [prepareToRemoveCourseId, setPrepareToRemoveCourseId] = useState([]);

  const handleDelete = (courseId) => {
    if (prepareToRemoveCourseId.includes(courseId)) {
      // If the course is in the prepareToRemoveCourseId, remove it from the list.
      setPrepareToRemoveCourseId(prepareToRemoveCourseId.filter((id) => id !== courseId));
    } else {
      // If the course is not in the prepareToRemoveCourseId, add it to the list.
      setPrepareToRemoveCourseId([...prepareToRemoveCourseId, courseId]);
    }
  };

  const isEdited = () => {
    // return true if the popup data is different from the original data.
    return !courseOrder.every((course, index) => course === courseList[index]) || prepareToRemoveCourseId.length > 0;
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setCourseList(arrayMove(courseList, oldIndex, newIndex));
  };

  // fetch original order from courseOrder (ids_array), return the indices need to reorder
  const fetchIndexByIds = (ids_array) => {
    const index_arr = [];
    ids_array.forEach((id) => {
      index_arr.push(course_table.courses.indexOf(id));
    });
    return index_arr;
  };

  const saveChanges = async () => {
    // get indice need to reorder from courseOrder
    const index_arr = fetchIndexByIds(courseOrder);
    // do reorder, generate new course_table.courses to be patched
    const new_courses = [...course_table.courses];
    for (let i = 0; i < courseList.length; i++) {
      const target_index = index_arr[i];
      const target_id = courseList[i];
      if (!prepareToRemoveCourseId.includes(target_id)) {
        new_courses[target_index] = target_id;
      } else {
        // deleted
        new_courses[target_index] = "";
      }
    }
    let res_table;
    try {
      res_table = await patchCourseTable(course_table._id, course_table.name, course_table.user_id, course_table.expire_ts, new_courses);
    } catch (error) {
      toast({
        title: "更改志願序失敗!",
        description: "請檢查網路連線，或聯絡系統管理員。",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    if (res_table) {
      // patch success
      toast({
        title: `Saved!`,
        description: `更改志願序成功`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // patch failed, because expired
      toast({
        title: `課表已過期!`,
        description: `更改志願序失敗`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    leavePopover();
  };

  const leavePopover = () => {
    onClose();
    // set buffer states to initial state
    setPrepareToRemoveCourseId([]);
    setCourseList([]);
  };

  return (
    <>
      <Popover
        onOpen={onOpen}
        onClose={() => {
          leavePopover();
        }}
        isOpen={isOpen}
        closeOnBlur={false}
        placement="auto"
        flip
      >
        <PopoverTrigger>
          <Flex
            w={"100%"}
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            onClick={() => {
              setCourseList(courseOrder);
              setPrepareToRemoveCourseId([]);
            }}
          >
            {courseOrder.map((courseId, index) => (
              <React.Fragment key={index}>
                <CourseBox courseId={courseId} courseData={courseData} isOpen={isOpen} hoverId={hoverId} />
              </React.Fragment>
            ))}
          </Flex>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            <Flex flexDirection="row" alignItems="center" justifyContent="start" mb="2">
              節次資訊
              <Badge key={day} ml="2" size="sm">
                週{day}
              </Badge>
              <Badge key={interval} ml="2" size="sm">
                第{interval}節
              </Badge>
            </Flex>
          </PopoverHeader>
          <PopoverBody>
            <Flex flexDirection="column" justifyContent="center">
              <SortablePopover
                courseData={courseData}
                courseList={courseList}
                prepareToRemoveCourseId={prepareToRemoveCourseId}
                onSortEnd={onSortEnd}
                handlePrepareToDelete={handleDelete}
              />
            </Flex>
          </PopoverBody>
          <PopoverFooter>
            <Flex justifyContent="end" alignItems="center">
              <ScaleFade initialScale={0.9} in={isEdited()}>
                <Tag colorScheme="yellow" variant="solid">
                  <TagLeftIcon boxSize="12px" as={FaExclamationTriangle} />
                  變更未儲存
                </Tag>
              </ScaleFade>
              <Spacer />
              <Button
                colorScheme="gray"
                variant="ghost"
                onClick={() => {
                  leavePopover();
                }}
              >
                取消
              </Button>
              <Button
                colorScheme="teal"
                onClick={() => {
                  saveChanges();
                }}
                disabled={!isEdited()}
              >
                儲存
              </Button>
            </Flex>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </>
  );
}
export default CourseTableCard;
