import { React } from 'react';
import {
    Box,
    Flex,
    Heading,
    Spacer,
  } from '@chakra-ui/react';
function HomeCard(props) {
    return (
        <Box className="initialBox" boxSize="xl" w="80vw" bg={props.bg} borderRadius="3xl" p={4} boxShadow='xl'>
            <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
              <Flex justifyContent="end" alignItems="center" flexDirection="column" m="40px">
                <Spacer/>
                <Heading as="h1" fontSize="6xl" fontWeight="800" color="gray.700">{props.title}</Heading>
              </Flex>
            </Flex>
          </Box>
    );
}
export default HomeCard;