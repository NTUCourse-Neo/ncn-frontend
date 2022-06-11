import { React, useEffect, useState } from "react";
import {
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Menu,
  MenuButton,
  MenuList,
  useToast,
  MenuItemOption,
  MenuOptionGroup,
  Badge,
  Spacer,
  HStack,
  Text,
  Collapse,
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Switch,
  MenuDivider,
  TagLeftIcon,
  FormLabel,
  useBreakpointValue,
  Tag,
} from "@chakra-ui/react";
import { Search2Icon, ChevronDownIcon } from "@chakra-ui/icons";
import { FaSearch, FaPlus, FaMinus, FaChevronDown } from "react-icons/fa";
import { setSearchColumn, setSearchSettings, setFilter, setFilterEnable, setNewDisplayTags } from "actions/index";
import { fetchSearchIDs } from "actions/courses";
import TimeFilterModal from "components/FilterModals/TimeFilterModal";
import DeptFilterModal from "components/FilterModals/DeptFilterModal";
import CategoryFilterModal from "components/FilterModals/CategoryFilterModal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { mapStateToTimeTable, mapStateToIntervals } from "utils/timeTableConverter";
import { info_view_map } from "data/mapping_table";

function CourseSearchInputTextArea() {
  const navigate = useNavigate();
  const toast = useToast();

  const search_columns = useSelector((state) => state.search_columns);
  const search_filters = useSelector((state) => state.search_filters);
  const batch_size = useSelector((state) => state.batch_size);
  const strict_match = useSelector((state) => state.search_settings.strict_search_mode);
  const search_filters_enable = useSelector((state) => state.search_filters_enable);

  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

  const toggle_search_column = (e) => {
    dispatch(setSearchColumn(e.currentTarget.value));
  };

  useEffect(() => {
    setSearch("");
  }, []);

  const startSearch = () => {
    // console.log(search_columns);
    if (search_columns.length === 0) {
      toast({
        title: "搜尋失敗",
        description: "您必須指定至少一個搜尋欄位",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      dispatch(fetchSearchIDs(search, search_columns, search_filters_enable, search_filters, batch_size, strict_match));
    } catch (error) {
      if (error.status_code >= 500) {
        navigate(`/error/${error.status_code}`, { state: error });
      } else {
        toast({
          title: "搜尋失敗",
          description: "請檢查網路連線，或聯絡系統管理員",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="row" alignItems="center" justifyContent={["start", "start", "center", "center"]} flexWrap="wrap" css={{ gap: "10px" }}>
        <Menu closeOnSelect={false} mx="2">
          <MenuButton as={Button} size={"md"} rightIcon={<ChevronDownIcon />}>
            搜尋欄位
          </MenuButton>
          <MenuList>
            <MenuOptionGroup defaultValue={["course_name", "teacher"]} type="checkbox">
              <MenuItemOption
                value="course_name"
                onClick={(e) => {
                  toggle_search_column(e);
                }}
              >
                課程名稱 <Badge>預設</Badge>
              </MenuItemOption>
              <MenuItemOption
                value="teacher"
                onClick={(e) => {
                  toggle_search_column(e);
                }}
              >
                教師
              </MenuItemOption>
              <MenuItemOption
                value="id"
                onClick={(e) => {
                  toggle_search_column(e);
                }}
                isDisabled
              >
                流水號 <Badge colorScheme="blue">即將推出</Badge>
              </MenuItemOption>
              <MenuItemOption
                value="course_code"
                onClick={(e) => {
                  toggle_search_column(e);
                }}
                isDisabled
              >
                課號 <Badge colorScheme="blue">即將推出</Badge>
              </MenuItemOption>
              <MenuItemOption
                value="course_id"
                onClick={(e) => {
                  toggle_search_column(e);
                }}
                isDisabled
              >
                課程識別碼 <Badge colorScheme="blue">即將推出</Badge>
              </MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </Menu>
        <InputGroup w={["70%", "60%", "60%", "60%"]}>
          <InputLeftElement>
            <Search2Icon color="gray.500" />
          </InputLeftElement>
          <Input
            variant="flushed"
            size="md"
            focusBorderColor="teal.500"
            placeholder="直接搜尋可顯示全部課程"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                startSearch();
              }
            }}
          />
        </InputGroup>
        <Spacer display={{ base: "inline-block", md: "none" }} />
        <Button
          colorScheme="blue"
          size={"md"}
          variant="solid"
          onClick={() => {
            startSearch();
          }}
        >
          <HStack>
            <FaSearch />
            <Text display={{ base: "none", md: "inline" }}>搜尋</Text>
          </HStack>
        </Button>
      </Flex>
    </Flex>
  );
}

function CourseSearchInput({ displayPanel }) {
  const dispatch = useDispatch();
  const toast = useToast();

  const available_tags = ["required", "total_slot", "enroll_method", "area"];
  const search_filters = useSelector((state) => state.search_filters);
  const search_settings = useSelector((state) => state.search_settings);
  const search_filters_enable = useSelector((state) => state.search_filters_enable);
  const display_tags = useSelector((state) => state.display_tags);

  // filters local states
  const [selectedTime, setSelectedTime] = useState(mapStateToTimeTable(search_filters.time));
  const [selectedDept, setSelectedDept] = useState(search_filters.department);
  const [selectedType, setSelectedType] = useState(search_filters.category);

  const [timeFilterOn, setTimeFilterOn] = useState(search_filters_enable.time);
  const [deptFilterOn, setDeptFilterOn] = useState(search_filters_enable.department);
  const [catFilterOn, setCatFilterOn] = useState(search_filters_enable.category);
  const [enrollFilterOn, setEnrollFilterOn] = useState(search_filters_enable.enroll_method);

  // search_settings local states
  const [show_selected_courses, set_show_selected_courses] = useState(search_settings.show_selected_courses);
  const [only_show_not_conflicted_courses, set_only_show_not_conflicted_courses] = useState(search_settings.only_show_not_conflicted_courses);
  const [sync_add_to_nol, set_sync_add_to_nol] = useState(search_settings.sync_add_to_nol);
  const [strict_search_mode, set_strict_search_mode] = useState(search_settings.strict_search_mode);

  const set_enroll_method = (e) => {
    // console.log(e.currentTarget.value)
    const new_enroll_method = e.currentTarget.value;
    const idx = search_filters.enroll_method.indexOf(new_enroll_method);
    if (idx === -1) {
      //add
      dispatch(setFilter("enroll_method", [...search_filters.enroll_method, new_enroll_method]));
    } else {
      // remove
      dispatch(
        setFilter(
          "enroll_method",
          search_filters.enroll_method.filter((item) => item !== new_enroll_method)
        )
      );
    }
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
    if (isDisabled) {
      return <></>;
    }

    return (
      <Flex alignItems="center" diisplay={{ base: "none", lg: "inline-block" }}>
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

  useEffect(() => {
    setSelectedTime(mapStateToTimeTable(search_filters.time));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <CourseSearchInputTextArea />
      <Collapse in={displayPanel} animateOpacity>
        <Box w="100%" py="8px" mt="4">
          <Tabs>
            <TabList>
              <Tab>
                <Text color="gray.700" fontSize={{ base: "md", lg: "xl" }} fontWeight="700">
                  篩選
                </Text>
              </Tab>
              <Tab>
                <Text color="gray.700" fontSize={{ base: "md", lg: "xl" }} fontWeight="700">
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
                        size={useBreakpointValue({ base: "md", lg: "lg" }) ?? "md"}
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
                        size={useBreakpointValue({ base: "md", lg: "lg" }) ?? "md"}
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
                        size={useBreakpointValue({ base: "md", lg: "lg" }) ?? "md"}
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
                        size={useBreakpointValue({ base: "md", lg: "lg" }) ?? "md"}
                        mr="2"
                        isChecked={enrollFilterOn}
                        onChange={(e) => {
                          setEnrollFilterOn(e.currentTarget.checked);
                          dispatch(setFilterEnable("enroll_method", e.currentTarget.checked));
                        }}
                      />
                      <Menu closeOnSelect={false} mx="2">
                        <MenuButton
                          size={useBreakpointValue({ base: "sm", md: "md" }) ?? "md"}
                          as={Button}
                          rightIcon={<FaChevronDown />}
                          disabled={!enrollFilterOn}
                        >
                          加選方式
                        </MenuButton>
                        <MenuList>
                          <MenuOptionGroup value={search_filters.enroll_method} type="checkbox">
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
                  <Flex w={{ base: "100%", lg: "50%" }} flexDirection="column" p="4" mr={{ base: 0, lg: 4 }} borderWidth="2px" borderRadius="lg">
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
                      size={useBreakpointValue({ base: "sm", lg: "md" }) ?? "sm"}
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
                      {available_tags.map((tag) => {
                        // console.log(displayTags)
                        const selected = display_tags.includes(tag);
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
                                    dispatch(setNewDisplayTags([...display_tags.filter((t) => t !== tag)]));
                                  }
                                : () => {
                                    dispatch(setNewDisplayTags([...display_tags, tag]));
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
    </>
  );
}

export default CourseSearchInput;
