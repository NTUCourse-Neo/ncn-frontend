import {useState} from 'react';
import { Flex, Tag, Heading, Spacer, Text, Button, SlideFade } from '@chakra-ui/react';
import { FaGithub, FaHeartbeat } from 'react-icons/fa';

function Footer() {
    const [hover, setHover] = useState(false);
    const handleOpenPage = (page) => {
        window.open(page, '_blank');
    };
    return (
        <Flex h="5vh" flexDirection="row" justifyContent="start" alignItems="center" px="4" py={2} borderTop="1px solid" borderColor="gray.200" zIndex="10000" onMouseEnter={(e)=>{if (e.type==='mouseenter'){setHover(true)}}} onMouseLeave={(e)=>{if (e.type==='mouseleave'){setHover(false)}}}>
            <Heading size="sm" color="gray.500" mr="8">NTUCourse Neo</Heading>
            <Button size="sm" variant="ghost" color="gray.500" leftIcon={<FaGithub/>} mx="1" onClick={() => handleOpenPage("https://github.com/NTUCourse-Neo")}>Github</Button>
            <Button size="sm" variant="ghost" color="gray.500" leftIcon={<FaHeartbeat/>} mx="1" onClick={() => handleOpenPage("https://status.course.myntu.me/")}>服務狀態</Button>
            <Spacer />
            <Text fontSize="sm" color="gray.300">
              A wp1101 project. Made with 💖 by 
                <a href="https://github.com/jc-hiroto" target="_blank" rel="noreferrer noopener"><Button size="xs" leftIcon={<FaGithub/>} variant="ghost" ml="2px" mr="2px">jc-hiroto</Button></a>
                <a href="https://github.com/swh00tw" target="_blank" rel="noreferrer noopener"><Button size="xs" leftIcon={<FaGithub/>} variant="ghost" ml="2px" mr="2px">swh00tw</Button></a>
                <a href="https://github.com/Wil0408" target="_blank" rel="noreferrer noopener"><Button size="xs" leftIcon={<FaGithub/>} variant="ghost" ml="2px" mr="2px">Wil0408</Button></a>
            </Text>
            <Spacer/>
            <Flex>
                <SlideFade in={hover===true} offsetY='5px'>
                    <a href="https://www.surveycake.com/s/LzWd6" target="_blank" rel="noreferrer noopener"><Tag fontSize="xs" mr='4' color="gray.400" align-self="end" colorScheme='teal'>問題回報</Tag></a>
                </SlideFade>
                <Text fontSize="xs" color="gray.300" align-self="end" position={'relative'}>Beta V1.0</Text>
            </Flex>
        </Flex>
    );
}
export default Footer;