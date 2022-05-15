import { React, useEffect, useState } from "react";
import "../components/CourseTableCard/CourseTableCard.css";
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
  useMediaQuery,
  HStack,
  Collapse,
  VStack,
} from "@chakra-ui/react";
import { FaPlus, FaTrash, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import { FadeLoader } from "react-spinners";
import { MdDragHandle } from "react-icons/md";
import { patchCourseTable } from "../actions/course_tables";
import { hash_to_color_hex } from "../utils/colorAgent";
import { genNolAddUrl, openPage } from "./CourseDrawerContainer";
import { useDispatch } from "react-redux";
import { sortableContainer, sortableElement, sortableHandle } from "react-sortable-hoc";
import { useNavigate } from "react-router-dom";

function CourseListContainer({ courseTable, courses, loading }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const [courseListForSort, setCourseListForSort] = useState(Object.keys(courses));
  const [prepareToRemoveCourseId, setPrepareToRemoveCourseId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 1000px)");

  useEffect(() => {
    //console.log('new list for sort', Object.keys(courses));
    setCourseListForSort(Object.keys(courses));
  }, [courses]);

  const handleDelete = (courseId) => {
    if (prepareToRemoveCourseId.includes(courseId)) {
      // If the course is in the prepareToRemoveCourseId, remove it from the list.
      setPrepareToRemoveCourseId(prepareToRemoveCourseId.filter((id) => id !== courseId));
    } else {
      // If the course is not in the prepareToRemoveCourseId, add it to the list.
      setPrepareToRemoveCourseId([...prepareToRemoveCourseId, courseId]);
    }
  };

  const handleSaveCourseTable = async () => {
    setIsLoading(true);
    try {
      // remove the course_id in the prepareToRemoveCourseId from the courseListForSort
      const newCourseListForSort = courseListForSort.filter((id) => !prepareToRemoveCourseId.includes(id));
      const res_table = await dispatch(
        patchCourseTable(courseTable._id, courseTable.name, courseTable.user_id, courseTable.expire_ts, newCourseListForSort)
      );
      if (res_table) {
        toast({
          title: "編輯課表成功",
          description: "課程更動已儲存",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setCourseListForSort(res_table.courses);
        setPrepareToRemoveCourseId([]);
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
    setIsLoading(false);
  };

  // TODO: refactor logic
  const isEdited = () => {
    // return true if the popup data is different from the original data.
    return !courseListForSort.every((course, index) => course === Object.keys(courses)[index]) || prepareToRemoveCourseId.length > 0;
  };

  const renderRowElement = (key, course, courseIdx) => {
    if (isMobile) {
      return (
        <Flex
          key={key}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          h="100%"
          w="100%"
          py="2"
          px="2"
          bg="gray.100"
          my="1"
          borderRadius="lg"
          zIndex="1000"
        >
          <Flex flexDirection="row" justifyContent="start" alignItems="center" h="100%" w="100%">
            <DragHandle key={"Sortable_" + key + "_DragHandle"} />
            <VStack>
              <Tag size="md" key={key} variant="solid" bg={hash_to_color_hex(course._id, 0.8)} mx="2">
                <Text fontWeight="800" color="gray.700">
                  {courseIdx + 1}
                </Text>
              </Tag>
            </VStack>
            <Flex flexDirection="column" alignItems="start">
              <Text
                maxW="40vw"
                ml="2"
                as={prepareToRemoveCourseId.includes(course._id) ? "del" : ""}
                color={prepareToRemoveCourseId.includes(course._id) ? "red.700" : "gray.500"}
                fontSize="lg"
                fontWeight="bold"
                isTruncated
              >
                {course.course_name}
              </Text>
              <HStack>
                <Badge colorScheme="blue" size="lg" mx="2">
                  {course.id}
                </Badge>
                <IconButton
                  size="sm"
                  colorScheme="blue"
                  icon={<FaInfoCircle />}
                  variant="ghost"
                  onClick={() => {
                    navigate(`/courseinfo/${course._id}`);
                  }}
                />
                <Button size="xs" variant="ghost" colorScheme="blue" leftIcon={<FaPlus />} onClick={() => openPage(genNolAddUrl(course), true)}>
                  課程網
                </Button>
              </HStack>
            </Flex>
          </Flex>
          <Flex ml="4" flexDirection="row" justifyContent="end" alignItems="center">
            <IconButton
              aria-label="Delete"
              variant={prepareToRemoveCourseId.includes(course._id) ? "solid" : "outline"}
              icon={<FaTrash />}
              size="sm"
              colorScheme="red"
              key={key}
              onClick={() => {
                handleDelete(course._id);
              }}
            />
          </Flex>
        </Flex>
      );
    }
    return (
      <Flex
        key={key}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        h="100%"
        w="100%"
        py="2"
        px="2"
        bg="gray.100"
        my="1"
        borderRadius="lg"
        zIndex="1000"
      >
        <Flex flexDirection="row" justifyContent="start" alignItems="center" h="100%" w="100%">
          <DragHandle key={"Sortable_" + key + "_DragHandle"} />
          <Tag size="lg" key={key} variant="solid" bg={hash_to_color_hex(course._id, 0.8)} mx="2">
            <Text fontWeight="800" color="gray.700">
              {courseIdx + 1}
            </Text>
          </Tag>
          <Badge colorScheme="blue" size="lg" mx="2">
            {course.id}
          </Badge>
          <Text
            as={prepareToRemoveCourseId.includes(course._id) ? "del" : ""}
            color={prepareToRemoveCourseId.includes(course._id) ? "red.700" : "gray.500"}
            fontSize="xl"
            fontWeight="bold"
          >
            {course.course_name}
          </Text>
          <IconButton
            ml="2"
            size="sm"
            colorScheme="blue"
            icon={<FaInfoCircle />}
            variant="ghost"
            onClick={() => {
              navigate(`/courseinfo/${course._id}`);
            }}
          />
        </Flex>
        <Flex ml="4" flexDirection="row" justifyContent="end" alignItems="center">
          <Button mx="2" size="sm" variant="ghost" colorScheme="blue" leftIcon={<FaPlus />} onClick={() => openPage(genNolAddUrl(course), true)}>
            課程網
          </Button>
          <IconButton
            aria-label="Delete"
            variant={prepareToRemoveCourseId.includes(course._id) ? "solid" : "outline"}
            icon={<FaTrash />}
            size="sm"
            colorScheme="red"
            key={key}
            onClick={() => {
              handleDelete(course._id);
            }}
          />
        </Flex>
      </Flex>
    );
  };

  const DragHandle = sortableHandle(() => <MdDragHandle cursor="row-resize" size="20" color="gray" />);
  const SortableElement = sortableElement(({ key, course, courseIdx }) => renderRowElement(key, course, courseIdx));

  const SortableContainer = sortableContainer(({ children }) => {
    return <Flex flexDirection="column">{children}</Flex>;
  });
  const onSortEnd = ({ oldIndex, newIndex }) => {
    setCourseListForSort(arrayMove(courseListForSort, oldIndex, newIndex));
  };

  if (loading) {
    return (
      <Flex h="60vh" w="100%" justify="center" align="center">
        <FadeLoader margin="8px" radius="5px" height="20px" width="8px" color="teal" />
      </Flex>
    );
  }

  if (isMobile) {
    return (
      <>
        <Flex flexDirection="column" justifyContent="center" alignItems="start" w="100%" py="2" px="2">
          <Flex w="100%" justifyContent="space-between" alignItems="center">
            <Flex flexDirection="column" alignItems="start">
              <Text fontSize="md" fontWeight="bold" color="gray.600">
                已選 {courseListForSort.length} 課程
              </Text>
              <HStack mt="2">
                <Button
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
              </HStack>
            </Flex>
            <Collapse in={isEdited()}>
              <Flex alignItems="center" justifyContent="center" flexDirection="column">
                <Tag colorScheme="yellow" variant="solid">
                  <TagLeftIcon boxSize="12px" as={FaExclamationTriangle} />
                  變更未儲存
                </Tag>
              </Flex>
            </Collapse>
          </Flex>
        </Flex>
        <SortableContainer onSortEnd={onSortEnd} lockAxis="y" useDragHandle helperClass="sortableHelper">
          {courseListForSort.map((key, index) => {
            const course = courses[key];
            return <SortableElement key={key} index={index} course={course} courseIdx={index} helperClass="sortableHelper" />;
          })}
        </SortableContainer>
      </>
    );
  }

  return (
    <>
      <Flex flexDirection="row" justifyContent="start" alignItems="center" w="100%" py="2" px="2">
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
      <SortableContainer onSortEnd={onSortEnd} lockAxis="y" useDragHandle>
        {courseListForSort.map((key, index) => {
          const course = courses[key];
          return <SortableElement key={key} index={index} course={course} courseIdx={index} helperClass="sortableHelper" />;
        })}
      </SortableContainer>
    </>
  );
}

export default CourseListContainer;
