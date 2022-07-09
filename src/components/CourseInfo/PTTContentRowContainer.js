import React from "react";
import { Badge, Flex, Spacer, Text, VStack, Icon } from "@chakra-ui/react";
import { IoMdOpen } from "react-icons/io";

function PTTContentRowContainer({ info, ...restProps }) {
  return (
    <Flex w="100%" mb="0" overflow="auto" flexDirection="column" {...restProps}>
      <VStack>
        {info.map((data) => (
          <Flex
            key={data.url}
            as="button"
            px="2"
            my="1"
            w="100%"
            h="10"
            bg="blue.50"
            justifyContent="start"
            alignItems="center"
            borderRadius="lg"
            onClick={() => window.open(data.url, "_blank")}
          >
            <Badge key={data.url + "Badge"} mr="1" colorScheme="blue">
              {data.date}
            </Badge>
            <Text
              key={data.url + "Title"}
              w="50%"
              mr="2"
              fontSize="md"
              color="gray.700"
              fontWeight="500"
              textAlign="start"
              isTruncated
            >
              {data.title}
            </Text>
            <Text
              key={data.url + "Author"}
              w="20%"
              as="i"
              fontSize="xs"
              color="gray.400"
              fontWeight="500"
              textAlign="start"
              isTruncated
            >
              - {data.author}
            </Text>
            <Spacer />
            <Icon
              key={data.url + "Icon"}
              as={IoMdOpen}
              color="gray.400"
              size="20px"
            />
          </Flex>
        ))}
      </VStack>
    </Flex>
  );
}

export default PTTContentRowContainer;
