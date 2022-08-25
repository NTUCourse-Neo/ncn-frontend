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
import { type_list, code_map } from "data/course_type";
import FilterElement from "components/FilterModals/components/FilterElement";
import React, { useMemo } from "react";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import { reportEvent } from "utils/ga";

export interface CategoryFilterModalProps {
  readonly title: string;
  readonly isEnabled: boolean;
  readonly selectedType: string[];
  readonly setSelectedType: (time: string[]) => void;
}

function CategoryFilterModal({
  title,
  isEnabled,
  selectedType,
  setSelectedType,
}: CategoryFilterModalProps) {
  const headingColor = useColorModeValue("heading.light", "heading.dark");
  const { searchFilters, setSearchFilters } = useCourseSearchingContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const modalBgColor = useColorModeValue("white", "gray.700");

  const onOpenModal = () => {
    // overwrite local states by redux store
    setSelectedType(searchFilters.category);
    onOpen();
  };

  const onCancelEditing = () => {
    // fire when click "X" or outside of modal
    // overwrite local state by redux state
    onClose();
    setSelectedType(searchFilters.category);
  };

  const onSaveEditing = () => {
    // fire when click "Save"
    // overwrite redux state by local state
    setSearchFilters({ ...searchFilters, category: selectedType });
    onClose();
  };

  const onResetEditing = () => {
    // fire when click "Reset"
    // set local state to empty array
    setSelectedType([]);
  };

  const modalBody = useMemo(
    () => (
      <React.Fragment key={`modalBody`}>
        {Object.keys(code_map).map((code_map_key, index) => {
          const categories = type_list.filter(
            (type) => type.code[0] === code_map_key
          );
          return (
            <React.Fragment key={`${code_map_key}-${index}`}>
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
                  {code_map[code_map_key].name}
                </Heading>
                <Divider />
              </Flex>
              {categories
                .filter((type) => !selectedType.includes(type.id))
                .map((type, typeIdx) => (
                  <FilterElement
                    key={`${type.id}-${typeIdx}`}
                    id={type.code}
                    name={type.full_name}
                    selected={false}
                    onClick={() => {
                      setSelectedType([...selectedType, type.id]);
                      reportEvent("filter_category", "click", type.id);
                    }}
                  />
                ))}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    ),
    [selectedType, setSelectedType, headingColor, modalBgColor]
  );

  return (
    <>
      <Button
        size={useBreakpointValue({ base: "sm", md: "md" }) ?? "md"}
        isDisabled={!isEnabled}
        onClick={() => {
          onOpenModal();
          reportEvent("filter_category", "click", "open_modal");
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
                  reportEvent("filter_category", "click", "save_changes");
                }}
              >
                套用
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  onResetEditing();
                  reportEvent("filter_category", "click", "reset_changes");
                }}
              >
                重設
              </Button>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody overflow="auto" pt="0">
            {type_list
              .filter((type) => selectedType.includes(type.id))
              .map((type, index) => (
                <FilterElement
                  key={`${type.id}-${index}-modalHeader`}
                  id={type.code}
                  name={type.full_name}
                  selected={true}
                  onClick={() => {
                    setSelectedType(
                      selectedType.filter((id) => id !== type.id)
                    );
                    reportEvent("filter_category", "click", type.id);
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
                reportEvent("filter_category", "click", "save_changes");
              }}
            >
              套用
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onResetEditing();
                reportEvent("filter_category", "click", "reset_changes");
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

export default CategoryFilterModal;
