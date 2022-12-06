import { Box, BoxProps } from "@chakra-ui/react";
import { Course } from "@/types/course";

export interface CourseTableCardProps extends BoxProps {
  readonly course: Course;
}

export default function CourseTableCard(props: CourseTableCardProps) {
  const { course, ...restProps } = props;
  return (
    <Box
      sx={{
        bg: "#ffffff",
        borderRadius: "10px",
        boxShadow: "2px 2px 12px 0px rgba(75, 75, 75, 0.12)",
      }}
      {...restProps}
    >
      {course.name}
    </Box>
  );
}
