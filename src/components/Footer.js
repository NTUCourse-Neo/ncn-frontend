import React from 'react';
import { Flex, Box, Heading, Spacer, Text, Button } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
function Footer() {
    return (
        <Flex h="5vh" flexDirection="row" justifyContent="start" alignItems="center" px="4" py={2} borderTop="1px solid" borderColor="gray.200" zIndex="10000">
            <Heading size="sm" color="gray.500">NTUCourse Neo</Heading>
            <Spacer />
            <Text fontSize="sm" color="gray.300">
              A wp1101 project. Made with 💖 by 
                <Button size="xs" leftIcon={<FaGithub/>} variant="ghost" ml="2px" mr="2px">jc-hiroto</Button>
                <Button size="xs" leftIcon={<FaGithub/>} variant="ghost" ml="2px" mr="2px">swh00tw</Button>
                <Button size="xs" leftIcon={<FaGithub/>} variant="ghost" ml="2px" mr="2px">Wil0408</Button>
            </Text>
            <Spacer/>
            <Text fontSize="xs" color="gray.300" align-self="end">Alpha V0.1</Text>
        </Flex>
    );
}
export default Footer;