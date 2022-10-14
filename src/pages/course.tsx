import { useEffect, useState, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Collapse,
  Fade,
  useMediaQuery,
  Icon,
  useColorModeValue,
  Center,
  Checkbox,
  HStack,
  RadioGroup,
  Radio,
  VStack,
} from "@chakra-ui/react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import SideCourseTableContainer from "components/CourseTable/SideCourseTableContainer";
import Head from "next/head";
import { reportEvent } from "utils/ga";
import { useInView } from "react-intersection-observer";
import CourseSearchInput from "@/components/CourseSearchInput";
import SearchFilters from "@/components/SearchFilters";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  InfoOutlineIcon,
} from "@chakra-ui/icons";
import { BiFilterAlt } from "react-icons/bi";
import CourseInfoRowPage from "@/components/CourseInfoRowPage";
import Dropdown from "@/components/Dropdown";

function SearchResultTopBar({ isTop = true }: { isTop?: boolean }) {
  const currentPageRef = useRef<HTMLDivElement>(null);
  const pageMenuRef = useRef<HTMLDivElement>(null);
  const {
    setPageIndex,
    totalCount,
    pageIndex,
    numOfPages,
    setBatchSize,
    batchSize,
  } = useCourseSearchingContext();

  return (
    <Flex
      w="100%"
      justifyContent={"space-between"}
      px={4}
      py={2}
      sx={{
        borderBottom: isTop ? "1px solid #CCCCCC" : "none",
        borderTop: !isTop ? "1px solid #CCCCCC" : "none",
      }}
      textStyle={"body2"}
    >
      <Flex justifyContent="flex-start" flex={1} gap={2} alignItems={"center"}>
        <Flex>{`共 ${totalCount} 筆結果`}</Flex>
        <Dropdown
          reverse={!isTop}
          dropdownButton={
            <HStack
              sx={{
                border: "1px solid #CCCCCC",
                borderRadius: "4px",
                px: "8px",
              }}
            >
              <Text minW="40px" noOfLines={1}>
                排序
              </Text>
              <ChevronDownIcon />
            </HStack>
          }
        >
          <Box>123</Box>
        </Dropdown>
      </Flex>
      <Flex justifyContent={"center"} alignItems={"center"}>
        每頁顯示{" "}
        <Dropdown
          reverse={!isTop}
          dropdownButton={
            <Flex
              sx={{
                border: "1px solid #CCCCCC",
                borderRadius: "4px",
                px: "8px",
                mx: 1,
              }}
              minW="50px"
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Text noOfLines={1}>{batchSize}</Text>
              <VStack h="22px" position={"relative"}>
                <ChevronUpIcon position={"absolute"} />
                <ChevronDownIcon position={"absolute"} />
              </VStack>
            </Flex>
          }
        >
          <Box
            sx={{
              px: 4,
              my: 2,
            }}
          >
            <RadioGroup
              value={batchSize}
              onChange={(next) => {
                setBatchSize(parseInt(next, 10));
              }}
            >
              <Radio value={25}>25</Radio>
              <Radio value={50}>50</Radio>
              <Radio value={100}>100</Radio>
              <Radio value={150}>150</Radio>
            </RadioGroup>
          </Box>
        </Dropdown>{" "}
        筆
      </Flex>
      <Flex justifyContent="flex-end" flex={1} gap={4}>
        <Flex gap={2} alignItems={"center"}>
          <Flex
            alignItems="center"
            cursor="pointer"
            sx={{
              opacity: pageIndex === 0 ? 0.5 : 1,
            }}
            onClick={() => {
              if (pageIndex > 0) {
                setPageIndex(pageIndex - 1);
              }
            }}
          >
            <ChevronLeftIcon boxSize={"20px"} />
            上一頁
          </Flex>
          <Flex
            alignItems="center"
            cursor="pointer"
            sx={{
              opacity: pageIndex === numOfPages - 1 ? 0.5 : 1,
            }}
            onClick={() => {
              if (pageIndex < numOfPages - 1) {
                setPageIndex(pageIndex + 1);
              }
            }}
          >
            下一頁
            <ChevronRightIcon boxSize={"20px"} />
          </Flex>
        </Flex>
        <Flex alignItems={"center"}>
          第
          <Dropdown
            reverse={!isTop}
            disabled={numOfPages === 0}
            onOpen={() => {
              const offsetY =
                parseInt(currentPageRef?.current?.id ?? "0", 10) ?? 0;
              if (pageMenuRef?.current) {
                pageMenuRef.current.scrollTop = 36 * Math.max(offsetY - 3, 0);
              }
            }}
            dropdownButton={
              <Flex
                sx={{
                  border: "1px solid #CCCCCC",
                  borderRadius: "4px",
                  px: "8px",
                  mx: 1,
                }}
                minW="50px"
                justifyContent={"space-between"}
              >
                <Text noOfLines={1}>{pageIndex + 1}</Text>
                <VStack h="22px" position={"relative"}>
                  <ChevronUpIcon position={"absolute"} />
                  <ChevronDownIcon position={"absolute"} />
                </VStack>
              </Flex>
            }
          >
            <Box
              w="100%"
              h="48px"
              position={"absolute"}
              zIndex={101}
              top={0}
              left={0}
              bg="linear-gradient(180.5deg, #FFFFFF -84.02%, #FFFFFF 31.81%, rgba(255, 255, 255, 0) 49.08%)s"
              pointerEvents={"none"}
            />
            <Box
              sx={{
                px: 4,
                my: 2,
              }}
              position="relative"
              h="250px"
              overflowY="scroll"
              ref={pageMenuRef}
            >
              <Flex flexDirection={"column"} justifyContent={"center"}>
                <RadioGroup
                  onChange={(i) => {
                    setPageIndex(parseInt(i));
                  }}
                  value={pageIndex}
                >
                  {Array.from({ length: numOfPages }, (_, i) => (
                    <Radio value={i} height="36px" key={i}>
                      <Box
                        id={`${i}`}
                        ref={pageIndex === i ? currentPageRef : undefined}
                      >
                        {i + 1}
                      </Box>
                    </Radio>
                  ))}
                </RadioGroup>
              </Flex>
            </Box>
            <Box
              w="100%"
              h="48px"
              position={"absolute"}
              zIndex={101}
              bottom={0}
              left={0}
              bg="linear-gradient(180.5deg, #FFFFFF -84.02%, #FFFFFF 31.81%, rgba(255, 255, 255, 0) 49.08%)"
              transform={"rotate(180deg)"}
              pointerEvents={"none"}
            />
          </Dropdown>
          頁
        </Flex>
      </Flex>
    </Flex>
  );
}

function CoursePage() {
  const { ref: searchBoxRef, inView: searchBoxInView } = useInView({
    threshold: 0,
  });
  const topRef = useRef<HTMLDivElement>(null);
  const {
    setIsSearchBoxInView,
    setBatchSize,
    searchSettings,
    setSearchSettings,
    pageIndex,
  } = useCourseSearchingContext();

  const [isHigherThan1325] = useMediaQuery(["(min-height: 1325px)"]);

  const [displayTable, setDisplayTable] = useState(false);

  useEffect(() => {
    if (isHigherThan1325) {
      setBatchSize(25);
    }
  }, [isHigherThan1325, setBatchSize]);

  useEffect(() => {
    setIsSearchBoxInView(searchBoxInView);
  }, [searchBoxInView, setIsSearchBoxInView]);

  const searchCallback = () => {
    topRef.current?.focus();
  };

  return (
    <>
      <Head>
        <title>課程搜尋 | NTUCourse Neo</title>
        <meta
          name="description"
          content="課程搜尋頁面 | NTUCourse Neo，全新的臺大選課網站。"
        />
      </Head>
      <Flex
        w="100vw"
        h="93vh"
        direction="row"
        justifyContent="center"
        alignItems="start"
        overflow="auto"
        bg={"black.100"}
      >
        <Flex
          w="100vw"
          h="93vh"
          flexDirection={"row"}
          gap={10}
          justifyContent="center"
          alignItems="start"
          overflowY={"auto"}
          position="relative"
        >
          <Flex w="60%" flexDirection={"column"} py={8}>
            <Flex ref={searchBoxRef} w="100%" mb={8} flexDirection={"column"}>
              <CourseSearchInput searchCallback={searchCallback} />
              <Flex flexDirection={"row"} alignItems={"center"} mt={6}>
                <HStack
                  sx={{
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#6f6f6f",
                  }}
                  w="fit-content"
                  mr={3}
                  spacing={1}
                >
                  <BiFilterAlt size={"20px"} />
                  <Text noOfLines={1} w="60px">
                    篩選條件
                  </Text>
                </HStack>
                <SearchFilters />
              </Flex>
              <Checkbox
                mt="4"
                w="fit-content"
                isChecked={searchSettings.strict_search_mode}
                onChange={(e) => {
                  setSearchSettings({
                    ...searchSettings,
                    strict_search_mode: e.currentTarget.checked,
                  });
                }}
              >
                <Text
                  sx={{
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#666666",
                  }}
                >
                  嚴格篩選條件
                </Text>
              </Checkbox>
              <Flex mt={4} alignItems="center" gap={2}>
                <Center h="100%" justifyContent={"center"}>
                  <InfoOutlineIcon boxSize={"20px"} color="primary.600" />
                </Center>
                <Text color="#4b4b4b50">External Links Placeholder</Text>
              </Flex>
            </Flex>
            <Box
              w="100%"
              sx={{
                border: "1px solid #CCCCCC",
                borderRadius: "4px",
              }}
            >
              <SearchResultTopBar />
              <Box w="100%" minH="90vh">
                <CourseInfoRowPage displayTable={false} pageIndex={pageIndex} />
              </Box>
              <SearchResultTopBar isTop={false} />
            </Box>
          </Flex>
          <Flex
            w="20%"
            py={8}
            flexDirection={"column"}
            position="sticky"
            top={0}
            gap={8}
          >
            <Box bg="blue" h="42vh" w="100%"></Box>
            <Box bg="blue" h="42vh" w="100%"></Box>
          </Flex>
        </Flex>
      </Flex>
      <Fade in={!displayTable}>
        <Flex
          as="button"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          position="absolute"
          top={{ base: "85vh", lg: "80vh" }}
          left={{ base: "70vw", md: "85vw", lg: "90vw" }}
          bg={useColorModeValue("gray.100", "gray.600")}
          boxShadow="md"
          py="1"
          px="4"
          borderRadius="xl"
          onClick={() => {
            setDisplayTable(!displayTable);
            reportEvent("course_page", "click", "expand_table");
          }}
          _hover={{
            boxShadow: "lg",
            transform: "translateY(-2px) scale(1.02)",
          }}
          transition="all 200ms"
        >
          <Icon
            mr="1"
            as={FaRegCalendarAlt}
            boxSize="4"
            color={useColorModeValue("teal.500", "teal.300")}
          />
          <Text
            my="2"
            fontWeight={800}
            fontSize={{ base: "md", lg: "lg" }}
            color={useColorModeValue("text.light", "text.dark")}
          >
            課表
          </Text>
        </Flex>
      </Fade>
      <Collapse in={displayTable} animateOpacity>
        <Flex justifyContent="end" mr="2">
          <Box
            position="absolute"
            top={{ base: "", lg: "8vh" }}
            bottom="0"
            right="0"
            zIndex={{ base: "10000", lg: "1" }}
            w={{ base: "100vw", lg: "45vw", xl: "40vw" }}
            h={{ base: "90vh", lg: "70vh" }}
            bg={useColorModeValue("card.light", "card.dark")}
            mt="128px"
            borderRadius="lg"
            boxShadow="xl"
          >
            <SideCourseTableContainer
              isDisplay={displayTable}
              setIsDisplay={setDisplayTable}
            />
          </Box>
        </Flex>
      </Collapse>
    </>
  );
}

export default CoursePage;
