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
  Tag,
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
import useCourseTable from "hooks/useCourseTable";
import useNeoLocalStorage from "hooks/useNeoLocalStorage";
import { createCourseTable, patchCourseTable } from "queries/courseTable";
import handleFetch from "utils/CustomFetch";
import useUserInfo from "hooks/useUserInfo";
import { reportEvent } from "utils/ga";
import { useSWRConfig } from "swr";

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
              ????????????
            </PopoverHeader>
            <PopoverBody p={5}>
              <Stack spacing={4}>
                <TextInput
                  label="????????????"
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
                    ??????
                  </Button>
                  <Button
                    colorScheme="teal"
                    onClick={() => {
                      handleSave(firstFieldRef.current.value);
                      reportEvent("course_table", "click", "save_table_name");
                    }}
                  >
                    ??????
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
  const { userInfo, isLoading, mutate: mutateUser } = useUserInfo(user?.sub);
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
  const [courses, setCourses] = useState({}); // dictionary of Course objects using courseId as key
  const [courseTimeMap, setCourseTimeMap] = useState({});

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

  useEffect(() => {
    if (courseTable?.courses) {
      setCourseTimeMap(
        parseCoursesToTimeMap(convertArrayToObject(courseTable.courses, "id"))
      );
      setCourses(convertArrayToObject(courseTable.courses, "id"));
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
          "????????????",
          userInfo.id,
          process.env.NEXT_PUBLIC_SEMESTER
        );
        await mutateUser(
          async () => {
            const userData = await handleFetch("/api/user/linkCourseTable", {
              table_id: new_uuid,
              user_id: userInfo.id,
            });
            return userData;
          },
          {
            revalidate: false,
            populateCache: true,
          }
        );
        await mutate(
          `/v2/course_tables/${new_uuid}`,
          async (prev) => {
            return newCourseTableData ?? prev;
          },
          {
            revalidate: false,
            populateCache: true,
          }
        );
      } catch (e) {
        toast({
          title: `??????????????????`,
          description: `???????????????(?)`,
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
          "????????????",
          null,
          process.env.NEXT_PUBLIC_SEMESTER
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
          title: `??????????????????`,
          description: `???????????????(?)`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleSave = async (new_table_name) => {
    onClose();
    try {
      await mutateCourseTable(
        async (prev) => {
          const data = await patchCourseTable(
            courseTable.id,
            new_table_name,
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
        title: `????????????????????????`,
        description: `???????????????????????? ${new_table_name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: `????????????????????????`,
        description: `???????????????(?)`,
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
          {isExpired ? "?????????????????????" : "????????????"}
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
          ????????????
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
                  <Tab>?????????</Tab>
                  <Tab>??????</Tab>
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
