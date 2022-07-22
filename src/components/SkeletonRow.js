import React from "react";
import { Flex, useToast, Text } from "@chakra-ui/react";
import { HashLoader } from "react-spinners";
import { FaSadTear } from "react-icons/fa";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";

function SkeletonRow({ loading }) {
  const { searchLoading, searchError } = useCourseSearchingContext();
  const isLoading = loading ?? searchLoading;
  const toast = useToast();

  if (isLoading) {
    return (
      <Flex p="4" direction={"row"} w="100%" justifyContent={"center"}>
        <HashLoader size="60px" color="teal" />
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
