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
  useColorModeValue,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { college_map } from "data/college";
import { deptList } from "data/department";
import FilterElement from "components/FilterModals/components/FilterElement";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import { reportEvent } from "utils/ga";

export interface DeptFilterModalProps {
  readonly title: string;
  readonly isActive?: boolean;
}

function DeptFilterModal({ title, isActive = false }: DeptFilterModalProps) {
  const { searchFilters, setSearchFilters } = useCourseSearchingContext();
  const [selectedDept, setSelectedDept] = useState(searchFilters.department);
  const [isSelective, setIsSelective] = useState<boolean | null>(
    searchFilters.is_selective
  );
  const headingColor = useColorModeValue("heading.light", "heading.dark");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const modalBgColor = useColorModeValue("white", "gray.700");

  const onOpenModal = () => {
    // overwrite local states by context
    setSelectedDept(searchFilters.department);
    setIsSelective(searchFilters.is_selective);
    onOpen();
  };

  const onCancelEditing = () => {
    // fire when click "X" or outside of modal
    // overwrite local state by context
    onClose();
    setSelectedDept(searchFilters.department);
    setIsSelective(searchFilters.is_selective);
  };

  const onSaveEditing = () => {
    // fire when click "Save"
    // overwrite redux state by local state
    setSearchFilters({
      ...searchFilters,
      department: selectedDept,
      is_selective: isSelective,
    });
    onClose();
  };

  const onResetEditing = () => {
    // fire when click "Reset"
    // set local state to empty array
    setSelectedDept([]);
    setIsSelective(null);
  };

  const modalBody = useMemo(
    () => (
      <>
        {Object.keys(college_map).map((college_key, index) => {
          const departments = deptList.filter(
            (dept) => dept.college_id === college_key
          );
          if (departments.length === 0) {
            return null;
          }
          return (
            <React.Fragment key={`${college_key}-${index}`}>
              <Flex
                p="2"
                h="40px"
                flexDirection="column"
                justifyContent="center"
                position="sticky"
                top="0"
                mt={index === 0 ? 0 : 6}
                zIndex="50"
                bg={modalBgColor}
              >
                <Heading fontSize="2xl" color={headingColor}>
                  {college_key + " " + college_map[college_key].name}
                </Heading>
              </Flex>
              <Divider pt={2} />
              {departments
                .filter((dept) => !selectedDept.includes(dept.id))
                .map((dept, dept_index) => (
                  <FilterElement
                    key={`${dept.id}-${dept_index}-modalBody`}
                    id={dept.id}
                    name={dept.name_full}
                    selected={false}
                    onClick={() => {
                      setSelectedDept([...selectedDept, dept.id]);
                      reportEvent("filter_department", "click", dept.id);
                    }}
                  />
                ))}
            </React.Fragment>
          );
        })}
      </>
    ),
    [selectedDept, setSelectedDept, headingColor, modalBgColor]
  );

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
            {`已選擇 ${selectedDept.length} 個系所`}
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
                  reportEvent("filter_department", "click", "save_changes");
                }}
              >
                套用
              </Button>
              <Button
                size="sm"
                variant="ghost"
                isDisabled={selectedDept.length === 0 && isSelective === null}
                onClick={() => {
                  onResetEditing();
                  reportEvent("filter_department", "click", "reset_changes");
                }}
              >
                重設
              </Button>
            </Flex>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody overflow="auto" pt="0">
            {deptList
              .filter((dept) => selectedDept.includes(dept.id))
              .map((dept, index) => (
                <FilterElement
                  key={`${dept.id}-${index}-modalHeader`}
                  id={dept.id}
                  name={dept.name_full}
                  selected={true}
                  onClick={() => {
                    setSelectedDept(
                      selectedDept.filter((code) => code !== dept.id)
                    );
                    reportEvent("filter_department", "click", dept.id);
                  }}
                />
              ))}
            {modalBody}
          </ModalBody>
          <ModalFooter
            display={{ base: "none", md: "flex" }}
            borderTop={"0.5px solid #6F6F6F"}
            boxSizing="border-box"
          >
            <Flex justifyContent={"space-between"} w="100%">
              <Flex alignItems={"center"}>
                <RadioGroup
                  onChange={(next) => {
                    if (next === "all") {
                      setIsSelective(null);
                    } else if (next === "selective") {
                      setIsSelective(true);
                    } else if (next === "required") {
                      setIsSelective(false);
                    }
                  }}
                  value={
                    isSelective === null
                      ? "all"
                      : isSelective === false
                      ? "required"
                      : "selective"
                  }
                >
                  <Stack
                    direction="row"
                    spacing={4}
                    sx={{
                      fontSize: "14px",
                      lineHeight: "20px",
                      fontWeight: 500,
                      color: "#666666",
                      letterSpacing: "0.05em",
                    }}
                  >
                    <Radio value={"all"}>全部</Radio>
                    <Radio value={"required"}>必修課程</Radio>
                    <Radio value={"selective"}>選修課程</Radio>
                  </Stack>
                </RadioGroup>
              </Flex>
              <Flex>
                <Button
                  variant={"unstyled"}
                  sx={{
                    color: "#4b4b4b",
                    fontSize: "13px",
                    lineHeight: "18px",
                    fontWeight: 600,
                  }}
                  mx={6}
                  isDisabled={selectedDept.length === 0 && isSelective === null}
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

export default DeptFilterModal;
