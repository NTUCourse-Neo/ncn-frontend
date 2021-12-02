import { React } from 'react';
import {
    Box,
    Flex,
    Heading,
    Badge,
    Spacer,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Tag,
    TagLeftIcon,
    TagLabel,
    IconButton,
  } from '@chakra-ui/react';
function CourseDrawerContainer(props) {
    const renderDataElement = (fieldName, data) => {
        if (data === "") {
            return (<></>);
        }
        return(
            <Flex flexDirection="row" alignItems="center" justifyContent="start" mx="8px">
                <Badge variant='solid' colorScheme="gray" >{fieldName}</Badge>
                <Heading as="h3" color="gray.600" fontSize="sm" ml="4px">{data}</Heading>
            </Flex>
        );
    };
    return(
        <Flex flexDirection="column" width="100%" alignItems="start" justifyContent="space-between">
            <Flex flexDirection="row" alignItems="center" justifyContent="start">
                {renderDataElement("課程識別碼", props.courseInfo.course_id)}
                {renderDataElement("課號", props.courseInfo.course_code)}
                {renderDataElement("班次", props.courseInfo.class_id)}
            </Flex>
            <Flex m="8px" w="100%" flexDirection="row" alignItems="center" justifyContent="start" borderRadius="sm" border="2px" borderColor="gray.200">
                <Flex flexDirection="column" alignItems="start" justifyContent="start">
                <Heading as="h3" color="gray.600" fontSize="lg" ml="4px">修課限制</Heading>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default CourseDrawerContainer;