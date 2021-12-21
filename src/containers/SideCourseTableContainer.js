import { React, useRef, forwardRef } from 'react';
import  FocusLock from "react-focus-lock"
import {
    Flex,
    Text,
    Box,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    Stack,
    ButtonGroup,
    FormControl,
    FormLabel,
    Input,
    useDisclosure,
} from '@chakra-ui/react';
import {
    FaRegEdit,
} from 'react-icons/fa';

function SideCourseTableContainer(props) {
    const { onOpen, onClose, isOpen } = useDisclosure()
    const firstFieldRef = useRef(null)
    const TextInput = forwardRef((props, ref) => {
        return (
          <FormControl>
            <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
            <Input ref={ref} id={props.id} {...props} />
          </FormControl>
        )
      })
    const Form = ({ firstFieldRef, onCancel }) => {
        return (
            <Stack spacing={4}>
            <TextInput
                label='課表名稱'
                id='table_name'
                ref={firstFieldRef}
                defaultValue='我的課表'
            />
            <ButtonGroup d='flex' justifyContent='flex-end'>
                <Button variant='outline' onClick={onCancel}>
                Cancel
                </Button>
                <Button colorScheme='teal' onClick={onCancel}>
                Save
                </Button>
            </ButtonGroup>
            </Stack>
        )
    }
    const renderEditName = () => {
        if (!props.isOpen){
            return (<></>);
        }
        return(
            <Popover isOpen={isOpen} initialFocusRef={firstFieldRef} onOpen={onOpen} onClose={onClose}>
                <PopoverTrigger>
                    <Button size="sm" variant="solid" colorScheme="gray" p="2"><FaRegEdit size={22}/></Button>
                </PopoverTrigger>
                <PopoverContent >
                    <FocusLock returnFocus persistentFocus={false}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader color="gray.500" fontWeight="700">課表設定</PopoverHeader>
                        <PopoverBody p={5}>
                            <Form firstFieldRef={firstFieldRef} onCancel={onClose} onSet={onClose} />
                        </PopoverBody>
                    </FocusLock>
                </PopoverContent>
            </Popover>
        );
    };
    return (
        <Box w="100%" h="100%" bg="gray.200" mt="128px" transition="1000ms ease-in-out">
            <Flex flexDirection="column" m="4" ml="8">
                <Flex flexDirection="row" justifyContent="start" alignItems="center" mb="4">
                    <Text fontWeight="700" fontSize={props.isOpen ? "3xl":"xl"} color="gray.600" mr="4" transition="1000ms ease-in-out">我的課表</Text>
                    {renderEditName()}
                </Flex>
                <Flex flexDirection="row" justifyContent="start" alignItems="center">
                    <Flex w="100%" h="50vh" bg="white"/>
                    <Flex w="100%" h="50vh" bg="white"/>
                    <Flex w="100%" h="50vh" bg="white"/>
                    <Flex w="100%" h="50vh" bg="white"/>
                    <Flex w="100%" h="50vh" bg="white"/>
                </Flex>
            </Flex>
        </Box>
    );
}

export default SideCourseTableContainer;