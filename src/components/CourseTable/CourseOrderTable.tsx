import {
  Flex,
  Box,
  Td as ChakraTd,
  TableCellProps,
  BoxProps,
  Circle,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Text,
  Button,
  FlexProps,
  Center,
  Icon,
} from "@chakra-ui/react";
import { MdDragHandle } from "react-icons/md";
import { CourseTable } from "@/types/courseTable";
import { Course } from "@/types/course";
import { CourseTableCellProps } from "@/components/CourseTable/NeoCourseTable";
import { intervals, days } from "@/constant";
import NeoCourseTable, {
  tabs,
  CourseOrderListTabId,
} from "@/components/CourseTable/NeoCourseTable";
import {
  intervalToNumber,
  numberToInterval,
} from "@/utils/intervalNumberConverter";
import { intervalSource } from "@/types/course";
import { customScrollBarCss } from "styles/customScrollBar";
import { CloseIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { PuffLoader } from "react-spinners";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { TrashCanOutlineIcon } from "@/components/CustomIcons";
import { useUser } from "@auth0/nextjs-auth0";
import useUserInfo from "@/hooks/useUserInfo";
import { useMemo } from "react";
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

interface TdProps extends TableCellProps {
  readonly children: React.ReactNode;
  readonly isFirstDay: boolean;
  readonly isLastDay: boolean;
  readonly isFirstInterval: boolean;
  readonly isLastInterval: boolean;
  readonly dayIndex: number;
  readonly intervalIndex: number;
  readonly tableCellProperty: CourseTableCellProps;
}
const Td: React.FC<TdProps> = ({
  children,
  isFirstDay,
  isLastDay,
  isFirstInterval,
  isLastInterval,
  dayIndex,
  intervalIndex,
  tableCellProperty,
  ...rest
}) => {
  const id = `${dayIndex + 1}-${intervalIndex}`;

  return (
    <ChakraTd
      sx={{
        boxSizing: "border-box",
        textAlign: "center",
        lineHeight: 1.4,
        color: "#2d2d2d",
        fontWeight: 400,
        fontSize: "14px",
        borderRadius: `${isFirstDay && isFirstInterval ? "4px" : "0px"} ${
          isLastDay && isFirstInterval ? "4px" : "0px"
        } ${isLastDay && isLastInterval ? "4px" : "0px"} ${
          isFirstDay && isLastInterval ? "4px" : "0px"
        }`,
        borderTop: `${tableCellProperty.borderWidth}px solid #CCCCCC${
          isFirstInterval ? "" : "80"
        }`,
        borderLeft: `${tableCellProperty.borderWidth}px solid #CCCCCC${
          isFirstDay ? "" : "80"
        }`,
        borderRight: `${
          isLastDay ? tableCellProperty.borderWidth : 0
        }px solid #CCCCCC`,
        borderBottom: `${
          isLastInterval ? tableCellProperty.borderWidth : 0
        }px solid #CCCCCC`,
        overflow: "visible",
        position: "relative",
      }}
      {...rest}
    >
      <Box
        sx={{
          zIndex: 98,
          position: "absolute",
          top: 0,
          left: 0,
          bg: "linear-gradient(0deg, rgba(204, 204, 204, 0.24), rgba(204, 204, 204, 0.24)), #FFFFFF",
          opacity: 0.32,
          w: "100%",
          h: "100%",
        }}
      />
      <Box
        position="absolute"
        sx={{
          top: 0,
          left: 0,
          zIndex: 100,
        }}
      >
        {children}
      </Box>
    </ChakraTd>
  );
};
interface CourseOrderTableCardProps extends BoxProps {
  readonly numberOfCourses: number;
  readonly intervalCourseOrderDict: IntervalCourseOrderDict;
  readonly dayIndex: number;
  readonly intervalIndex: number;
}
function CourseOrderTableCard(props: CourseOrderTableCardProps) {
  const {
    numberOfCourses,
    intervalCourseOrderDict,
    dayIndex,
    intervalIndex,
    ...restProps
  } = props;
  const numberBg =
    numberOfCourses >= 1
      ? numberOfCourses > 5
        ? numberOfCourses > 10
          ? numberOfCourses >= 20
            ? "#072164"
            : "#0D40C4"
          : "#4575F3"
        : "#7499F6"
      : "#ffffff";
  const coursesStr = Object.values(intervalCourseOrderDict)
    .reduce((acc, courseOrders) => {
      return [...acc, ...courseOrders];
    }, [])
    .map((courseOrder) => courseOrder.course.name)
    .join(", ");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTabId, setActiveTabId] =
    useState<CourseOrderListTabId>("Common");
  const [isLoading, setIsLoading] = useState(false);

  // dnd
  const [courseListForSort, setCourseListForSort] =
    useState<IntervalCourseOrderDict>(intervalCourseOrderDict);
  const [prepareToRemoveCourseId, setPrepareToRemoveCourseId] = useState<{
    [tab in CourseOrderListTabId]: string[];
  }>({
    Common: [],
    Chinese: [],
    Calculus: [],
    ForeignLanguage: [],
  });

  const handleDelete = (courseId: string, tab: CourseOrderListTabId) => {
    if (prepareToRemoveCourseId[tab].includes(courseId)) {
      setPrepareToRemoveCourseId({
        ...prepareToRemoveCourseId,
        [tab]: prepareToRemoveCourseId[tab].filter((id) => id !== courseId),
      });
    } else {
      setPrepareToRemoveCourseId({
        ...prepareToRemoveCourseId,
        [tab]: [...prepareToRemoveCourseId[tab], courseId],
      });
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const isEdited: boolean = useMemo(() => {
    const hasDeletedCourses = Object.values(prepareToRemoveCourseId).some(
      (ids) => ids.length > 0
    );
    const hasReorderedCourses = Object.entries(courseListForSort).some(
      ([tabId, courseOrders]) => {
        if (tabId === "Common") {
          // if not edited, must be sorted
          return !courseOrders.every((courseOrder, index, courseOrders) => {
            if (index !== courseOrders.length - 1) {
              return courseOrder.order < courseOrders[index + 1].order;
            }
            return true;
          });
        }
        // TODO: Calculus, Chinese, ForeignLanguage tabs
        return false;
      }
    );
    return hasDeletedCourses || hasReorderedCourses;
  }, [courseListForSort, prepareToRemoveCourseId]);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          bg: "#ffffff",
          borderRadius: "10px",
          boxShadow: "2px 2px 12px 0px rgba(75, 75, 75, 0.12)",
          cursor: "pointer",
          py: "9px",
          pl: "8px",
          pr: "22px",
          overflow: "hidden",
          transition: "all 0.2s ease-in-out",
        }}
        onClick={onOpen}
        {...restProps}
      >
        <Flex w="100%" h="100%" gap={2}>
          <Flex alignItems={"center"}>
            <Circle
              size="30px"
              sx={{
                bg: numberBg,
                fontWeight: 500,
                fontSize: "11px",
                color: "#ffffff",
              }}
            >
              {`${numberOfCourses > 1 ? "+" : ""}${numberOfCourses}`}
            </Circle>
          </Flex>
          <Flex
            w="70%"
            flexDirection={"column"}
            sx={{
              fontSize: "11px",
              color: "#4b4b4b",
              textAlign: "left",
            }}
          >
            <Flex maxW="100%">包含</Flex>
            <Box
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {coursesStr}
            </Box>
          </Flex>
        </Flex>
      </Box>
      <Modal size="xl" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="850px" overflowY="hidden">
          <ModalHeader
            py={6}
            px={8}
            borderRadius="4px"
            sx={{
              shadow: "0px 32px 64px -12px rgba(85, 105, 135, 0.08)",
              color: "#2d2d2d",
              fontWeight: 500,
              fontSize: "20px",
              lineHeight: 1.4,
            }}
          >
            <Flex alignItems="center" w="100%" justifyContent={"space-between"}>
              <Flex gap={6} alignItems="center">
                <Text>{`星期${days[dayIndex]}`}</Text>
                <Text>{`第 ${intervalIndex} 節`}</Text>
                <Text
                  sx={{
                    fontSize: "16px",
                    color: "#909090",
                  }}
                >
                  {`${
                    intervalSource[numberToInterval(intervalIndex)].startAt
                  }~${intervalSource[numberToInterval(intervalIndex)].endAt}`}
                </Text>
              </Flex>
              <CloseIcon
                boxSize="14px"
                sx={{
                  color: "#2d2d2d",
                  cursor: "pointer",
                }}
                onClick={onClose}
              />
            </Flex>
          </ModalHeader>
          <ModalBody p={0}>
            <Flex
              h="60vh"
              flexDirection={"column"}
              justifyContent={"space-between"}
            >
              <Flex
                minH="46px"
                w="100%"
                bg="#002F94"
                sx={{
                  p: " 0px 32px 0px 16px",
                }}
              >
                {tabs.map((tab) => {
                  const isActive = tab.id === activeTabId;
                  return (
                    <Flex
                      key={tab.id}
                      sx={{
                        alignItems: "center",
                        color: isActive ? "#ffffff" : "#ffffff50",
                        fontWeight: 500,
                        mx: 6,
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        borderTop: "2px solid transparent",
                        borderBottom: isActive
                          ? "2px solid #ffffff"
                          : "2px solid transparent",
                      }}
                      onClick={() => {
                        setActiveTabId(tab.id);
                      }}
                    >
                      {tab.label}
                    </Flex>
                  );
                })}
              </Flex>
              <Flex
                flexGrow={1}
                overflowY="auto"
                flexDirection={"column"}
                __css={customScrollBarCss}
              >
                {intervalCourseOrderDict[activeTabId].length === 0 ? (
                  <Flex
                    w="100%"
                    h="100%"
                    justifyContent={"center"}
                    alignItems={"center"}
                    sx={{
                      color: "#6f6f6f",
                      fontSize: "14px",
                    }}
                  >{`此節次尚未加入任何${
                    tabs.find((t) => t.id === activeTabId)?.label
                  }課程`}</Flex>
                ) : (
                  <div>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      modifiers={[
                        restrictToParentElement,
                        restrictToVerticalAxis,
                      ]}
                      onDragEnd={(event) => {
                        const { active, over } = event;
                        if (over) {
                          if (active.id !== over?.id) {
                            setCourseListForSort((courseListForSort) => {
                              const oldIndex = courseListForSort[
                                activeTabId
                              ].findIndex(
                                (courseOrder) =>
                                  courseOrder.course.id === String(active.id)
                              );
                              const newIndex = courseListForSort[
                                activeTabId
                              ].findIndex(
                                (courseOrder) =>
                                  courseOrder.course.id === String(over.id)
                              );

                              return {
                                ...courseListForSort,
                                [activeTabId]: arrayMove(
                                  courseListForSort[activeTabId],
                                  oldIndex,
                                  newIndex
                                ),
                              };
                            });
                          }
                        }
                      }}
                    >
                      <SortableContext
                        items={courseListForSort[activeTabId].map(
                          (co) => co.course.id
                        )}
                        strategy={verticalListSortingStrategy}
                      >
                        {courseListForSort[activeTabId].map(
                          ({ course, order }, index) => {
                            return (
                              <SortableCourseRow
                                key={`${course.id}-${index}`}
                                course={course}
                                order={order}
                                isPrepareToRemoved={prepareToRemoveCourseId[
                                  activeTabId
                                ].includes(course.id)}
                                onClickRemoveButton={() => {
                                  handleDelete(course.id, activeTabId);
                                }}
                                sx={{
                                  mt: index === 0 ? 0 : "1px",
                                  shadow:
                                    "0px 0.5px 0px rgba(144, 144, 144, 0.8)",
                                  p: "16px 32px",
                                  gap: 6,
                                  minH: "72px",
                                }}
                              />
                            );
                          }
                        )}
                      </SortableContext>
                    </DndContext>
                  </div>
                )}
              </Flex>
              <Flex
                h="68px"
                w="100%"
                alignItems="center"
                justifyContent={"space-between"}
                p="16px 32px"
                shadow="0px -20px 24px -4px rgba(85, 105, 135, 0.04), 0px -8px 8px -4px rgba(85, 105, 135, 0.02)"
              >
                <Flex></Flex>
                <Flex gap="28px">
                  <Button
                    variant={"unstyled"}
                    sx={{
                      fontWeight: 500,
                      fontSize: "14px",
                      lineHeight: 1.4,
                      h: "36px",
                    }}
                    disabled={!isEdited}
                    onClick={() => {
                      setCourseListForSort(intervalCourseOrderDict);
                      setPrepareToRemoveCourseId({
                        Common: [],
                        Chinese: [],
                        Calculus: [],
                        ForeignLanguage: [],
                      });
                    }}
                  >
                    還原此次變更
                  </Button>
                  <Button
                    sx={{
                      borderRadius: "full",
                      fontWeight: 500,
                      fontSize: "14px",
                      lineHeight: 1.4,
                      shadow: "0px 1px 2px rgba(105, 81, 255, 0.05)",
                      p: "8px 16px",
                      h: "36px",
                    }}
                    disabled={!isEdited}
                    isLoading={isLoading}
                    onClick={async () => {}}
                  >
                    儲存
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

interface SortableCourseRowProps extends FlexProps {
  readonly course: Course;
  readonly order: number;
  readonly isPrepareToRemoved: boolean;
  readonly onClickRemoveButton: () => void;
}
function SortableCourseRow({
  course,
  order,
  isPrepareToRemoved,
  onClickRemoveButton,
  sx,
  ...restProps
}: SortableCourseRowProps) {
  const { user } = useUser();
  const { userInfo, addOrRemoveFavorite, isLoading } = useUserInfo(
    user?.sub ?? null
  );
  const [addingFavoriteCourse, setAddingFavoriteCourse] = useState(false);
  const isFavorite = useMemo(
    () => (userInfo?.favorites ?? []).map((c) => c.id).includes(course.id),
    [userInfo, course.id]
  );
  const handleAddFavorite = async (course_id: string, course_name: string) => {
    if (!isLoading && userInfo) {
      setAddingFavoriteCourse(true);
      await addOrRemoveFavorite(course_id, course_name);
      setAddingFavoriteCourse(false);
    }
  };
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

  return (
    <Flex
      alignItems={"center"}
      position={"relative"}
      sx={{
        ...style,
        ...sx,
      }}
      {...restProps}
      ref={setNodeRef}
      {...attributes}
    >
      <Flex
        position={"absolute"}
        left={0}
        w={"100%"}
        h="100%"
        bg="white"
        {...listeners}
      />
      <Flex zIndex={2} justifyContent={"space-between"} w="13%" {...listeners}>
        <div
          style={{
            touchAction: "manipulation",
          }}
        >
          <MdDragHandle cursor="row-resize" size="25" color="#4b4b4b" />
        </div>
        <Flex
          sx={{
            fontSize: "14px",
            color: "#4b4b4b",
          }}
          alignItems={"center"}
        >
          排序
          <Text
            ml="4px"
            sx={{
              fontWeight: 500,
              fontSize: "16px",
              color: "#1A181C",
            }}
          >
            {order}
          </Text>
        </Flex>
      </Flex>
      <Flex
        zIndex={2}
        w="15%"
        sx={{
          fontSize: "14px",
          color: "#4b4b4b",
        }}
        justifyContent={"center"}
        {...listeners}
      >
        {course.serial}
      </Flex>
      <Flex
        zIndex={2}
        flexGrow={1}
        sx={{
          fontWeight: 500,
          color: "#2d2d2d",
        }}
        {...listeners}
      >
        {course.name}
      </Flex>
      <Button
        size="sm"
        zIndex={2}
        variant="unstyled"
        colorScheme={"red"}
        onClick={(e) => {
          e.preventDefault();
          handleAddFavorite(course.id, course.name);
        }}
        isLoading={addingFavoriteCourse}
        spinner={
          <Center w="100%" h="24px">
            <PuffLoader size={32} />
          </Center>
        }
      >
        <Center w="100%" h="24px">
          {<Icon as={isFavorite ? FaHeart : FaRegHeart} boxSize="16px" />}
        </Center>
      </Button>
      <Button
        size="sm"
        variant="unstyled"
        onClick={onClickRemoveButton}
        zIndex={2}
      >
        <Center
          w="100%"
          h="24px"
          color={isPrepareToRemoved ? "error.500" : "#4b4b4b"}
        >
          {
            <TrashCanOutlineIcon
              boxSize="24px"
              transition="all 0.2s ease-in-out"
            />
          }
        </Center>
      </Button>
    </Flex>
  );
}

type CourseOrder = {
  course: Course;
  order: number;
};
type IntervalCourseOrderDict = {
  [tab in CourseOrderListTabId]: CourseOrder[];
};
type CourseTableCourseOrderDict = {
  [key: `${number}-${number}`]: IntervalCourseOrderDict;
};

function getNumberOfCourses(intervalCourseOrderDict: IntervalCourseOrderDict) {
  return Object.values(intervalCourseOrderDict).reduce(
    (acc, courseOrderList) => {
      return acc + courseOrderList.length;
    },
    0
  );
}

// TODO: refactor after integrated with new backend
function getCourseTableCourseOrderDict(
  courseTable: CourseTable | null
): CourseTableCourseOrderDict {
  if (courseTable === null) return {};
  const res: CourseTableCourseOrderDict = {};
  days.forEach((day, dayIndex) => {
    intervals.forEach((interval, intervalIndex) => {
      const key = `${dayIndex + 1}-${intervalIndex}` as `${number}-${number}`;
      res[key] = {
        Common: [],
        Chinese: [],
        ForeignLanguage: [],
        Calculus: [],
      } as IntervalCourseOrderDict;
    });
  });

  // process Common courses
  courseTable.courses.forEach((course, courseIndex) => {
    const { schedules } = course;
    schedules.forEach((schedule) => {
      const { weekday, interval: intervalString } = schedule;
      const interval = intervalToNumber(intervalString);
      const key = `${weekday}-${interval}` as `${number}-${number}`;
      res[key] = {
        ...res[key],
        Common: [
          ...res[key]["Common"],
          {
            course: course,
            order: courseIndex + 1,
          },
        ],
      };
    });
  });
  // TODO: add other tabs

  return res;
}

interface CourseOrderTableProps {
  readonly courseTable: CourseTable | null;
  readonly tableCellProperty: CourseTableCellProps;
}

export default function CourseOrderTable(props: CourseOrderTableProps) {
  const { courseTable, tableCellProperty } = props;
  const courseTableCourseOrderDict = courseTable
    ? getCourseTableCourseOrderDict(courseTable)
    : {};

  return (
    <Flex
      w="100%"
      minH="70vh"
      justifyContent={"center"}
      alignItems="center"
      overflow={"auto"}
      pt={4}
      px={4}
      pb={12}
    >
      <NeoCourseTable
        tableCellProperty={tableCellProperty}
        renderCustomCell={(dayIndex, intervalIndex) => {
          return (
            <Td
              key={`${dayIndex + 1}-${intervalIndex}`}
              minW={`${tableCellProperty.w}px`}
              w={`${tableCellProperty.w}px`}
              maxW={`${tableCellProperty.w}px`}
              minH={`${tableCellProperty.h}px`}
              h={`${tableCellProperty.h}px`}
              isFirstDay={dayIndex === 0}
              isLastDay={dayIndex === days.length - 1}
              isFirstInterval={intervalIndex === 0}
              isLastInterval={intervalIndex === intervals.length - 1}
              dayIndex={dayIndex}
              intervalIndex={intervalIndex}
              tableCellProperty={tableCellProperty}
            >
              {getNumberOfCourses(
                courseTableCourseOrderDict?.[
                  `${dayIndex + 1}-${intervalIndex}`
                ] ?? {}
              ) > 0 ? (
                <CourseOrderTableCard
                  w={`${tableCellProperty.w - tableCellProperty.borderWidth}px`}
                  h={`${tableCellProperty.h - tableCellProperty.borderWidth}px`}
                  dayIndex={dayIndex}
                  intervalIndex={intervalIndex}
                  numberOfCourses={getNumberOfCourses(
                    courseTableCourseOrderDict?.[
                      `${dayIndex + 1}-${intervalIndex}`
                    ] ?? {}
                  )}
                  intervalCourseOrderDict={
                    courseTableCourseOrderDict?.[
                      `${dayIndex + 1}-${intervalIndex}`
                    ] ?? {}
                  }
                />
              ) : null}
            </Td>
          );
        }}
      />
    </Flex>
  );
}
