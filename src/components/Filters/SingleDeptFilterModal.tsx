import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Heading,
  Divider,
  Flex,
  useBreakpointValue,
  FlexProps,
  Input,
  InputGroup,
  InputLeftElement,
  Center,
  InputRightElement,
  HStack,
  Badge,
  Text,
  Box,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { SearchOutlineIcon } from "components/CustomIcons";
import React, {
  useMemo,
  useState,
  useRef,
  forwardRef,
  RefObject,
  createRef,
} from "react";
import { college_map } from "data/college";
import { deptList } from "data/department";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import { reportEvent } from "utils/ga";
import type { Department } from "types/course";
import { generateScrollBarCss } from "styles/customScrollBar";
import { useInView } from "react-intersection-observer";
import { CloseIcon } from "@chakra-ui/icons";
import { searchDept } from "@/components/Filters/DeptFilterModal";
import Dropdown from "@/components/Dropdown";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { IsSelectiveOption, isSelectiveOptions } from "@/types/search";

// TODO: add API & hook to fetch options
interface DropdownGroupProps extends FlexProps {
  readonly deptId: string | null;
  readonly selectedCourseType: string | null;
  readonly setSelectedCourseType: (courseType: string | null) => void;
  readonly isSingleDeptSelective: IsSelectiveOption;
  readonly setIsSingleDeptSelective: (
    isSingleDeptSelective: IsSelectiveOption
  ) => void;
  readonly suggestedGrade: string | null;
  readonly setSuggestedGrade: (suggestedGrade: string | null) => void;
}
function DropdownGroup(props: DropdownGroupProps) {
  const {
    deptId,
    selectedCourseType,
    setSelectedCourseType,
    isSingleDeptSelective,
    setIsSingleDeptSelective,
    suggestedGrade,
    setSuggestedGrade,
    ...rest
  } = props;
  const selectiveOptions: Record<
    IsSelectiveOption,
    {
      label: string;
    }
  > = {
    all: {
      label: "必修 + 選修",
    },
    selective: {
      label: "選修",
    },
    required: {
      label: "必修",
    },
  };
  return (
    <Flex alignItems={"center"} {...rest}>
      <Dropdown
        reverse={true}
        closeAfterClick={true}
        renderDropdownButton={() => (
          <HStack
            sx={{
              border: "1px solid #CCCCCC",
              borderRadius: "4px",
              p: "4px 12px",
            }}
          >
            <Text
              minW="40px"
              noOfLines={1}
              sx={{
                fontSize: "12px",
              }}
            >
              {isSingleDeptSelective === "all"
                ? "必修 + 選修"
                : isSingleDeptSelective === "selective"
                ? "選修"
                : "必修"}
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
            value={isSingleDeptSelective}
            onChange={(next) => {
              setIsSingleDeptSelective(next as IsSelectiveOption);
            }}
            gap={2}
          >
            {Object.entries(selectiveOptions).map(([key, option]) => (
              <Radio p={2} value={key} key={key}>
                <Flex
                  w="120px"
                  sx={{
                    fontWeight: 500,
                    fontSize: "13px",
                    lineHeight: "1.4",
                    color: "#4b4b4b",
                  }}
                >
                  {option.label}
                </Flex>
              </Radio>
            ))}
          </RadioGroup>
        </Box>
      </Dropdown>
    </Flex>
  );
}

interface ModalDeptSectionProps {
  readonly college_key: string;
  readonly departments: Department[];
  readonly selectedDept: Department | null;
  readonly setSelectedDept: (selectedDept: Department | null) => void;
  readonly setActiveDept: (activeDept: string | null) => void;
  readonly collegeRefs: Record<string, React.RefObject<HTMLDivElement>>;
  readonly flexProps?: FlexProps;
}
const ModalDeptSection = forwardRef<HTMLDivElement, ModalDeptSectionProps>(
  (props, ref) => {
    const {
      college_key,
      departments,
      selectedDept,
      setSelectedDept,
      setActiveDept,
      collegeRefs,
      flexProps,
    } = props;
    const sectionScrollRef = collegeRefs[college_key];
    const modal = ref as RefObject<HTMLDivElement>;
    const modalBody = modal.current;
    const ROOT_MARGIN_BOX_HEIGHT = 50;
    const offsetBottom = modalBody?.clientHeight
      ? `-${modalBody.clientHeight - ROOT_MARGIN_BOX_HEIGHT}px`
      : "-88%";

    const { ref: inViewRef } = useInView({
      /* Optional options */
      root: modalBody ?? null,
      rootMargin: `0px 0px ${offsetBottom} 0px`,
      onChange: (inView, entry) => {
        if (inView) {
          setActiveDept(entry?.target?.id ?? null);
        }
      },
    });

    return (
      <Box position={"relative"} minH="100px">
        <Box
          ref={inViewRef}
          id={college_key}
          h="40px"
          w="100%"
          bg="transparent"
          position={"absolute"}
          top={0}
        />
        <Box
          ref={sectionScrollRef}
          id={college_key}
          h="40px"
          w="100%"
          bg="transparent"
          position={"absolute"}
          top={0}
        />
        <Flex
          p="2"
          h="40px"
          flexDirection="column"
          justifyContent="center"
          bg={"white"}
          {...flexProps}
        >
          <Heading fontSize="2xl" color={"heading.light"}>
            {college_key + " " + college_map[college_key].name}
          </Heading>
        </Flex>
        <Divider pt={2} />
        <Flex flexWrap={"wrap"}>
          {departments.map((dept) => (
            <HStack
              p={2}
              spacing={"6px"}
              w="fit-content"
              key={dept.id}
              cursor={"pointer"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (selectedDept?.id === dept.id) {
                  setSelectedDept(null);
                } else {
                  setSelectedDept(dept);
                }
              }}
            >
              <Radio
                value={dept.id}
                isChecked={dept.id === selectedDept?.id}
                defaultChecked={false}
              />
              <Badge bg="#ececec" color="primary.500" fontWeight={400}>
                {dept.id}
              </Badge>
              <Flex
                w="fit-content"
                sx={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#0D40C3",
                }}
              >
                {dept.name_full}
              </Flex>
            </HStack>
          ))}
        </Flex>
      </Box>
    );
  }
);
ModalDeptSection.displayName = "ModalDeptSection";

export interface SingleDeptFilterModalProps {
  readonly title: string;
  readonly isActive?: boolean;
}
function SingleDeptFilterModal({
  title,
  isActive = false,
}: SingleDeptFilterModalProps) {
  const { searchFilters, setSearchFilters, setPageIndex } =
    useCourseSearchingContext();
  const [selectedDept, setSelectedDept] = useState(searchFilters.dept);
  const [selectedCourseType, setSelectedCourseType] = useState<string | null>(
    searchFilters.department_course_type
  );
  const [isSingleDeptSelective, setIsSingleDeptSelective] =
    useState<IsSelectiveOption>(searchFilters.singleDeptIsSelective);
  const [suggestedGrade, setSuggestedGrade] = useState(
    searchFilters.suggestedGrade
  );

  const modalBodyRef = useRef<HTMLDivElement>(null);
  const [activeDept, setActiveDept] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [searchString, setSearchString] = useState("");

  // clickable navigation link && scrollIntoView effect
  const collegeRefs = Object.keys(college_map).reduce((refsObj, collegeId) => {
    refsObj[collegeId] = createRef<HTMLDivElement>();
    return refsObj;
  }, {} as Record<string, RefObject<HTMLDivElement>>);
  const scrollToCollege = (collegeId: string) => {
    collegeRefs?.[collegeId]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const onOpenModal = () => {
    // overwrite local states by context
    setSelectedDept(searchFilters.dept);
    setIsSingleDeptSelective(searchFilters.singleDeptIsSelective);
    setSelectedCourseType(searchFilters.department_course_type);
    setSuggestedGrade(searchFilters.suggestedGrade);
    onOpen();
  };
  const onCancelEditing = () => {
    // fire when click "X" or outside of modal
    // overwrite local state by context
    onClose();
    setSelectedDept(searchFilters.dept);
    setIsSingleDeptSelective(searchFilters.singleDeptIsSelective);
    setSelectedCourseType(searchFilters.department_course_type);
    setSuggestedGrade(searchFilters.suggestedGrade);
  };
  const onSaveEditing = () => {
    // fire when click "Save"
    // overwrite redux state by local state
    setSearchFilters({
      ...searchFilters,
      dept: selectedDept,
      singleDeptIsSelective: isSingleDeptSelective,
      department_course_type: selectedCourseType,
      suggestedGrade: suggestedGrade,
    });
    // Reset indexed page
    setPageIndex(0);
    onClose();
  };
  const onResetEditing = () => {
    // fire when click "Reset"
    // set local state to empty array
    setSelectedDept(null);
    setIsSingleDeptSelective(isSelectiveOptions[0]);
    setSelectedCourseType(null);
    setSuggestedGrade(null);
  };

  const modalBody = useMemo(() => {
    const numOfMatchedDept = Object.keys(college_map)
      .map((collegeKey) => {
        const departments = searchDept(
          searchString,
          deptList.filter((dept) => dept.college_id === collegeKey)
        );
        return departments.length;
      })
      .reduce((acc, cur) => acc + cur, 0);
    if (numOfMatchedDept === 0) {
      return (
        <Center
          w="100%"
          h="100%"
          zIndex="100"
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            color: "#6f6f6f",
          }}
        >
          找不到相關內容，請檢查是否打錯字
        </Center>
      );
    }
    return (
      <>
        {Object.keys(college_map).map((college_key, index) => {
          const departments = deptList.filter(
            (dept) => dept.college_id === college_key
          );
          if (departments.length === 0) {
            return null;
          }
          const deptAfterSearch = searchDept(searchString, departments);
          if (deptAfterSearch.length === 0) {
            return null;
          }
          return (
            <ModalDeptSection
              key={college_key}
              college_key={college_key}
              departments={deptAfterSearch}
              selectedDept={selectedDept}
              setSelectedDept={setSelectedDept}
              setActiveDept={setActiveDept}
              flexProps={{
                mt: index === 0 ? 0 : 6,
              }}
              ref={modalBodyRef}
              collegeRefs={collegeRefs}
            />
          );
        })}
      </>
    );
  }, [selectedDept, collegeRefs, searchString]);

  return (
    <>
      <Flex
        borderRadius={"24px"}
        height="36px"
        px="16px"
        py="6px"
        border="0.5px solid #4B4B4B"
        alignItems={"center"}
        color="#4b4b4b"
        cursor={"pointer"}
        transition={"all 0.2s ease-in-out"}
        _hover={{
          bg: "#4b4b4b20",
        }}
        onClick={() => {
          onOpenModal();
          reportEvent("filter_department", "click", "open_modal");
        }}
        bg={isActive ? "#cccccc" : "white"}
      >
        {title}
      </Flex>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onCancelEditing();
        }}
        size={useBreakpointValue({ base: "full", md: "xl" }) ?? "xl"}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW={{ base: "100vw", md: "90vw", lg: "50vw" }}>
          <ModalHeader
            borderBottom={"0.5px solid #6F6F6F"}
            boxSizing="border-box"
            sx={{
              fontSize: "17px",
              lineHeight: "22px",
              color: "#2d2d2d",
              fontWeight: 400,
            }}
          >
            <Flex
              flexDirection={{ base: "column", md: "row" }}
              alignItems="center"
            >
              <Flex w="40%">
                {selectedDept === null ? (
                  <Flex>請選擇 1 個開課系所</Flex>
                ) : (
                  <Flex>
                    <Flex whiteSpace={"nowrap"}>已選擇開課系所：</Flex>
                    <Text color="#002F94" noOfLines={1}>
                      {selectedDept?.name_full ?? ""}
                    </Text>
                  </Flex>
                )}
              </Flex>
              <Flex w={{ base: "50%", md: "35%" }}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" pl="2" pt="1">
                    <SearchOutlineIcon boxSize="22px" color="#909090" />
                  </InputLeftElement>
                  <Input
                    borderRadius={"999px"}
                    placeholder="搜尋系所名稱或代碼"
                    onChange={(e) => {
                      setSearchString(e.target.value);
                    }}
                    value={searchString}
                  />
                  <InputRightElement>
                    {searchString.trim() !== "" ? (
                      <CloseIcon
                        boxSize="10px"
                        color="#6f6f6f"
                        sx={{
                          fontWeight: 500,
                          boxSizing: "content-box",
                          cursor: "pointer",
                          borderRadius: "999px",
                          padding: "2px",
                          borderWidth: "2px",
                          borderColor: "#6f6f6f",
                        }}
                        onClick={() => {
                          setSearchString("");
                        }}
                      />
                    ) : null}
                  </InputRightElement>
                </InputGroup>
              </Flex>
              <Flex
                flexDirection="row"
                justifyContent="start"
                alignItems="center"
                mt="2"
                display={{ base: "block", md: "none" }}
              >
                <DropdownGroup
                  deptId={selectedDept?.id ?? null}
                  isSingleDeptSelective={isSingleDeptSelective}
                  setIsSingleDeptSelective={setIsSingleDeptSelective}
                  selectedCourseType={selectedCourseType}
                  setSelectedCourseType={setSelectedCourseType}
                  suggestedGrade={suggestedGrade}
                  setSuggestedGrade={setSuggestedGrade}
                  my={2}
                />
                <Button
                  size="sm"
                  colorScheme="blue"
                  mr={3}
                  onClick={() => {
                    onSaveEditing();
                    reportEvent("filter_department", "click", "save_changes");
                  }}
                >
                  套用
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  isDisabled={
                    selectedDept === null &&
                    isSingleDeptSelective === null &&
                    selectedCourseType === null
                  }
                  onClick={() => {
                    onResetEditing();
                    reportEvent("filter_department", "click", "reset_changes");
                  }}
                >
                  重設
                </Button>
              </Flex>
            </Flex>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody py="0" px={0} overflow="hidden">
            <Flex h="68vh" ref={modalBodyRef}>
              <Box
                overflowY="scroll"
                h="100%"
                w="25%"
                bg="#f2f2f2"
                __css={generateScrollBarCss("#f2f2f2", "#909090")}
              >
                {Object.keys(college_map).map((college_key, index) => {
                  const deptName = college_map[college_key].name;
                  const isActive = activeDept === college_key;
                  return (
                    <Flex
                      key={college_key}
                      py={3}
                      px={8}
                      alignItems="start"
                      sx={{
                        fontSize: isActive ? "17px" : "15px",
                        lineHeight: isActive ? "22px" : "23px",
                        color: isActive ? "#2d2d2d" : "#4b4b4b",
                        fontWeight: isActive ? 600 : 400,
                      }}
                      cursor="pointer"
                      onClick={() => {
                        scrollToCollege(college_key);
                      }}
                    >
                      <Box mr={1}>{college_key}</Box>
                      <Box>{deptName}</Box>
                    </Flex>
                  );
                })}
              </Box>
              <Box
                overflowY="scroll"
                w="75%"
                h="100%"
                __css={generateScrollBarCss("white", "#909090")}
              >
                {modalBody}
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter
            display={{ base: "none", md: "flex" }}
            borderTop={"0.5px solid #6F6F6F"}
            boxSizing="border-box"
          >
            <Flex justifyContent={"space-between"} w="100%">
              <DropdownGroup
                deptId={selectedDept?.id ?? null}
                isSingleDeptSelective={isSingleDeptSelective}
                setIsSingleDeptSelective={setIsSingleDeptSelective}
                selectedCourseType={selectedCourseType}
                setSelectedCourseType={setSelectedCourseType}
                suggestedGrade={suggestedGrade}
                setSuggestedGrade={setSuggestedGrade}
                my={2}
              />
              <Flex alignItems={"center"}>
                <Button
                  variant={"unstyled"}
                  sx={{
                    color: "#4b4b4b",
                    fontSize: "13px",
                    lineHeight: "18px",
                    fontWeight: 600,
                  }}
                  mx={6}
                  isDisabled={
                    selectedDept === null &&
                    isSingleDeptSelective === null &&
                    selectedCourseType === null
                  }
                  onClick={() => {
                    onResetEditing();
                    reportEvent("filter_department", "click", "reset_changes");
                  }}
                >
                  重設
                </Button>
                <Button
                  ml="2"
                  w="58px"
                  h="34px"
                  sx={{
                    borderRadius: "50px",
                    fontSize: "13px",
                    lineHeight: "18px",
                    fontWeight: 600,
                    bg: "#4b4b4b",
                    _hover: {
                      bg: "#4b4b4b",
                      opacity: 0.8,
                    },
                    _active: {
                      bg: "#4b4b4b",
                      opacity: 0.7,
                    },
                  }}
                  onClick={() => {
                    onSaveEditing();
                    reportEvent("filter_department", "click", "save_changes");
                  }}
                >
                  套用
                </Button>
              </Flex>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SingleDeptFilterModal;
