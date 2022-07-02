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
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import TimetableSelector from "components/FilterModals/components/TimetableSelector";
import { mapStateToTimeTable } from "utils/timeTableConverter";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";

function TimeFilterModal({ selectedTime, setSelectedTime, toggle, title }) {
  const { searchFilters, setSearchFilters } = useCourseSearchingContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const saveSelectedTime = () => {
    // turn 15x7 2D array (selectedTime) to 7x15 array
    const timeTable = [[], [], [], [], [], [], []];
    const intervals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "A", "B", "C", "D"];
    for (let i = 0; i < intervals.length; i++) {
      const interval = intervals[i];
      for (let j = 0; j < 7; j++) {
        if (selectedTime[i][j] === true) {
          timeTable[j].push(interval);
        }
      }
    }
    setSearchFilters({ ...searchFilters, time: timeTable });
  };

  const resetSelectedTime = () => {
    setSelectedTime([
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
    ]);
  };

  return (
    <>
      <Button
        size={useBreakpointValue({ base: "sm", md: "md" }) ?? "md"}
        isDisabled={!toggle}
        onClick={() => {
          onOpen();
          // because this modal will not re-render, so manually reload from redux state
          setSelectedTime(mapStateToTimeTable(searchFilters.time));
        }}
      >
        {title}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          // when click "X", overwrite local state from redux state
          onClose();
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
                  onClose();
                  saveSelectedTime();
                }}
              >
                套用
              </Button>
              <Button size="sm" variant="ghost" onClick={resetSelectedTime}>
                重設
              </Button>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody overflow="auto" pt="0">
            <TimetableSelector selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
          </ModalBody>
          <ModalFooter display={{ base: "none", md: "flex" }}>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                onClose();
                saveSelectedTime();
              }}
            >
              套用
            </Button>
            <Button variant="ghost" onClick={resetSelectedTime}>
              重設
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default TimeFilterModal;
