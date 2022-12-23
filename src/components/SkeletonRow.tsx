import React from "react";
import { Flex, SkeletonText, SkeletonTextProps, Box } from "@chakra-ui/react";

function SkeletonBox(props: SkeletonTextProps) {
  return (
    <SkeletonText
      noOfLines={1}
      startColor="black.200"
      endColor="black.500"
      w="100%"
      skeletonHeight={"15px"}
      {...props}
    />
  );
}

export interface SkeletonProps {
  isLoading?: boolean;
  noOfLines?: number;
}

function SkeletonRow({ isLoading, noOfLines = 10 }: SkeletonProps) {
  if (isLoading) {
    return (
      <Box>
        {Array.from({ length: noOfLines }).map((_, i) => (
          <Flex
            key={i}
            w="100%"
            flexDirection={{ base: "column", md: "row" }}
            alignItems="center"
            _hover={{
              bg: "#f6f6f6",
            }}
            gap={6}
            p={6}
            shadow={"0px 0.5px 0px rgba(144, 144, 144, 0.8)"}
          >
            <Flex
              w={{ base: "100%", md: "40%" }}
              flexDirection={"column"}
              gap={"4px"}
              lineHeight="1.6"
            >
              <SkeletonBox w="90%" />
              <SkeletonBox w="90%" />
              <SkeletonBox w="90%" />
            </Flex>
            <Flex
              w={{ base: "100%", md: "20%" }}
              flexDirection="column"
              alignItems={"start"}
            >
              <SkeletonBox w="90%" />
            </Flex>
            <Flex w={{ base: "100%", md: "20%" }} flexDirection={"column"}>
              <SkeletonBox w="40%" />
            </Flex>
            <Flex w={{ base: "100%", md: "15%" }} gap={4}>
              <SkeletonBox w="30%" />
              <SkeletonBox w="50%" />
            </Flex>
          </Flex>
        ))}
      </Box>
    );
  }

  return null;
}
export default SkeletonRow;
