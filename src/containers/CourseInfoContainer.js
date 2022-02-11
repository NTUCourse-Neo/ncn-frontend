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
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Moment from "moment";
import { IoMdOpen } from 'react-icons/io';
import { FaPlus, FaHeartbeat, FaHeart, FaSyncAlt, FaAngleDown } from 'react-icons/fa';
import { BiCopy } from 'react-icons/bi';
import setPageMeta from "../utils/seo";
import { genNolUrl } from "./CourseDrawerContainer";
import ParrotGif from "../img/parrot/parrot.gif";
import ParrotUltraGif from "../img/parrot/ultrafastparrot.gif";

const copyWordList = [
  {count: 100, word: "複製終結者!!", color: "purple.600", bg: "purple.50"},
  {count: 50, word: "終極複製!!", color: "red.600", bg: "red.50"},
  {count: 25, word: "超級複製!!", color: "orange.600", bg: "orange.50"},
  {count: 10, word: "瘋狂複製!!", color: "yellow.600", bg: "yellow.50"},
  {count: 3, word: "三倍複製!", color: "green.600", bg: "green.50"},
  {count: 2, word: "雙倍複製!", color: "green.600", bg: "green.50"},
  {count: 1, word: "已複製", color: "green.600", bg: "green.50"},
  {count: 0, word: "複製連結", color: "gray.600", bg: "white"},
]

function CourseInfoContainer ({code}){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [isMobile] = useMediaQuery('(max-width: 1000px)')
    const [copiedLinkClicks, setCopiedLinkClicks] = useState(0);
    const [copyWord, setCopyWord] = useState(copyWordList.find(word => word.count <= copiedLinkClicks));
    const [refreshTime, setRefreshTime] = useState(new Date());
    Moment.locale("zh-tw");


    useEffect(() => {
        const fetchCourseObject = async(course_code) => {
            let course_obj
            try {
                course_obj = await dispatch(fetchCourse(course_code))
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
            setPageMeta({title: `${course_obj.course_name} - 課程資訊 | NTUCourse Neo`, desc: `${course_obj.course_name} 課程的詳細資訊 | NTUCourse Neo，全新的臺大選課網站。`});
          } 
          fetchCourseObject(code);
    },[])

    useEffect(() => {
      setCopyWord(copyWordList.find(word => word.count <= copiedLinkClicks));
    }, [copiedLinkClicks])

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
                    <Text fontWeight="500" fontSize="xs" color="gray.300">{Moment(refreshTime).format("HH:mm")} 更新</Text>
                    <CopyToClipboard text={"https://course.myntu.me/courseinfo/"+course._id}>
                        <Button rightIcon={<Icon as={BiCopy} color={copyWord.color} />} variant="ghost" size="xs" bg={copyWord.bg} color={copyWord.color} onClick={() => setCopiedLinkClicks(copiedLinkClicks + 1)}>
                          {copyWord.word}
                        </Button>
                      </CopyToClipboard>
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
                      <MenuItem icon={<IoMdOpen />} onClick={() => window.open(genNolUrl(course), "_blank")}>課程網資訊</MenuItem>
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
                  <HStack my="2" mx="4%" spacing="4" w="100%" align="center">
                      <Tag size="md" colorScheme="blue"><Text fontWeight="800" fontSize="lg">{course.id}</Text></Tag>
                      <Text fontSize="3xl" fontWeight="800" color="gray.700">{course.course_name}</Text>
                      <Text fontSize="2xl" fontWeight="500" color="gray.500">{course.teacher}</Text>
                      <Text fontWeight="500" fontSize="md" color="gray.300">{Moment(refreshTime).format("HH:mm")} 更新</Text>
                      <Spacer />
                      <ButtonGroup isAttached>
                          <Button key={"NolContent_Button_"+code} mr='-px' size="md" colorScheme="blue" variant="outline" leftIcon={<FaPlus />}>課表</Button>
                          <Button key={"NolContent_Button_"+code} size="md" colorScheme="blue" variant="outline" leftIcon={<FaPlus />}>課程網</Button>
                      </ButtonGroup>
                      <Button key={"NolContent_Button_"+code} size="md" colorScheme="red" variant="outline" leftIcon={<FaHeart />}>加入最愛</Button>
                      <Button key={"NolContent_Button_"+code} size="md" rightIcon={<IoMdOpen />} onClick={() => window.open(genNolUrl(course), "_blank")}>課程網資訊</Button>
                      <CopyToClipboard text={"https://course.myntu.me/courseinfo/"+course._id}>
                        <Button rightIcon={<Icon as={BiCopy} color={copyWord.color} />} variant="ghost" size="md" bg={copyWord.bg} color={copyWord.color} onClick={() => setCopiedLinkClicks(copiedLinkClicks + 1)}>
                          {copyWord.word}
                        </Button>
                      </CopyToClipboard>
                  </HStack>
              </Flex>
              <CourseDetailInfoContainer course={course}/>
          </>
      )
    }
}

export default CourseInfoContainer;