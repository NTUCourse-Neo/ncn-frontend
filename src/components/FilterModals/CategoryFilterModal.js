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
} from "@chakra-ui/react";
import { type_list, code_map } from "data/course_type";
import FilterElement from "components/FilterModals/components/FilterElement";
import React, { useMemo } from "react";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";

function CategoryFilterModal({ title, isEnabled, selectedType, setSelectedType }) {
  const { search_filters, setFilter } = useCourseSearchingContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onOpenModal = () => {
    // overwrite local states by redux store
    setSelectedType(search_filters.category);
    onOpen();
  };

  const onCancelEditing = () => {
    // fire when click "X" or outside of modal
    // overwrite local state by redux state
    onClose();
    setSelectedType(search_filters.category);
  };

  const onSaveEditing = () => {
    // fire when click "Save"
    // overwrite redux state by local state
    setFilter("category", selectedType);
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
          const categories = type_list.filter((type) => type.code[0] === code_map_key);
          return (
            <React.Fragment key={`${code_map_key}`}>
              <Flex
                key={`${code_map_key}-${index}`}
                px="2"
                h="40px"
                flexDirection="column"
                justifyContent="center"
                position="sticky"
                top="0"
                mt={index === 0 ? 0 : 6}
                bgColor="white"
                zIndex="50"
              >
                <Heading fontSize="2xl" color="gray.600">
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
                    }}
                  />
                ))}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    ),
    [selectedType, setSelectedType]
  );

  return (
    <>
      <Button
        size={useBreakpointValue({ base: "sm", md: "md" }) ?? "md"}
        isDisabled={!isEnabled}
        onClick={() => {
          onOpenModal();
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
            <Flex flexDirection="row" justifyContent="start" alignItems="center" mt="2" display={{ base: "block", md: "none" }}>
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
                onClick={() => {
                  onResetEditing();
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
                    setSelectedType(selectedType.filter((id) => id !== type.id));
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
              }}
            >
              套用
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onResetEditing();
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
