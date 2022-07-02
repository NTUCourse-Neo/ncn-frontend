import { React, useRef, forwardRef, useEffect, useState } from "react";
import FocusLock from "react-focus-lock";
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
  IconButton,
  Spacer,
  useToast,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  SkeletonText,
} from "@chakra-ui/react";
import { FaRegEdit, FaRegHandPointDown, FaRegHandPointUp, FaRegMeh, FaPlusSquare, FaAngleDown } from "react-icons/fa";
import CourseTableContainer from "containers/CourseTableContainer";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import { v4 as uuidv4 } from "uuid";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import CourseListContainer from "containers/CourseListContainer";
import { parseCoursesToTimeMap } from "utils/parseCourseTime";
import { useUserData } from "components/Providers/UserProvider";
import { useCourseTable } from "components/Providers/CourseTableProvider";
import handleAPIError from "utils/handleAPIError";

const LOCAL_STORAGE_KEY = "NTU_CourseNeo_Course_Table_Key";

const courseTableScrollBarCss = {
  "&::-webkit-scrollbar": {
    w: "2",
    h: "2",
  },
  "&::-webkit-scrollbar-track": {
    w: "6",
    h: "6",
  },
  "&::-webkit-scrollbar-thumb": {
    borderRadius: "10",
    bg: `gray.300`,
  },
};

// eslint-disable-next-line react/display-name
const TextInput = forwardRef((props, ref) => {
  return (
    <FormControl>
      <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
      <Input ref={ref} id={props.id} {...props} />
    </FormControl>
  );
});

function CourseTableNameEditor({ isOpen, onOpen, onClose, handleSave, defaultName }) {
  const firstFieldRef = useRef(null);
  return (
    <Popover isOpen={isOpen} initialFocusRef={firstFieldRef} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <Button size="sm" variant="solid" colorScheme="gray" p="2">
          <FaRegEdit size={22} />
        </Button>
      </PopoverTrigger>
      <Flex zIndex={2000}>
        <PopoverContent>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader color="gray.500" fontWeight="700">
              課表設定
            </PopoverHeader>
            <PopoverBody p={5}>
              <Stack spacing={4}>
                <TextInput
                  label="課表名稱"
                  id="table_name"
                  ref={firstFieldRef}
                  defaultValue={defaultName}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSave(firstFieldRef.current.value);
                    }
                  }}
                />
                <ButtonGroup d="flex" justifyContent="flex-end">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="teal"
                    onClick={() => {
                      handleSave(firstFieldRef.current.value);
                    }}
                  >
                    Save
                  </Button>
                </ButtonGroup>
              </Stack>
            </PopoverBody>
          </FocusLock>
        </PopoverContent>
      </Flex>
    </Popover>
  );
}

function SideCourseTableContent({ agreeToCreateTableWithoutLogin, setIsLoginWarningOpen }) {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const toast = useToast();
  const { fetchCourseTableCoursesByIds } = useCourseSearchingContext();
  const { courseTable, fetchCourseTable, setCourseTable, createCourseTable, patchCourseTable } = useCourseTable();
  const { setUser, user: userInfo, linkCoursetableToUser, fetchUserById } = useUserData();

  // some local states for handling course data
  const [courses, setCourses] = useState({}); // dictionary of Course objects using courseId as key
  const [courseTimeMap, setCourseTimeMap] = useState({});

  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);

  const { onOpen, onClose, isOpen } = useDisclosure();

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
  useEffect(() => {
    const courseTableInit = async (uuid) => {
      let course_table;
      try {
        course_table = await fetchCourseTable(uuid);
        setCourseTable(course_table);
      } catch (e) {
        if (e?.response?.status === 403 || e?.response?.status === 404) {
          // expired
          setCourseTable(null);
        } else {
          // navigate to error page
          const error = handleAPIError(e);
          navigate(`/error/${error.status_code}`, { state: error });
        }
      }
      if (course_table === null) {
        setExpired(true);
        setLoading(false);
      }
    };

    const fetchCourseTableFromUser = async () => {
      if (!isLoading && user) {
        try {
          const token = await getAccessTokenSilently();
          const user_data = await fetchUserById(token, user.sub);
          await setUser(user_data);
          const course_tables = user_data.db.course_tables;
          if (course_tables.length === 0) {
            setCourseTable(null);
            setLoading(false);
          } else {
            // pick the first table
            try {
              const updatedCourseTable = await fetchCourseTable(course_tables[0]);
              setCourseTable(updatedCourseTable);
            } catch (e) {
              if (e?.response?.status === 403 || e?.response?.status === 404) {
                // expired
                setCourseTable(null);
              } else {
                const error = handleAPIError(e);
                navigate(`/error/${error.status_code}`, { state: error });
              }
            }
          }
        } catch (e) {
          toast({
            title: "取得用戶資料失敗.",
            description: "請聯繫客服(?)",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          setLoading(false);
          // Other subsequent actions?
        }
      }
    };
    // run after useAuth0 finish loading.
    // console.log('isLoading: ', isLoading);
    if (!isLoading) {
      // user mode
      if (user) {
        setLoading(true);
        fetchCourseTableFromUser();
      }
      // guest mode
      else {
        const uuid = localStorage.getItem(LOCAL_STORAGE_KEY);
        // console.log("UUID in localStorage now: ",uuid);
        if (uuid) {
          setLoading(true);
          courseTableInit(uuid);
        } else {
          setLoading(false);
        }
      }
    }
  }, [user, isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // fetch course objects data from server based on array of IDs
  useEffect(() => {
    const fetchCoursesDataById = async (_callback) => {
      if (courseTable) {
        try {
          const courseResult = await fetchCourseTableCoursesByIds(courseTable.courses);
          // set states: courseTimeMap, courses
          setCourseTimeMap(parseCoursesToTimeMap(convertArrayToObject(courseResult, "_id")));
          setCourses(convertArrayToObject(courseResult, "_id"));
        } catch (e) {
          toast({
            title: "取得課表課程資料失敗.",
            description: "請聯繫客服(?)",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
      _callback();
    };
    if (courseTable) {
      setLoading(true);
      fetchCoursesDataById(() => setLoading(false));
    }
    // guest mode & do not have uuid on localstorage
    if (!isLoading) {
      // user mode
      if (!user && !localStorage.getItem(LOCAL_STORAGE_KEY)) {
        setLoading(false);
      }
    }
  }, [courseTable]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateTable = async () => {
    if (!isLoading) {
      // generate a new uuid of course table
      const new_uuid = uuidv4();
      if (user) {
        // hasLogIn
        try {
          const updatedCourseTable = await createCourseTable(new_uuid, "我的課表", userInfo.db._id, "1102");
          setCourseTable(updatedCourseTable);
          // console.log("New UUID is generated: ",new_uuid);
          const token = await getAccessTokenSilently();
          const updatedUser = await linkCoursetableToUser(token, new_uuid, userInfo.db._id);
          setUser(updatedUser);
        } catch (e) {
          toast({
            title: `新增課表失敗`,
            description: `請聯繫客服(?)`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        // Guest mode
        try {
          const new_course_table = await createCourseTable(new_uuid, "我的課表", null, "1102");
          setCourseTable(new_course_table);
          // console.log("New UUID is generated: ",new_uuid);
          localStorage.setItem(LOCAL_STORAGE_KEY, new_course_table._id);
          setExpired(false);
        } catch (error) {
          toast({
            title: `新增課表失敗`,
            description: `請聯繫客服(?)`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    }
  };

  const handleSave = async (new_table_name) => {
    onClose();
    try {
      const res_table = await patchCourseTable(courseTable._id, new_table_name, courseTable.user_id, courseTable.expire_ts, courseTable.courses);
      setCourseTable(res_table);
      toast({
        title: `變更課表名稱成功`,
        description: `課表名稱已更新為 ${new_table_name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
      if (e?.response?.status === 403 || e?.response?.status === 404) {
        // expired
        setCourseTable(null);
        toast({
          title: `變更課表名稱失敗`,
          description: `課表已過期`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setExpired(true);
        return;
      }
      toast({
        title: `變更課表名稱失敗`,
        description: `請聯繫客服(?)`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if ((courseTable === null || expired === true) && !(loading || isLoading)) {
    return (
      <Flex flexDirection="column" justifyContent="center" alignItems="center" h="100%" w="100%">
        <Flex flexDirection="row" justifyContent="center" alignItems="center">
          <FaRegHandPointUp size="3vh" style={{ color: "gray" }} />
          <FaRegMeh size="3vh" style={{ color: "gray" }} />
          <FaRegHandPointDown size="3vh" style={{ color: "gray" }} />
        </Flex>
        <Text fontSize="2xl" fontWeight="bold" color="gray">
          {expired ? "您的課表已過期" : "尚無課表"}
        </Text>
        <Button
          colorScheme="teal"
          leftIcon={<FaPlusSquare />}
          onClick={() => {
            if (isAuthenticated || agreeToCreateTableWithoutLogin) {
              handleCreateTable();
            } else {
              setIsLoginWarningOpen(true);
            }
          }}
        >
          新增課表
        </Button>
      </Flex>
    );
  }

  return (
    <Box overflow="auto" w="100%" mt={{ base: 0, lg: 4 }} __css={courseTableScrollBarCss}>
      <Flex flexDirection="column">
        <Tabs>
          <Flex flexDirection="row" justifyContent="start" alignItems="center" mb="2" ml="4">
            {courseTable ? (
              <Flex alignItems="center" flexWrap="wrap">
                <Text fontWeight="700" fontSize={["xl", "2xl", "3xl"]} color="gray.600" mr="4">
                  {courseTable.name}
                </Text>
                <CourseTableNameEditor isOpen={isOpen} onClose={onClose} onOpen={onOpen} handleSave={handleSave} defaultName={courseTable.name} />
                <Spacer mx="8" />
                <TabList>
                  <Tab>時間表</Tab>
                  <Tab>清單</Tab>
                </TabList>
              </Flex>
            ) : (
              <SkeletonText width="15vw" mt="2" h="2" noOfLines={3} />
            )}
          </Flex>
          <TabPanels>
            <TabPanel>
              <Flex flexDirection="row" justifyContent="start" alignItems="center" overflowX={"auto"} __css={courseTableScrollBarCss}>
                <CourseTableContainer courseTimeMap={courseTimeMap} courses={courses} loading={loading || isLoading} />
              </Flex>
            </TabPanel>
            <TabPanel>
              <CourseListContainer courseTable={courseTable} courses={courses} loading={loading || isLoading} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
}

function SideCourseTableContainer({ isDisplay, setIsDisplay, agreeToCreateTableWithoutLogin, setIsLoginWarningOpen }) {
  return (
    <Flex flexDirection={{ base: "column", lg: "row" }} h="100%" w="100%">
      <Flex justifyContent="center" alignItems="center">
        <IconButton
          h={{ base: "", lg: "100%" }}
          w={{ base: "100%", lg: "" }}
          icon={
            <Box transform={{ base: "none", lg: "rotate(270deg)" }}>
              <FaAngleDown size={24} />
            </Box>
          }
          onClick={() => {
            setIsDisplay(!isDisplay);
          }}
          size="sm"
          variant="ghost"
        />
      </Flex>
      <SideCourseTableContent agreeToCreateTableWithoutLogin={agreeToCreateTableWithoutLogin} setIsLoginWarningOpen={setIsLoginWarningOpen} />
    </Flex>
  );
}

export default SideCourseTableContainer;
