import { React, useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Flex,
  Text,
  Collapse,
  IconButton,
  Button,
  useToast,
  Fade,
  useMediaQuery,
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
import { FaChevronDown, FaChevronUp, FaArrowRight, FaRegCalendarAlt } from "react-icons/fa";
import CourseInfoRowContainer from "containers/CourseInfoRowContainer";
import CourseSearchInput from "components/CourseSearchInput";
import SkeletonRow from "components/SkeletonRow";
import SideCourseTableContainer from "containers/SideCourseTableContainer";
import { setBatchSize } from "actions/index";
import { fetchSearchResults } from "actions/courses";
import { useSelector, useDispatch } from "react-redux";
import useOnScreen from "hooks/useOnScreen";
import { useAuth0 } from "@auth0/auth0-react";
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

  const { loginWithPopup } = useAuth0();

  const [isMobile, isHigherThan1325] = useMediaQuery(["(max-width: 1000px)", "(min-height: 1325px)"]);

  const [displayFilter, setDisplayFilter] = useState(false);
  const [displayTable, setDisplayTable] = useState(!isMobile);

  // state for no login warning when creating a course table.
  const [isLoginWarningOpen, setIsLoginWarningOpen] = useState(false);
  const [agreeToCreateTableWithoutLogin, setAgreeToCreateTableWithoutLogin] = useState(false);

  // State for the course result row that is been hovered now.
  const [hoveredCourse, setHoveredCourse] = useState(null);

  const [coursesInTable, setCoursesInTable] = useState([]);

  useEffect(() => {
    if (isHigherThan1325) {
      dispatch(setBatchSize(25));
    }
  }, [isHigherThan1325, dispatch]);

  useEffect(() => {
    setDisplayFilter(false);
  }, [search_ids]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta({ title: `課程搜尋 | NTUCourse Neo`, desc: `課程搜尋頁面 | NTUCourse Neo，全新的臺大選課網站。` });
  }, []);

  // if isMobile, when show Alert Modal, set displayTable to false to prevent ugly overlapping
  useEffect(() => {
    if (isLoginWarningOpen) {
      if (isMobile) {
        setDisplayTable(false);
      }
    }
  }, [isLoginWarningOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderNoLoginWarning = useCallback(() => {
    const onClose = () => setIsLoginWarningOpen(false);
    // console.log("renderNoLoginWarning");
    return (
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
    );
  }, [isLoginWarningOpen, loginWithPopup]);

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

  useEffect(() => {
    topRef.current.focus();
  }, [search_ids]);

  useEffect(() => {
    // console.log('reachedBottom: ',reachedBottom);
    handleScrollToBottom();
  }, [reachedBottom]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
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
              <CourseSearchInput displayPanel={displayFilter} />
            </Flex>
            <IconButton
              size="xs"
              variant="ghost"
              icon={displayFilter ? <FaChevronUp /> : <FaChevronDown />}
              onClick={() => setDisplayFilter(!displayFilter)}
            />
          </Flex>
          <Flex
            flexDirection={"column"}
            alignItems={{ base: "center", lg: "start" }}
            ml={{ base: "0", lg: displayTable ? "2vw" : "15vw" }}
            w={{ base: "100%", lg: displayTable ? "50vw" : "70vw", xl: displayTable ? "55vw" : "70vw" }}
            transition="all 500ms ease-in-out"
          >
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
              displayTable={displayTable}
            />
          </Flex>
          <Flex
            w="100%"
            alignItems="center"
            justifyContent={{ base: "center", lg: "start" }}
            ml={{ base: "0", lg: displayTable ? "24vw" : "48vw" }}
            transition="all 500ms ease-in-out"
          >
            <SkeletonRow loading={search_loading} error={search_error} />
          </Flex>
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
          <Text my="2" fontWeight={800} fontSize={{ base: "md", lg: "lg" }} color="gray.600">
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
            />
          </Box>
        </Flex>
      </Collapse>
    </>
  );
}

export default CourseResultViewContainer;
