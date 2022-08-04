import { useRef, forwardRef, useEffect, useState } from "react";
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
  Tag,
  InputProps,
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
import { parseCoursesToTimeMap, TimeMap } from "utils/parseCourseTime";
import useCourseTable from "hooks/useCourseTable";
import useNeoLocalStorage from "hooks/useNeoLocalStorage";
import { createCourseTable, patchCourseTable } from "queries/courseTable";
import handleFetch from "utils/CustomFetch";
import useUserInfo from "hooks/useUserInfo";
import { reportEvent } from "utils/ga";
import { useSWRConfig } from "swr";
import { Course } from "@/types/course";
import { User } from "@/types/user";

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

interface TextInputProps extends InputProps {
  readonly id: string;
  readonly label: string;
}
// eslint-disable-next-line react/display-name
const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  return (
    <FormControl>
      <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
      <Input ref={ref} {...props} id={props.id} />
    </FormControl>
  );
});

function CourseTableNameEditor(props: {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onOpen: () => void;
  readonly handleSave: (name: string | null) => void;
  readonly defaultName: string;
}) {
  const { isOpen, onOpen, onClose, handleSave, defaultName } = props;
  const firstFieldRef = useRef<HTMLInputElement>(null);
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
                      handleSave(firstFieldRef?.current?.value ?? null);
                    }
                  }}
                />
                <ButtonGroup display="flex" justifyContent="flex-end">
                  <Button variant="outline" onClick={onClose}>
                    取消
                  </Button>
                  <Button
                    colorScheme="teal"
                    onClick={() => {
                      handleSave(firstFieldRef?.current?.value ?? null);
                      reportEvent("course_table", "click", "save_table_name");
                    }}
                  >
                    儲存
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

function SideCourseTableContent(props: {
  readonly agreeToCreateTableWithoutLogin: boolean;
  readonly setIsLoginWarningOpen: (isOpen: boolean) => void;
}) {
  const { agreeToCreateTableWithoutLogin, setIsLoginWarningOpen } = props;
  const headingColor = useColorModeValue("heading.light", "heading.dark");
  const router = useRouter();
  const { user } = useUser();
  const toast = useToast();
  const {
    userInfo,
    isLoading,
    mutate: mutateUser,
  } = useUserInfo(user?.sub ?? null);
  const { neoLocalCourseTableKey, setNeoLocalStorage } = useNeoLocalStorage();
  const courseTableKey = userInfo
    ? userInfo?.course_tables?.[0] ?? null
    : neoLocalCourseTableKey;
  const {
    courseTable,
    isLoading: isCourseTableLoading,
    mutate: mutateCourseTable,
    isExpired,
  } = useCourseTable(courseTableKey);
  const { mutate } = useSWRConfig();
  const bgColor = useColorModeValue("card.light", "card.dark");

  // some local states for handling course data
  const [courses, setCourses] = useState<{ [key: string]: Course }>({}); // dictionary of Course objects using courseId as key
  const [courseTimeMap, setCourseTimeMap] = useState<TimeMap>({});

  const { onOpen, onClose, isOpen } = useDisclosure();

  function convertArrayToObject(array: Course[]): { [key: string]: Course } {
    const initialValue = {};
    return array.reduce((obj, item: Course) => {
      const courseKey = item.id;
      return {
        ...obj,
        [courseKey]: item,
      };
    }, initialValue);
  }

  useEffect(() => {
    if (courseTable?.courses) {
      setCourseTimeMap(
        parseCoursesToTimeMap(convertArrayToObject(courseTable.courses))
      );
      setCourses(convertArrayToObject(courseTable.courses));
    }
  }, [courseTable]);

  const handleCreateTable = async () => {
    // generate a new uuid of course table
    const new_uuid = uuidv4();
    if (userInfo) {
      // hasLogIn
      try {
        const newCourseTableData = await createCourseTable(
          new_uuid,
          "我的課表",
          userInfo.id,
          process.env.NEXT_PUBLIC_SEMESTER ?? "error_secret_key"
        );
        await mutateUser(
          async () => {
            const userData = await handleFetch<{ user: User; message: string }>(
              "/api/user/linkCourseTable",
              {
                table_id: new_uuid,
                user_id: userInfo.id,
              }
            );
            return userData;
          },
          {
            revalidate: false,
            populateCache: true,
          }
        );
        await mutate(
          `/v2/course_tables/${new_uuid}`,
          async (prev: unknown) => {
            return newCourseTableData ?? prev;
          },
          {
            revalidate: false,
            populateCache: true,
          }
        );
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
        const newCourseTableData = await createCourseTable(
          new_uuid,
          "我的課表",
          null,
          process.env.NEXT_PUBLIC_SEMESTER ?? "error_secret_key"
        );
        // set State
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          newCourseTableData.course_table.id
        );
        setNeoLocalStorage({
          courseTableKey: newCourseTableData.course_table.id,
        }); // have to setState to trigger request to new course table
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
  };

  const handleSave = async (new_table_name: string | null) => {
    onClose();
    if (courseTable) {
      try {
        await mutateCourseTable(
          async (prev) => {
            const data = await patchCourseTable(
              courseTable.id,
              new_table_name ?? courseTable.name,
              courseTable.user_id,
              courseTable.expire_ts,
              courseTable.courses.map((course) => course.id)
            );
            return data ?? prev;
          },
          {
            revalidate: false,
            populateCache: true,
          }
        );
        toast({
          title: `變更課表名稱成功`,
          description: `課表名稱已更新為 ${new_table_name}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (e) {
        toast({
          title: `變更課表名稱失敗`,
          description: `請聯繫客服`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: `變更課表名稱失敗`,
        description: `請聯繫客服`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const sideCourseTableLoading = isCourseTableLoading || isLoading;

  if ((!courseTable || isExpired === true) && !sideCourseTableLoading) {
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
          {isExpired ? "您的課表已過期" : "尚無課表"}
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
            reportEvent("course_table", "click", "create_table");
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
            pb={4}
            ml="4"
            position={"sticky"}
            top={0}
            bg={bgColor}
            zIndex={10000}
          >
            {courseTable ? (
              <Flex alignItems="center" flexWrap="wrap">
                <Tag size="md" variant="outline" w="fit-content" mr="2">
                  <Text fontWeight="800" fontSize={{ base: "sm", lg: "md" }}>
                    {courseTable.semester}
                  </Text>
                </Tag>
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
              <SkeletonText width="15vw" mt="2" h="8" noOfLines={2} />
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
                  loading={sideCourseTableLoading}
                />
              </Flex>
            </TabPanel>
            <TabPanel>
              <CourseListContainer
                courseTable={courseTable}
                courses={courses}
                loading={sideCourseTableLoading}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
}

function SideCourseTableContainer(props: {
  readonly isDisplay: boolean;
  readonly setIsDisplay: (isDisplay: boolean) => void;
  readonly agreeToCreateTableWithoutLogin: boolean;
  readonly setIsLoginWarningOpen: (isOpen: boolean) => void;
}) {
  const {
    isDisplay,
    setIsDisplay,
    agreeToCreateTableWithoutLogin,
    setIsLoginWarningOpen,
  } = props;
  return (
    <Flex flexDirection={{ base: "column", lg: "row" }} h="100%" w="100%">
      <Flex justifyContent="center" alignItems="center">
        <IconButton
          aria-label="開啟課表"
          h={{ base: "", lg: "100%" }}
          w={{ base: "100%", lg: "" }}
          icon={
            <Box transform={{ base: "none", lg: "rotate(270deg)" }}>
              <FaAngleDown size={24} />
            </Box>
          }
          onClick={() => {
            setIsDisplay(!isDisplay);
            reportEvent(
              "course_table",
              "click",
              `${isDisplay ? "Close" : "Open"}_panel`
            );
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
