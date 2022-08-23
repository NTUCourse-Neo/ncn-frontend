import * as React from "react";
import { useState } from "react";
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
import { Interval, Course } from "types/course";

function CourseBox(props: {
  readonly courseId: string;
  readonly courseData: {
    readonly [key: string]: Course;
  };
  readonly hoverId: string;
}) {
  const { courseId, courseData, hoverId } = props;
  const course = courseData?.[courseId];
  const bgColor = useColorModeValue(
    hash_to_color_hex(course.id, 0.8, 0.6),
    hash_to_color_hex(course.id, 0.2, 0.3)
  );
  if (!course) {
    return null;
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
        <Text fontSize="xs" noOfLines={1}>
          {` ${course.name} `}
        </Text>
      </Button>
    </Tooltip>
  );
}

function CourseTableCard(props: {
  readonly courseInitialOrder: string[];
  readonly courseData: { readonly [key: string]: Course };
  readonly interval: Interval;
  readonly day: string;
  readonly hoverId: string;
}) {
  const { courseInitialOrder, courseData, day, interval, hoverId = "" } = props;
  const { neoLocalCourseTableKey } = useNeoLocalStorage();
  const { user } = useUser();
  const { userInfo } = useUserInfo(user?.sub ?? null);
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
  const [courseList, setCourseList] = useState<string[]>([]);
  const [prepareToRemoveCourseId, setPrepareToRemoveCourseId] = useState<
    string[]
  >([]);

  const handleDelete = (courseId: string) => {
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

  const saveChanges = async () => {
    if (!courseTable) {
      toast({
        title: "更改志願序失敗!",
        description: "請檢查網路連線，或聯絡系統管理員。",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    const new_courses = courseList.filter(
      (c) => !prepareToRemoveCourseId.includes(c)
    );
    try {
      await mutateCourseTable(
        async (prev) => {
          const data = await patchCourseTable(
            courseTable.id,
            courseTable.name,
            courseTable.user_id,
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
        description: `更改志願序成功`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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
                setCourseList={setCourseList}
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
                  reportEvent(
                    "course_table_card_popover",
                    "click",
                    "save_changes"
                  );
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
