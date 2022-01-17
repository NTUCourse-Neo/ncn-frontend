import {
    Center,
    Image,
    Text,
    Button,
    HStack
} from '@chakra-ui/react';
import { FaHeartbeat } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

function ErrorContainer(props){
    const error_page_states = useLocation().state;

    const handleOpenPage = (page) => {
        window.open(page, '_blank');
    };
    const error_img_src = `https://http.cat/${props.code}`
    // can random pick one msg from the list, welcome to add more msgs
    const error_msgs = [`太無情了你真的太無情了`, `出事了阿北`, `==?`, `哭啊`] 
    const error_message = error_msgs[Math.floor(Math.random() * error_msgs.length)];

    console.log(error_page_states);
    if (!error_page_states){
        console.log('NOT VALID');
        return (
        <Center flexDirection='column' justifyItems="center" maxW="60vw" mx="auto" overflow="visible" p="64px" h='95vh' >
            <Image mt="5vh" src={error_img_src} w="auto" h="80%"/>
            <a href="https://youtu.be/yKrR5IHwT0k" target="_blank" rel="noreferrer noopener">
                <Text fontSize='4xl' color='gray.500' mt='2vh'>不可以直接用url打我ㄛ</Text>
            </a>
            <HStack spacing={2} mt="4">
                <Button variant="solid" onClick={() => handleOpenPage("https://www.surveycake.com/s/LzWd6")}>點我回報問題 🥺</Button>
                <Button variant="solid" colorScheme="teal" leftIcon={<FaHeartbeat />} onClick={() => handleOpenPage("https://status.course.myntu.me/")}>服務狀態</Button>
            </HStack>
        </Center>)
    }

    return (
        <Center flexDirection='column' justifyItems="center" maxW="60vw" mx="auto" overflow="visible" p="64px" h='95vh' >
                <Image mt="5vh" src={error_img_src} w="auto" h="80%"/>
                <a href="https://youtu.be/yKrR5IHwT0k" target="_blank" rel="noreferrer noopener">
                    <Text fontSize='4xl' color='gray.500' mt='2vh'>{error_message}</Text>
                </a>
                <HStack spacing={2} mt="4">
                    <Button variant="solid" onClick={() => handleOpenPage("https://www.surveycake.com/s/LzWd6")}>點我回報問題 🥺</Button>
                    <Button variant="solid" colorScheme="teal" leftIcon={<FaHeartbeat />} onClick={() => handleOpenPage("https://status.course.myntu.me/")}>服務狀態</Button>
                </HStack>
        </Center>
    )
}

export default ErrorContainer;