import { React, useEffect,useState } from 'react';
import {arrayMoveImmutable as arrayMove} from 'array-move';
import "./CourseTableCard.css";
import {
    Flex,
    Text,
    Button,
    useDisclosure,
    Tooltip,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    Badge,
    PopoverFooter,
    Spacer,
    IconButton,
    Tag,
    TagLeftIcon,
    ScaleFade,
    useToast
} from '@chakra-ui/react';
import { hash_to_color_hex } from '../utils/colorAgent';
import {sortableContainer, sortableElement, sortableHandle} from 'react-sortable-hoc';
import { FaBars, FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa';
import {RenderNolContentBtn} from '../containers/CourseDrawerContainer';
import {useSelector, useDispatch} from 'react-redux';
import {patchCourseTable} from '../actions';



function CourseTableCard(props){
    const dispatch = useDispatch();
    const course_table = useSelector(state => state.course_table);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();

    // initial state or sorting result
    const [ courseOrder, setCourseOrder ] = useState(props.courseTime);
    // temp state (buffer), used for decide the NEW course order / dispatch to server, when press "save"
    const [ courseList, setCourseList ] = useState([]);
    const [ prepareToRemoveCourseId, setPrepareToRemoveCourseId ] = useState([]);
    
    const handleDelete = (courseId) => {
        if (prepareToRemoveCourseId.includes(courseId)){
            // If the course is in the prepareToRemoveCourseId, remove it from the list.
            setPrepareToRemoveCourseId(prepareToRemoveCourseId.filter(id => id!==courseId));
        }else{
            // If the course is not in the prepareToRemoveCourseId, add it to the list.
            setPrepareToRemoveCourseId([...prepareToRemoveCourseId, courseId])
        }
    };

    const isEdited = () => {
        // return true if the popup data is different from the original data.
        return !(courseOrder.every((course, index) => course===courseList[index])) || prepareToRemoveCourseId.length > 0;
    }

    const DragHandle = sortableHandle(() => <FaBars />);
    const SortableElement = sortableElement(({key, course}) => (
      <Flex className="sortableHelper" alignItems="center" my="1" key={"Sortable_"+key+"_Flex"}>
        <DragHandle key={"Sortable_"+key+"_DragHandle"}/>
        <Badge ml="4" mr="1" variant="solid" bg={hash_to_color_hex(course._id, 0.9)} color="gray.600" key={"Sortable_"+key+"_Badge"}>{course.id}</Badge>
        <Text as={prepareToRemoveCourseId.includes(course._id) ? "del":""}fontSize="lg" color={prepareToRemoveCourseId.includes(course._id) ? "red.700":"gray.500"} mx="1" fontWeight="700" isTruncated key={"Sortable_"+key+"_Text"}>{course.course_name}</Text>
            {RenderNolContentBtn(course, "", key)}
        <Spacer key={"Sortable_"+key+"_Spacer"}/>
        <IconButton aria-label='Delete' variant={prepareToRemoveCourseId.includes(course._id) ? "solid":"outline"} icon={<FaTrashAlt />} size="sm" colorScheme="red" key={"Sortable_"+key+"_IconButton"} onClick={() => {handleDelete(course._id)}}/>
      </Flex>
    ));
    const SortableContainer = sortableContainer(({children}) => {
      return <Flex flexDirection="column">{children}</Flex>;
    });
    const onSortEnd = ({oldIndex, newIndex}) => {
        setCourseList(arrayMove(courseList, oldIndex, newIndex));
    };

    // when open Popover, overwrite the courseList by courseOrder
    // when click save, overwrite the courseOrder by courseList
    const renderPopoverBody = (courseData) => {
        return(
            <SortableContainer useDragHandle onSortEnd={onSortEnd} lockAxis="y">
                {courseList.map((courseId, index) => {
                    let course = courseData[courseId];
                    return(
                        <SortableElement key={courseId} index={index} course={course} helperClass="sortableHelper"/>
                    );
                })}
            </SortableContainer>
        );
    };
    
    const renderCourseBox = (courseId, courseData) => {
        const course = courseData[courseId];
        // console.log(courseId);
        if(course){
            return (
            <>
                <Tooltip label={course.course_name} placement="top" hasArrow >
                    <Button  
                            bg={hash_to_color_hex(course._id, isOpen ? 0.7:0.8)} 
                            borderRadius="md" boxShadow="lg" 
                            mb="1" p="2" w="4vw" h="3vh"
                            border={props.hoverId === courseId  ? "2px":""}
                            borderColor={hash_to_color_hex(course._id, 0.5)}>
                        <Text fontSize="xs" isTruncated> {course.course_name} </Text>
                    </Button>
                </Tooltip>
            </>
            );
        }
    };

    // fetch original order from courseOrder (ids_array), return the indices need to reorder
    const fetchIndexByIds = (ids_array) => {
        const index_arr = [];
        ids_array.forEach(id => {
            index_arr.push(course_table.courses.indexOf(id));
        })
        return index_arr
    }

    const saveChanges = async () => {
        // get indice need to reorder from courseOrder
        let index_arr = fetchIndexByIds(courseOrder);
        // do reorder, generate new course_table.courses to be patched
        const new_courses = [...course_table.courses];
        for (let i=0;i<courseList.length;i++){
            let target_index = index_arr[i];
            let target_id = courseList[i];
            if (!prepareToRemoveCourseId.includes(target_id)){
                new_courses[target_index] = target_id;
            } else {
                // deleted
                new_courses[target_index] = "";
            }
        }
        let res_table;
        try {
            res_table = await dispatch(patchCourseTable(course_table._id, course_table.name, course_table.user_id, course_table.expire_ts, new_courses));
        } catch (error) {
            toast({
                title: "更改志願序失敗!",
                description: "請檢查網路連線，或聯絡系統管理員。",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            return;
        }
        if (res_table){
            // patch success
            toast({
                title: `Saved!`,
                description: `更改志願序成功`,
                status: 'success',
                duration: 3000,
                isClosable: true
            });
        } else {
            // patch failed, because expired
            toast({
                title: `課表已過期!`,
                description: `更改志願序失敗`,
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        }
        leavePopover();
    };

    const leavePopover = () => {
        onClose(); 
        // set buffer states to initial state
        setPrepareToRemoveCourseId([]);
        setCourseList([]);
    }

    // set state and force re-render
    useEffect(()=>{
        setCourseOrder(props.courseTime)
    },[props])

    // debugger
    // useEffect(()=>{console.log('CourseTableCard--courseOrder: ', courseOrder);},[courseOrder])
    // useEffect(()=>{console.log('CourseTableCard--courseList: ', courseList);},[courseList])
    // useEffect(()=>{console.log('CourseTableCard--prepareToRemoveCourseId: ', prepareToRemoveCourseId);},[prepareToRemoveCourseId])

    if(props.isHover){
        const course = props.courseData;
        return(
            <Button borderRadius="lg" boxShadow="lg" p="2" w="4vw" h="3vh" mb="1" border="2px" borderColor={hash_to_color_hex(course._id, 0.7)} borderStyle="dashed">
                <Text fontSize="xs" isTruncated> {course.course_name} </Text>
            </Button>
        );
    }

    return(
    <>
        <Popover onOpen={onOpen} onClose={()=>{leavePopover()}} isOpen={isOpen} closeOnBlur={false} placement="left">
            <PopoverTrigger>
                <Flex w="4vw" justifyContent="center" alignItems="center" flexDirection="column" onClick={()=>{setCourseList(courseOrder); setPrepareToRemoveCourseId([]);}}>
                    {courseOrder.map(courseId => {
                        return renderCourseBox(courseId, props.courseData);
                    })}
                </Flex>
            </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>
                        <Flex flexDirection="row" alignItems="center" justifyContent="start" mb="2">
                            節次資訊
                            <Badge ml="2" size="sm">週{props.day}</Badge>
                            <Badge ml="2" size="sm">第{props.interval}節</Badge>
                        </Flex>
                    </PopoverHeader>
                    <PopoverBody>
                    <Flex flexDirection="column" justifyContent="center">
                        {renderPopoverBody(props.courseData)}
                    </Flex>
                    </PopoverBody>
                    <PopoverFooter>
                        <Flex justifyContent="end" alignItems="center">
                            <ScaleFade initialScale={0.9} in={isEdited()}>
                                <Tag colorScheme="yellow" variant="solid" >
                                    <TagLeftIcon boxSize='12px' as={FaExclamationTriangle} />
                                    變更未儲存
                                </Tag>
                            </ScaleFade>
                            <Spacer />
                            <Button colorScheme='gray' variant="ghost" onClick={() => {
                                leavePopover();
                            }}>取消</Button>
                            <Button colorScheme='teal' onClick={() => {
                                saveChanges();
                            }} disabled={!isEdited()}>儲存</Button>
                        </Flex>
                    </PopoverFooter>
                </PopoverContent>
        </Popover>
    </>
    );
}
export default CourseTableCard;