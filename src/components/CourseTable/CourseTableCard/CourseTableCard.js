import * as React from "react";
import { useState } from "react";
import { arrayMoveImmutable as arrayMove } from "array-move";
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
  useColorModeValue,
} from "@chakra-ui/react";
import { hash_to_color_hex } from "utils/colorAgent";
import { FaExclamationTriangle } from "react-icons/fa";
import useCourseTable from "hooks/useCourseTable";
import useUserInfo from "hooks/useUserInfo";
import { useUser } from "@auth0/nextjs-auth0";
import useNeoLocalStorage from "hooks/useNeoLocalStorage";
import SortablePopover from "components/CourseTable/CourseTableCard/SortablePopover";
import { patchCourseTable } from "queries/courseTable";
import { reportEvent } from "utils/ga";

function CourseBox({ courseId, courseData, isOpen, hoverId }) {
  const course = courseData?.[courseId];
  const bgColor = useColorModeValue(
    hash_to_color_hex(course.id, 0.8, 0.6),
    hash_to_color_hex(course.id, 0.2, 0.3)
  );
  if (!course) {
    return <></>;
  }

  return (
    <Tooltip label={course.name} placement="top" hasArrow>
      <Button
        bg={bgColor}
        borderRadius="md"
        boxShadow="lg"
        mb="1"
        p="2"
        w="100%"
        h="3vh"
        border={"2px"}
        borderColor={
          hoverId === courseId
            ? hash_to_color_hex(course.id, 0.8)
            : "transparent"
        }
      >
        <Text fontSize="xs" isTruncated noOfLines={1}>
          {` ${course.name} `}
        </Text>
      </Button>
    </Tooltip>
  );
}

function CourseTableCard({
  courseInitialOrder,
  courseData,
  day,
  interval,
  hoverId,
}) {
  const { neoLocalCourseTableKey } = useNeoLocalStorage();
  const { user } = useUser();
  const { userInfo } = useUserInfo(user?.sub);
  const courseTableKey = userInfo
    ? userInfo?.course_tables?.[0] ?? null
    : neoLocalCourseTableKey;
  const { courseTable, mutate: mutateCourseTable } =
    useCourseTable(courseTableKey);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  // initial order of courses
  const courseOrder = courseInitialOrder;
  // temp state (buffer), used for decide the NEW course order / dispatch to server, when press "save"
  const [courseList, setCourseList] = useState([]);
  const [prepareToRemoveCourseId, setPrepareToRemoveCourseId] = useState([]);

  const handleDelete = (courseId) => {
    if (prepareToRemoveCourseId.includes(courseId)) {
      setPrepareToRemoveCourseId(
        prepareToRemoveCourseId.filter((id) => id !== courseId)
      );
    } else {
      setPrepareToRemoveCourseId([...prepareToRemoveCourseId, courseId]);
    }
  };

  const isEdited = () => {
    // return true if the popup data is different from the original data.
    return (
      !courseOrder.every((course, index) => course === courseList[index]) ||
      prepareToRemoveCourseId.length > 0
    );
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setCourseList(arrayMove(courseList, oldIndex, newIndex));
  };

  // fetch original order from courseOrder (ids_array), return the indices need to reorder
  const fetchIndexByIds = (ids_array) => {
    const index_arr = [];
    ids_array.forEach((id) => {
      index_arr.push(courseTable.courses.map((c) => c.id).indexOf(id));
    });
    return index_arr;
  };

  const saveChanges = async () => {
    // get indice need to reorder from courseOrder
    const index_arr = fetchIndexByIds(courseOrder);
    // do reorder, generate new courseTable.courses to be patched
    const new_courses = courseTable.courses.map((course) => course.id);
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
    try {
      await mutateCourseTable(
        async (prev) => {
          const data = await patchCourseTable(
            courseTable.id,
            courseTable.name,
            courseTable.user_id,
            courseTable.expire_ts,
            new_courses
          );
          return data ?? prev;
        },
        {
          revalidate: false,
          populateCache: true,
        }
      );
      toast({
        title: `Saved!`,
        description: `?????????????????????`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "?????????????????????!",
        description: "???????????????????????????????????????????????????",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
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
              reportEvent("course_table_card_popover", "click", "open");
            }}
          >
            {courseOrder.map((courseId, index) => (
              <React.Fragment key={index}>
                <CourseBox
                  courseId={courseId}
                  courseData={courseData}
                  isOpen={isOpen}
                  hoverId={hoverId}
                />
              </React.Fragment>
            ))}
          </Flex>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            <Flex
              flexDirection="row"
              alignItems="center"
              justifyContent="start"
              mb="2"
            >
              ????????????
              <Badge key={day} ml="2" size="sm">
                ???{day}
              </Badge>
              <Badge key={interval} ml="2" size="sm">
                ???{interval}???
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
                  ???????????????
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
                ??????
              </Button>
              <Button
                colorScheme="teal"
                onClick={() => {
                  saveChanges();
                  reportEvent(
                    "course_table_card_popover",
                    "click",
                    "save_changes"
                  );
                }}
                disabled={!isEdited()}
              >
                ??????
              </Button>
            </Flex>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </>
  );
}
export default CourseTableCard;
