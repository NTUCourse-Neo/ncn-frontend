import { React } from 'react';
import {
    Box,
    Flex,
    Heading,
    Image,
    Spacer,
    Button,
    Divider
  } from '@chakra-ui/react';
import homeMainSvg from '../img/home_main.svg';
import HomeCard from '../components/HomeCard';

import { FaArrowDown } from "react-icons/fa";
import { animateScroll as scroll } from 'react-scroll'
import { Link } from "react-router-dom";

function HomeViewContainer() {
    return (
        <Box maxW="screen-md" mx="auto" overflow="visible" p="64px">
        <Flex justifyContent="space-between" mb={4} grow="1" flexDirection="column" alignItems="center">
          <Spacer/>
          <Flex justifyContent="space-between" flexDirection="row" alignItems="center" w="90vw">
            <Box>
              <Heading as="h1" fontSize="6xl" fontWeight="800" color="gray.700">Course Schedule</Heading>
              <Heading as="h1" fontSize="6xl" fontWeight="extrabold" color="gray.700" mb={4}>Re-imagined.</Heading>
              <Heading as="h1" fontSize="3xl" fontWeight="500" color="gray.500" mb={4}>修課安排不再是難事。</Heading>
              <Spacer my={8}/>
              <Flex justifyContent="start" alignItems="center" flexDirection="row">
                <Link to="/course"><Button colorScheme="teal" variant="solid" size="lg" mr={4}>開始使用</Button></Link>
                <Button colorScheme="teal" variant="outline" size="lg" mr={4}>了解更多</Button>
              </Flex> 
            </Box>
            <Spacer/>
            <Image src={homeMainSvg} alt="home_main" w="50vw"/>
          </Flex>
          <Spacer my={10}/>
          <Button variant="ghost" size="lg" onClick={() => scroll.scrollTo(750)}><FaArrowDown/></Button>
          <Spacer my={5}/>
          <HomeCard title="Section 1" bg="gray.100" img=""/>
          <Spacer mt="10" mb="10"/>
        </Flex>
      </Box>
    );
}

export default HomeViewContainer;