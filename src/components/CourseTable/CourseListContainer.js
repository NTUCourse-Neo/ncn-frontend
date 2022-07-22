import { React, useEffect, useState } from "react";
import styles from "components/CourseTable/CourseTableCard/CourseTableCard.module.css";
import { arrayMoveImmutable as arrayMove } from "array-move";
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
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { useRouter } from "next/router";
import { patchCourseTable } from "queries/courseTable";

const DragHandle = sortableHandle(() => (
  <MdDragHandle cursor="row-resize" size="20" color="gray" />
));

function ListRowElement({
  course,
  courseIdx,
  prepareToRemoveCourseId,
  handleDelete,
}) {
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
      bg={useColorModeValue("gray.100", "gray.600")}
      my="1"
      borderRadius="lg"
      zIndex="1000"
    >
      <Flex
        flexDirection="row"
        justifyContent="start"
        alignItems="center"
        h="100%"
        w="100%"
      >
        <DragHandle />
        <Tag
          size={useBreakpointValue({ base: "md", md: "lg" }) ?? "md"}
          variant="solid"
          bg={hash_to_color_hex(course.id, 0.8)}
          mx="2"
        >
          <Text fontWeight="800" color="gray.700">
            {courseIdx + 1}
          </Text>
        </Tag>
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
            as={prepareToRemoveCourseId.includes(course.id) ? "del" : ""}
            color={
              prepareToRemoveCourseId.includes(course.id)
                ? removeColor
                : textColor
            }
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="bold"
            noOfLines={1}
            isTruncated
            maxW={{ base: "120px", md: "50vw", lg: "16vw" }}
          >
            {course.name}
          </Text>
        </Flex>
        <IconButton
          display={{ base: "none", md: "block" }}
          ml={3}
          size="sm"
          colorScheme="blue"
          icon={<FaInfoCircle />}
          variant="ghost"
          onClick={() => {
            router.push(`/courseinfo/${course.id}`);
          }}
        />
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
          onClick={() => openPage(getNolAddUrl(course), true)}
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
          }}
        />
      </Flex>
    </Flex>
  );
}

const SortableElement = sortableElement(
  ({ course, courseIdx, prepareToRemoveCourseId, handleDelete }) => (
    <ListRowElement
      course={course}
      courseIdx={courseIdx}
      prepareToRemoveCourseId={prepareToRemoveCourseId}
      handleDelete={handleDelete}
    />
  )
);

const SortableContainer = sortableContainer(({ children }) => {
  return (
    <Flex flexDirection="column" overflow={"visible"}>
      {children}
    </Flex>
  );
});

function CourseListContainer({ courseTable, courses, loading }) {
  const { neoLocalCourseTableKey } = useNeoLocalStorage();
  const { user } = useUser();
  const { userInfo } = useUserInfo(user?.sub);
  const courseTableKey = userInfo
    ? userInfo?.course_tables?.[0] ?? null
    : neoLocalCourseTableKey;
  const { refetch } = useCourseTable(courseTableKey);
  const toast = useToast();
  const [courseListForSort, setCourseListForSort] = useState(
    Object.keys(courses)
  );
  const [prepareToRemoveCourseId, setPrepareToRemoveCourseId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Redundant?
  useEffect(() => {
    setCourseListForSort(Object.keys(courses));
  }, [courses]);

  const handleDelete = (courseId) => {
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
    try {
      const res_table = await patchCourseTable(
        courseTable.id,
        courseTable.name,
        courseTable.user_id,
        courseTable.expire_ts,
        courseListForSort.filter((id) => !prepareToRemoveCourseId.includes(id))
      );
      refetch();
      toast({
        title: "編輯課表成功",
        description: "課程更動已儲存",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setCourseListForSort(res_table.courses.map((c) => c.id));
      setPrepareToRemoveCourseId([]);
    } catch (err) {
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

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setCourseListForSort(arrayMove(courseListForSort, oldIndex, newIndex));
  };

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
          }}
          isLoading={isLoading}
        >
          儲存
        </Button>
      </Flex>
      <SortableContainer
        onSortEnd={onSortEnd}
        lockAxis="y"
        useDragHandle
        helperClass={styles.sortableHelper}
      >
        {courseListForSort.map((key, index) => {
          const course = courses?.[key];
          if (!course) {
            return null;
          }
          return (
            <SortableElement
              key={key}
              index={index}
              helperClass={styles.sortableHelper}
              course={course}
              courseIdx={index}
              handleDelete={handleDelete}
              prepareToRemoveCourseId={prepareToRemoveCourseId}
            />
          );
        })}
      </SortableContainer>
    </>
  );
}

export default CourseListContainer;
