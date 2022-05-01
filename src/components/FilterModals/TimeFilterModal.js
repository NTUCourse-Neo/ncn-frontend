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
    useMediaQuery,
} from '@chakra-ui/react';
import TimetableSelector from './components/TimetableSelector';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter } from '../../actions';
import { mapStateToTimeTable } from '../../utils/timeTableConverter';

function TimeFilterModal({ selectedTime, setSelectedTime, toggle, title }) {
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const time_state = useSelector(state => state.search_filters.time);

    const [isMobile] = useMediaQuery('(max-width: 760px)');

    const saveSelectedTime = () => {
        // turn 15x7 2D array (selectedTime) to 7x15 array
        let timeTable = [[], [], [], [], [], [], []];
        const intervals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'B', 'C', 'D'];
        for (let i = 0; i < intervals.length; i++) {
            let interval = intervals[i];
            for (let j = 0; j < 7; j++) {
                if (selectedTime[i][j] === true) {
                    timeTable[j].push(interval);
                }
            }
        }
        dispatch(setFilter('time', timeTable));
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
                size={isMobile ? 'sm' : 'md'}
                isDisabled={!toggle}
                onClick={() => {
                    onOpen();
                    // because this modal will not re-render, so manually reload from redux state
                    setSelectedTime(mapStateToTimeTable(time_state));
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
                size={isMobile ? 'full' : 'xl'}
                scrollBehavior="inside"
            >
                <ModalOverlay />
                <ModalContent maxW={isMobile ? '' : '50vw'}>
                    <ModalHeader>
                        {title}
                        {isMobile ? (
                            <Flex flexDirection="row" justifyContent="start" alignItems="center" mt="2">
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
                        ) : (
                            <></>
                        )}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody overflow="auto" pt="0">
                        <TimetableSelector selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
                    </ModalBody>
                    {isMobile ? (
                        <></>
                    ) : (
                        <ModalFooter>
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
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default TimeFilterModal;
