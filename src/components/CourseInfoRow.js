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
    Collapse,
    useMediaQuery,
    IconButton
} from '@chakra-ui/react';
import {CourseDrawerContainer} from '../containers/CourseDrawerContainer';
import { FaPlus, FaHeart, FaRss, FaInfoCircle} from 'react-icons/fa';
import { info_view_map } from '../data/mapping_table';
import {useDispatch, useSelector} from 'react-redux';
import { fetchCourseTable, patchCourseTable, addFavoriteCourse } from '../actions';
import { hash_to_color_hex } from '../utils/colorAgent';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from "react-router-dom";

const LOCAL_STORAGE_KEY = 'NTU_CourseNeo_Course_Table_Key';

function CourseInfoRow(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector(state => state.user);

    const [addingCourse, setAddingCourse] = useState(false);
    const [addingFavoriteCourse, setAddingFavoriteCourse] = useState(false);
    
    const toast = useToast();
    const {user, isLoading, getAccessTokenSilently} = useAuth0();

    const [isMobile] = useMediaQuery('(max-width: 760px)');

    const handleButtonClick = async (course)=>{
        if (!isLoading){
            setAddingCourse(true);

            let uuid;
            if (user){
                // user mode
                if (userInfo.db.course_tables.length === 0){
                    uuid = null
                } else {
                    // use the first one
                    uuid = userInfo.db.course_tables[0];
                }
            }
            else {
                // guest mode
                uuid = localStorage.getItem(LOCAL_STORAGE_KEY);
            }

            if (uuid){
                // fetch course table from server
                let course_table;
                try {
                    course_table = await dispatch(fetchCourseTable(uuid));
                } catch (error) {
                    toast({
                        title: '取得課表資料失敗',
                        status: 'error',
                        duration: 3000,
                        isClosable: true
                    });
                    return;
                }
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
                        try {
                            res_table =  await dispatch(patchCourseTable(uuid, course_table.name, course_table.user_id, course_table.expire_ts, new_courses));
                        } catch (error) {
                            toast({
                                title: `刪除 ${course.course_name} 失敗`,
                                status: 'error',
                                duration: 3000,
                                isClosable: true
                            });
                            return;
                        }
                    }else{
                        // course is not in course table, add it.
                        operation_str = "新增";
                        const new_courses = [...course_table.courses, course._id];
                        try {
                            res_table = await dispatch(patchCourseTable(uuid, course_table.name, course_table.user_id, course_table.expire_ts, new_courses));
                        } catch (error) {
                            toast({
                                title: `新增 ${course.course_name} 失敗`,
                                status: 'error',
                                duration: 3000,
                                isClosable: true
                            });
                            return;
                        }
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
                    // ELSE TOAST?
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
        }
    };

    const handleAddFavorite = async (course_id) => {
        if (!isLoading){
            if (user){
                setAddingFavoriteCourse(true);
                const favorite_list = [...userInfo.db.favorites];
                let new_favorite_list;
                let op_name;
                if (favorite_list.includes(course_id)){
                    // remove course from favorite list
                    new_favorite_list = favorite_list.filter(id => id!==course_id);
                    op_name = "刪除";
                } else {
                    // add course to favorite list
                    new_favorite_list = [...favorite_list, course_id];
                    op_name = "新增";
                }
                // API call
                try {
                    const token = await getAccessTokenSilently();
                    await dispatch(addFavoriteCourse(token, new_favorite_list, userInfo.db._id));
                    toast({
                        title: `${op_name}最愛課程成功`,
                        //description: `請稍後再試`,
                        status: 'success',
                        duration: 3000,
                        isClosable: true
                    });
                    setAddingFavoriteCourse(false);
                } catch (e){
                    // toast error
                    toast({
                        title: `${op_name}最愛課程失敗`,
                        description: `請稍後再試`,
                        status: 'error',
                        duration: 3000,
                        isClosable: true
                    });
                    setAddingFavoriteCourse(false);
                }
            } else {
                toast({
                    title: `請先登入`,
                    // description: `請先登入`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true
                });
            }
        }
    }

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
    if (isMobile){
        return(
            <AccordionItem bg={props.selected? hash_to_color_hex(props.courseInfo._id, 0.95):"gray.100"} borderRadius="md" transition="all ease-in-out 500ms">
            <Flex alignItems="center" justifyContent="start" flexDirection="row" w="100%" pr="2" pl="2" py="1">
                <AccordionButton>
                    <Flex alignItems="start" justifyContent="start" flexDirection="column" flexWrap="wrap" css={{gap: "2px"}}>
                        <Flex alignItems="center" justifyContent="start" mb="2">
                            <Heading as="h3" size="sm" color="gray.600" mr="2">{props.courseInfo.course_name}</Heading>
                            <Heading as="h3" size="xs" ml="2px" color="gray.500" fontWeight="500">{props.courseInfo.teacher}</Heading>
                        </Flex>
                        <Flex alignItems="center" justifyContent="start" mb="2">
                            {renderDeptBadge(props.courseInfo)}
                            <Tooltip hasArrow placement="top" label='課程流水號' bg='gray.600' color='white'>
                                <Badge variant='outline' mr="4px">{props.courseInfo.id}</Badge>
                            </Tooltip>
                            <Tooltip hasArrow placement="top" label={props.courseInfo.credit+' 學分'} bg='gray.600' color='white'>
                                <Badge variant='outline'>{props.courseInfo.credit}</Badge>
                            </Tooltip>
                        </Flex>
                        <Tooltip hasArrow placement="top" label={props.courseInfo.time_loc} bg='gray.600' color='white'>
                            <Badge variant='outline' size="lg" maxW="60vw" isTruncated>{props.courseInfo.time_loc}</Badge>
                        </Tooltip>
                        <Flex maxW="100%" alignItems="center" justifyContent="start" mt="4" flexWrap="wrap" css={{gap: "2px"}}>
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
                                            <Tag variant='subtle' colorScheme={info_view_map[tag].color} hidden={props.courseInfo[tag]===-1}>
                                                <TagLeftIcon boxSize='12px' as={info_view_map[tag].logo} />
                                                <TagLabel>{ "map" in info_view_map[tag] ? info_view_map[tag].map[props.courseInfo[tag]] : props.courseInfo[tag]}</TagLabel>
                                            </Tag>
                                        </Tooltip>
                                    );
                                })
                            }
                        </Flex>
                    </Flex>
                    <Spacer />
                </AccordionButton>
                <Flex alignItems="center" justifyContent="end" flexDirection={isMobile? "column":"row"}>
                    <IconButton size="sm" colorScheme="blue" icon={<FaInfoCircle />} variant="ghost" onClick={() => {navigate(`/courseinfo/${props.courseInfo._id}`);}}/>
                    <Button size="sm" variant={props.isfavorite? "solid":"outline"} colorScheme={"red"} onClick={() => handleAddFavorite(props.courseInfo._id)} isLoading={addingFavoriteCourse}>
                        <Box>
                            <FaHeart/>
                        </Box>
                    </Button>
                    <Button size="sm" colorScheme={props.selected? "red":"blue"} onClick={() => handleButtonClick(props.courseInfo)} isLoading={addingCourse}>
                        <Box transform={props.selected ? "rotate(45deg)":""} transition="all ease-in-out 200ms">
                            <FaPlus />
                        </Box>
                    </Button>
                </Flex>
            </Flex>
            <AccordionPanel>
                <CourseDrawerContainer courseInfo={props.courseInfo}/>
            </AccordionPanel>
        </AccordionItem>
        );
    }

    return(
        <AccordionItem bg={props.selected? hash_to_color_hex(props.courseInfo._id, 0.95):"gray.100"} borderRadius="md" transition="all ease-in-out 500ms">
            <Flex alignItems="center" justifyContent="start" flexDirection="row" w="100%" pr="2" pl="2" py="1">
                <AccordionButton>
                    <Flex alignItems="center" justifyContent="start" flexWrap="wrap" css={{gap: "8px"}}>
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
                <Flex alignItems="center" justifyContent="end" flexDirection={isMobile? "column":"row"}>
                    <Button size="sm" colorScheme="blue" leftIcon={<FaInfoCircle />} variant="ghost" onClick={() => {navigate(`/courseinfo/${props.courseInfo._id}`);}}>詳細</Button>
                    <Button size="sm" ml="20px" variant={props.isfavorite? "solid":"outline"} colorScheme={"red"} onClick={() => handleAddFavorite(props.courseInfo._id)} isLoading={addingFavoriteCourse}>
                        <Box>
                            <FaHeart/>
                        </Box>
                    </Button>
                    <Button size="sm" ml="20px" colorScheme={props.selected? "red":"blue"} onClick={() => handleButtonClick(props.courseInfo)} isLoading={addingCourse}>
                        <Box transform={props.selected ? "rotate(45deg)":""} transition="all ease-in-out 200ms">
                            <FaPlus />
                        </Box>
                    </Button>
                </Flex>
            </Flex>
            <AccordionPanel>
                <CourseDrawerContainer courseInfo={props.courseInfo}/>
            </AccordionPanel>
        </AccordionItem>
    );
}
export default CourseInfoRow;