import {
    Box,
    Flex,
    Center,
    Image,
    Text
} from '@chakra-ui/react';

function ErrorContainer(props){

    const error_img_src = `https://http.cat/${props.code}`
    // can random pick one msg from the list
    const error_msgs = [`太無情了你真的太無情了`, `出事了阿北`, `==?`] 
    const error_message = `太無情了你真的太無情了`

    return (
        <Center flexDirection='column' justifyItems="center" maxW="60vw" mx="auto" overflow="visible" p="64px" h='95vh' >
                <Image mt="5vh" src={error_img_src} w="auto" h="80%"/>
                <a href="https://youtu.be/yKrR5IHwT0k" target="_blank" rel="noreferrer noopener">
                    <Text fontSize='4xl' color='gray.500' mt='2vh'>{error_message}</Text>
                </a>
                <Text fontSize='xl' color='gray.500' mt='0.5vh'>(For dev only) Open your console to see error &#11015; &#128064;</Text>
        </Center>
    )
}

export default ErrorContainer;