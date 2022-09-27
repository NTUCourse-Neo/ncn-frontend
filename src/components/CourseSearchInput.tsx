import React, { useState } from "react";
import {
  Flex,
  Input,
  Button,
  Menu,
  MenuButton,
  MenuList,
  useToast,
  MenuItemOption,
  MenuOptionGroup,
  Badge,
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
  Icon,
  ButtonGroup,
  Tooltip,
} from "@chakra-ui/react";
import { FaSearch, FaPlus, FaMinus, FaChevronDown } from "react-icons/fa";
import { TbListSearch } from "react-icons/tb";
import DeptFilterModal from "components/FilterModals/DeptFilterModal";
import CategoryFilterModal from "components/FilterModals/CategoryFilterModal";
import { info_view_map } from "data/mapping_table";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import {
  useDisplayTags,
  availableTags,
} from "components/Providers/DisplayTagsProvider";
import { useSWRConfig } from "swr";
import { reportEvent } from "utils/ga";
import { SearchFieldName, EnrollMethod } from "types/search";

const availableSemesters = ["1102", "1111"];

function CourseSearchInputTextArea(props: {
  readonly searchCallback?: () => void;
}) {
  const { searchCallback = () => {} } = props;
  const { mutate } = useSWRConfig();
  const toast = useToast();
  const {
    search,
    searchColumns,
    pageNumber,
    setSearchColumns,
    dispatchSearch,
    setSearchResultCount,
  } = useCourseSearchingContext();
  const [searchText, setSearchText] = useState("");
  const { searchSemester, setSearchSemester } = useCourseSearchingContext();

  const toggleSearchColumn = (col_name: SearchFieldName) => {
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
    if (searchText === search) {
      setSearchResultCount(0);
      for (let i = 0; i < pageNumber; i++) {
        mutate(`/api/search/${search}/${i}`);
      }
    } else {
      dispatchSearch(searchText);
    }
    searchCallback();
  };

  return (
    <Flex flexDirection="column">
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        css={{ gap: "10px" }}
      >
        <Menu closeOnSelect={false}>
          <MenuButton as={Button} size={{ base: "md", md: "md" }}>
            <Icon
              as={TbListSearch}
              mr={{ base: "0", md: "2" }}
              boxSize={{ base: "1.2em", md: "1em" }}
            />
            <Text display={{ base: "none", md: "inline-block" }}>設定</Text>
          </MenuButton>
          <MenuList>
            <MenuOptionGroup
              title="查詢欄位"
              defaultValue={searchColumns}
              type="checkbox"
            >
              <MenuItemOption
                value="name"
                onClick={(e) => {
                  toggleSearchColumn("name");
                  reportEvent("search", "toggle_search_column", "name");
                }}
              >
                課程名稱
              </MenuItemOption>
              <MenuItemOption
                value="teacher"
                onClick={(e) => {
                  toggleSearchColumn("teacher");
                  reportEvent("search", "toggle_search_column", "teacher");
                }}
              >
                教師姓名
              </MenuItemOption>
              <MenuItemOption
                value="serial"
                onClick={(e) => {
                  toggleSearchColumn("serial");
                  reportEvent("search", "toggle_search_column", "serial");
                }}
              >
                流水號
              </MenuItemOption>
              <MenuItemOption
                value="code"
                onClick={(e) => {
                  toggleSearchColumn("code");
                  reportEvent("search", "toggle_search_column", "code");
                }}
              >
                課號
              </MenuItemOption>
              <MenuItemOption
                value="identifier"
                onClick={(e) => {
                  toggleSearchColumn("identifier");
                  reportEvent("search", "toggle_search_column", "identifier");
                }}
              >
                課程識別碼
              </MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </Menu>
        <Input
          variant="flushed"
          size={{ base: "sm", md: "md" }}
          w={["50%", "60%", "60%", "60%"]}
          focusBorderColor="teal.500"
          placeholder="直接搜尋顯示全部課程"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              startSearch();
              reportEvent("search", "key_enter_search", searchText);
            }
          }}
        />
        <ButtonGroup isAttached>
          <Button
            colorScheme="blue"
            size={"md"}
            variant="solid"
            onClick={() => {
              startSearch();
              reportEvent("search", "click_search", searchText);
            }}
          >
            <HStack>
              <FaSearch />
              <Text display={{ base: "none", md: "inline" }}>搜尋</Text>
            </HStack>
          </Button>
          <Menu>
            <Tooltip
              hasArrow
              placement="top"
              label={"選擇學期"}
              bg="gray.600"
              color="white"
            >
              <MenuButton
                as={Button}
                colorScheme="blue"
                size={"md"}
                variant="solid"
                borderLeft={`0.1px solid ${useColorModeValue(
                  "white",
                  "black"
                )}`}
              >
                <FaChevronDown size={10} />
              </MenuButton>
            </Tooltip>
            <MenuList>
              <MenuOptionGroup
                value={searchSemester ?? undefined}
                title="開課學期"
                type="radio"
              >
                {availableSemesters.map((semester) => (
                  <MenuItemOption
                    key={semester}
                    value={semester}
                    onClick={() => {
                      setSearchSemester(semester);
                    }}
                  >
                    {semester}
                  </MenuItemOption>
                ))}
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
}

function SettingSwitch(props: {
  label: string;
  isDisabled: boolean;
  defaultValue: boolean;
  setterFunc: (x: boolean) => void;
}) {
  const { label, setterFunc, defaultValue, isDisabled } = props;
  const textColor = useColorModeValue("gray.500", "text.dark");
  return (
    <Flex alignItems="center">
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

export interface CourseSearchInputProps {
  displayPanel: boolean;
  searchCallback?: () => void;
}
function CourseSearchInput({
  displayPanel,
  searchCallback,
}: CourseSearchInputProps) {
  const toast = useToast();
  const { searchFilters, searchSettings, setSearchSettings, setSearchFilters } =
    useCourseSearchingContext();
  const { displayTags, setDisplayTags } = useDisplayTags();

  // filters local states // TODO: move to their component
  // const [selectedType, setSelectedType] = useState(searchFilters.category);

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

  const set_enroll_method = (new_enroll_method: EnrollMethod) => {
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
        <Box w="100%" py="8px" mt="4">
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
                <Flex flexDirection="row" flexWrap="wrap" css={{ gap: "10px" }}>
                  <Flex flexDirection="column" px="4">
                    <Flex
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {/* <Switch
                        size={
                          useBreakpointValue({ base: "md", lg: "lg" }) ?? "md"
                        }
                        mr="2"
                        isChecked={searchFiltersEnable.time}
                        onChange={(e) => {
                          setSearchFiltersEnable({
                            ...searchFiltersEnable,
                            time: e.currentTarget.checked,
                          });
                        }}
                      /> */}
                      {/* <TimeFilterModal
                        title={
                          mapStateToIntervals(searchFilters.time) === 0
                            ? "未選擇課程時間"
                            : `已選擇 ${mapStateToIntervals(searchFilters.time)}
                               節次`
                        }
                        isEnabled={searchFiltersEnable.time}
                        selectedTime={selectedTime}
                        setSelectedTime={setSelectedTime}
                      /> */}
                    </Flex>
                  </Flex>
                  <Flex flexDirection="column" px="4">
                    <Flex
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {/* <Switch
                        size={
                          useBreakpointValue({ base: "md", lg: "lg" }) ?? "md"
                        }
                        mr="2"
                        isChecked={searchFiltersEnable.department}
                        onChange={(e) => {
                          setSearchFiltersEnable({
                            ...searchFiltersEnable,
                            department: e.currentTarget.checked,
                          });
                        }}
                      /> */}
                      {/* <DeptFilterModal
                        title={
                          selectedDept.length === 0
                            ? "未選擇開課系所"
                            : `已選擇 ${selectedDept.length} 系所`
                        }
                        isEnabled={searchFiltersEnable.department}
                        selectedDept={selectedDept}
                        setSelectedDept={setSelectedDept}
                      /> */}
                    </Flex>
                  </Flex>
                  <Flex flexDirection="column" px="4">
                    <Flex
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {/* <Switch
                        size={
                          useBreakpointValue({ base: "md", lg: "lg" }) ?? "md"
                        }
                        mr="2"
                        isChecked={searchFiltersEnable.category}
                        onChange={(e) => {
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
                            : `已選擇 ${selectedType.length} 類別`
                        }
                        isEnabled={searchFiltersEnable.category}
                        selectedType={selectedType}
                        setSelectedType={setSelectedType}
                      />*/}
                    </Flex>
                  </Flex>
                  <Flex flexDirection="column" px="4">
                    <Flex
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {/* <Switch
                        size={
                          useBreakpointValue({ base: "md", lg: "lg" }) ?? "md"
                        }
                        mr="2"
                        isChecked={searchFiltersEnable.enroll_method}
                        onChange={(e) => {
                          setSearchFiltersEnable({
                            ...searchFiltersEnable,
                            enroll_method: e.currentTarget.checked,
                          });
                        }}
                      />
                      <Menu closeOnSelect={false}>
                        <MenuButton
                          size={
                            useBreakpointValue({ base: "sm", md: "md" }) ?? "md"
                          }
                          as={Button}
                          rightIcon={<FaChevronDown />}
                          disabled={!searchFiltersEnable.enroll_method}
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
                                set_enroll_method("1");
                                reportEvent(
                                  "filter",
                                  "toggle_enroll_method",
                                  "1"
                                );
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
                                set_enroll_method("2");
                                reportEvent(
                                  "filter",
                                  "toggle_enroll_method",
                                  "2"
                                );
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
                                set_enroll_method("3");
                                reportEvent(
                                  "filter",
                                  "toggle_enroll_method",
                                  "3"
                                );
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
                      </Menu> */}
                    </Flex>
                  </Flex>
                </Flex>
              </TabPanel>
              <TabPanel>
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
                        reportEvent(
                          "search_settings",
                          "save",
                          "strict_" + strict_search_mode
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
                      {availableTags.map((tag) => {
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
                                    reportEvent(
                                      "display_tags",
                                      "toggle_off",
                                      tag
                                    );
                                  }
                                : () => {
                                    setDisplayTags([...displayTags, tag]);
                                    reportEvent(
                                      "display_tags",
                                      "toggle_on",
                                      tag
                                    );
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
