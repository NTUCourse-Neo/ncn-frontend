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
} from "@chakra-ui/react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import SideCourseTableContainer from "components/CourseTable/SideCourseTableContainer";
import Head from "next/head";
import { reportEvent } from "utils/ga";
import { useInView } from "react-intersection-observer";
import CourseSearchInput from "@/components/CourseSearchInput";
import SearchFilters from "@/components/SearchFilters";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { BiFilterAlt } from "react-icons/bi";

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
                  <Flex>篩選條件</Flex>
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
            {Array.from({ length: 55 }, (v, i) => (
              <Flex w="100%" bg="yellow">
                <Box>I am placeholder</Box>
              </Flex>
            ))}
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
