import React from "react";
import { Flex, Skeleton } from "@chakra-ui/react";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";

export interface SkeletonProps {
  loading?: boolean;
  times?: number;
}

function SkeletonRow({ loading, times = 1 }: SkeletonProps) {
  const { searchLoading } = useCourseSearchingContext();
  const isLoading = loading ?? searchLoading;

  if (isLoading) {
    return (
      <Flex direction={"column"} w="100%" justifyContent={"center"}>
        {[...Array(times)].map((_, index) => (
          <Skeleton
            mb={1}
            mx={{ base: "5", md: "0" }}
            height={{ base: "120px", md: "45px" }}
            borderRadius="md"
            speed={1 + index * 0.5}
            key={`skeleton-${index}`}
          />
        ))}
      </Flex>
    );
  }

  return null;
}
export default SkeletonRow;
