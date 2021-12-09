import React from 'react';
import {
  Flex,
  Heading,
  Button,
  Spacer,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Kbd,
} from '@chakra-ui/react';
import {ChevronRightIcon, Search2Icon} from "@chakra-ui/icons"
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { Link } from "react-router-dom";


function HeaderBar() {
    return (
      <Flex position="fixed" w="100%" h="64px" bg="teal.300" flexDirection="row" justifyContent="start" alignItems="center" zIndex="1000">
        <Flex justifyContent="center" alignItems="center" ml="60px">
          <Heading fontSize="2xl" fontWeight="700" mr="auto" color="gray.700" minW="200px">NTUCourse Neo</Heading>
          <Link to="/course"><Button colorScheme="blue" variant="ghost" size="md" ml="30px">課程</Button></Link>
        </Flex>
        <Spacer />
        <Flex justifyContent="center" alignItems="center" mr="60px">
          <Button colorScheme="blue" variant="ghost" size="md" ml="10px" mr="10px">登入</Button>
          <Button colorScheme="yellow" rightIcon={<ChevronRightIcon/>} size="md" ml="10px" mr="10px">註冊</Button>
        </Flex>
      </Flex>
  );
}

export default HeaderBar;
