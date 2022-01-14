import { React } from 'react';
import CourseInfoRow from '../components/CourseInfoRow';
import {
    Box,
    Flex,
    Spacer,
    Accordion,
    useMediaQuery
  } from '@chakra-ui/react';
import {useSelector} from 'react-redux';

function CourseInfoRowContainer(props) {
    const userInfo = useSelector(state => state.user);
    const [isMobile] = useMediaQuery('(max-width: 760px)');
    const hide_scroll_bar = {
        '::-webkit-scrollbar': {
            display: "none"
        },
    }

    const renderCourseInfoRow = () => {
        return(
            props.courseInfo.map((info, index) => {
                return(
                    <Accordion allowToggle w={isMobile? "90vw":""} key={index} onMouseEnter={() => props.setHoveredCourse(info)} onMouseLeave={() => {props.setHoveredCourse(null)}}>
                        <CourseInfoRow id={info["id"]} index={index} courseInfo={info} selected={props.selectedCourses.includes(info._id)} setHoveredCourse={props.setHoveredCourse} displayTags={props.displayTags} displayTable={props.displayTable} isfavorite={userInfo===null?false:userInfo.db.favorites.includes(info._id)}/>
                        <Spacer my={isMobile? "2":"1"} />
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