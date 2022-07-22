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
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaRegEdit,
  FaRegHandPointDown,
  FaRegHandPointUp,
  FaRegMeh,
  FaPlusSquare,
  FaAngleDown,
} from "react-icons/fa";
import CourseTableContainer from "components/CourseTable/CourseTableContainer";
import CourseListContainer from "components/CourseTable/CourseListContainer";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { parseCoursesToTimeMap } from "utils/parseCourseTime";
import { useCourseTable } from "components/Providers/CourseTableProvider";
import {
  createCourseTable,
  patchCourseTable,
  fetchCourseTable,
} from "queries/courseTable";
import handleFetch from "utils/CustomFetch";
import useUserInfo from "hooks/useUserInfo";

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

function CourseTableNameEditor({
  isOpen,
  onOpen,
  onClose,
  handleSave,
  defaultName,
}) {
  const firstFieldRef = useRef(null);
  return (
    <Popover
      isOpen={isOpen}
      initialFocusRef={firstFieldRef}
      onOpen={onOpen}
      onClose={onClose}
    >
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

function SideCourseTableContent({
  agreeToCreateTableWithoutLogin,
  setIsLoginWarningOpen,
}) {
  const headingColor = useColorModeValue("heading.light", "heading.dark");
  const router = useRouter();
  const { user } = useUser();
  const toast = useToast();
  const { courseTable, setCourseTable } = useCourseTable();
  const { userInfo, isLoading, refetch } = useUserInfo(user?.sub);

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
    const getCourseTable = async (uuid) => {
      try {
        const course_table = await fetchCourseTable(uuid);
        setCourseTable(course_table);
        setLoading(false);
      } catch (e) {
        if (e?.response?.data?.msg === "access_token_expired") {
          router.push("/api/auth/login");
        }
        if (e?.response?.status === 403 || e?.response?.status === 404) {
          // expired
          setCourseTable(null);
          setExpired(true);
          setLoading(false);
        } else {
          toast({
            title: "取得用戶資料失敗.",
            description: "請聯繫客服(?)",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          router.push(`/404`);
        }
      }
    };

    if (!isLoading) {
      const uuid = !userInfo
        ? localStorage?.getItem(LOCAL_STORAGE_KEY) ?? null
        : userInfo?.course_tables?.[0] ?? null;
      if (uuid) {
        setLoading(true);
        getCourseTable(uuid);
      } else {
        setCourseTable(null);
        setLoading(false);
      }
    }
  }, [user, isLoading, userInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (courseTable?.courses) {
      setCourseTimeMap(
        parseCoursesToTimeMap(convertArrayToObject(courseTable.courses, "id"))
      );
      setCourses(convertArrayToObject(courseTable.courses, "id"));
    }
  }, [courseTable]);

  const handleCreateTable = async () => {
    if (!isLoading) {
      // generate a new uuid of course table
      const new_uuid = uuidv4();
      if (user) {
        // hasLogIn
        try {
          const updatedCourseTable = await createCourseTable(
            new_uuid,
            "我的課表",
            userInfo.id,
            "1102"
          );
          setCourseTable(updatedCourseTable);
          // console.log("New UUID is generated: ",new_uuid);
          const updatedUser = await handleFetch("/api/user/linkCourseTable", {
            table_id: new_uuid,
            user_id: userInfo.id,
          });
          refetch();
        } catch (e) {
          toast({
            title: `新增課表失敗`,
            description: `請聯繫客服(?)`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          if (e?.response?.data?.msg === "access_token_expired") {
            router.push("/api/auth/login");
          }
        }
      } else {
        // Guest mode
        try {
          const new_course_table = await createCourseTable(
            new_uuid,
            "我的課表",
            null,
            "1102"
          );
          setCourseTable(new_course_table);
          // console.log("New UUID is generated: ",new_uuid);
          localStorage.setItem(LOCAL_STORAGE_KEY, new_course_table.id);
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
      const res_table = await patchCourseTable(
        courseTable.id,
        new_table_name,
        courseTable.user_id,
        courseTable.expire_ts,
        courseTable.courses.map((course) => course.id)
      );
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
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        h="100%"
        w="100%"
      >
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
            if (user || agreeToCreateTableWithoutLogin) {
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
    <Box
      overflow="auto"
      w="100%"
      mt={{ base: 0, lg: 4 }}
      __css={courseTableScrollBarCss}
    >
      <Flex flexDirection="column">
        <Tabs>
          <Flex
            flexDirection="row"
            justifyContent="start"
            alignItems="center"
            mb="2"
            ml="4"
          >
            {courseTable ? (
              <Flex alignItems="center" flexWrap="wrap">
                <Text
                  fontWeight="700"
                  fontSize={["xl", "2xl", "3xl"]}
                  color={headingColor}
                  mr="4"
                >
                  {courseTable.name}
                </Text>
                <CourseTableNameEditor
                  isOpen={isOpen}
                  onClose={onClose}
                  onOpen={onOpen}
                  handleSave={handleSave}
                  defaultName={courseTable.name}
                />
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
              <Flex
                flexDirection="row"
                justifyContent="start"
                alignItems="center"
                overflowX={"auto"}
                __css={courseTableScrollBarCss}
              >
                <CourseTableContainer
                  courseTimeMap={courseTimeMap}
                  courses={courses}
                  loading={loading || isLoading}
                />
              </Flex>
            </TabPanel>
            <TabPanel>
              <CourseListContainer
                courseTable={courseTable}
                courses={courses}
                loading={loading || isLoading}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
}

function SideCourseTableContainer({
  isDisplay,
  setIsDisplay,
  agreeToCreateTableWithoutLogin,
  setIsLoginWarningOpen,
}) {
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
      <SideCourseTableContent
        agreeToCreateTableWithoutLogin={agreeToCreateTableWithoutLogin}
        setIsLoginWarningOpen={setIsLoginWarningOpen}
      />
    </Flex>
  );
}

export default SideCourseTableContainer;
