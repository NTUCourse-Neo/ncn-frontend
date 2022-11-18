import { useCourseSearchingContext } from "@/components/Providers/CourseSearchingProvider";
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
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { SearchOutlineIcon } from "components/CustomIcons";
import { CloseIcon } from "@chakra-ui/icons";
// import FilterElement from "@/components/Filters/components/FilterElement";

export interface GroupingCourseFilterModalProps {
  readonly title: string;
  readonly isActive?: boolean;
}

export default function GroupingCourseFilterModal(
  props: GroupingCourseFilterModalProps
) {
  const { title, isActive } = props;
  const { searchFilters, setSearchFilters, setPageIndex } =
    useCourseSearchingContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedGroupingCourse, setSelectedGroupingCourse] = useState(
    searchFilters.grouping_course_type
  );
  const [searchString, setSearchString] = useState("");

  const onOpenModal = () => {
    setSelectedGroupingCourse(searchFilters.grouping_course_type);
    onOpen();
  };
  const onCancelEditing = () => {
    onClose();
    setSelectedGroupingCourse(searchFilters.grouping_course_type);
  };
  const onSaveEditing = () => {
    setSearchFilters({
      ...searchFilters,
      grouping_course_type: selectedGroupingCourse,
    });
    // Reset indexed page
    setPageIndex(0);
    onClose();
  };
  const onResetEditing = () => {
    setSelectedGroupingCourse([]);
  };

  const modalBody = useMemo(() => {
    return (
      <>
        <Flex
          p="2"
          h="40px"
          flexDirection="column"
          justifyContent="center"
          bg={"white"}
        >
          <Heading fontSize="2xl" color={"heading.light"}>
            {`未選開課學程`}
          </Heading>
        </Flex>
        <Divider pt={2} />
        {/* {programs
          .filter((p) => p.chinese_label.includes(searchString.trim()))
          .filter((p) => !selectedProgram.includes(p.value))
          .map((program, index) => {
            return (
              <FilterElement
                key={`${program.value}-${index}-modalBody`}
                id={program.value}
                name={program.chinese_label}
                selected={false}
                onClick={() => {
                  setSelectedProgram([...selectedProgram, program.value]);
                }}
              />
            );
          })} */}
      </>
    );
  }, [searchString]);

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
              <Flex w="40%">{`已選擇 ${selectedGroupingCourse.length} 個學程`}</Flex>
              <Flex w="30%">
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
                <Button
                  size="sm"
                  colorScheme="blue"
                  mr={3}
                  onClick={() => {
                    onSaveEditing();
                  }}
                >
                  套用
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  isDisabled={selectedGroupingCourse.length === 0}
                  onClick={() => {
                    onResetEditing();
                  }}
                >
                  重設
                </Button>
              </Flex>
            </Flex>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody p={8} overflowY="auto">
            <Flex flexWrap={"wrap"} w="100%">
              <Flex w="100%">
                <Box mb={6} w="100%">
                  <Flex
                    p="2"
                    h="40px"
                    flexDirection="column"
                    justifyContent="center"
                    bg={"white"}
                  >
                    <Heading fontSize="2xl" color={"heading.light"}>
                      {`已選開課學程`}
                    </Heading>
                  </Flex>
                  <Divider pt={2} />
                  {selectedGroupingCourse.length > 0 ? (
                    <Flex w="100%" minH="80px" flexWrap={"wrap"}>
                      {/* {programs
                        .filter((program) =>
                          selectedProgram.includes(program.value)
                        )
                        .map((program, index) => (
                          <FilterElement
                            key={`${program.value}-${index}-modalHeader`}
                            id={program.value}
                            name={program.chinese_label}
                            selected={true}
                            onClick={() => {
                              setSelectedProgram(
                                selectedProgram.filter(
                                  (code) => code !== program.value
                                )
                              );
                            }}
                          />
                        ))} */}
                    </Flex>
                  ) : (
                    <Flex
                      w="100%"
                      h="80px"
                      justify={"center"}
                      alignItems="center"
                      sx={{
                        color: "#909090",
                      }}
                    >
                      尚未選擇分組編班課程
                    </Flex>
                  )}
                </Box>
              </Flex>
              {modalBody}
            </Flex>
          </ModalBody>
          <ModalFooter
            display={{ base: "none", md: "flex" }}
            borderTop={"0.5px solid #6F6F6F"}
            boxSizing="border-box"
          >
            <Flex justifyContent={"end"} w="100%">
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
                  isDisabled={selectedGroupingCourse.length === 0}
                  onClick={() => {
                    onResetEditing();
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
