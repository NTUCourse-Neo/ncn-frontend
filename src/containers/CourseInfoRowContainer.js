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
                return(
                    <Accordion allowToggle w="100%" minW="50rem" key={index}>
                        <CourseInfoRow id={info["id"]} index={index} courseInfo={info}/>
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