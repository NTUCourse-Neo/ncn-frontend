import React from 'react';
import {
  Badge,
  Flex,
  Spacer,
  Text,
  VStack,
  Icon,
  HStack,
  Image,
} from '@chakra-ui/react';
import { IoMdOpen } from 'react-icons/io';
import ParrotGif from "../img/parrot/parrot.gif";

function PTTContentRowContainer({ info, height}){
  const RenderRow = (data) => {
    return(
      <Flex key={data.title} as="button" px="2" my="1" w="100%" h="10" bg="blue.50" justifyContent="start" alignItems="center" borderRadius="lg" onClick={() => window.open(data.url,"_blank")}>
        <Badge key={data.title+"Badge"} mr="1" colorScheme="blue">{data.date}</Badge>
        <Text key={data.title+"Title"} w="50%" mr="2" fontSize="md" color="gray.700" fontWeight="500" textAlign="start" isTruncated>{data.title}</Text>
        <Text key={data.title+"Author"} w="20%" as="i" fontSize="xs" color="gray.400" fontWeight="500" textAlign="start" isTruncated>- {data.author}</Text>
        <Spacer />
        <Icon key={data.title+"Icon"} as={IoMdOpen} color="gray.400" size="20px" />
      </Flex>
    );
  };
  return(
    <Flex w="100%" h={height} mb="0" overflow="auto" flexDirection="column">
      <VStack>
        {info.map(RenderRow)}
      </VStack>
    </Flex>
  );
}

export default PTTContentRowContainer;