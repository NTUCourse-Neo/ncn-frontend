import { React } from 'react';
import {
    Box,
    Flex,
    Heading,
    Spacer,
    Text,
    Image,
    transform,
  } from '@chakra-ui/react';
function HomeCard(props) {
    return (
        <Box className="initialBox" boxSize="xl" w="80vw" bg={props.bg} borderRadius="3xl" p={4} boxShadow='xl'>
            <Flex w="100%" h="100%" justifyContent="center" alignItems="center" flexDirection="row">
              <Flex w="60%" justifyContent="start" alignItems="start" flexDirection="column" mr="16">
                <Heading as="h1" fontSize="5xl" fontWeight="800" color="gray.700">{props.title}</Heading>
                <Spacer my="4"/>
                {props.desc.map((item,index) => {
                  return (
                    <Text fontSize="3xl" fontWeight="400" color="gray.600" mb={4}>{item}</Text>
                  );
                })}
              </Flex>
              <Image src={props.img} alt={props.title} w="30%" borderRadius="xl" boxShadow="xl" _hover={{ transform: "Scale(1.8)", boxShadow: "2xl"}} transition="all ease-out 0.2s"/>
            </Flex>
            {props.children}
          </Box>
    );
}
export default HomeCard;