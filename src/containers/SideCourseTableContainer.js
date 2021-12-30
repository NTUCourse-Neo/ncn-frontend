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
    Spacer,
    useToast
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
import { fetchCourseTableCoursesByIds, createCourseTable, fetchCourseTable } from '../actions/index';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
// TODO: add auth0 function, get user info first and load course_table_id from user instead of localStorage
import { useAuth0 } from "@auth0/auth0-react";
import LoadingOverlay from 'react-loading-overlay';

const LOCAL_STORAGE_KEY = 'NTU_CourseNeo_Course_Table_Key';

function SideCourseTableContainer(props) {
    const toast = useToast();
    const dispatch = useDispatch();
    const courseTable = useSelector(state => state.course_table);

    // some local states for handling course data
    const courseIds = props.courseIds;
    const setCourseIds = props.setCourseIds;
    const [courses, setCourses] = useState({}); // dictionary of Course objects using courseId as key
    const [courseTimes, setCourseTimes] = useState({}); // coursesTime is a dictionary of courseIds and their corresponding time in time table
    const [hoveredCourseTime, setHoveredCourseTime]  = useState({}); // courseTime is a dictionary of courseIds and their corresponding time in time table

    const [loading, setLoading] = useState(false);
    const [courseTableName, setCourseTableName] = useState("我的課表");
    const [expired, setExpired] = useState(false);

    const parseCourseDateTime = (course, course_time_tmp) => {
      course.time_loc_pair.map(time_loc_pair => {
        Object.keys(time_loc_pair.time).forEach(day => {
          time_loc_pair.time[day].map(time => {
            if (!(day in course_time_tmp.time_map)) {
              course_time_tmp.time_map[day] = {};
            }
            if (! (time in course_time_tmp.time_map[day])){
              course_time_tmp.time_map[day][time] = [course._id];
            }else{
              course_time_tmp.time_map[day][time].push(course._id);
            }
          })
        })
      })
    };

    // will set courseTimes in this function
    const extract_course_info = (courses) => {
        let course_time_tmp = {}
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
          parseCourseDateTime(courses[key], course_time_tmp);
          course_time_tmp.parsed.push(courses[key]._id);
        })
        // console.log(course_time_tmp);
        return course_time_tmp;
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

    // trigger when mounting, fetch local storage course_id
    useEffect(()=>{
      const courseTableInit = async (uuid)=>{
        const course_table = await dispatch(fetchCourseTable(uuid));
        // console.log("FETCH_COURSE_TABLE_SUCCESS: ",course_table);
        if (course_table===null){
          setExpired(true);
        }
      };

      const uuid = localStorage.getItem(LOCAL_STORAGE_KEY);
      // console.log("UUID in localStorage now: ",uuid);
      if (uuid){
        courseTableInit(uuid);
      }
    },[])

    // fetch course objects data from server based on array of IDs
    useEffect(() => {
      const fetchCoursesDataById = async (_callback) =>{
        setLoading(true);
        if (courseTable){
          // console.log("course_table: ",courseTable);
          const courseResult = await dispatch(fetchCourseTableCoursesByIds(courseTable.courses));
          // set states: coursesIds, courseTimes, courses
          setCourseIds(courseTable.courses);
          setCourseTimes(extract_course_info(convertArrayToObject(courseResult, "_id")));
          setCourses(convertArrayToObject(courseResult, "_id"));
        } 
        _callback();
      }
      
      fetchCoursesDataById(() => setLoading(false));
    }, [courseTable]);

    useEffect(() => {
      if (props.hoveredCourse){
        let tmp = {
          time_map:{},
          parsed:[],
          course_data:props.hoveredCourse
        }
        parseCourseDateTime(props.hoveredCourse, tmp);
        setHoveredCourseTime(tmp);
      }else{
        setHoveredCourseTime(null);
      }
    } , [props.hoveredCourse]);
    
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
      if(courseTable===null){
        return(
          <Flex flexDirection="column" justifyContent="center" alignItems="center" h="100%" w="100%">
            <Flex flexDirection="row" justifyContent="center" alignItems="center">
              <FaRegHandPointUp size="3vh" style={{color:"gray"}}/>
              <FaRegMeh size="3vh" style={{color:"gray"}}/>
              <FaRegHandPointDown size="3vh" style={{color:"gray"}}/>
            </Flex>
            <Text fontSize="2xl" fontWeight="bold" color="gray">{expired?"您的課表已過期":"尚無課表"}</Text>
            <Button colorScheme="teal" leftIcon={<FaPlusSquare />} onClick={ async()=>{
                // generate a new uuid and store into local storage
                let new_uuid = uuidv4();
                console.log("New UUID is generated: ",new_uuid);

                // TODO: finish catch error
                try {
                  const new_course_table = await dispatch(createCourseTable(new_uuid, "我的課表", null, "1101"));
                  localStorage.setItem(LOCAL_STORAGE_KEY, new_course_table._id);
                } catch (error) {
                    toast({
                      title: `新增課表失敗`,
                      description: `請聯繫客服(?)`,
                      status: 'error',
                      duration: 3000,
                      isClosable: true
                  });
                }
              }
            }>新增課表</Button>
          </Flex>
        );
      }
      return(
        <Box overflow="auto" w="100%">
          <Flex flexDirection="column" m="4" ml="0">
            <Flex flexDirection="row" justifyContent="space-between" alignItems="center" mb="4" position="fixed" zIndex={100}>
                <Text fontWeight="700" fontSize="3xl" color="gray.600" mr="4">{courseTableName}</Text>
                {renderEditName()}
            </Flex>
            <Flex flexDirection="row" justifyContent="center" alignItems="center" my="5vh" >
              <CourseTableContainer courseTimes={courseTimes} courses={courses} loading={loading} hoveredCourseTime={hoveredCourseTime} hoveredCourse={props.hoveredCourse}/>  
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
        <LoadingOverlay active={loading} spinner styles={{wrapper: {overflow: "auto"}, overlay: (base)=>({...base, borderRadius:"10px"})}}>
        {renderSideCourseTableContent()}
        </LoadingOverlay>
      </Flex>
    );
}

export default SideCourseTableContainer;