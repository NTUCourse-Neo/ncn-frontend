import React, { useState, useRef } from "react";
import {
  Flex,
  Input,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Text,
  useColorModeValue,
  InputLeftElement,
  InputRightElement,
  InputGroup,
  Radio,
  ButtonGroup,
  Tooltip,
  Box,
  RadioGroup,
  HStack,
} from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import { useSWRConfig } from "swr";
import { reportEvent } from "utils/ga";
import { ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { availableSemesters } from "@/constant";
import searchModeList from "@/data/searchMode";

function SearchModeMenu() {
  const { searchMode, setSearchMode } = useCourseSearchingContext();
  return (
    <Menu>
      <MenuButton
        as={Button}
        w="105px"
        bg="#909090"
        sx={{
          borderRadius: "8px",
          _hover: {
            bg: "black.700",
          },
          _active: {
            bg: "black.700",
          },
        }}
        size={"md"}
        variant="solid"
      >
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          w="100%"
          sx={{
            fontSize: "13px",
            lineHeight: "22px",
          }}
        >
          {searchMode.chinese} <ChevronDownIcon boxSize={"22px"} />
        </Flex>
      </MenuButton>
      <MenuList
        border="0.5px solid #6F6F6F"
        borderRadius={"4px"}
        minW={0}
        w="fit-content"
      >
        <Box
          py={6}
          px={12}
          sx={{
            fontSize: "16px",
            lineHeight: "1.4",
            color: "#4b4b4b",
          }}
        >
          {searchModeList.map((mode) => {
            const fontStyle =
              searchMode.id === mode.id
                ? {
                    color: "primary.500",
                    fontWeight: 500,
                  }
                : {};
            return (
              <Box
                key={mode.id}
                py={2}
                sx={{
                  cursor: "pointer",
                  ...fontStyle,
                }}
                onClick={() => {
                  setSearchMode(mode);
                }}
              >
                {mode.chinese}
              </Box>
            );
          })}
        </Box>
      </MenuList>
    </Menu>
  );
}

function CourseSearchInput() {
  const semesterRef = useRef<HTMLInputElement>(null);
  const semesterMenuRef = useRef<HTMLDivElement>(null);
  const { mutate } = useSWRConfig();
  const { search, dispatchSearch, pageIndex, batchSize } =
    useCourseSearchingContext();
  const [searchText, setSearchText] = useState("");
  const { searchSemester, setSearchSemester, searchCallback } =
    useCourseSearchingContext();

  const startSearch = async () => {
    if (searchText === search) {
      // refresh current page
      mutate(`/api/search/${search}/${pageIndex}/${batchSize}`);
    } else {
      // start new search
      dispatchSearch(searchText);
    }
    searchCallback();
  };

  return (
    <HStack w="100%">
      <SearchModeMenu />
      <InputGroup
        bg="#f9f9f9"
        border="0.8px solid #9B9B9B"
        borderRadius={"8px"}
        h="fit-content"
      >
        <InputLeftElement pointerEvents="none" h="100%" pl="2">
          <SearchIcon boxSize="15px" color="#818181" />
        </InputLeftElement>
        <Input
          h="37px"
          type={"text"}
          placeholder="搜尋課程名稱/教師姓名/教室/課號/課程識別碼"
          sx={{
            fontSize: "14px",
            lineHeight: "24px",
            _placeholder: {
              color: "#818181",
            },
            border: "none",
          }}
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
        <InputRightElement w="fit-content" h="100%" px="2">
          <ButtonGroup isAttached>
            <Tooltip
              hasArrow
              placement="top"
              label={"點擊搜尋查看所有課程"}
              bg="gray.600"
              color="white"
            >
              <Button
                colorScheme="primary"
                size={"md"}
                variant="solid"
                px="8"
                h="29px"
                onClick={() => {
                  startSearch();
                }}
              >
                <Text display={{ base: "none", md: "inline" }}>搜尋</Text>
              </Button>
            </Tooltip>
            <Menu
              onOpen={() => {
                const offsetY =
                  parseInt(semesterRef?.current?.id?.[0] ?? "0", 10) ?? 0;
                if (semesterMenuRef?.current) {
                  semesterMenuRef.current.scrollTop = 44 * offsetY;
                }
              }}
            >
              <Tooltip
                hasArrow
                placement="top"
                label={"選擇學期"}
                bg="gray.600"
                color="white"
              >
                <MenuButton
                  h="29px"
                  as={Button}
                  colorScheme="primary"
                  size={"md"}
                  variant="solid"
                  borderLeft={`0.1px solid ${useColorModeValue(
                    "white",
                    "black"
                  )}`}
                >
                  <HStack>
                    <Box>
                      {searchSemester
                        ? `${searchSemester.slice(0, 3)}-${searchSemester.slice(
                            3,
                            4
                          )}`
                        : null}
                    </Box>
                    <FaChevronDown height="37px" size={10} />
                  </HStack>
                </MenuButton>
              </Tooltip>
              <MenuList
                border="0.5px solid #6F6F6F"
                borderRadius={"4px"}
                minW={0}
                w="fit-content"
                position={"relative"}
              >
                <Box
                  position="absolute"
                  top="0"
                  w="100%"
                  h="54px"
                  zIndex={2}
                  pointerEvents="none"
                  sx={{
                    background:
                      "linear-gradient(181.46deg, #FFFFFF -82.1%, #FFFFFF 32.01%, rgba(255, 255, 255, 0) 48.34%)",
                  }}
                />
                <RadioGroup
                  value={searchSemester ?? undefined}
                  onChange={setSearchSemester}
                  w="fit-content"
                >
                  <Flex
                    px={6}
                    py={6}
                    flexDirection={"column"}
                    h="180px"
                    overflowY="scroll"
                    ref={semesterMenuRef}
                  >
                    {availableSemesters.map((semester, index) => (
                      <Radio
                        colorScheme={"green"}
                        key={semester}
                        value={semester}
                        h="32px"
                        py="6px"
                        id={`${index}-${semester}`}
                        ref={
                          searchSemester === semester ? semesterRef : undefined
                        }
                        sx={{
                          fontSize: "14px",
                          fontWeight: 500,
                          lineHeight: "20px",
                          color: "#666666",
                        }}
                      >
                        {` ${semester.slice(0, 3)}-${semester.slice(3, 4)}`}
                      </Radio>
                    ))}
                  </Flex>
                </RadioGroup>
                <Box
                  position="absolute"
                  bottom="0"
                  w="100%"
                  h="54px"
                  zIndex={2}
                  pointerEvents="none"
                  sx={{
                    transform: "rotate(-180deg)",
                    background:
                      "linear-gradient(181.46deg, #FFFFFF -82.1%, #FFFFFF 32.01%, rgba(255, 255, 255, 0) 48.34%)",
                  }}
                />
              </MenuList>
            </Menu>
          </ButtonGroup>
        </InputRightElement>
      </InputGroup>
    </HStack>
  );
}

export default CourseSearchInput;
