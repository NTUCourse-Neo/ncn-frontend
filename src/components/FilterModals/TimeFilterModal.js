import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Badge, Button, Heading, Divider, Flex, useMediaQuery } from '@chakra-ui/react';
import { college_map } from '../../data/college';
import { dept_list_bachelor_only } from '../../data/department';
import { type_list, code_map } from '../../data/course_type';
import TimetableSelector from './components/TimetableSelector';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter } from '../../actions';
import { mapStateToTimeTable } from '../../utils/timeTableConverter';

function TimeFilterModal({ selectedTime, setSelectedTime, toggle, title }) {
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const time_state = useSelector(state => state.search_filters.time);
    // console.error = () => {};

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

    // const renderSelectedHeader = () => {
    //     if (type === 'department') {
    //         return (
    //             <Flex flexDirection="column" justifyContent="start" alignItems="start" mx="8" mb="4">
    //                 <Flex w="100%" flexWrap="wrap" flexDirection="row" justifyContent="start" alignItems="start">
    //                     {dept_list_bachelor_only.map(dept => renderButton('department', dept, selectedDept, setSelectedDept, true))}
    //                 </Flex>
    //             </Flex>
    //         );
    //     }
    //     if (type === 'category') {
    //         return (
    //             <Flex flexDirection="column" justifyContent="start" alignItems="start" mx="8" mb="4">
    //                 <Flex w="100%" flexWrap="wrap" flexDirection="row" justifyContent="start" alignItems="start">
    //                     {type_list.map(category => renderButton('category', category, selectedType, setSelectedType, true))}
    //                 </Flex>
    //             </Flex>
    //         );
    //     }
    //     return <></>;
    // };

    // for dept and category
    // const handleSelect = (value, selected, setSelected) => {
    //     let index = selected.indexOf(value);
    //     if (index === -1) {
    //         setSelected([...selected, value]);
    //     } else {
    //         selected.splice(index, 1);
    //         setSelected([...selected]);
    //     }
    // };
    // for dept and category
    // TODO: move as functional compopnent
    // const renderButton = (type, data, selected, setSelected, renderSelected) => {
    //     let key;
    //     switch (type) {
    //         case 'department':
    //             key = data.code;
    //             break;
    //         case 'category':
    //             key = data.id;
    //             break;
    //         default:
    //             key = data.code;
    //     }
    //     let index = selected.indexOf(key);
    //     if ((index === -1) === !renderSelected) {
    //         return (
    //             <Button
    //                 key={type + key + ' button'}
    //                 colorScheme="teal"
    //                 variant={index === -1 ? 'outline' : 'solid'}
    //                 size="sm"
    //                 minW="100px"
    //                 m="1"
    //                 onClick={() => handleSelect(key, selected, setSelected)}
    //                 _hover={index === -1 ? { bg: 'teal.100' } : { bg: 'red.700' }}
    //             >
    //                 <Badge mx="2" colorScheme="blue" key={type + key + ' badge'}>
    //                     {data.code}
    //                 </Badge>
    //                 {data.full_name}
    //             </Button>
    //         );
    //     } else {
    //         return <></>;
    //     }
    // };
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
