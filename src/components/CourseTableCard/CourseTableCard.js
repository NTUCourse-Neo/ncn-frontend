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
import { useCourseTable } from "components/Providers/CourseTableProvider";
import SortablePopover from "components/CourseTableCard/SortablePopover";
import { patchCourseTable } from "queries/courseTable";

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
  const { courseTable, setCourseTable } = useCourseTable();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  // initial order of courses
  const courseOrder = courseInitialOrder;
  // temp state (buffer), used for decide the NEW course order / dispatch to server, when press "save"
  const [courseList, setCourseList] = useState([]);
  const [prepareToRemoveCourseId, setPrepareToRemoveCourseId] = useState([]);

  const handleDelete = (courseId) => {
    if (prepareToRemoveCourseId.includes(courseId)) {
      setPrepareToRemoveCourseId(prepareToRemoveCourseId.filter((id) => id !== courseId));
    } else {
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
      index_arr.push(courseTable.courses.indexOf(id));
    });
    return index_arr;
  };

  const saveChanges = async () => {
    // get indice need to reorder from courseOrder
    const index_arr = fetchIndexByIds(courseOrder);
    // do reorder, generate new courseTable.courses to be patched
    const new_courses = [...courseTable.courses];
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
      res_table = await patchCourseTable(courseTable._id, courseTable.name, courseTable.user_id, courseTable.expire_ts, new_courses);
      setCourseTable(res_table);
    } catch (error) {
      if (error?.response?.status === 403 || error?.response?.status === 404) {
        // expired
        setCourseTable(null);
      }
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
