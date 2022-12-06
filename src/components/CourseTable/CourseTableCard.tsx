import { Box, BoxProps, Text } from "@chakra-ui/react";
import { CourseRLE } from "@/utils/courses2rle";

export interface CourseTableCardProps extends BoxProps {
  readonly courseRle: CourseRLE;
}

export default function CourseTableCard(props: CourseTableCardProps) {
  const { courseRle, ...restProps } = props;
  const { course, duration, location } = courseRle;

  // TODO: 必帶 flag
  const isPreallocated = false;

  return (
    <Box
      sx={{
        position: "relative",
        bg: "#ffffff",
        borderRadius: "10px",
        boxShadow: "2px 2px 12px 0px rgba(75, 75, 75, 0.12)",
        cursor: "pointer",
        p: "12px",
        overflow: "hidden",
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
          color: "#2d2d2d",
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
          color: "#909090",
        }}
      >
        {location}
      </Text>
    </Box>
  );
}
