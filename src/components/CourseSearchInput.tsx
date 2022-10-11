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
  HStack,
  Text,
  useColorModeValue,
  Icon,
  ButtonGroup,
  Tooltip,
} from "@chakra-ui/react";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { TbListSearch } from "react-icons/tb";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import { useSWRConfig } from "swr";
import { reportEvent } from "utils/ga";
import { SearchFieldName } from "types/search";

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

export interface CourseSearchInputProps {
  searchCallback?: () => void;
}
function CourseSearchInput({ searchCallback }: CourseSearchInputProps) {
  return (
    <>
      <CourseSearchInputTextArea searchCallback={searchCallback} />
    </>
  );
}

export default CourseSearchInput;
