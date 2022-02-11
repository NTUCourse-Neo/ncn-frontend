import { 
  HStack,
  Tag,
  Text,
  ButtonGroup,
  Button,
  Spacer,
  IconButton,
  Icon,
  Flex,
  Image,
  useMediaQuery,
  VStack,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  MenuDivider,
} from "@chakra-ui/react";
import CourseDetailInfoContainer from "./CourseDetailInfoContainer";
import {useState, useEffect} from "react";
import { useDispatch} from "react-redux";
import { fetchCourse } from "../actions/";
import { useNavigate } from "react-router-dom";
import { IoMdOpen } from 'react-icons/io';
import { FaPlus, FaHeartbeat, FaHeart, FaSyncAlt, FaAngleDown } from 'react-icons/fa';
import { BiCopy } from 'react-icons/bi';
import ParrotGif from "../img/parrot/parrot.gif";
import ParrotUltraGif from "../img/parrot/ultrafastparrot.gif";

function CourseInfoContainer ({code}){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [isMobile] = useMediaQuery('(max-width: 1000px)')


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
          return(
            <Flex h="95vh" pt='64px' justifyContent="center" alignItems="center">
              <Flex flexDirection="column" justifyContent="center" alignItems="center">
                <Image w="64px" src={ParrotGif} alt="Loading Parrot" />
                <Text mt="8" mb="4" fontSize="3xl" fontWeight="600" color="gray.500">正在載入課程資訊</Text>
                <HStack>
                  <Button variant="solid" onClick={() => window.open("https://www.surveycake.com/s/LzWd6", "_blank")}>問題回報</Button>
                  <Button variant="solid" colorScheme="teal" leftIcon={<FaHeartbeat />} onClick={() => window.open("https://status.course.myntu.me/", "_blank")}>服務狀態</Button>
                </HStack>
              </Flex>
            </Flex>
          );
        } else {
          return(
            <Flex h="95vh" pt='64px' justifyContent="center" alignItems="center">
              <Flex flexDirection="column" justifyContent="center" alignItems="center">
                <HStack>
                  <Image w="64px" src={ParrotUltraGif} alt="Loading Parrot" />
                </HStack>
                <Text mt="8" mb="4" fontSize="3xl" fontWeight="600" color="gray.500">喔哦! 找不到課程資料</Text>
                <HStack>
                  <Button variant="solid" onClick={() => window.open("https://www.surveycake.com/s/LzWd6", "_blank")}>問題回報</Button>
                  <Button variant="solid" colorScheme="teal" leftIcon={<FaHeartbeat />} onClick={() => window.open("https://status.course.myntu.me/", "_blank")}>服務狀態</Button>
                </HStack>
              </Flex>
            </Flex>
          );
        }
    }
    else {
      if(isMobile){
        return(
          <>
            <Flex pt="64px" w='100%' justifyContent={'center'} position="fixed" bg="white" zIndex="100" boxShadow="md">
              <HStack my="2" mx="4%" spacing="4" w="100%">
                <VStack align="start">
                  <HStack>
                    <Tag size="sm" colorScheme="blue"><Text fontWeight="600" fontSize="sm">{course.id}</Text></Tag>
                    <IconButton icon={<FaSyncAlt color="gray"/>} variant="ghost" size="xs"/>
                    <Text fontWeight="500" fontSize="sm" color="gray.300">11:10 更新</Text>
                  </HStack>
                  <HStack>
                    <Text fontSize="xl" fontWeight="800" color="gray.700">{course.course_name}</Text>
                    <Text fontSize="md" fontWeight="500" color="gray.500">{course.teacher}</Text>
                  </HStack>
                </VStack>
                <Spacer />
                <Menu>
                  <MenuButton as={Button} rightIcon={<FaAngleDown />}>功能</MenuButton>
                  <MenuList>
                      <MenuItem icon={<FaPlus />}>加入課表</MenuItem>
                      <MenuItem icon={<FaPlus />}>加入課程網</MenuItem>
                      <MenuItem icon={<FaHeart />}>加入最愛</MenuItem>
                    <MenuDivider />
                      <MenuItem icon={<IoMdOpen />}>課程網資訊</MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </Flex>
            <CourseDetailInfoContainer course={course}/>
          </>
        );
      }
      return (
          <>
              <Flex pt="64px" w='100%' justifyContent={'center'}>
                  <HStack my="2" mx="4%" spacing="4" w="100%">
                      <Tag size="md" colorScheme="blue"><Text fontWeight="800" fontSize="lg">{course.id}</Text></Tag>
                      <Text fontSize="3xl" fontWeight="800" color="gray.700">{course.course_name}</Text>
                      <Text fontSize="2xl" fontWeight="500" color="gray.500">{course.teacher}</Text>
                      <HStack>
                        <IconButton icon={<Icon as={FaSyncAlt} color="gray.400"/>} variant="ghost" size="xs"/>
                        <Text fontWeight="500" fontSize="md" color="gray.300">11:10 更新</Text>
                      </HStack>
                      <Spacer />
                      <ButtonGroup isAttached>
                          <Button key={"NolContent_Button_"+code} mr='-px' size="md" colorScheme="blue" variant="outline" leftIcon={<FaPlus />}>課表</Button>
                          <Button key={"NolContent_Button_"+code} size="md" colorScheme="blue" variant="outline" leftIcon={<FaPlus />}>課程網</Button>
                      </ButtonGroup>
                      <Button key={"NolContent_Button_"+code} size="md" colorScheme="red" variant="outline" leftIcon={<FaHeart />}>加入最愛</Button>
                      <Button key={"NolContent_Button_"+code} size="md" rightIcon={<IoMdOpen />} onClick={() => {
                        //TODO
                      }}>課程網資訊</Button>
                      <Button rightIcon={<Icon as={BiCopy} color="gray.600" />} variant="ghost" size="md" color="gray.600">複製連結</Button>
                  </HStack>
              </Flex>
              <CourseDetailInfoContainer course={course}/>
          </>
      )
    }
}

export default CourseInfoContainer;