import {
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Badge,
    Button,
    Heading,
    Divider,
    Flex,
    useMediaQuery,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';

function CategoryFilterModal({ title, isEnabled, selectedType, setSelectedType }) {
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isMobile] = useMediaQuery('(max-width: 760px)');

    const onOpenModal = () => {
        // TODO: overwrite local states by redux store
        onOpen();
    };

    const onCancelEditing = () => {
        // fire when click "X" or outside of modal
        // TODO: overwrite local state by redux state
        onClose();
    };

    const onSaveEditing = () => {
        // fire when click "Save"
        // TODO: overwrite redux state by local state
        onClose();
    };

    const onResetEditing = () => {
        // fire when click "Reset"
        // TODO: set local state to empty array
    };

    return (
        <>
            <Button
                size={isMobile ? 'sm' : 'md'}
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
                        {/* TODO: render buttons */}
                        <h1>hello</h1>
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

export default CategoryFilterModal;
