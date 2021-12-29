// Props
// | courseInfo: Obj
//
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
    Tooltip,
    useToast
  } from '@chakra-ui/react';
import {CourseDrawerContainer} from '../containers/CourseDrawerContainer';
import { FaUserPlus, FaPuzzlePiece, FaPlus} from 'react-icons/fa';
import { info_view_map } from '../data/mapping_table';
import {useDispatch} from 'react-redux';
import { fetchCourseTable, patchCourseTable } from '../actions';

const LOCAL_STORAGE_KEY = 'NTU_CourseNeo_Course_Table_Key';

function CourseInfoRow(props) {
    const dispatch = useDispatch();
    const toast = useToast();

    const addCourse = async (course)=>{
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
                return;
            } 
            else {
                // fetch course table success
                const new_courses = [...course_table.courses, course._id];
                const res_table = await dispatch(patchCourseTable(uuid, course_table.name, course_table.user_id, course_table.expire_ts, new_courses));
                if (res_table){
                    toast({
                        title: `已新增 ${course.course_name}`,
                        description: `新增至 ${course_table.name}`,
                        status: 'success',
                        duration: 3000,
                        isClosable: true
                    });
                }
                else {
                    toast({
                        title: `新增 ${course.course_name} 失敗`,
                        description: `您的課表已過期，請重新建立課表`,
                        status: 'error',
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
    };

    const renderDeptBadge = (course) => {
        if(course.department.length > 1){
            let dept_str = course.department.join(", ");
            return (
                <Tooltip hasArrow placement="top" label={dept_str} bg='gray.300' color='black'>
                    <Badge colorScheme="teal" variant='solid' mx="4px">多個系所</Badge>
                </Tooltip>
            );
        }
        return (
            <Badge colorScheme="blue" variant='solid' mx="4px">{props.courseInfo.department[0]}</Badge>
        );
    }

    // TODO: later will implement tags checklist for user to customize which tags to show
    const tags = ["required", "total_slot"];
    return(
        <AccordionItem bg="gray.100" borderRadius="md">
            <Flex alignItems="center" justifyContent="start" flexDirection="row" w="100%" pr="2" pl="2" py="1">
                <AccordionButton>
                    <Flex alignItems="center" justifyContent="start">
                        <Tooltip hasArrow placement="top" label='課程流水號' bg='gray.300' color='black'>
                            <Badge variant='outline' mr="4px">{props.courseInfo.id}</Badge>
                        </Tooltip>
                        {renderDeptBadge(props.courseInfo)}
                        <Heading as="h3" size="md" ml="10px" mr="5px" color="gray.600">{props.courseInfo.course_name}</Heading>
                        <Badge variant='outline' colorScheme="gray">{props.courseInfo.credit[0]}</Badge>
                        <Heading as="h3" size="sm" ml="20px" mr="5px" color="gray.500" fontWeight="500">{props.courseInfo.teacher}</Heading>
                    </Flex>
                    <Spacer />
                    <Flex alignItems="center" justifyContent="end">
                        {
                            tags.map((tag, index) => {
                                return(
                                    <Tag mx="2px" variant='subtle' colorScheme={info_view_map[tag].color} hidden={props.courseInfo[tag]===-1}>
                                        <TagLeftIcon boxSize='12px' as={info_view_map[tag].logo} />
                                        <TagLabel>{ "map" in info_view_map[tag] ? info_view_map[tag].map[props.courseInfo[tag]] : props.courseInfo[tag]}</TagLabel>
                                    </Tag>
                                );
                            })
                        }
                    </Flex>
                </AccordionButton>
                <IconButton ml="20px" colorScheme='blue' icon={<FaPlus />} onClick={() => addCourse(props.courseInfo)}/>
            </Flex>
            <AccordionPanel>
                <CourseDrawerContainer courseInfo={props.courseInfo}/>
            </AccordionPanel>
        </AccordionItem>
    );
}
export default CourseInfoRow;