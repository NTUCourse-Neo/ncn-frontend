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
    FaAngleRight
} from 'react-icons/fa';
import CourseTableContainer from './CourseTableContainer';
import { get_courses_by_ids } from '../api/courses';

function SideCourseTableContainer(props) {
    const [courseIds, setCourseIds] = useState(["1101_74030", "1101_27674", "1101_30859", "1101_75633"]);
    const [courses, setCourses] = useState({});
    const [courseTimes, setCourseTimes] = useState({});
    const [loading, setLoading] = useState(false);

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
        console.log(course_time_tmp);
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

    useEffect(() => {const fetchData = async (_callback) =>{
      setLoading(true);
        try {
          await get_courses_by_ids(courseIds, 100, 0).then(res => {
            extract_course_info(convertArrayToObject(res, "_id"))
            setCourses(convertArrayToObject(res, "_id"));
          });
        } catch (error) {
          console.error(error.message);
        }
        _callback();
      };
      fetchData(() => setLoading(false));
      console.log(courseTimes);
    }, []);
    
    // useEffect(() => console.log(courseTimes), [courseTimes]);

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
    const Form = ({ firstFieldRef, onCancel }) => {
        return (
            <Stack spacing={4}>
            <TextInput
                label='課表名稱'
                id='table_name'
                ref={firstFieldRef}
                defaultValue='我的課表'
            />
            <ButtonGroup d='flex' justifyContent='flex-end'>
                <Button variant='outline' onClick={onCancel}>
                Cancel
                </Button>
                <Button colorScheme='teal' onClick={onCancel}>
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
                            <Form firstFieldRef={firstFieldRef} onCancel={onClose} onSet={onClose} />
                        </PopoverBody>
                    </FocusLock>
                </PopoverContent>
            </Popover>
        );
    };
    return (
      <Flex flexDirection="row" h="100%">
        <Flex justifyContent="center" alignItems="center">
          <IconButton h="100%" icon={<FaAngleRight size={24}/>} onClick={()=>{props.setIsOpen(!props.isOpen)}} size="sm" variant="ghost"/>
        </Flex>
        <Box overflow="auto">
            <Flex flexDirection="column" m="4" ml="0">
                <Flex flexDirection="row" justifyContent="space-between" alignItems="center" mb="4" position="fixed">
                    <Text fontWeight="700" fontSize="3xl" color="gray.600" mr="4">我的課表</Text>
                    {renderEditName()}
                    <Spacer/>
                </Flex>
                <Flex flexDirection="row" justifyContent="center" alignItems="center" my="5vh" >
                  <CourseTableContainer courseTimes={courseTimes} courses={courses} loading={loading}/>  
                </Flex>
            </Flex>
        </Box>
      </Flex>
    );
}

export default SideCourseTableContainer;