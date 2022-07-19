import React from "react";
import {
  Badge,
  Flex,
  Spacer,
  Text,
  VStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { IoMdOpen } from "react-icons/io";

function PTTContentRowContainer({ info, ...restProps }) {
  const rowColor = useColorModeValue("blue.50", "#2B6CB030");
  const textColor = useColorModeValue("text.light", "text.dark");
  const rows = info ?? [];
  return (
    <Flex w="100%" mb="0" overflow="auto" flexDirection="column" {...restProps}>
      <VStack>
        {rows.map((data) => (
          <Flex
            key={data.url}
            as="button"
            px="2"
            my="1"
            w="100%"
            h="10"
            bg={rowColor}
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
              color={textColor}
              fontWeight="500"
              textAlign="start"
              noOfLines={1}
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
              noOfLines={1}
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
