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
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { college_map } from "data/college";
import { deptList } from "data/department";
import FilterElement from "components/FilterModals/components/FilterElement";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import { reportEvent } from "utils/ga";

export interface DeptFilterModalProps {
  readonly title: string;
  readonly isEnabled: boolean;
  readonly selectedDept: string[];
  readonly setSelectedDept: (time: string[]) => void;
}

function DeptFilterModal({
  title,
  isEnabled,
  selectedDept,
  setSelectedDept,
}: DeptFilterModalProps) {
  const headingColor = useColorModeValue("heading.light", "heading.dark");
  const { searchFilters, setSearchFilters } = useCourseSearchingContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const modalBgColor = useColorModeValue("white", "gray.700");

  const onOpenModal = () => {
    // overwrite local states by redux store
    setSelectedDept(searchFilters.department);
    onOpen();
  };

  const onCancelEditing = () => {
    // fire when click "X" or outside of modal
    // overwrite local state by redux state
    onClose();
    setSelectedDept(searchFilters.department);
  };

  const onSaveEditing = () => {
    // fire when click "Save"
    // overwrite redux state by local state
    setSearchFilters({ ...searchFilters, department: selectedDept });
    onClose();
  };

  const onResetEditing = () => {
    // fire when click "Reset"
    // set local state to empty array
    setSelectedDept([]);
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
                px="2"
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
                <Divider />
              </Flex>
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
      <Button
        size={useBreakpointValue({ base: "sm", md: "md" }) ?? "md"}
        isDisabled={!isEnabled}
        onClick={() => {
          onOpenModal();
          reportEvent("filter_department", "click", "open_modal");
        }}
      >
        {title}
      </Button>
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
          <ModalHeader>
            {title}
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
                onClick={() => {
                  onResetEditing();
                  reportEvent("filter_department", "click", "reset_changes");
                }}
              >
                重設
              </Button>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
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
            <Divider />
            {modalBody}
          </ModalBody>
          <ModalFooter display={{ base: "none", md: "flex" }}>
            <Button
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
              variant="ghost"
              onClick={() => {
                onResetEditing();
                reportEvent("filter_department", "click", "reset_changes");
              }}
            >
              重設
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeptFilterModal;
