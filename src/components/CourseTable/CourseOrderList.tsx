import {
  Button,
  Flex,
  HStack,
  Text,
  Tooltip,
  Center,
  Icon,
  Input,
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import useCourseTable from "@/hooks/useCourseTable";
import useUserInfo from "@/hooks/useUserInfo";
import { Course } from "@/types/course";
import { customScrollBarCss } from "@/styles/customScrollBar";
import { DeptBadge, CustomTag } from "@/components/CourseInfoRow";
import { info_view_map } from "data/mapping_table";
import { parseCourseTimeLocation } from "utils/parseCourseSchedule";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { PuffLoader } from "react-spinners";
import { useRouter } from "next/router";
import { TrashCanOutlineIcon } from "@/components/CustomIcons";
import { MdDragHandle } from "react-icons/md";
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

const tabs = [
  {
    id: "Common",
    label: "一般科目",
  },
  {
    id: "Chinese",
    label: "國文",
  },
  {
    id: "ForeignLanguage",
    label: "英外文",
  },
  {
    id: "Calculus",
    label: "微積分",
  },
] as const;
type CourseOrderListTabId = typeof tabs[number]["id"];

function SortableRowElement({
  course,
  index,
}: {
  readonly course: Course;
  readonly index: number;
}) {
  const router = useRouter();
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

  // Bug due to old API. course.departments has wrong format. Should be fixed when new API is ready.
  const deptBadge = useMemo(
    () =>
      course.departments.length === 0 ? null : <DeptBadge course={course} />,
    [course]
  );

  // 必帶/必修/選修/其他
  const selectiveOrNot =
    info_view_map["requirement"]["map"][course.requirement];
  const courseArea = useMemo(() => {
    if (course.areas.length === 0) {
      return null;
    }
    const areasString = course.areas
      .map(
        (area) =>
          info_view_map["areas"]["map"]?.[area.area_id]?.full_name ?? null
      )
      .filter((x) => x !== null)
      .join(", ");
    return (
      <Tooltip label={areasString} placement="top" hasArrow>
        <CustomTag>{areasString.trim()}</CustomTag>
      </Tooltip>
    );
  }, [course]);
  const courseTimeLocationPairs = useMemo(
    () => parseCourseTimeLocation(course.schedules),
    [course]
  );

  // dnd
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
      w="100%"
      h="78px"
      sx={{
        bg: "#ffffff",
        alignItems: "center",
        p: "16px 32px",
        ...style,
        shadow: "0px 0.5px 0px rgba(144, 144, 144, 0.8)",
        mt: index !== 0 ? "1px" : undefined,
      }}
      gap={2}
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
      <Flex
        w="12%"
        justify={"start"}
        alignItems="center"
        gap={7}
        sx={{
          zIndex: 2,
        }}
      >
        <div
          style={{
            touchAction: "manipulation",
          }}
          {...listeners}
        >
          <MdDragHandle cursor="row-resize" size="25" color="#4b4b4b" />
        </div>
        <Flex
          sx={{
            fontSize: "14px",
            color: "#4b4b4b",
            lineHeight: 1.4,
          }}
          alignItems="center"
        >
          <Text noOfLines={1}>排序</Text>
          <Input
            size="xs"
            w="50px"
            type={"number"}
            onBlur={() => {
              console.log("on focus out");
            }}
            sx={{
              mx: "6px",
              border: "0.8px solid #CCCCCC",
              borderRadius: "4px",
              fontWeight: 500,
              fontSize: "16px",
              color: "#1A181C",
              lineHeight: 1,
            }}
          />
        </Flex>
      </Flex>
      <Flex
        w="20%"
        flexDirection={"column"}
        sx={{
          zIndex: 2,
        }}
        {...listeners}
      >
        <Text
          noOfLines={1}
          textOverflow={"ellipsis"}
          sx={{
            fontWeight: 500,
            fontSize: "14px",
            color: "#2d2d2d",
          }}
        >
          {course.name}
        </Text>
        <HStack
          sx={{
            fontSize: "12px",
            color: "#6f6f6f",
          }}
        >
          <Text noOfLines={1}>{course.serial}</Text>
          <Text noOfLines={1}>{course.teacher}</Text>
        </HStack>
      </Flex>
      <Flex
        w="20%"
        gap="4px"
        sx={{
          zIndex: 2,
        }}
        {...listeners}
      >
        {/* {deptBadge} */}
        <CustomTag>{selectiveOrNot}</CustomTag>
        {courseArea}
      </Flex>
      <Flex
        flexGrow={1}
        flexDirection="column"
        alignItems={"start"}
        sx={{
          fontSize: "12px",
          lineHeight: 1.4,
          fontWeight: 400,
          color: "#4b4b4b",
          fontFamily: "Work Sans",
          zIndex: 2,
        }}
        {...listeners}
      >
        {courseTimeLocationPairs.map((pair, index) => {
          return (
            <Text key={`${index}-${pair.time}-${pair.location}`}>
              {pair.time}
            </Text>
          );
        })}
      </Flex>
      <Button
        size="sm"
        mr="30px"
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
        onClick={() => {}}
        mr="30px"
        zIndex={2}
      >
        <Center w="100%" h="24px">
          {<TrashCanOutlineIcon boxSize="24px" />}
        </Center>
      </Button>
      <Button
        zIndex={2}
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          router.push(`/courseinfo/${course.id}`);
        }}
        variant="outline"
        borderRadius={"full"}
        w="85px"
      >
        {"課程大綱"}
      </Button>
    </Flex>
  );
}

type TempCourseOrderType = {
  [tab in CourseOrderListTabId]: string[];
};

export default function CourseOrderList() {
  const [activeTabId, setActiveTabId] = useState<CourseOrderListTabId>(
    tabs[0].id
  );
  const { user } = useUser();
  const { userInfo, isLoading: isUserInfoLoading } = useUserInfo(
    user?.sub ?? null
  );
  const courseTableKey = userInfo?.course_tables?.[0] ?? null;
  const { courseTable, isLoading: isCourseTableLoading } =
    useCourseTable(courseTableKey);
  const tabCoursesDict: Record<CourseOrderListTabId, Record<string, Course>> = {
    Common: (courseTable?.courses ?? []).reduce((acc, course) => {
      acc[course.id] = course;
      return acc;
    }, {} as Record<string, Course>),
    Chinese: {}, // TODO:
    Calculus: {}, // TODO:
    ForeignLanguage: {}, // TODO:
  };

  const [courseListForSort, setCourseListForSort] =
    useState<TempCourseOrderType>({
      Common: courseTable?.courses?.map((c) => c.id) ?? [],
      Chinese: [],
      Calculus: [],
      ForeignLanguage: [],
    });
  const [prepareToRemoveCourseId, setPrepareToRemoveCourseId] =
    useState<TempCourseOrderType>({
      Common: [],
      Chinese: [],
      Calculus: [],
      ForeignLanguage: [],
    });

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
      ([tabId, courseIds]) => {
        if (tabId === "Common") {
          return !courseIds.every(
            (courseId, index) => courseId === courseTable?.courses?.[index]?.id
          );
        }
        // TODO: Calculus, Chinese, ForeignLanguage tabs
        return false;
      }
    );
    return hasDeletedCourses || hasReorderedCourses;
  }, [courseListForSort, prepareToRemoveCourseId, courseTable?.courses]);

  return (
    <Flex w="100%" h="70vh" flexDirection={"column"}>
      <Flex
        minH="44px"
        pl={4}
        alignItems="center"
        shadow="0px 20px 24px -4px rgba(85, 105, 135, 0.04), 0px 8px 8px -4px rgba(85, 105, 135, 0.02)"
        zIndex={1001}
      >
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id;
          return (
            <Flex
              key={tab.id}
              mx={6}
              h="100%"
              alignItems={"center"}
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: 1.4,
                color: isActive ? "#2d2d2d" : "#2d2d2d50",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                borderTop: "2px solid transparent",
                borderBottom: isActive
                  ? "2px solid #1A181C"
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
        flexDirection="column"
        overflowY={"auto"}
        flexGrow={1}
        sx={customScrollBarCss}
      >
        {isCourseTableLoading || isUserInfoLoading ? (
          <>isLoading</>
        ) : (
          <div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToParentElement, restrictToVerticalAxis]}
              onDragEnd={(event) => {
                const { active, over } = event;
                if (active.id !== over?.id) {
                  setCourseListForSort((courseListForSort) => {
                    const oldIndex = courseListForSort[activeTabId].indexOf(
                      String(active.id)
                    );
                    const newIndex = courseListForSort[activeTabId].indexOf(
                      String(over?.id)
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
              }}
            >
              <SortableContext
                items={courseListForSort[activeTabId]}
                strategy={verticalListSortingStrategy}
              >
                {courseListForSort[activeTabId].map((courseId, index) => {
                  const course = tabCoursesDict[activeTabId][courseId];
                  if (!course) {
                    return null;
                  }
                  return (
                    <SortableRowElement
                      key={course.id}
                      course={course}
                      index={index}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          </div>
        )}
      </Flex>
      <Flex
        h="56px"
        shadow="0px -0.5px 0px #909090"
        alignItems="center"
        justifyContent={"space-between"}
        p="10px 32px"
        zIndex={1001}
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
          >
            儲存
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
