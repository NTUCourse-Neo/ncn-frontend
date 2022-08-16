import {
  Text,
  Flex,
  Progress,
  HStack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaClock } from "react-icons/fa";
import { differenceInDays, differenceInHours } from "date-fns";

const status_map = [
  {
    name: "即將開始",
    emoji: "⏰",
    color: "blue.200",
  },
  {
    name: "已開始",
    emoji: "🏎️",
    color: "green.200",
  },
  {
    name: "快結束啦!",
    emoji: "🏃",
    color: "yellow.200",
  },
  {
    name: "剩不到一天了",
    emoji: "🥵",
    color: "red.200",
  },
];

const ntu_course_select_url = [
  "https://if192.aca.ntu.edu.tw/index.php",
  "https://if177.aca.ntu.edu.tw/index.php",
];

interface CourseSelectionSchedule {
  start: number;
  end: number;
  name: string;
  label: string;
}

const course_select_schedule: CourseSelectionSchedule[] = [
  {
    name: "初選第一階段",
    label: "初選 一階",
    start: 1660698000000,
    end: 1660935600000,
  },
  {
    name: "初選第二階段",
    label: "二階",
    start: 1661302800000,
    end: 1661454000000,
  },
  {
    name: "第一週加退選",
    label: "加退選 W1",
    start: 1662339600000,
    end: 1662782400000,
  },
  {
    name: "第二週加退選",
    label: "W2",
    start: 1662944400000,
    end: 1663408800000,
  },
  {
    name: "第三週加退選",
    label: "W3",
    start: 1663549200000,
    end: 1663923600000,
  },
];

const msInDay = 86400000;

export const getCourseSelectSchedule = (timestamp: number) => {
  if (timestamp < course_select_schedule[0].start) {
    return { status_idx: 0, schedule_idx: 0 };
  }
  for (let i = 0; i < course_select_schedule.length; i++) {
    if (
      timestamp >= course_select_schedule[i].start &&
      timestamp <= course_select_schedule[i].end
    ) {
      if (course_select_schedule[i].end - timestamp <= msInDay) {
        return { status_idx: 3, schedule_idx: i };
      } else if (course_select_schedule[i].end - timestamp <= msInDay * 2) {
        return { status_idx: 2, schedule_idx: i };
      }
      return { status_idx: 1, schedule_idx: i };
    }
    if (
      i < course_select_schedule.length - 1 &&
      timestamp <= course_select_schedule[i + 1].start &&
      timestamp >= course_select_schedule[i].end
    ) {
      return { status_idx: 0, schedule_idx: i + 1 };
    }
  }
  return { status_idx: -1, schedule_idx: -1 };
};

function DeadlineCountdown() {
  const curr_ts = new Date().getTime();
  const { status_idx, schedule_idx } = getCourseSelectSchedule(curr_ts);
  const colorScheme = useColorModeValue(
    status_map[status_idx].color.slice(0, -4),
    "cyan"
  );
  if (status_idx === -1) {
    return <></>;
  }
  const elaspedDays = differenceInDays(
    status_idx === 0
      ? course_select_schedule[schedule_idx].start
      : course_select_schedule[schedule_idx].end,
    curr_ts
  );
  const elapsedHours =
    differenceInHours(
      status_idx === 0
        ? course_select_schedule[schedule_idx].start
        : course_select_schedule[schedule_idx].end,
      curr_ts
    ) % 24;
  const time_percent =
    status_idx === 0
      ? 0
      : (curr_ts - course_select_schedule[schedule_idx].start) /
        (course_select_schedule[schedule_idx].end -
          course_select_schedule[schedule_idx].start);
  const process_percent =
    ((time_percent + schedule_idx) / (course_select_schedule.length - 1)) * 100;

  return (
    <Flex
      overflowY={"auto"}
      w={{ base: "100%", lg: "25vw" }}
      justifyContent={["center", "start"]}
      alignItems="start"
      flexDirection="column"
      borderRadius="xl"
      boxShadow="xl"
      p="4"
      bg={status_map[status_idx].color}
    >
      <Flex
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        wrap="wrap"
        css={{ gap: "2" }}
      >
        <Text fontSize="xl" fontWeight="800" color="gray.700" mb="2">
          {status_map[status_idx].emoji}{" "}
          {course_select_schedule[schedule_idx].name}{" "}
          {status_map[status_idx].name}
        </Text>
        <HStack ml="1">
          <FaClock />
          <Text fontSize="sm" fontWeight="600" color="gray.700" mb="2">
            {" "}
            尚餘 {elaspedDays} 天 {elapsedHours} 時
          </Text>
        </HStack>
      </Flex>
      <Progress
        w="100%"
        my="2"
        colorScheme={colorScheme}
        size="sm"
        value={process_percent}
        hasStripe
        isAnimated
      />
      <Flex w="100%" justifyContent="space-between" alignItems="center">
        {course_select_schedule.map((item, idx) => {
          return (
            <Text
              key={idx}
              fontSize="xs"
              fontWeight="600"
              color="gray.700"
              mb="2"
            >
              {item.label}
            </Text>
          );
        })}
      </Flex>
      <Flex w="100%" mt="4" justifyContent="end" alignItems="center">
        <Button
          variant="solid"
          mr="2"
          size="sm"
          onClick={() => {
            window.open(ntu_course_select_url[0], "_blank");
          }}
          colorScheme={colorScheme}
        >
          選課系統 1
        </Button>
        <Button
          variant="solid"
          size="sm"
          onClick={() => {
            window.open(ntu_course_select_url[1], "_blank");
          }}
          colorScheme={colorScheme}
        >
          選課系統 2
        </Button>
      </Flex>
    </Flex>
  );
}

export default DeadlineCountdown;
