import React from 'react';
import {
  ChakraProvider,
  Box,
  Flex,
  Heading,
  Image,
  Spacer,
  IconButton,
  Button,
  Divider,
  useColorModeValue,
  useColorMode,
  ColorModeProvider
} from '@chakra-ui/react';
import theme from './theme';
import HeaderBar from './components/HeaderBar';
import Footer from './components/Footer';
import homeMainSvg from './img/home_main.svg';
import { FaArrowDown} from "react-icons/fa";
import { animateScroll as scroll} from 'react-scroll'


function ScrollToTop() {
  scroll.scrollToTop();
}


function App() {
  return (
    <ChakraProvider theme={theme}>
      <HeaderBar useColorModeValue={useColorModeValue}/>
      <Box maxW="screen-md" mx="auto" overflow="visible" px="64px">
        <Flex justifyContent="space-between" mb={4} grow="1" flexDirection="column" alignItems="center">
          <Spacer/>
          <Flex justifyContent="space-between" flexDirection="row" alignItems="center" w="90vw">
            <Box>
              <Heading as="h1" fontSize="6xl" fontWeight="800" color="gray.700">Course Schedule</Heading>
              <Heading as="h1" fontSize="6xl" fontWeight="extrabold" color="gray.700" mb={4}>Re-imagined.</Heading>
              <Heading as="h1" fontSize="3xl" fontWeight="500" color="gray.500" mb={4}>修課安排不再是難事。</Heading>
              <Spacer my={8}/>
              <Flex justifyContent="start" alignItems="center" flexDirection="row">
                <Button colorScheme="teal" variant="solid" size="lg" mr={4}>開始使用</Button>
                <Button colorScheme="teal" variant="outline" size="lg" mr={4}>了解更多</Button>
              </Flex> 
            </Box>
            <Spacer/>
            <Image src={homeMainSvg} alt="home_main" w="50vw"/>
          </Flex>
          <Spacer my={10}/>
          <Button variant="ghost" size="lg" onClick={() => scroll.scrollTo(750)}><FaArrowDown/></Button>
          <Spacer my={5}/>
          <Box className="initialBox" boxSize="xl" w="80vw" bg="gray.200" borderRadius="3xl" p={4} boxShadow='xl'>
            <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
              <Flex justifyContent="end" alignItems="center" flexDirection="column" m="40px">
                <Spacer/>
                <Heading as="h1" fontSize="6xl" fontWeight="800" color="gray.700">EZ!</Heading>
              </Flex>
            </Flex>
          </Box>
          <Divider mt="10" mb="10"/>
          <Box className="initialBox" boxSize="xl" w="80vw" bg="gray.200" borderRadius="3xl" p={4} boxShadow='xl'>
            <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
              <Flex justifyContent="end" alignItems="center" flexDirection="column" m="40px">
                <Spacer/>
                <Heading as="h1" fontSize="6xl" fontWeight="800" color="gray.700">EZ!</Heading>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Footer />
    </ChakraProvider>
  );
}

export default App;
