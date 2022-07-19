import { React, useState } from "react";
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
  useColorModeValue,
} from "@chakra-ui/react";
import { Search2Icon, ChevronDownIcon } from "@chakra-ui/icons";
import { FaSearch, FaPlus, FaMinus, FaChevronDown } from "react-icons/fa";
import TimeFilterModal from "components/FilterModals/TimeFilterModal";
import DeptFilterModal from "components/FilterModals/DeptFilterModal";
import CategoryFilterModal from "components/FilterModals/CategoryFilterModal";
import {
  mapStateToTimeTable,
  mapStateToIntervals,
} from "utils/timeTableConverter";
import { info_view_map } from "data/mapping_table";
import { useMount } from "react-use";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import { useDisplayTags } from "components/Providers/DisplayTagsProvider";
import { fetchSearchResult } from "queries/course";
import { useRouter } from "next/router";

function CourseSearchInputTextArea(props) {
  const { searchCallback = () => {} } = props;
  const toast = useToast();
  const router = useRouter();
  const {
    searchColumns,
    searchFilters,
    batchSize,
    searchFiltersEnable,
    searchSettings,
    setSearchColumns,
    setSearchResult,
    setSearchLoading,
    setSearchError,
    setOffset,
    setTotalCount,
    setSearch,
  } = useCourseSearchingContext();

  const [searchText, setSearchText] = useState("");
  useMount(() => {
    setSearch("");
  });

  const toggle_search_column = (e) => {
    const col_name = e.currentTarget.value;
    if (searchColumns.includes(col_name)) {
      setSearchColumns(searchColumns.filter((col) => col !== col_name));
    } else {
      setSearchColumns([...searchColumns, col_name]);
    }
  };

  const startSearch = async () => {
    // console.log(searchColumns);
    if (searchColumns.length === 0) {
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
      setSearchLoading(true);
      setSearchResult([]);
      setSearch(searchText);
      await fetchSearchResult(
        searchText,
        searchColumns,
        searchFiltersEnable,
        searchFilters,
        batchSize,
        0,
        searchSettings.strict_search_mode,
        {
          onSuccess: ({ courses, totalCount }) => {
            setSearchResult(courses);
            setTotalCount(totalCount);
            setOffset(batchSize);
            setSearchLoading(false);
            setSearchError(null);
            searchCallback();
          },
        }
      );
    } catch (e) {
      setSearchLoading(false);
      setSearchError(e);
      if (e.status >= 500) {
        router.push(`/404`);
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
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent={["start", "start", "center", "center"]}
        flexWrap="wrap"
        css={{ gap: "10px" }}
        bg={useColorModeValue("white", "gray.800")}
      >
        <Menu closeOnSelect={false} mx="2">
          <MenuButton as={Button} size={"md"} rightIcon={<ChevronDownIcon />}>
            搜尋欄位
          </MenuButton>
          <MenuList>
            <MenuOptionGroup defaultValue={["name", "teacher"]} type="checkbox">
              <MenuItemOption
                value="name"
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
                value="serial"
                onClick={(e) => {
                  toggle_search_column(e);
                }}
              >
                流水號
              </MenuItemOption>
              <MenuItemOption
                value="code"
                onClick={(e) => {
                  toggle_search_column(e);
                }}
              >
                課號
              </MenuItemOption>
              <MenuItemOption
                value="identifier"
                onClick={(e) => {
                  toggle_search_column(e);
                }}
              >
                課程識別碼
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
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
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

function SettingSwitch({ label, setterFunc, defaultValue, isDisabled }) {
  const textColor = useColorModeValue("gray.500", "text.dark");
  if (isDisabled) {
    return <></>;
  }
  return (
    <Flex alignItems="center" diisplay={{ base: "none", lg: "inline-block" }}>
      <Switch
        id={label}
        defaultChecked={defaultValue}
        mr="2"
        onChange={(e) => {
          setterFunc(e.currentTarget.checked);
        }}
        isDisabled={isDisabled}
      />
      <FormLabel htmlFor={label} mb="0" fontWeight="500" color={textColor}>
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
}

function CourseSearchInput({ displayPanel, searchCallback }) {
  const toast = useToast();
  const {
    searchFilters,
    searchSettings,
    searchFiltersEnable,
    setSearchFiltersEnable,
    setSearchSettings,
    setSearchFilters,
  } = useCourseSearchingContext();
  const { displayTags, setDisplayTags } = useDisplayTags();
  const available_tags = ["requirement", "slot", "enroll_method", "areas"];

  // filters local states
  const [selectedTime, setSelectedTime] = useState(
    mapStateToTimeTable(searchFilters.time)
  );
  const [selectedDept, setSelectedDept] = useState(searchFilters.department);
  const [selectedType, setSelectedType] = useState(searchFilters.category);

  const [timeFilterOn, setTimeFilterOn] = useState(searchFiltersEnable.time);
  const [deptFilterOn, setDeptFilterOn] = useState(
    searchFiltersEnable.department
  );
  const [catFilterOn, setCatFilterOn] = useState(searchFiltersEnable.category);
  const [enrollFilterOn, setEnrollFilterOn] = useState(
    searchFiltersEnable.enroll_method
  );

  // searchSettings local states
  const [show_selected_courses, set_show_selected_courses] = useState(
    searchSettings.show_selected_courses
  );
  const [
    only_show_not_conflicted_courses,
    set_only_show_not_conflicted_courses,
  ] = useState(searchSettings.only_show_not_conflicted_courses);
  const [sync_add_to_nol, set_sync_add_to_nol] = useState(
    searchSettings.sync_add_to_nol
  );
  const [strict_search_mode, set_strict_search_mode] = useState(
    searchSettings.strict_search_mode
  );

  useMount(() => {
    setSelectedTime(mapStateToTimeTable(searchFilters.time));
  });

  const set_enroll_method = (e) => {
    // console.log(e.currentTarget.value)
    const new_enroll_method = e.currentTarget.value;
    const idx = searchFilters.enroll_method.indexOf(new_enroll_method);
    if (idx === -1) {
      //add
      setSearchFilters({
        ...searchFilters,
        enroll_method: [...searchFilters.enroll_method, new_enroll_method],
      });
    } else {
      // remove

      setSearchFilters({
        ...searchFilters,
        enroll_method: searchFilters.enroll_method.filter(
          (item) => item !== new_enroll_method
        ),
      });
    }
  };

  return (
    <>
      <CourseSearchInputTextArea searchCallback={searchCallback} />
      <Collapse in={displayPanel} animateOpacity>
        <Box
          w="100%"
          py="8px"
          mt="4"
          bg={useColorModeValue("white", "gray.800")}
        >
          <Tabs>
            <TabList>
              <Tab>
                <Text
                  color={useColorModeValue("heading.light", "heading.dark")}
                  fontSize={{ base: "md", lg: "xl" }}
                  fontWeight="700"
                >
                  篩選
                </Text>
              </Tab>
              <Tab>
                <Text
                  color={useColorModeValue("heading.light", "heading.dark")}
                  fontSize={{ base: "md", lg: "xl" }}
                  fontWeight="700"
                >
                  設定
                </Text>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {/* Filters: time, department, type of courses */}
                <Flex flexDirection="row" flexWrap="wrap" css={{ gap: "10px" }}>
                  <Flex flexDirection="column" px="4">
                    <Flex
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Switch
                        size={
                          useBreakpointValue({ base: "md", lg: "lg" }) ?? "md"
                        }
                        mr="2"
                        isChecked={timeFilterOn}
                        onChange={(e) => {
                          setTimeFilterOn(e.currentTarget.checked);
                          setSearchFiltersEnable({
                            ...searchFiltersEnable,
                            time: e.currentTarget.checked,
                          });
                        }}
                      />
                      <TimeFilterModal
                        title={
                          mapStateToIntervals(searchFilters.time) === 0
                            ? "未選擇課程時間"
                            : "已選擇 " +
                              mapStateToIntervals(searchFilters.time) +
                              " 節次"
                        }
                        toggle={timeFilterOn}
                        selectedTime={selectedTime}
                        setSelectedTime={setSelectedTime}
                      />
                    </Flex>
                  </Flex>
                  <Flex flexDirection="column" px="4">
                    <Flex
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Switch
                        size={
                          useBreakpointValue({ base: "md", lg: "lg" }) ?? "md"
                        }
                        mr="2"
                        isChecked={deptFilterOn}
                        onChange={(e) => {
                          setDeptFilterOn(e.currentTarget.checked);
                          setSearchFiltersEnable({
                            ...searchFiltersEnable,
                            department: e.currentTarget.checked,
                          });
                        }}
                      />
                      <DeptFilterModal
                        title={
                          selectedDept.length === 0
                            ? "未選擇開課系所"
                            : "已選擇 " + selectedDept.length + " 系所"
                        }
                        isEnabled={deptFilterOn}
                        selectedDept={selectedDept}
                        setSelectedDept={setSelectedDept}
                      />
                    </Flex>
                  </Flex>
                  <Flex flexDirection="column" px="4">
                    <Flex
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Switch
                        size={
                          useBreakpointValue({ base: "md", lg: "lg" }) ?? "md"
                        }
                        mr="2"
                        isChecked={catFilterOn}
                        onChange={(e) => {
                          setCatFilterOn(e.currentTarget.checked);
                          setSearchFiltersEnable({
                            ...searchFiltersEnable,
                            category: e.currentTarget.checked,
                          });
                        }}
                      />
                      <CategoryFilterModal
                        title={
                          selectedType.length === 0
                            ? "未選擇課程類別"
                            : "已選擇 " + selectedType.length + " 類別"
                        }
                        isEnabled={catFilterOn}
                        selectedType={selectedType}
                        setSelectedType={setSelectedType}
                      />
                    </Flex>
                  </Flex>
                  <Flex flexDirection="column" px="4">
                    <Flex
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Switch
                        size={
                          useBreakpointValue({ base: "md", lg: "lg" }) ?? "md"
                        }
                        mr="2"
                        isChecked={enrollFilterOn}
                        onChange={(e) => {
                          setEnrollFilterOn(e.currentTarget.checked);
                          setSearchFiltersEnable({
                            ...searchFiltersEnable,
                            enroll_method: e.currentTarget.checked,
                          });
                        }}
                      />
                      <Menu closeOnSelect={false} mx="2">
                        <MenuButton
                          size={
                            useBreakpointValue({ base: "sm", md: "md" }) ?? "md"
                          }
                          as={Button}
                          rightIcon={<FaChevronDown />}
                          disabled={!enrollFilterOn}
                        >
                          加選方式
                        </MenuButton>
                        <MenuList>
                          <MenuOptionGroup
                            value={searchFilters.enroll_method}
                            type="checkbox"
                          >
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
                    w={{ base: "100%", lg: "50%" }}
                    flexDirection="column"
                    p="4"
                    mr={{ base: 0, lg: 4 }}
                    borderWidth="2px"
                    borderRadius="lg"
                  >
                    <Text
                      fontSize="lg"
                      color={useColorModeValue("gray.500", "text.dark")}
                      fontWeight="700"
                      mb="4"
                    >
                      課表設定
                    </Text>
                    <Flex
                      w="100%"
                      flexDirection="row"
                      alignItems="center"
                      flexWrap="wrap"
                      css={{ gap: "6px" }}
                    >
                      <SettingSwitch
                        label="篩選條件嚴格搜尋"
                        setterFunc={set_strict_search_mode}
                        defaultValue={strict_search_mode}
                        isDisabled={false}
                      />
                      <SettingSwitch
                        label="只顯示未選課程"
                        setterFunc={set_show_selected_courses}
                        defaultValue={show_selected_courses}
                        isDisabled={true}
                      />
                      <SettingSwitch
                        label="只顯示未衝堂課程"
                        setterFunc={set_only_show_not_conflicted_courses}
                        defaultValue={only_show_not_conflicted_courses}
                        isDisabled={true}
                      />
                      <SettingSwitch
                        label="同步新增至課程網"
                        setterFunc={set_sync_add_to_nol}
                        defaultValue={sync_add_to_nol}
                        isDisabled={true}
                      />
                    </Flex>
                    <Button
                      mt={2}
                      colorScheme="teal"
                      size={
                        useBreakpointValue({ base: "sm", lg: "md" }) ?? "sm"
                      }
                      onClick={() => {
                        setSearchSettings({
                          show_selected_courses: show_selected_courses,
                          only_show_not_conflicted_courses:
                            only_show_not_conflicted_courses,
                          sync_add_to_nol: sync_add_to_nol,
                          strict_search_mode: strict_search_mode,
                        });
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
                  <Flex
                    flexDirection="column"
                    p="4"
                    borderWidth="2px"
                    borderRadius="lg"
                  >
                    <Text
                      fontSize="lg"
                      color={useColorModeValue("gray.500", "text.dark")}
                      fontWeight="700"
                      mb="4"
                    >
                      自訂顯示欄位
                    </Text>
                    <Flex
                      w="100%"
                      flexDirection="row"
                      alignItems="center"
                      flexWrap="wrap"
                      css={{ gap: "4px" }}
                    >
                      {available_tags.map((tag) => {
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
                                    setDisplayTags([
                                      ...displayTags.filter((t) => t !== tag),
                                    ]);
                                  }
                                : () => {
                                    setDisplayTags([...displayTags, tag]);
                                  }
                            }
                            transition="all 200ms ease-in-out"
                          >
                            <TagLeftIcon
                              key={tag + "-Icon"}
                              boxSize="12px"
                              as={selected ? FaMinus : FaPlus}
                            />
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
