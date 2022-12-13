import {
  Box,
  BoxProps,
  Text,
  Flex,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogHeader,
  HStack,
} from "@chakra-ui/react";
import { CourseRLE } from "@/utils/courseTableRle";
import { CloseIcon } from "@chakra-ui/icons";
import { intervals, days } from "@/constant";
import { useRouter } from "next/router";
import { useRef, useMemo } from "react";
import useCourseTable from "hooks/useCourseTable";
import { useUser } from "@auth0/nextjs-auth0";
import useUserInfo from "hooks/useUserInfo";
import { hoverCourseState } from "@/utils/hoverCourse";
import { useSnapshot } from "valtio";
import { intervalSource } from "@/types/course";
import { numberToInterval } from "@/utils/intervalNumberConverter";

export function CourseTableCardPortal({
  courseRle,
  onClose,
  dayIndex,
  intervalIndex,
}: {
  readonly courseRle: CourseRLE;
  readonly onClose: () => void;
  readonly dayIndex: number;
  readonly intervalIndex: number;
}) {
  const { user } = useUser();
  const { userInfo } = useUserInfo(user?.sub ?? null);
  const courseTableKey = userInfo?.course_tables?.[0] ?? null;
  const { addOrRemoveCourse } = useCourseTable(courseTableKey);

  const router = useRouter();
  const { course, duration, location } = courseRle;
  const time = `${days[dayIndex]} ${Array.from({ length: duration })
    .map((_, i) => {
      return intervals[intervalIndex + i];
    })
    .join(", ")}`;
  const intervalTime = useMemo(() => {
    const startInterval = numberToInterval(intervalIndex);
    const endInterval = numberToInterval(intervalIndex + duration - 1);
    return `${intervalSource[startInterval].startAt}~${intervalSource[endInterval].endAt}`;
  }, [duration, intervalIndex]);
  const { isOpen, onOpen, onClose: closeDialog } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Box
      sx={{
        w: 300,
        h: 170,
        bg: "#ffffff",
        borderRadius: "8px",
        shadow: " 2px 2px 12px -2px rgba(75, 75, 75, 0.12)",
        p: 4,
      }}
    >
      <Flex flexDirection="column" justify={"space-between"} h="100%">
        <Flex flexDirection="column" gap={2}>
          <Flex justify={"space-between"} alignItems="center">
            <Text
              textAlign={"start"}
              noOfLines={1}
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: 1.4,
                color: "#2d2d2d",
              }}
            >
              {course.name}
            </Text>
            <CloseIcon
              boxSize={"13px"}
              onClick={onClose}
              sx={{
                cursor: "pointer",
              }}
            />
          </Flex>
          <Text
            textAlign={"start"}
            noOfLines={1}
            sx={{
              fontSize: "12px",
              lineHeight: 1.4,
              color: "#6f6f6f",
            }}
          >
            {course.teacher}
          </Text>
          <HStack
            spacing={3}
            sx={{
              fontSize: "12px",
              lineHeight: 1.4,
              color: "#4b4b4b",
            }}
          >
            <Text textAlign={"start"} noOfLines={1}>
              {time}
            </Text>
            <Text textAlign={"start"} noOfLines={1} color={"#909090"}>
              {intervalTime}
            </Text>
          </HStack>
          <Text
            textAlign={"start"}
            noOfLines={1}
            sx={{
              fontSize: "12px",
              lineHeight: 1.4,
              color: "#4b4b4b",
            }}
          >
            {location}
          </Text>
        </Flex>
        <Flex justify={"end"} alignItems="center" gap={4}>
          <Button
            variant={"unstyled"}
            size="sm"
            sx={{
              fontWeight: 500,
              fontSize: "12px",
              color: "error.500",
            }}
            onClick={onOpen}
          >
            移除
          </Button>
          <Button
            variant={"outline"}
            size="sm"
            w="80px"
            sx={{
              fontWeight: 500,
              fontSize: "12px",
              borderRadius: "full",
            }}
            onClick={() => {
              router.push(`/courseinfo/${course.id}`);
            }}
          >
            課程大綱
          </Button>
          <AlertDialog
            motionPreset="slideInBottom"
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isOpen={isOpen}
            isCentered
          >
            <AlertDialogOverlay />
            <AlertDialogContent p={6}>
              <AlertDialogHeader
                sx={{
                  fontWeight: 500,
                  fontSize: "18px",
                  p: 0,
                }}
              >
                移除提醒
              </AlertDialogHeader>
              <AlertDialogBody
                p={0}
                mt={"8px"}
                sx={{
                  color: "#6f6f6f",
                }}
              >
                確定要移除 {`${course.id} ${course.name}`}？
              </AlertDialogBody>
              <AlertDialogFooter gap="8px" p={0} mt={8}>
                <Button
                  ref={cancelRef}
                  sx={{
                    w: "60px",
                    h: "36px",
                    borderRadius: "full",
                    fontWeight: 500,
                    fontSize: "14px",
                  }}
                  onClick={closeDialog}
                >
                  取消
                </Button>
                <Button
                  variant={"unstyled"}
                  sx={{
                    w: "60px",
                    h: "36px",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#4b4b4b",
                  }}
                  onClick={async () => {
                    await addOrRemoveCourse(course);
                    closeDialog();
                    onClose();
                  }}
                >
                  確定
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Flex>
      </Flex>
    </Box>
  );
}

export interface CourseTableCardProps extends BoxProps {
  readonly courseRle: CourseRLE;
  readonly isActive: boolean;
}

export default function CourseTableCard(props: CourseTableCardProps) {
  const { courseRle, isActive, ...restProps } = props;
  const { course, duration, location, conflictedCourses } = courseRle;
  const numOfConflict = Object.keys(conflictedCourses).length;
  const { hoveredCourse } = useSnapshot(hoverCourseState);
  const isHovered = hoveredCourse && hoveredCourse.id === course.id;
  const needOffset = useMemo(() => {
    if (isHovered || !hoveredCourse) return false;
    const { schedules: hoveredSchedules } = hoveredCourse;
    const isOverlapped = hoveredSchedules.some((schedule) => {
      return course.schedules.some(
        (s) =>
          s.weekday === schedule.weekday && s.interval === schedule.interval
      );
    });
    return isOverlapped;
  }, [course.schedules, isHovered, hoveredCourse]);

  // TODO: 必帶 flag
  const isPreallocated = false;

  return (
    <Box
      sx={{
        position: "relative",
        top: needOffset ? "-14px" : 0,
        left: needOffset ? "-14px" : 0,
        bg: isHovered
          ? "linear-gradient(0deg, rgba(70, 129, 255, 0.5), rgba(70, 129, 255, 0.5)), #FFFFFF"
          : isActive
          ? "#4681FF"
          : "#ffffff",
        borderRadius: "10px",
        boxShadow: "2px 2px 12px 0px rgba(75, 75, 75, 0.12)",
        cursor: "pointer",
        p: "12px",
        overflow: "hidden",
        transition: "all 0.2s ease-in-out",
      }}
      {...restProps}
    >
      <Box
        position="absolute"
        h="4px"
        top={0}
        left={0}
        right={0}
        sx={{
          bg: "#0D40C3",
          display: isPreallocated ? "block" : "none",
        }}
      />
      <Flex h="100%" flexDirection={"column"} justifyContent="space-between">
        <Flex flexDirection={"column"}>
          <Text
            textAlign={"start"}
            noOfLines={duration}
            sx={{
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: 1.4,
              color: isHovered || isActive ? "#ffffff" : "#2d2d2d",
            }}
          >
            {course.name}
          </Text>
          <Text
            mt="6px"
            textAlign={"start"}
            noOfLines={1}
            sx={{
              fontSize: "12px",
              lineHeight: 1.4,
              color: isHovered || isActive ? "#f2f2f2" : "#909090",
            }}
          >
            {location}
          </Text>
        </Flex>
        {numOfConflict > 0 ? (
          <Flex justify={"end"}>
            <Flex
              alignItems="center"
              sx={{
                bg: isHovered || isActive ? "#ffffff" : "#4681FF",
                color: isHovered || isActive ? "#4681FF" : "#ffffff",
                p: "4px 8px",
                h: "22px",
                borderRadius: "36px",
                shadow: "0px 1px 2px rgba(105, 81, 255, 0.05)",
                fontWeight: 500,
                fontSize: "10px",
                lineHeight: 1.4,
                gap: "2px",
              }}
            >
              衝堂 {numOfConflict}
            </Flex>
          </Flex>
        ) : null}
      </Flex>
    </Box>
  );
}
