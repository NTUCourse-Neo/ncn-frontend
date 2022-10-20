import React from "react";
import { Flex } from "@chakra-ui/react";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import { PuffLoader } from "react-spinners";

export interface SkeletonProps {
  loading?: boolean;
}

function SkeletonRow({ loading }: SkeletonProps) {
  const { searchLoading } = useCourseSearchingContext();
  const isLoading = loading ?? searchLoading;

  if (isLoading) {
    return (
      <Flex
        direction={"column"}
        w="100%"
        h="57vh"
        alignItems={"center"}
        justifyContent={"center"}
      >
        <PuffLoader color={"#33333350"} />
      </Flex>
    );
  }

  return null;
}
export default SkeletonRow;
