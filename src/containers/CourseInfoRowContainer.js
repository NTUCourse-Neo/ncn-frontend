import { React } from 'react';
import CourseInfoRow from '../components/CourseInfoRow';
import {
    Box,
    Flex,
    Spacer,
    Accordion
  } from '@chakra-ui/react';
function CourseInfoRowContainer(props) {
    const hide_scroll_bar = {
        '::-webkit-scrollbar': {
            display: "none"
        },
    }

    const renderCourseInfoRow = () => {
        return(
            props.courseInfo.map((info, index) => {
                if(props.selectedCourses.includes(info._id)){
                    return(
                        <Accordion allowToggle w="100%" key={index}>
                            <CourseInfoRow id={info["id"]} index={index} courseInfo={info} selected={true}/>
                            <Spacer my="1" />
                        </Accordion>
                    );
                }
                return(
                    <Accordion allowToggle w="100%" key={index} onMouseEnter={() => props.setHoveredCourse(info)} onMouseLeave={() => {props.setHoveredCourse(null)}}>
                        <CourseInfoRow id={info["id"]} index={index} courseInfo={info} selected={false}/>
                        <Spacer my="1" />
                    </Accordion>
                );
            }
        ));
    }
    return (
        <Box>
            <Flex direction="column">
                {renderCourseInfoRow()}
            </Flex>   
        </Box>
    );
}
export default CourseInfoRowContainer;