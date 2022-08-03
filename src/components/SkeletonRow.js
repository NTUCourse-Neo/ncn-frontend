import React from "react";
import { Flex, useToast, Text, Skeleton } from "@chakra-ui/react";
import { FaSadTear } from "react-icons/fa";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";

function SkeletonRow({ loading, times = 1 }) {
  const { searchLoading, searchError } = useCourseSearchingContext();
  const isLoading = loading ?? searchLoading;
  const toast = useToast();

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
            key={"skeleton-" + index}
          />
        ))}
      </Flex>
    );
  }

  if (searchError) {
    toast({
      title: "錯誤",
      description: "😢 哭阿，發生錯誤了，請稍後再試一次。",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    return (
      <Text color="gray.300" pt="10">
        {" "}
        <FaSadTear size={32} />{" "}
      </Text>
    );
  }

  return null;
}
export default SkeletonRow;
