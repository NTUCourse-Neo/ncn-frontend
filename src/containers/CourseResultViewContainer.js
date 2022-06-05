import { React, useEffect, useState, useRef } from "react";
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
  Tag,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  TagLeftIcon,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  useMediaQuery,
  HStack,
  Spacer,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Alert,
  AlertIcon,
  Icon,
} from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import { FaChevronDown, FaChevronUp, FaPlus, FaMinus, FaArrowRight, FaRss, FaRegCalendarAlt } from "react-icons/fa";
import CourseInfoRowContainer from "containers/CourseInfoRowContainer";
import TimeFilterModal from "components/FilterModals/TimeFilterModal";
import DeptFilterModal from "components/FilterModals/DeptFilterModal";
import CategoryFilterModal from "components/FilterModals/CategoryFilterModal";
import CourseSearchInput from "components/CourseSearchInput";
import SkeletonRow from "components/SkeletonRow";
import SideCourseTableContainer from "containers/SideCourseTableContainer";
import { setSearchSettings, setFilter, setFilterEnable, setNewDisplayTags, setBatchSize } from "actions/index";
import { getCourseEnrollInfo, fetchSearchResults } from "actions/courses";
import { useSelector, useDispatch } from "react-redux";
import useOnScreen from "hooks/useOnScreen";
import { mapStateToTimeTable, mapStateToIntervals } from "utils/timeTableConverter";
import { info_view_map } from "data/mapping_table";
import { useAuth0 } from "@auth0/auth0-react";
import BetaBadge from "components/BetaBadge";
import setPageMeta from "utils/seo";

function CourseResultViewContainer() {
  const toast = useToast();
  const topRef = useRef();
  const bottomRef = useRef();
  const reachedBottom = useOnScreen(bottomRef);

  const dispatch = useDispatch();
  const search_ids = useSelector((state) => state.search_ids);
  const search_results = useSelector((state) => state.search_results);
  const search_settings = useSelector((state) => state.search_settings);
  const search_filters_enable = useSelector((state) => state.search_filters_enable);
  const search_filters = useSelector((state) => state.search_filters);
  const search_loading = useSelector((state) => state.search_loading);
  const search_error = useSelector((state) => state.search_error);
  const offset = useSelector((state) => state.offset);
  const batch_size = useSelector((state) => state.batch_size);
  const total_count = useSelector((state) => state.total_count);
  const display_tags = useSelector((state) => state.display_tags);

  const { loginWithPopup } = useAuth0();

  const [isMobile, isHigherThan1325] = useMediaQuery(["(max-width: 1000px)", "(min-height: 1325px)"]);

  const [selectedTime, setSelectedTime] = useState(mapStateToTimeTable(search_filters.time));
  const [selectedDept, setSelectedDept] = useState(search_filters.department);
  const [selectedType, setSelectedType] = useState(search_filters.category);
  const [selectedEnrollMethod, setSelectedEnrollMethod] = useState(search_filters.enroll_method);

  const [timeFilterOn, setTimeFilterOn] = useState(search_filters_enable.time);
  const [deptFilterOn, setDeptFilterOn] = useState(search_filters_enable.department);
  const [catFilterOn, setCatFilterOn] = useState(search_filters_enable.category);
  const [enrollFilterOn, setEnrollFilterOn] = useState(search_filters_enable.enroll_method);

  const [displayFilter, setDisplayFilter] = useState(false);
  const [displayTable, setDisplayTable] = useState(!isMobile);

  // state for no login warning when creating a course table.
  const [isLoginWarningOpen, setIsLoginWarningOpen] = useState(false);
  const [agreeToCreateTableWithoutLogin, setAgreeToCreateTableWithoutLogin] = useState(false);

  // State for the course result row that is been hovered now.
  const [hoveredCourse, setHoveredCourse] = useState(null);
  // search_settings local states
  const [show_selected_courses, set_show_selected_courses] = useState(search_settings.show_selected_courses);
  const [only_show_not_conflicted_courses, set_only_show_not_conflicted_courses] = useState(search_settings.only_show_not_conflicted_courses);
  const [sync_add_to_nol, set_sync_add_to_nol] = useState(search_settings.sync_add_to_nol);
  const [strict_search_mode, set_strict_search_mode] = useState(search_settings.strict_search_mode);

  const [coursesInTable, setCoursesInTable] = useState([]);
  const [displayTags, setDisplayTags] = useState(display_tags);
  const available_tags = ["required", "total_slot", "enroll_method", "area"];

  // states for course enroll status
  const [isCourseStatusModalOpen, setIsCourseStatusModalOpen] = useState(null);
  const [isFetchingCourseStatus, setIsFetchingCourseStatus] = useState(false);
  const [courseEnrollStatus, setCourseEnrollStatus] = useState({
    enrolled: "",
    enrolled_other: "",
    registered: "",
    remain: "",
  });

  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isHigherThan1325) {
      dispatch(setBatchSize(25));
    }
  }, [isHigherThan1325]);

  useEffect(() => {
    dispatch(setNewDisplayTags(displayTags));
  }, [displayTags]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setDisplayFilter(false);
  }, [search_ids]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta({ title: `課程搜尋 | NTUCourse Neo`, desc: `課程搜尋頁面 | NTUCourse Neo，全新的臺大選課網站。` });
  }, []);

  useEffect(() => {
    async function fetchCourseEnrollData() {
      setIsFetchingCourseStatus(true);
      let data;
      try {
        data = await dispatch(getCourseEnrollInfo(isCourseStatusModalOpen));
      } catch (error) {
        setIsFetchingCourseStatus(false);
        setIsCourseStatusModalOpen(null);
        toast({
          title: "錯誤",
          description: "無法取得課程即時資訊",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      if (!data) {
        setIsFetchingCourseStatus(false);
        setIsCourseStatusModalOpen(null);
        toast({
          title: "錯誤",
          description: "無法取得課程即時資訊",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setCourseEnrollStatus(data);
      setIsFetchingCourseStatus(false);
    }

    if (isCourseStatusModalOpen) {
      if (!isAuthenticated) {
        toast({
          title: "請先登入",
          description: "課程即時資訊功能尚為 Beta 階段，僅供會員搶先試用",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        setIsCourseStatusModalOpen(null);
      } else {
        fetchCourseEnrollData();
      }
    }

    // console.log(isFetchingCourseStatus);
  }, [isCourseStatusModalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // if isMobile, when show Alert Modal, set displayTable to false to prevent ugly overlapping
  useEffect(() => {
    if (isLoginWarningOpen) {
      if (isMobile) {
        setDisplayTable(false);
      }
    }
  }, [isLoginWarningOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderCourseStatusModal = () => {
    const renderFormattedTime = () => {
      const fetch_time = new Date(courseEnrollStatus.fetch_ts * 1000);
      const fetch_time_str = `${fetch_time.getFullYear()}-${
        fetch_time.getMonth() + 1
      }-${fetch_time.getDate()} ${fetch_time.getHours()}:${fetch_time.getMinutes()}:${fetch_time.getSeconds()}`;
      return fetch_time_str;
    };
    return (
      <>
        <Modal
          isOpen={isCourseStatusModalOpen && isAuthenticated}
          onClose={() => {
            setIsCourseStatusModalOpen(null);
          }}
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              課程即時資訊
              <BetaBadge content="beta" />
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex w="100%" justifyContent="center" alignItems="center">
                {isFetchingCourseStatus ? (
                  <Spinner size="xl" color="teal" />
                ) : (
                  <Flex
                    w="100%"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="start"
                    bg="gray.200"
                    px="8"
                    py="4"
                    borderRadius="xl"
                    boxShadow="lg"
                  >
                    <Flex
                      w="100%"
                      flexDirection={isMobile ? "column" : "row"}
                      justifyContent="center"
                      alignItems={isMobile ? "start" : "center"}
                      flexWrap="wrap"
                    >
                      <Stat w="20vw">
                        <StatLabel>已選上人數</StatLabel>
                        <StatNumber>{courseEnrollStatus.enrolled}</StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel>已選上外系人數</StatLabel>
                        <StatNumber>{courseEnrollStatus.enrolled_other}</StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel>已登記人數</StatLabel>
                        <StatNumber>{courseEnrollStatus.registered}</StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel>剩餘空位</StatLabel>
                        <StatNumber>{courseEnrollStatus.remain}</StatNumber>
                      </Stat>
                    </Flex>
                    <HStack mt="4" spacing="2">
                      <FaRss color="gray" size="15" />
                      <Text fontSize="sm" textAlign="center" color="gray.500">
                        更新時間: {renderFormattedTime()}
                      </Text>
                    </HStack>
                  </Flex>
                )}
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Text fontSize="sm" textAlign="center" color="gray.500">
                資料來自 臺大選課系統
              </Text>
              <Spacer />
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  setIsCourseStatusModalOpen(null);
                }}
              >
                關閉
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };

  const renderNoLoginWarning = () => {
    const onClose = () => setIsLoginWarningOpen(false);
    // console.log("renderNoLoginWarning");
    return (
      <>
        <AlertDialog isOpen={isLoginWarningOpen} onClose={onClose} motionPreset="slideInBottom" isCentered>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                等等，你還沒登入啊！
              </AlertDialogHeader>
              <AlertDialogBody>
                <Alert status="warning">
                  <AlertIcon />
                  訪客課表將於一天後過期，屆時您將無法存取此課表。
                </Alert>
                <Text mt={4} color="gray.600" fontWeight="700" fontSize="lg">
                  真的啦！相信我。
                  <br />
                  註冊跟登入非常迅速，而且課表還能永久保存喔！
                </Text>
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  onClick={() => {
                    setIsLoginWarningOpen(false);
                    setAgreeToCreateTableWithoutLogin(true);
                  }}
                >
                  等等再說
                </Button>
                <Button
                  colorScheme="teal"
                  rightIcon={<FaArrowRight />}
                  onClick={() => {
                    setIsLoginWarningOpen(false);
                    loginWithPopup();
                  }}
                  ml={3}
                >
                  去登入
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    );
  };

  const renderSettingSwitch = (label, default_checked, isDisabled) => {
    const handleChangeSettings = (e) => {
      // console.log(e.currentTarget.checked);
      if (label === "ˋ只顯示未選課程") {
        set_show_selected_courses(e.currentTarget.checked);
      } else if (label === "只顯示未衝堂課程") {
        set_only_show_not_conflicted_courses(e.currentTarget.checked);
      } else if (label === "同步新增至課程網") {
        set_sync_add_to_nol(e.currentTarget.checked);
      } else if (label === "篩選條件嚴格搜尋") {
        set_strict_search_mode(e.currentTarget.checked);
      }
    };
    if (isMobile && isDisabled) {
      return <></>;
    }

    return (
      <Flex alignItems="center">
        <Switch
          id={label}
          defaultChecked={default_checked}
          mr="2"
          onChange={(e) => {
            handleChangeSettings(e);
          }}
          isDisabled={isDisabled}
        />
        <FormLabel htmlFor={label} mb="0" fontWeight="500" color="gray.600">
          {label}
          {isDisabled ? (
            <Badge ml="2" colorScheme="blue">
              即將推出
            </Badge>
          ) : (
            <></>
          )}
        </FormLabel>
      </Flex>
    );
  };

  const handleScrollToBottom = () => {
    if (reachedBottom && search_results.length !== 0) {
      // fetch next batch of search results
      if (search_results.length < total_count) {
        try {
          dispatch(fetchSearchResults(search_ids, search_filters_enable, search_filters, batch_size, offset, search_settings.strict_search_mode));
        } catch (error) {
          toast({
            title: "獲取課程資訊失敗",
            description: "請檢查網路連線",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    }
  };

  const set_enroll_method = (e) => {
    // console.log(e.currentTarget.value)
    let new_enroll_method = e.currentTarget.value;
    let idx = selectedEnrollMethod.indexOf(new_enroll_method);
    if (idx === -1) {
      //add
      setSelectedEnrollMethod([...selectedEnrollMethod, new_enroll_method]);
    } else {
      // remove
      setSelectedEnrollMethod(selectedEnrollMethod.filter((item) => item !== new_enroll_method));
    }
  };

  useEffect(() => {
    // console.log(selectedEnrollMethod);
    dispatch(setFilter("enroll_method", selectedEnrollMethod));
  }, [selectedEnrollMethod]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    topRef.current.focus();
  }, [search_ids]);

  useEffect(() => {
    // console.log('reachedBottom: ',reachedBottom);
    handleScrollToBottom();
  }, [reachedBottom]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSelectedTime(mapStateToTimeTable(search_filters.time));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {renderCourseStatusModal()}
      {renderNoLoginWarning()}
      <Flex w="100vw" direction="row" justifyContent="center" alignItems="center" overflow="hidden">
        <Box
          display="flex"
          flexBasis="100vw"
          flexDirection="column"
          alignItems="start"
          h="95vh"
          overflow="auto"
          maxW="screen-md"
          mx="auto"
          pt="64px"
          pb="40px"
        >
          <div ref={topRef} />
          <Flex w="100%" direction="column" position="sticky" top="0" bgColor="white" zIndex="100" boxShadow="md">
            <Flex w="100%" px="10vw" py="4" direction="column">
              <CourseSearchInput />
              <Collapse in={displayFilter} animateOpacity>
                <Box w="100%" py="8px" mt="4">
                  <Tabs>
                    <TabList>
                      <Tab>
                        <Text color="gray.700" fontSize={isMobile ? "md" : "xl"} fontWeight="700">
                          篩選
                        </Text>
                      </Tab>
                      <Tab>
                        <Text color="gray.700" fontSize={isMobile ? "md" : "xl"} fontWeight="700">
                          設定
                        </Text>
                      </Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        {/* Filters: time, department, type of courses */}
                        <Flex flexDirection="row" flexWrap="wrap" css={{ gap: "10px" }}>
                          <Flex flexDirection="column" px="4">
                            <Flex flexDirection="row" alignItems="center" justifyContent="center">
                              <Switch
                                size={isMobile ? "md" : "lg"}
                                mr="2"
                                isChecked={timeFilterOn}
                                onChange={(e) => {
                                  setTimeFilterOn(e.currentTarget.checked);
                                  dispatch(setFilterEnable("time", e.currentTarget.checked));
                                }}
                              />
                              <TimeFilterModal
                                title={
                                  mapStateToIntervals(search_filters.time) === 0
                                    ? "未選擇課程時間"
                                    : "已選擇 " + mapStateToIntervals(search_filters.time) + " 節次"
                                }
                                toggle={timeFilterOn}
                                selectedTime={selectedTime}
                                setSelectedTime={setSelectedTime}
                              />
                            </Flex>
                          </Flex>
                          <Flex flexDirection="column" px="4">
                            <Flex flexDirection="row" alignItems="center" justifyContent="center">
                              <Switch
                                size={isMobile ? "md" : "lg"}
                                mr="2"
                                isChecked={deptFilterOn}
                                onChange={(e) => {
                                  setDeptFilterOn(e.currentTarget.checked);
                                  dispatch(setFilterEnable("department", e.currentTarget.checked));
                                }}
                              />
                              <DeptFilterModal
                                title={selectedDept.length === 0 ? "未選擇開課系所" : "已選擇 " + selectedDept.length + " 系所"}
                                isEnabled={deptFilterOn}
                                selectedDept={selectedDept}
                                setSelectedDept={setSelectedDept}
                              />
                            </Flex>
                          </Flex>
                          <Flex flexDirection="column" px="4">
                            <Flex flexDirection="row" alignItems="center" justifyContent="center">
                              <Switch
                                size={isMobile ? "md" : "lg"}
                                mr="2"
                                isChecked={catFilterOn}
                                onChange={(e) => {
                                  setCatFilterOn(e.currentTarget.checked);
                                  dispatch(setFilterEnable("category", e.currentTarget.checked));
                                }}
                              />
                              <CategoryFilterModal
                                title={selectedType.length === 0 ? "未選擇課程類別" : "已選擇 " + selectedType.length + " 類別"}
                                isEnabled={catFilterOn}
                                selectedType={selectedType}
                                setSelectedType={setSelectedType}
                              />
                            </Flex>
                          </Flex>
                          <Flex flexDirection="column" px="4">
                            <Flex flexDirection="row" alignItems="center" justifyContent="center">
                              <Switch
                                size={isMobile ? "md" : "lg"}
                                mr="2"
                                isChecked={enrollFilterOn}
                                onChange={(e) => {
                                  setEnrollFilterOn(e.currentTarget.checked);
                                  dispatch(setFilterEnable("enroll_method", e.currentTarget.checked));
                                }}
                              />
                              <Menu closeOnSelect={false} mx="2">
                                <MenuButton size={isMobile ? "sm" : "md"} as={Button} rightIcon={<FaChevronDown />} disabled={!enrollFilterOn}>
                                  加選方式
                                </MenuButton>
                                <MenuList>
                                  <MenuOptionGroup value={selectedEnrollMethod} type="checkbox">
                                    <MenuItemOption
                                      key="1"
                                      value="1"
                                      onClick={(e) => {
                                        set_enroll_method(e);
                                      }}
                                    >
                                      <Badge mr="2" colorScheme="blue">
                                        1
                                      </Badge>
                                      直接加選
                                    </MenuItemOption>
                                    <MenuItemOption
                                      key="2"
                                      value="2"
                                      onClick={(e) => {
                                        set_enroll_method(e);
                                      }}
                                    >
                                      <Badge mr="2" colorScheme="blue">
                                        2
                                      </Badge>
                                      授權碼加選
                                    </MenuItemOption>
                                    <MenuItemOption
                                      key="3"
                                      value="3"
                                      onClick={(e) => {
                                        set_enroll_method(e);
                                      }}
                                    >
                                      <Badge mr="2" colorScheme="blue">
                                        3
                                      </Badge>
                                      登記後加選
                                    </MenuItemOption>
                                  </MenuOptionGroup>
                                  <MenuDivider />
                                  <Flex flexDirection="row" justifyContent="center">
                                    <Text fontSize="sm" color="gray.500">
                                      加退選規定詳洽教務處
                                    </Text>
                                  </Flex>
                                </MenuList>
                              </Menu>
                            </Flex>
                          </Flex>
                        </Flex>
                      </TabPanel>
                      <TabPanel>
                        {/* Settings */}
                        <Flex flexDirection="row" flexWrap="wrap" css={{ gap: "10px" }}>
                          <Flex
                            w={isMobile ? "100%" : "50%"}
                            flexDirection="column"
                            p="4"
                            mr={isMobile ? "0" : "4"}
                            borderWidth="2px"
                            borderRadius="lg"
                          >
                            <Text fontSize="lg" color="gray.500" fontWeight="700" mb="4">
                              課表設定
                            </Text>
                            <Flex w="100%" flexDirection="row" alignItems="center" flexWrap="wrap" css={{ gap: "6px" }}>
                              {renderSettingSwitch("篩選條件嚴格搜尋", strict_search_mode, false)}
                              {renderSettingSwitch("只顯示未選課程", show_selected_courses, true)}
                              {renderSettingSwitch("只顯示未衝堂課程", only_show_not_conflicted_courses, true)}
                              {renderSettingSwitch("同步新增至課程網", sync_add_to_nol, true)}
                            </Flex>
                            <Button
                              mt={2}
                              colorScheme="teal"
                              size={isMobile ? "sm" : "md"}
                              onClick={() => {
                                dispatch(
                                  setSearchSettings({
                                    show_selected_courses: show_selected_courses,
                                    only_show_not_conflicted_courses: only_show_not_conflicted_courses,
                                    sync_add_to_nol: sync_add_to_nol,
                                    strict_search_mode: strict_search_mode,
                                  })
                                );
                                toast({
                                  title: "設定已儲存",
                                  description: "讚啦",
                                  status: "success",
                                  duration: 1000,
                                  isClosable: true,
                                });
                              }}
                            >
                              套用
                            </Button>
                          </Flex>
                          <Flex flexDirection="column" p="4" borderWidth="2px" borderRadius="lg">
                            <Text fontSize="lg" color="gray.500" fontWeight="700" mb="4">
                              自訂顯示欄位
                            </Text>
                            <Flex w="100%" flexDirection="row" alignItems="center" flexWrap="wrap" css={{ gap: "4px" }}>
                              {available_tags.map((tag, index) => {
                                // console.log(displayTags)
                                const selected = displayTags.includes(tag);
                                return (
                                  <Tag
                                    key={tag}
                                    as="button"
                                    m="2"
                                    ml="0"
                                    variant={selected ? "solid" : "subtle"}
                                    onClick={
                                      selected
                                        ? () => {
                                            setDisplayTags([...displayTags.filter((t) => t !== tag)]);
                                          }
                                        : () => {
                                            setDisplayTags([...displayTags, tag]);
                                          }
                                    }
                                    transition="all 200ms ease-in-out"
                                  >
                                    <TagLeftIcon key={tag + "-Icon"} boxSize="12px" as={selected ? FaMinus : FaPlus} />
                                    {info_view_map[tag].name}
                                  </Tag>
                                );
                              })}
                            </Flex>
                          </Flex>
                        </Flex>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Box>
              </Collapse>
            </Flex>
            <IconButton
              size="xs"
              variant="ghost"
              icon={displayFilter ? <FaChevronUp /> : <FaChevronDown />}
              onClick={() => setDisplayFilter(!displayFilter)}
            />
          </Flex>
          {isMobile ? (
            <>
              <Flex flexDirection="column" alignItems="center" justifyContent="start" w="100%">
                <Flex flexDirection="row" alignItems="center" justifyContent="start">
                  {search_loading ? <BeatLoader size={8} color="teal" /> : <></>}
                  <Text fontSize="md" fontWeight="medium" color="gray.400" my="2" ml="1">
                    {search_loading ? "載入中" : `共找到 ${total_count} 筆結果`}
                  </Text>
                </Flex>
                <CourseInfoRowContainer
                  courseInfo={search_results}
                  setHoveredCourse={setHoveredCourse}
                  selectedCourses={coursesInTable}
                  displayTags={displayTags}
                  displayTable={displayTable}
                  isCourseStatusModalOpen={isCourseStatusModalOpen}
                  setIsCourseStatusModalOpen={setIsCourseStatusModalOpen}
                />
              </Flex>
              <Flex w="100%" alignItems="center" justifyContent="center">
                <SkeletonRow loading={search_loading} error={search_error} />
              </Flex>
            </>
          ) : (
            <>
              <Box ml={displayTable ? "2vw" : "15vw"} w={displayTable ? "55vw" : "70vw"} transition="all 500ms ease-in-out">
                <Flex flexDirection="row" alignItems="center" justifyContent="start">
                  {search_loading ? <BeatLoader size={8} color="teal" /> : <></>}
                  <Text fontSize="md" fontWeight="medium" color="gray.400" my="2" ml="1">
                    {search_loading ? "載入中" : `共找到 ${total_count} 筆結果`}
                  </Text>
                </Flex>
                <CourseInfoRowContainer
                  courseInfo={search_results}
                  setHoveredCourse={setHoveredCourse}
                  selectedCourses={coursesInTable}
                  displayTags={displayTags}
                  displayTable={displayTable}
                  isCourseStatusModalOpen={isCourseStatusModalOpen}
                  setIsCourseStatusModalOpen={setIsCourseStatusModalOpen}
                />
              </Box>
              <Box ml={displayTable ? "24vw" : "48vw"} transition="all 500ms ease-in-out">
                <SkeletonRow loading={search_loading} error={search_error} />
              </Box>
            </>
          )}
          <div ref={bottomRef} />
        </Box>
      </Flex>
      <Fade in={!displayTable}>
        <Flex
          as="button"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          position="absolute"
          top={isMobile ? "85vh" : "80vh"}
          left={isMobile ? "70vw" : "90vw"}
          bg="gray.100"
          boxShadow="md"
          py="1"
          px="4"
          borderRadius="xl"
          onClick={() => setDisplayTable(!displayTable)}
          _hover={{ boxShadow: "lg", transform: "translateY(-2px) scale(1.02)" }}
          transition="all 200ms"
        >
          <Icon mr="1" as={FaRegCalendarAlt} boxSize="4" color="teal.500" />
          <Text my="2" fontWeight={800} fontSize={isMobile ? "md" : "lg"} color="gray.600">
            課表
          </Text>
        </Flex>
      </Fade>
      <Collapse in={displayTable} animateOpacity>
        <Flex justifyContent="end" mr="2">
          <Box
            position="absolute"
            top={isMobile ? "" : "8vh"}
            bottom="0"
            right="0"
            zIndex={isMobile ? "10000" : "1"}
            w={isMobile ? "100vw" : "40vw"}
            h={isMobile ? "90vh" : "70vh"}
            bg="gray.200"
            mt="128px"
            borderRadius="lg"
            boxShadow="xl"
          >
            <SideCourseTableContainer
              isDisplay={displayTable}
              setIsDisplay={setDisplayTable}
              hoveredCourse={hoveredCourse}
              setHoveredCourse={setHoveredCourse}
              courseIds={coursesInTable}
              setCourseIds={setCoursesInTable}
              setIsLoginWarningOpen={setIsLoginWarningOpen}
              agreeToCreateTableWithoutLogin={agreeToCreateTableWithoutLogin}
              setIsCourseStatusModalOpen={setIsCourseStatusModalOpen}
            />
          </Box>
        </Flex>
      </Collapse>
    </>
  );
}

export default CourseResultViewContainer;
