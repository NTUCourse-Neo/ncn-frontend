import { React } from 'react';
import CourseInfoRow from '../components/CourseInfoRow';
import {
    Box,
    Flex,
    Spacer,
    Accordion
  } from '@chakra-ui/react';
function CourseInfoRowContainer(props) {
    const renderCourseInfoRow = () => {
        return(
            Object.keys(props.courseInfo).map((key, index) => {
                return(
                    <Accordion allowToggle w="50vw">
                        <CourseInfoRow index={key} courseInfo={props.courseInfo[key]}/>
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