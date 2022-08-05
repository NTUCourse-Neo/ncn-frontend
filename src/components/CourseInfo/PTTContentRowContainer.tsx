import React from "react";
import {
  Badge,
  Flex,
  Spacer,
  Text,
  VStack,
  Icon,
  useColorModeValue,
  FlexProps,
} from "@chakra-ui/react";
import { IoMdOpen } from "react-icons/io";
import { reportEvent } from "utils/ga";
import type { PTTData } from "@/types/course";

export interface PTTContentRowContainerProps extends FlexProps {
  readonly info: PTTData;
}

function PTTContentRowContainer(props: PTTContentRowContainerProps) {
  const { info, ...restProps } = props;
  const rowColor = useColorModeValue("blue.50", "#2B6CB030");
  const textColor = useColorModeValue("text.light", "text.dark");
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
            bg={rowColor}
            justifyContent="start"
            alignItems="center"
            borderRadius="lg"
            onClick={() => {
              window.open(data.url, "_blank");
              reportEvent("ptt_panel", "click_external", data.url);
            }}
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
