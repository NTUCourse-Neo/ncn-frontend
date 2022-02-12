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
  useToast,
} from "@chakra-ui/react";
import CourseDetailInfoContainer from "./CourseDetailInfoContainer";
import {useState, useEffect} from "react";
import { useDispatch, useSelector} from "react-redux";
import { fetchCourse, fetchCourseTable, patchCourseTable, fetchUserById, logIn } from "../actions/";
import { useNavigate } from "react-router-dom";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Moment from "moment";
import { IoMdOpen } from 'react-icons/io';
import { FaPlus, FaMinus, FaHeartbeat, FaHeart, FaSyncAlt, FaAngleDown } from 'react-icons/fa';
import { BiCopy } from 'react-icons/bi';
import setPageMeta from "../utils/seo";
import { genNolUrl, genNolAddUrl, openPage } from "./CourseDrawerContainer";
import ParrotGif from "../img/parrot/parrot.gif";
import ParrotUltraGif from "../img/parrot/ultrafastparrot.gif";
import { useAuth0 } from '@auth0/auth0-react';

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

const LOCAL_STORAGE_KEY = 'NTU_CourseNeo_Course_Table_Key';

function CourseInfoContainer ({code}){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();

    const [course, setCourse] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [isMobile] = useMediaQuery('(max-width: 1000px)')
    const [copiedLinkClicks, setCopiedLinkClicks] = useState(0);
    const [copyWord, setCopyWord] = useState(copyWordList.find(word => word.count <= copiedLinkClicks));
    const [refreshTime, setRefreshTime] = useState(new Date());
    Moment.locale("zh-tw");

    const [addingCourse, setAddingCourse] = useState(false);
    const [selected, setSelected] = useState(false);
    const {user, isLoading, getAccessTokenSilently} = useAuth0();
    const userInfo = useSelector(state => state.user);

    // fetch Course Info at first 
    useEffect(() => {
        const fetchCourseObject = async(course_code) => {
            let course_obj
            try {
                course_obj = await dispatch(fetchCourse(course_code))
                //console.log(course_obj);
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

    // get selected init state
    useEffect(()=>{
      const getInitState = async() => {
          setAddingCourse(true);
          let uuid;
          if (user){
              // user mode, if no userInfo, log in first
              if (!userInfo){
                const token = await getAccessTokenSilently();
                let user_data;
                try {
                  user_data = await dispatch(fetchUserById(token, user.sub));
                } catch (error) {
                  navigate(`/error/${error.status_code}`, { state: error });
                  return;
                }
                await dispatch(logIn(user_data));
                
                if (user_data.db.course_tables.length === 0){
                    uuid = null
                } else {
                    // use the first one
                    uuid = user_data.db.course_tables[0];
                }
              } 
              else {
                if (userInfo.db.course_tables.length === 0){
                    uuid = null
                } else {
                    // use the first one
                    uuid = userInfo.db.course_tables[0];
                }
              }
          }
          else {
              // guest mode
              uuid = localStorage.getItem(LOCAL_STORAGE_KEY);
          }
          if (uuid){
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
                setAddingCourse(false);
                return;
            }
            // determine init state
            if (course_table.courses.includes(code)){
                setSelected(true);
            } else {
                setSelected(false);
            }
          }

          setAddingCourse(false);
      }

      if (!isLoading){
        getInitState();
      }
    },[isLoading])

    const handleAddCourse = async (course)=>{
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
                  setAddingCourse(false);
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
                          setAddingCourse(false);
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
                          setAddingCourse(false);
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
                      setSelected(!selected)
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

    const handleAddFavorite = () => {}

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
                          <Button key={"NolContent_Button_"+code} mr='-px' size="md" colorScheme={selected?"red":"blue"} variant="outline" leftIcon={selected?<FaMinus />:<FaPlus />} isLoading={addingCourse || isLoading} onClick={()=>{handleAddCourse(course)}}>{selected?"從課表移除":"加入課表"}</Button>
                          <Button key={"NolContent_Button_"+code} size="md" colorScheme="blue" variant="outline" leftIcon={<FaPlus />} onClick={() => openPage(genNolAddUrl(course), true)}>課程網</Button>
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