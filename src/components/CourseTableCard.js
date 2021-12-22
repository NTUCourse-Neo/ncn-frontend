import { React, useRef, forwardRef, useEffect,useState } from 'react';
import  FocusLock from "react-focus-lock"
import {
    Flex,
    Text,
    Box,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    Stack,
    ButtonGroup,
    FormControl,
    FormLabel,
    Input,
    useDisclosure,
    Tooltip
} from '@chakra-ui/react';
import {
    FaRegEdit,
} from 'react-icons/fa';
function CourseTableCard(props){
    return(
        <Tooltip label={props.course.course_name} placement="top" hasArrow >
            <Box bg="blue.100" borderRadius="lg" boxShadow="lg" p="2" w="4vw">
                <Text fontSize="2" isTruncated> {props.course.course_name} </Text>
            </Box>
        </Tooltip>
    );
}
export default CourseTableCard;