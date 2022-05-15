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
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { college_map } from "../../data/college";
import { dept_list_bachelor_only } from "../../data/department";
import FilterElement from "./components/FilterElement";
import { setFilter } from "../../actions";

function DeptFilterModal({ title, isEnabled, selectedDept, setSelectedDept }) {
  const dispatch = useDispatch();
  const search_filters = useSelector((state) => state.search_filters);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 760px)");

  const onOpenModal = () => {
    // overwrite local states by redux store
    setSelectedDept(search_filters.department);
    onOpen();
  };

  const onCancelEditing = () => {
    // fire when click "X" or outside of modal
    // overwrite local state by redux state
    onClose();
    setSelectedDept(search_filters.department);
  };

  const onSaveEditing = () => {
    // fire when click "Save"
    // overwrite redux state by local state
    dispatch(setFilter("department", selectedDept));
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
          const departments = dept_list_bachelor_only.filter((dept) => dept.code[0] === college_key);
          if (departments.length === 0) {
            return null;
          }
          return (
            <React.Fragment key={`${college_key}`}>
              <Flex
                key={`${college_key}-${index}`}
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
                  {college_key + " " + college_map[college_key].name}
                </Heading>
                <Divider />
              </Flex>
              {departments
                .filter((dept) => !selectedDept.includes(dept.code))
                .map((dept, dept_index) => (
                  <FilterElement
                    key={`${dept.code}-${dept_index}-modalBody`}
                    id={dept.code}
                    name={dept.full_name}
                    selected={false}
                    onClick={() => {
                      setSelectedDept([...selectedDept, dept.code]);
                    }}
                  />
                ))}
            </React.Fragment>
          );
        })}
      </>
    ),
    [selectedDept, setSelectedDept]
  );

  return (
    <>
      <Button
        size={isMobile ? "sm" : "md"}
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
        size={isMobile ? "full" : "xl"}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW={{ base: "100vw", md: "90vw", lg: "50vw" }}>
          <ModalHeader>
            {title}
            {isMobile ? (
              <Flex flexDirection="row" justifyContent="start" alignItems="center" mt="2">
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
            ) : (
              <></>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody overflow="auto" pt="0">
            {dept_list_bachelor_only
              .filter((dept) => selectedDept.includes(dept.code))
              .map((dept, index) => (
                <FilterElement
                  key={`${dept.code}-${index}-modalHeader`}
                  id={dept.code}
                  name={dept.full_name}
                  selected={true}
                  onClick={() => {
                    setSelectedDept(selectedDept.filter((code) => code !== dept.code));
                  }}
                />
              ))}
            <Divider />
            {modalBody}
          </ModalBody>
          {isMobile ? (
            <></>
          ) : (
            <ModalFooter>
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
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeptFilterModal;
