import { React, useRef, forwardRef, useEffect,useState } from 'react';
import {
    Box,
    Flex,
    Text,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Switch,
    FormControl,
    FormLabel,
    Collapse,
    IconButton,
    Button,
    useToast,
    Menu,
    MenuButton,
    MenuList,
    MenuOptionGroup,
    MenuItemOption,
    Badge,
    MenuDivider,
    Fade,
    Spacer,
    Tag,
    TagLeftIcon,
    useMediaQuery
} from '@chakra-ui/react';
import {useSelector, useDispatch} from 'react-redux';
import CourseInfoRowContainer from './CourseInfoRowContainer';
import SkeletonRow from '../components/SkeletonRow';
import { HashLoader } from 'react-spinners';
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { BeatLoader } from 'react-spinners';
import { fetchFavoriteCourses, fetchUserById, logIn, updateCourseTable, fetchCourseTable, fetchCourseTableCoursesByIds } from '../actions/index';


function UserMyPage() {
    
    const toast = useToast();
    const {user, isLoading, getAccessTokenSilently} = useAuth0();
    const dispatch = useDispatch();
    const search_error = useSelector(state => state.search_error);    
    const courseTable = useSelector(state => state.course_table);
    const userInfo = useSelector(state => state.user);
    const [ hoveredCourse, setHoveredCourse ] = useState(null);
    const [ favorite_list, setFavorite_list ] = useState([]);
    const [ coursesInTable, setCoursesInTable] = useState([]);
    const [ displayTags, setDisplayTags ] = useState(["required", "total_slot", "enroll_method", "area"]);
    const [ Loading, setLoading ] = useState(true);
    const userLoading = isLoading || !userInfo;

    const [isMobile]  = useMediaQuery("(max-width: 760px)");

    // fetch userInfo
    useEffect(() => {
        const fetchUserInfo = async () => {
          if(!isLoading && user) {
            try {
              const token = await getAccessTokenSilently();
              const user_data = await dispatch(fetchUserById(token, user.sub));
              await dispatch(logIn(user_data));
              const course_tables = user_data.db.course_tables;
              console.log(course_tables);
              if (course_tables.length === 0) {
                // user has no course table, set courseTable in redux null
                dispatch(updateCourseTable(null));
              }
              else {
                // pick the first table
                try {
                  await dispatch(fetchCourseTable(course_tables[0]));
                } catch (e) {
                    console.log(e);
                }
              }
            } catch (e) {
              toast({
                title: '取得用戶資料失敗.',
                description: "請聯繫客服(?)",
                status: 'error',
                duration: 9000,
                isClosable: true,
              })
              // Other subsequent actions?
            }
          }
        }
    
        fetchUserInfo();
      }, [user]);
      

    useEffect(() => {
        const fetchFavoriteCoursesById = async () => {
            setLoading(true);
            console.log(userInfo);
            if(userInfo.db.favorites.length > 0) {
                try {
                    const courses = await dispatch(fetchFavoriteCourses(userInfo.db.favorites));
                    console.log(courses);
                    setFavorite_list(courses);
                }
                catch (e) {
                    console.log(e);
                    toast({
                        title: '載入最愛課程失敗.',
                        description: "請聯繫客服(?)",
                        status: 'error',
                        duration: 4000,
                        isClosable: true,
                      })
                }
            }
        }

        if(userInfo) {
            fetchFavoriteCoursesById();
            setLoading(false);
        }
    }, [userInfo]);

    useEffect(() => {
        if(courseTable) {
            setCoursesInTable(courseTable.courses);
        }
    }, [courseTable]);
    

    if(userLoading) {
        return(
          <Box maxW="screen-md" h="95vh" mx="auto" overflow="visible" p="64px">
            <Flex h="90vh" justifyContent="center" flexDirection="column" alignItems="center">
              <HashLoader size="60px" color="teal"/>
            </Flex>
          </Box>
        );
    }

    return(
        <>       
          <Flex w="100vw" direction="column" justifyContent="center" alignItems="center" overflow="hidden" transition="all 500ms ease-in-out" pt="64px">
            <Flex flexDirection="row" alignItems="center" justifyContent="start">
              {Loading ? <BeatLoader size={8} color='teal'/>:<></>}
              <Text fontSize="md" fontWeight="medium" color="gray.400" my="2" ml="1">{Loading ? "載入中" : `我的最愛課程 共有 ${favorite_list.length} 筆結果`}</Text>
            </Flex>
            <CourseInfoRowContainer courseInfo={favorite_list} setHoveredCourse={setHoveredCourse} selectedCourses={coursesInTable} displayTags={displayTags} displayTable={false}/>
            <Box ml="48vw" transition="all 500ms ease-in-out">
              <SkeletonRow loading={Loading} error={search_error}/>
            </Box>
        </Flex> 
        </>
    );
};

export default withAuthenticationRequired(UserMyPage, {
    onRedirecting: () => <h1>Redirect...</h1>,
    returnTo: '/',
});