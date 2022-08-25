import React, { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Button,
  IconButton,
  Badge,
  Tag,
  useToast,
  ScaleFade,
  TagLeftIcon,
  Spacer,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaPlus,
  FaTrash,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import { FadeLoader } from "react-spinners";
import { MdDragHandle } from "react-icons/md";
import { hash_to_color_hex } from "utils/colorAgent";
import { getNolAddUrl } from "utils/getNolUrls";
import openPage from "utils/openPage";
import useCourseTable from "hooks/useCourseTable";
import useUserInfo from "hooks/useUserInfo";
import { useUser } from "@auth0/nextjs-auth0";
import useNeoLocalStorage from "hooks/useNeoLocalStorage";
import { useRouter } from "next/router";
import { patchCourseTable } from "queries/courseTable";
import { reportEvent } from "utils/ga";
import { Course } from "types/course";
import {
  useSortable,
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

interface SortableElementProps {
  readonly course: Course;
  readonly courseIdx: number;
  readonly handleDelete: (courseId: string) => void;
  readonly prepareToRemoveCourseId: string[];
}

function SortableRowElement(props: SortableElementProps) {
  const { course, courseIdx, prepareToRemoveCourseId, handleDelete } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: course.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: "relative",
    zIndex: isDragging ? 1000 : undefined,
  };
  const router = useRouter();
  const textColor = useColorModeValue("heading.light", "heading.dark");
  const removeColor = useColorModeValue("red.700", "red.300");
  return (
    <Flex
      flexDirection="row"
      justifyContent="start"
      alignItems="center"
      h="100%"
      w="100%"
      py="2"
      px="2"
      bg={useColorModeValue(
        hash_to_color_hex(course.id, 0.92, 0.3),
        hash_to_color_hex(course.id, 0.2, 0.2)
      )}
      my="1"
      borderRadius="lg"
      zIndex="1000"
      sx={style}
      ref={setNodeRef}
      {...attributes}
    >
      <Flex
        flexDirection="row"
        justifyContent="start"
        alignItems="center"
        h="100%"
        w="100%"
      >
        <div
          style={{
            touchAction: "manipulation",
          }}
          {...listeners}
        >
          <MdDragHandle cursor="row-resize" size="20" color="gray" />
        </div>
        <Text fontWeight="800" color={textColor} mx="2" fontSize="xl">
          {courseIdx + 1}
        </Text>
        <Flex
          direction={{ base: "column", md: "row" }}
          alignItems={{ base: "start", md: "center" }}
          ml={{ base: 2, md: 0 }}
          flexShrink={1}
        >
          <Badge
            colorScheme="blue"
            size={useBreakpointValue({ base: "md", md: "lg" }) ?? "md"}
            mx={{ base: 0, md: 2 }}
          >
            {course.serial}
          </Badge>
          <Text
            as={prepareToRemoveCourseId.includes(course.id) ? "del" : undefined}
            color={
              prepareToRemoveCourseId.includes(course.id)
                ? removeColor
                : textColor
            }
            fontSize={{ base: "lg", md: "md" }}
            fontWeight="bold"
            noOfLines={1}
            maxW={{ base: "120px", md: "50vw", lg: "16vw" }}
          >
            {course.name}
          </Text>
        </Flex>
        <Button
          display={{ base: "none", md: "block" }}
          flexDirection="row"
          justifyContent="center"
          ml={3}
          size="sm"
          colorScheme="blue"
          variant="ghost"
          onClick={() => {
            reportEvent("course_table_list", "click", "course_info");
            router.push(`/courseinfo/${course.id}`);
          }}
        >
          <FaInfoCircle />
        </Button>
      </Flex>
      <Flex
        ml={{ base: 0, md: 4 }}
        flexDirection="row"
        justifyContent="end"
        alignItems="center"
      >
        <Button
          display={{ base: "inline-block", md: "none" }}
          size="sm"
          colorScheme="blue"
          variant="ghost"
          onClick={() => {
            reportEvent("course_table_list", "click", "course_info");
            router.push(`/courseinfo/${course.id}`);
          }}
        >
          <FaInfoCircle />
        </Button>
        <Button
          mx={{ base: 0, md: 2 }}
          size="sm"
          variant="ghost"
          colorScheme="blue"
          leftIcon={<FaPlus />}
          onClick={() => {
            openPage(getNolAddUrl(course), true);
            reportEvent("course_table_list", "click", "add_to_nol");
          }}
        >
          課程網
        </Button>
        <IconButton
          aria-label="Delete"
          variant={
            prepareToRemoveCourseId.includes(course.id) ? "solid" : "outline"
          }
          icon={<FaTrash />}
          size="sm"
          colorScheme="red"
          onClick={() => {
            handleDelete(course.id);
            reportEvent("course_table_list", "click", "delete_course");
          }}
        />
      </Flex>
    </Flex>
  );
}

function CourseListContainer(props: {
  readonly loading: boolean;
  readonly courses: {
    readonly [key: string]: Course;
  };
}) {
  const { courses, loading } = props;
  const { neoLocalCourseTableKey } = useNeoLocalStorage();
  const { user } = useUser();
  const { userInfo } = useUserInfo(user?.sub ?? null);
  const courseTableKey = userInfo
    ? userInfo?.course_tables?.[0] ?? null
    : neoLocalCourseTableKey;
  const { courseTable, mutate: mutateCourseTable } =
    useCourseTable(courseTableKey);
  const toast = useToast();
  const [courseListForSort, setCourseListForSort] = useState(
    Object.keys(courses)
  );
  const [prepareToRemoveCourseId, setPrepareToRemoveCourseId] = useState<
    string[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Redundant?
  useEffect(() => {
    setCourseListForSort(Object.keys(courses));
  }, [courses]);

  const handleDelete = (courseId: string) => {
    if (prepareToRemoveCourseId.includes(courseId)) {
      setPrepareToRemoveCourseId(
        prepareToRemoveCourseId.filter((id) => id !== courseId)
      );
    } else {
      setPrepareToRemoveCourseId([...prepareToRemoveCourseId, courseId]);
    }
  };

  const handleSaveCourseTable = async () => {
    setIsLoading(true);
    if (courseTable) {
      try {
        const updatedCourseTableData = await mutateCourseTable(
          async (prev) => {
            const data = await patchCourseTable(
              courseTable.id,
              courseTable.name,
              courseTable.user_id,
              courseListForSort.filter(
                (id) => !prepareToRemoveCourseId.includes(id)
              )
            );
            return data ?? prev;
          },
          {
            revalidate: false,
            populateCache: true,
          }
        );
        if (updatedCourseTableData) {
          setCourseListForSort(
            updatedCourseTableData.course_table.courses.map((c) => c.id)
          );
          setPrepareToRemoveCourseId([]);
          toast({
            title: "編輯課表成功",
            description: "課程更動已儲存",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (err) {
        toast({
          title: `編輯課表失敗`,
          description: `請稍後再試`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: `編輯課表失敗`,
        description: `請稍後再試`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  const isEdited = () => {
    return (
      !courseListForSort.every(
        (course, index) => course === Object.keys(courses)[index]
      ) || prepareToRemoveCourseId.length > 0
    );
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (loading) {
    return (
      <Flex h="60vh" w="100%" justify="center" align="center">
        <FadeLoader
          margin="8px"
          radius="5px"
          height="20px"
          width="8px"
          color="teal"
        />
      </Flex>
    );
  }

  return (
    <>
      <Flex
        flexDirection="row"
        justifyContent="start"
        alignItems="center"
        w="100%"
        py="2"
        px="2"
      >
        <Text fontSize="md" fontWeight="bold" color="gray.600">
          已選 {courseListForSort.length} 課程
        </Text>
        <Spacer />
        <ScaleFade initialScale={0.9} in={isEdited()}>
          <Tag colorScheme="yellow" variant="solid">
            <TagLeftIcon boxSize="12px" as={FaExclamationTriangle} />
            變更未儲存
          </Tag>
        </ScaleFade>
        <Button
          ml="2"
          size="sm"
          variant="ghost"
          colorScheme="blue"
          disabled={!isEdited()}
          onClick={() => {
            setCourseListForSort(Object.keys(courses));
            setPrepareToRemoveCourseId([]);
            reportEvent("course_table_list", "click", "reset_changes");
          }}
        >
          重設
        </Button>
        <Button
          ml="2"
          size="sm"
          variant="solid"
          colorScheme="teal"
          disabled={!isEdited()}
          onClick={() => {
            handleSaveCourseTable();
            reportEvent("course_table_list", "click", "save_changes");
          }}
          isLoading={isLoading}
        >
          儲存
        </Button>
      </Flex>
      <div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToParentElement, restrictToVerticalAxis]}
          onDragEnd={(event) => {
            const { active, over } = event;
            if (active.id !== over?.id) {
              setCourseListForSort((courseListForSort) => {
                const oldIndex = courseListForSort.indexOf(String(active.id));
                const newIndex = courseListForSort.indexOf(String(over?.id));

                return arrayMove(courseListForSort, oldIndex, newIndex);
              });
            }
          }}
        >
          <SortableContext
            items={courseListForSort}
            strategy={verticalListSortingStrategy}
          >
            {courseListForSort.map((key, index) => {
              const course = courses?.[key];
              if (!course) {
                return null;
              }
              return (
                <SortableRowElement
                  key={key}
                  course={course}
                  courseIdx={index}
                  handleDelete={handleDelete}
                  prepareToRemoveCourseId={prepareToRemoveCourseId}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

export default CourseListContainer;
