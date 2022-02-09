import CourseDetailInfoContainer from "./CourseDetailInfoContainer";
import {useState, useEffect} from "react";
import { useDispatch} from "react-redux";
import { fetchCourse } from "../actions/";
import { useNavigate } from "react-router-dom";
import { HStack, Tag, Text, ButtonGroup, Button, Spacer, IconButton, Flex } from "@chakra-ui/react";
import { IoMdOpen } from 'react-icons/io';
import { ImCross } from 'react-icons/im';
import { FaPlus, FaInfoCircle, FaHeart, FaSyncAlt } from 'react-icons/fa';

function CourseInfoContainer ({code}){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchCourseObject = async(course_code) => {
            try {
                const course_obj = await dispatch(fetchCourse(course_code))
                console.log(course_obj);
                if (course_obj === undefined){
                    setNotFound(true);
                } else {
                    setCourse(course_obj);
                }
            } catch (error) {
                navigate(`/error/${error.status_code}`, { state: error });
                return;
            }
        } 

        fetchCourseObject(code);
    },[])

    if (!course){
        if (!notFound){
            return <div>Loading...</div>
        } else {
            return <Flex pt='100px'>Course Not Found</Flex>
        }
    }
    else {
        return (
            <>
                <Flex pt="64px" w='100%' justifyContent={'center'}>
                    <HStack my="2" spacing="4" w='90%'>
                        <Tag size="md" colorScheme="blue"><Text fontWeight="800" fontSize="lg">{course.id}</Text></Tag>
                        <Text fontSize="3xl" fontWeight="800" color="gray.700">{course.course_name}</Text>
                        <Text fontSize="2xl" fontWeight="500" color="gray.500">{course.teacher}</Text>
                        <IconButton icon={<FaSyncAlt color="gray"/>} variant="ghost" size="xs"/>
                        <Text fontWeight="500" fontSize="md" color="gray.300">更新時間</Text>
                        <Spacer />
                        <ButtonGroup isAttached>
                            <Button key={"NolContent_Button_"+code} mr='-px' size="md" colorScheme="blue" variant="outline" leftIcon={<FaPlus />}>課表</Button>
                            <Button key={"NolContent_Button_"+code} size="md" colorScheme="blue" variant="outline" leftIcon={<FaPlus />}>課程網</Button>
                        </ButtonGroup>
                        <Button key={"NolContent_Button_"+code} size="md" colorScheme="red" variant="outline" leftIcon={<FaHeart />}>加入最愛</Button>
                        <Button key={"NolContent_Button_"+code} size="md" rightIcon={<IoMdOpen />} onClick={() => {
                            //TODO
                        }}>課程網資訊</Button>
                    </HStack>
                </Flex>
                <CourseDetailInfoContainer course={course}/>
            </>
        )
    }
}

export default CourseInfoContainer;