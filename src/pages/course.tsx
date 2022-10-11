import { useEffect, useState, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Collapse,
  IconButton,
  Fade,
  useMediaQuery,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import { FaChevronDown, FaChevronUp, FaRegCalendarAlt } from "react-icons/fa";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import CourseInfoRowContainer from "components/CourseInfoRowContainer";
import CourseSearchInput from "components/CourseSearchInput";
import SkeletonRow from "components/SkeletonRow";
import SideCourseTableContainer from "components/CourseTable/SideCourseTableContainer";
import usePagination from "hooks/usePagination";
import Head from "next/head";
import { reportEvent } from "utils/ga";

function CoursePage() {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = usePagination();
  const { searchLoading, totalCount, setBatchSize } =
    useCourseSearchingContext();

  const [isMobile, isHigherThan1325] = useMediaQuery([
    "(max-width: 1000px)",
    "(min-height: 1325px)",
  ]);

  const [displayFilter, setDisplayFilter] = useState(false);
  const [displayTable, setDisplayTable] = useState(false);

  useEffect(() => {
    if (isHigherThan1325) {
      setBatchSize(25);
    }
  }, [isHigherThan1325, setBatchSize]);

  const searchCallback = () => {
    topRef.current?.focus();
    setDisplayFilter(false);
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
        direction="row"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
        bg={useColorModeValue("white", "black")}
      >
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
          <Flex
            w="100%"
            direction="column"
            position="sticky"
            top="0"
            zIndex="100"
            boxShadow="md"
            borderBottom={useColorModeValue("gray.200", "gray.100")}
            bg={useColorModeValue("white", "gray.800")}
          >
            <Flex
              w="100%"
              px={{ base: "5vw", md: "10vw" }}
              py="4"
              direction="column"
              bg={useColorModeValue("white", "black")}
            >
              <CourseSearchInput
                displayPanel={displayFilter}
                searchCallback={searchCallback}
              />
            </Flex>
            <IconButton
              aria-label="searchInputDrawer"
              size="xs"
              variant="ghost"
              bg={useColorModeValue("white", "black")}
              icon={displayFilter ? <FaChevronUp /> : <FaChevronDown />}
              onClick={() => {
                setDisplayFilter(!displayFilter);
                reportEvent("course_page", "click", "toggle_filter");
              }}
            />
          </Flex>
          <Flex
            flexDirection={"column"}
            alignItems={{ base: "center", lg: "start" }}
            ml={{
              base: "0",
              lg: displayTable ? "2vw" : "5vw",
              xl: displayTable ? "2vw" : "10vw",
            }}
            w={{
              base: "100%",
              lg: displayTable ? "50vw" : "90vw",
              xl: displayTable ? "55vw" : "80vw",
            }}
            transition="all 500ms ease-in-out"
          >
            <Flex
              flexDirection="row"
              alignItems="center"
              justifyContent="start"
            >
              {searchLoading ? <BeatLoader size={8} color="teal" /> : <></>}
              <Text
                fontSize="md"
                fontWeight="medium"
                color="gray.400"
                my="2"
                ml="1"
              >
                {searchLoading ? "載入中" : `共找到 ${totalCount} 筆結果`}
              </Text>
            </Flex>
            <CourseInfoRowContainer displayTable={displayTable} />
            <SkeletonRow times={3} />
          </Flex>
          <Flex
            alignItems="center"
            w={displayTable ? "60%" : "100%"}
            justifyContent={{ base: "center", lg: "start" }}
            transition="all 500ms ease-in-out"
          ></Flex>
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
