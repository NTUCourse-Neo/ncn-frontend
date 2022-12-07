import { Box, BoxProps, Text, Flex, Button } from "@chakra-ui/react";
import { CourseRLE } from "@/utils/courses2rle";
import { CloseIcon } from "@chakra-ui/icons";
import { intervals, days } from "@/constant";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const { course, duration, location } = courseRle;
  const time = `${days[dayIndex]} ${Array.from({ length: duration })
    .map((_, i) => {
      return intervals[intervalIndex + i];
    })
    .join(", ")}`;
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
          <Text
            textAlign={"start"}
            noOfLines={1}
            sx={{
              fontSize: "12px",
              lineHeight: 1.4,
              color: "#4b4b4b",
            }}
          >
            {time}
          </Text>
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
  const { course, duration, location } = courseRle;

  // TODO: 必帶 flag
  const isPreallocated = false;

  return (
    <Box
      sx={{
        position: "relative",
        bg: isActive ? "#4681FF" : "#ffffff",
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
      <Text
        textAlign={"start"}
        noOfLines={duration}
        sx={{
          fontWeight: 500,
          fontSize: "14px",
          lineHeight: 1.4,
          color: isActive ? "#ffffff" : "#2d2d2d",
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
          color: isActive ? "#f2f2f2" : "#909090",
        }}
      >
        {location}
      </Text>
    </Box>
  );
}
