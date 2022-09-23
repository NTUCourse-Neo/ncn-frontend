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
import { reportEvent } from "utils/ga";
import type { Interval } from "types/course";
import { intervals } from "constant";
import { useState } from "react";

const countInterval = (timeTable: boolean[][]): number => {
  let count = 0;
  for (let i = 0; i < timeTable.length; i++) {
    for (let j = 0; j < timeTable[i].length; j++) {
      if (timeTable[i][j]) {
        count++;
      }
    }
  }
  return count;
};

export interface TimeFilterModalProps {
  readonly title: string;
  readonly isActive?: boolean;
}

function TimeFilterModal(props: TimeFilterModalProps) {
  const { title, isActive = false } = props;
  const { searchFilters, setSearchFilters } = useCourseSearchingContext();
  const [selectedTime, setSelectedTime] = useState(
    mapStateToTimeTable(searchFilters.time)
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const saveSelectedTime = () => {
    // turn 15x7 2D array (selectedTime) to 7x15 array
    const timeTable: Interval[][] = [[], [], [], [], [], [], []];
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
          onOpen();
          setSelectedTime(mapStateToTimeTable(searchFilters.time));
          reportEvent("filter_time", "click", "open_modal");
        }}
        bg={isActive ? "#cccccc" : "white"}
      >
        {title}
      </Flex>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
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
            {`已選擇 ${countInterval(selectedTime)} 個時段`}
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
                  onClose();
                  saveSelectedTime();
                  reportEvent("filter_time", "click", "save_changes");
                }}
              >
                套用
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  resetSelectedTime();
                  reportEvent("filter_time", "click", "reset_changes");
                }}
              >
                重設
              </Button>
            </Flex>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody overflow="auto" pt="8">
            <TimetableSelector
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
            />
          </ModalBody>
          <ModalFooter
            display={{ base: "none", md: "flex" }}
            borderTop={"0.5px solid #6F6F6F"}
            boxSizing="border-box"
          >
            <Button
              variant={"unstyled"}
              sx={{
                color: "#4b4b4b",
                fontSize: "13px",
                lineHeight: "18px",
                fontWeight: 600,
              }}
              mx={6}
              isDisabled={countInterval(selectedTime) === 0}
              onClick={() => {
                resetSelectedTime();
                reportEvent("filter_time", "click", "reset_changes");
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
                onClose();
                saveSelectedTime();
                reportEvent("filter_time", "click", "save_changes");
              }}
            >
              套用
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default TimeFilterModal;
