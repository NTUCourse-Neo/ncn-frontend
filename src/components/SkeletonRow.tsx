import React from "react";
import { Flex } from "@chakra-ui/react";
import { PuffLoader } from "react-spinners";

export interface SkeletonProps {
  isLoading?: boolean;
}

function SkeletonRow({ isLoading }: SkeletonProps) {
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
