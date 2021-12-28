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
    Collapse,
    IconButton,
    Spacer
} from '@chakra-ui/react';
import {
    FaRegEdit,
    FaAngleRight,
    FaRegHandPointDown,
    FaRegHandPointUp,
    FaRegMeh,
    FaPlusSquare
} from 'react-icons/fa';
import CourseTableContainer from './CourseTableContainer';
import { fetchCourseTableCoursesByIds } from '../actions/index';
import { useDispatch } from 'react-redux';

function SideCourseTableContainer(props) {
  const dispatch = useDispatch();
    const [mountedCourseTable, setMountedCourseTable] = useState([]);
    const [courseTableName, setCourseTableName] = useState("我的課表");
    // arr of course ids
    const [courseIds, setCourseIds] = useState(["1101_74030", "1101_27674", "1101_30859", "1101_75633"]);
    // dictionary of Course objects using courseId as key
    const [courses, setCourses] = useState({});
    // coursesTime is a dictionary of courseIds and their corresponding time in time table
    const [courseTimes, setCourseTimes] = useState({});
    const [loading, setLoading] = useState(false);

    // will set courseTimes in this function
    const extract_course_info = (courses) => {
        let course_time_tmp = Object.assign({}, courseTimes);
        if (!course_time_tmp.parsed){
          course_time_tmp.parsed = [];
        }
        if (!course_time_tmp.time_map){
          course_time_tmp.time_map = {};
        }
        Object.keys(courses).forEach(key => {
          if (course_time_tmp.parsed.includes(courses[key]._id)){
            return;
          }
          courses[key].time_loc_pair.map(time_loc_pair => {
            Object.keys(time_loc_pair.time).forEach(day => {
              time_loc_pair.time[day].map(time => {
                if (!(day in course_time_tmp.time_map)) {
                  course_time_tmp.time_map[day] = {};
                }
                if (! (time in course_time_tmp.time_map[day])){
                  course_time_tmp.time_map[day][time] = [courses[key]._id];
                }else{
                  course_time_tmp.time_map[day][time].push(courses[key]._id);
                }
              })
            })
          })
          course_time_tmp.parsed.push(courses[key]._id);
        })
        setCourseTimes(course_time_tmp);
        //console.log('Course Times: ',course_time_tmp);
    };

    const convertArrayToObject = (array, key) => {
        const initialValue = {};
        return array.reduce((obj, item) => {
            return {
            ...obj,
            [item[key]]: item,
            };
        }, initialValue);
    };

    // fetch data from server based on courseIds(arr of ids)
    // execute when every reload
    useEffect(() => {
      const fetchData = async (_callback) =>{
        setLoading(true);
        const courseResult = await dispatch(fetchCourseTableCoursesByIds(courseIds));
        // set courseTimes
        extract_course_info(convertArrayToObject(courseResult, "_id"));
        // set courses
        setCourses(convertArrayToObject(courseResult, "_id"));
        _callback();
      };
      fetchData(() => setLoading(false));
      // console.log(courseTimes);
    }, []);
    
    // debugger
    useEffect(() => console.log('courseTimes: ',courseTimes), [courseTimes]);
    useEffect(() => console.log('courses: ',courses), [courses]);
    useEffect(() => console.log('courseIds: ',courseIds), [courseIds]);

    const { onOpen, onClose, isOpen } = useDisclosure()
    const firstFieldRef = useRef(null)
    const TextInput = forwardRef((props, ref) => {
        return (
          <FormControl>
            <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
            <Input ref={ref} id={props.id} {...props} />
          </FormControl>
        )
      })
    const Form = ({ firstFieldRef, onClose, onSet }) => {
        const handleSave = () => {
          onClose();
          setCourseTableName(firstFieldRef.current.value);
        }
        return (
            <Stack spacing={4}>
            <TextInput
                label='課表名稱'
                id='table_name'
                ref={firstFieldRef}
                defaultValue={courseTableName}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSave();
                    }
                }}
            />
            <ButtonGroup d='flex' justifyContent='flex-end'>
                <Button variant='outline' onClick={onClose}>
                Cancel
                </Button>
                <Button colorScheme='teal' onClick={() => {handleSave()}}>
                Save
                </Button>
            </ButtonGroup>
            </Stack>
        )
    }
    const renderEditName = () => {
        return(
            <Popover isOpen={isOpen} initialFocusRef={firstFieldRef} onOpen={onOpen} onClose={onClose}>
                <PopoverTrigger>
                    <Button size="sm" variant="solid" colorScheme="gray" p="2"><FaRegEdit size={22}/></Button>
                </PopoverTrigger>
                <PopoverContent >
                    <FocusLock returnFocus persistentFocus={false}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader color="gray.500" fontWeight="700">課表設定</PopoverHeader>
                        <PopoverBody p={5}>
                            <Form firstFieldRef={firstFieldRef} onClose={onClose} />
                        </PopoverBody>
                    </FocusLock>
                </PopoverContent>
            </Popover>
        );
    };
    const renderSideCourseTableContent = () => {
      if(mountedCourseTable.length === 0){
        return(
          <Flex flexDirection="column" justifyContent="center" alignItems="center" h="100%" w="100%">
            <Flex flexDirection="row" justifyContent="center" alignItems="center">
              <FaRegHandPointUp size="3vh" style={{color:"gray"}}/>
              <FaRegMeh size="3vh" style={{color:"gray"}}/>
              <FaRegHandPointDown size="3vh" style={{color:"gray"}}/>
            </Flex>
            <Text fontSize="2xl" fontWeight="bold" color="gray">尚無課表</Text>
            {
              // TODO: add button on click action to add a new course table
            }
            <Button colorScheme="teal" leftIcon={<FaPlusSquare />}>新增課表</Button>
          </Flex>
        );
      }
      return(
        <Box overflow="auto">
          <Flex flexDirection="column" m="4" ml="0">
            <Flex flexDirection="row" justifyContent="space-between" alignItems="center" mb="4" position="fixed" zIndex={100}>
                <Text fontWeight="700" fontSize="3xl" color="gray.600" mr="4">{courseTableName}</Text>
                {renderEditName()}
            </Flex>
            <Flex flexDirection="row" justifyContent="center" alignItems="center" my="5vh" >
              <CourseTableContainer courseTimes={courseTimes} courses={courses} loading={loading}/>  
            </Flex>
          </Flex>
        </Box>
      );
    };
    return(
      <Flex h="100%">
        <Flex justifyContent="center" alignItems="center">
          <IconButton h="100%" icon={<FaAngleRight size={24}/>} onClick={()=>{props.setIsOpen(!props.isOpen)}} size="sm" variant="ghost"/>
        </Flex>
        {renderSideCourseTableContent()}
      </Flex>
    );
}

export default SideCourseTableContainer;