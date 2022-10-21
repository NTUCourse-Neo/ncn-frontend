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
  HStack,
  RadioGroup,
  Radio,
  VStack,
} from "@chakra-ui/react";
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
import { SortOption, sortOptions } from "@/types/search";
import { FiCalendar } from "react-icons/fi";
import SkeletonRow from "@/components/SkeletonRow";
import UserCoursePanel from "@/components/UserCoursePanel";

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
    setSortOption,
    sortOption,
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
          closeAfterClick={true}
          reverse={!isTop}
          renderDropdownButton={() => (
            <HStack
              sx={{
                border: "1px solid #CCCCCC",
                borderRadius: "4px",
                px: "8px",
              }}
            >
              <Text minW="40px" noOfLines={1}>
                排序：
                {sortOptions.find((option) => option.id === sortOption)
                  ?.chinese ?? "請選擇排序方式"}
              </Text>
              <ChevronDownIcon />
            </HStack>
          )}
        >
          <Box
            sx={{
              px: 2,
              my: 2,
            }}
          >
            <RadioGroup
              value={sortOption}
              onChange={(next) => {
                setSortOption(next as SortOption);
                setPageIndex(0);
              }}
              gap={2}
            >
              {sortOptions.map((option) => (
                <Radio key={option.id} p={2} value={option.id}>
                  <Flex
                    w="120px"
                    sx={{
                      fontWeight: 500,
                      fontSize: "13px",
                      lineHeight: "1.4",
                      color: "#4b4b4b",
                    }}
                  >
                    {option.chinese}
                  </Flex>
                </Radio>
              ))}
            </RadioGroup>
          </Box>
        </Dropdown>
      </Flex>
      <Flex justifyContent={"center"} alignItems={"center"}>
        每頁顯示{" "}
        <Dropdown
          reverse={!isTop}
          renderDropdownButton={() => (
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
          )}
          closeAfterClick={true}
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
                setPageIndex(0);
              }}
              gap={2}
            >
              {[25, 50, 100, 150].map((size) => (
                <Radio key={size} p={2} value={size}>
                  {size}
                </Radio>
              ))}
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
              opacity:
                pageIndex === numOfPages - 1 || numOfPages === 0 ? 0.5 : 1,
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
            closeAfterClick={true}
            disabled={numOfPages === 0}
            onOpen={() => {
              const offsetY =
                parseInt(currentPageRef?.current?.id ?? "0", 10) ?? 0;
              if (pageMenuRef?.current) {
                pageMenuRef.current.scrollTop = 36 * Math.max(offsetY - 3, 0);
              }
            }}
            renderDropdownButton={() => (
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
            )}
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
              maxH="250px"
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
  const { setIsSearchBoxInView, setBatchSize, pageIndex, searchPageTopRef } =
    useCourseSearchingContext();

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
          overflowX={"hidden"}
          position="relative"
        >
          <Flex w="60%" flexDirection={"column"} py={8}>
            <Box
              ref={searchPageTopRef}
              h="1px"
              w="80vw"
              position="relative"
              bottom="30px"
            />
            <Flex ref={searchBoxRef} w="100%" mb={8} flexDirection={"column"}>
              <CourseSearchInput />
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
              <Box w="100%" minH="57vh">
                <SkeletonRow />
                <CourseInfoRowPage displayTable={false} pageIndex={pageIndex} />
              </Box>
              <SearchResultTopBar isTop={false} />
            </Box>
          </Flex>
          <Flex
            w="20%"
            h="92vh"
            py={8}
            flexDirection={"column"}
            position="sticky"
            top={0}
          >
            <UserCoursePanel />
          </Flex>
        </Flex>
      </Flex>
      <Fade in={!displayTable}>
        <Flex
          as="button"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          position="absolute"
          bottom="10vh"
          right="4vw"
          bg={"white"}
          border="4px solid #A3A3A3"
          borderRadius={"5.5px"}
          sx={{
            w: "80px",
            h: "80px",
            p: 2,
            filter: "drop-shadow(0px 0px 20.5932px rgba(85, 105, 135, 0.15))",
          }}
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
          <Icon mr="1" as={FiCalendar} boxSize="40px" color={"black"} />
          <Text
            mt={"6px"}
            sx={{
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "14px",
              color: "#000000",
            }}
          >
            我的課表
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
