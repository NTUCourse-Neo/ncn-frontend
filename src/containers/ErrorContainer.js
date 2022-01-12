import {
    Box,
    Flex,
    Center,
    Image,
    Text
} from '@chakra-ui/react';

function ErrorContainer(props){

    const error_img_src = `https://http.cat/${props.code}`
    // can random pick one msg from the list, welcome to add more msgs
    const error_msgs = [`太無情了你真的太無情了`, `出事了阿北`, `==?`, `哭啊`] 
    const error_message = error_msgs[Math.floor(Math.random() * error_msgs.length)];

    return (
        <Center flexDirection='column' justifyItems="center" maxW="60vw" mx="auto" overflow="visible" p="64px" h='95vh' >
                <Image mt="5vh" src={error_img_src} w="auto" h="80%"/>
                <a href="https://youtu.be/yKrR5IHwT0k" target="_blank" rel="noreferrer noopener">
                    <Text fontSize='4xl' color='gray.500' mt='2vh'>{error_message}</Text>
                </a>
                <a href="https://www.surveycake.com/s/LzWd6" target="_blank" rel="noreferrer noopener"><Text fontSize='xl' color='gray.500' mt='0.5vh'>點我回報問題 🥺</Text></a>
        </Center>
    )
}

export default ErrorContainer;