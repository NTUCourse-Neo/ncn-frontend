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
import { hash_to_color_hex, random_color_hex } from '../utils/colorAgent';

function CourseTableCard(props){
    const renderCourseBox = (courseId, courseData) => {
        const course = courseData[courseId];
        return (
        <Tooltip label={course.course_name} placement="top" hasArrow >
            <Box bg={hash_to_color_hex(course._id, 0.8)} borderRadius="lg" boxShadow="lg" p="2" w="4vw" mb="1">
                <Text fontSize="2" isTruncated> {course.course_name} </Text>
            </Box>
        </Tooltip>
        );
    };
    console.log(props.courseTime);
    return(
        props.courseTime.map(courseId => {
            return renderCourseBox(courseId, props.courseData);
        })
    );
}
export default CourseTableCard;