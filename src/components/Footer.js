import React from 'react';
import { Flex, Box, Heading, Spacer, Text, Button } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
function Footer() {
    return (
      <footer>
        <Flex maxH="128px" align="center" justify="space-between" p={4} borderTop="1px solid" borderColor="gray.200" >
          <Box>
            <Heading size="sm" color="gray.500">NTUCourse Neo</Heading>
            <Spacer my={1} />
            <Text fontSize="sm" color="gray.300">
              A wp1101 project. Made with 💖 by 
                <Button size="xs" leftIcon={<FaGithub/>} variant="ghost" ml="2px" mr="2px">jc-hiroto</Button>
                <Button size="xs" leftIcon={<FaGithub/>} variant="ghost" ml="2px" mr="2px">swh00tw</Button>
                <Button size="xs" leftIcon={<FaGithub/>} variant="ghost" ml="2px" mr="2px">Wil0408</Button>
            </Text>
            <Spacer my={4} />
            <Text fontSize="xs" color="gray.300" align-self="end">Alpha V0.1</Text>
          </Box>
        </Flex>
      </footer>
    );
}
export default Footer;