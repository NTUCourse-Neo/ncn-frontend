// Props
// | courseInfo: Obj
//
import { React, useState } from 'react';
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
    Button,
    Tooltip,
    useToast,
    Collapse
} from '@chakra-ui/react';
import {CourseDrawerContainer} from '../containers/CourseDrawerContainer';
import { FaUserPlus, FaPuzzlePiece, FaPlus} from 'react-icons/fa';
import { info_view_map } from '../data/mapping_table';
import {useDispatch} from 'react-redux';
import { fetchCourseTable, patchCourseTable } from '../actions';
import { hash_to_color_hex } from '../utils/colorAgent';

const LOCAL_STORAGE_KEY = 'NTU_CourseNeo_Course_Table_Key';

function CourseInfoRow(props) {
    const [addingCourse, setAddingCourse] = useState(false);
    const dispatch = useDispatch();
    const toast = useToast();

    const handleButtonClick = async (course)=>{
        setAddingCourse(true);
        // console.log('course: ', course);
        const uuid = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (uuid){
            // fetch course table from server
            const course_table = await dispatch(fetchCourseTable(uuid));
            if (course_table===null){
                // get course_tables/:id return null (expired)
                // show error and break the function
                toast({
                    title: `新增 ${course.course_name} 失敗`,
                    description: `您的課表已過期，請重新建立課表`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true
                });
            } 
            else {
                // fetch course table success
                let res_table;
                let operation_str;
                if(course_table.courses.includes(course._id)){
                    // course is already in course table, remove it.
                    operation_str = "刪除";
                    const new_courses = course_table.courses.filter(id => id!==course._id);
                    res_table =  await dispatch(patchCourseTable(uuid, course_table.name, course_table.user_id, course_table.expire_ts, new_courses));
                }else{
                    // course is not in course table, add it.
                    operation_str = "新增";
                    const new_courses = [...course_table.courses, course._id];
                    res_table = await dispatch(patchCourseTable(uuid, course_table.name, course_table.user_id, course_table.expire_ts, new_courses));
                }
                if (res_table){
                    toast({
                        title: `已${operation_str} ${course.course_name}`,
                        description: `課表: ${course_table.name}`,
                        status: 'success',
                        duration: 3000,
                        isClosable: true
                    });
                }
            }    
        } else {
            // do not have course table id in local storage
            toast({
                title: `新增 ${course.course_name} 失敗`,
                description: `尚未建立課表`,
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        }
        setAddingCourse(false);
    };

    const renderDeptBadge = (course) => {
        if(!course.department || course.department.length === 0 || (course.department.length === 1  && course.department[0].length === 0)){
            return <></>;
        }
        if(course.department.length > 1){
            let dept_str = course.department.join(", ");
            return (
                <Tooltip hasArrow placement="top" label={dept_str} bg='gray.600' color='white'>
                    <Badge colorScheme="teal" variant='solid' mr="4px">多個系所</Badge>
                </Tooltip>
            );
        }
        return (
            <Badge colorScheme="blue" variant='solid' mr="4px">{props.courseInfo.department[0]}</Badge>
        );
    }

    return(
        <AccordionItem bg={props.selected? hash_to_color_hex(props.courseInfo._id, 0.95):"gray.100"} borderRadius="md" transition="all ease-in-out 500ms">
            <Flex alignItems="center" justifyContent="start" flexDirection="row" w="100%" pr="2" pl="2" py="1">
                <AccordionButton>
                    <Flex alignItems="center" justifyContent="start">
                        <Flex w="8vw" alignItems="center" justifyContent="start">
                            <Tooltip hasArrow placement="top" label='課程流水號' bg='gray.600' color='white'>
                                <Badge variant='outline' mr="4px">{props.courseInfo.id}</Badge>
                            </Tooltip>
                            {renderDeptBadge(props.courseInfo)}
                        </Flex>
                        <Heading as="h3" size="md" ml="10px" mr="8px" color="gray.600">{props.courseInfo.course_name}</Heading>
                        <Tooltip hasArrow placement="top" label={props.courseInfo.credit+' 學分'} bg='gray.600' color='white'>
                            <Badge variant='outline' mr="4">{props.courseInfo.credit}</Badge>
                        </Tooltip>
                        <Heading as="h3" size="sm" ml="20px" mr="5px" color="gray.500" fontWeight="500">{props.courseInfo.teacher}</Heading>
                        <Collapse in={!props.displayTable}>
                            <Tooltip hasArrow placement="top" label={props.courseInfo.time_loc} bg='gray.600' color='white'>
                                <Badge variant='outline' ml="8" size="lg" maxW="10vw" isTruncated>{props.courseInfo.time_loc}</Badge>
                            </Tooltip>
                        </Collapse>
                    </Flex>
                    <Spacer />
                    <Flex alignItems="center" justifyContent="end">
                        {
                            props.displayTags.map((tag, index) => {
                                if (tag === "area"){
                                    let display_str = "";
                                    let tooltip_str = "";
                                    if (props.courseInfo.area.length === 0){
                                        display_str = "無";
                                        tooltip_str = info_view_map[tag].name +": 無";
                                    }else if(props.courseInfo.area.length > 1){
                                        display_str = "多個領域";
                                        tooltip_str = props.courseInfo.area.map(area => info_view_map[tag].map[area].full_name).join(", ");
                                    }else if (props.courseInfo[tag][0] === "g"){
                                        display_str = "通識 "+ info_view_map[tag].map[props.courseInfo[tag][0]].code;
                                        tooltip_str = info_view_map[tag].name +": "+info_view_map[tag].map[props.courseInfo[tag][0]].full_name;
                                    }else{
                                        display_str = info_view_map[tag].map[props.courseInfo[tag][0]].full_name;
                                        tooltip_str = info_view_map[tag].name +":"+info_view_map[tag].map[props.courseInfo[tag][0]].full_name;
                                    }
                                    return(
                                        <Tooltip hasArrow placement="top" label={tooltip_str} bg='gray.600' color='white'>
                                            <Tag mx="2px" variant='subtle' colorScheme={info_view_map[tag].color} hidden={props.courseInfo[tag]===-1}>
                                                <TagLeftIcon boxSize='12px' as={info_view_map[tag].logo} />
                                                <TagLabel>{ display_str }</TagLabel>
                                            </Tag>
                                         </Tooltip>
                                    );
                                }
                                return(
                                    <Tooltip hasArrow placement="top" label={info_view_map[tag].name} bg='gray.600' color='white'>
                                        <Tag mx="2px" variant='subtle' colorScheme={info_view_map[tag].color} hidden={props.courseInfo[tag]===-1}>
                                            <TagLeftIcon boxSize='12px' as={info_view_map[tag].logo} />
                                            <TagLabel>{ "map" in info_view_map[tag] ? info_view_map[tag].map[props.courseInfo[tag]] : props.courseInfo[tag]}</TagLabel>
                                        </Tag>
                                    </Tooltip>
                                );
                            })
                        }
                    </Flex>
                </AccordionButton>
                <Button size="sm" ml="20px" colorScheme={props.selected? "red":"blue"} onClick={() => handleButtonClick(props.courseInfo)} isLoading={addingCourse}>
                    <Box transform={props.selected ? "rotate(45deg)":""} transition="all ease-in-out 200ms">
                        <FaPlus />
                    </Box>
                </Button>
            </Flex>
            <AccordionPanel>
                <CourseDrawerContainer courseInfo={props.courseInfo}/>
            </AccordionPanel>
        </AccordionItem>
    );
}
export default CourseInfoRow;