import { Flex, Spacer, Text, Button, ButtonGroup, useMediaQuery } from '@chakra-ui/react';
import { FaExclamationTriangle, FaGithub, FaHeartbeat } from 'react-icons/fa';

function Footer() {
    const handleOpenPage = (page) => {
        window.open(page, '_blank');
    };
    const [isMobile] = useMediaQuery("(max-width: 760px)") 
    return (
        <Flex h="5vh" flexDirection="row" flexWrap="wrap" justifyContent="center" alignItems="start" px="4" py="4" borderTop="1px solid" borderColor="gray.200" zIndex="10000" css={{gap: "10px"}}>
            <Text size="sm" color="gray.500" ml="2" fontWeight="800">NTUCourse Neo</Text>
            <Text fontSize="xs" color="gray.300">Beta V1.0</Text>
            {isMobile? <></>:<Spacer />}
            <Text fontSize="sm" color="gray.300">A wp1101 project. Made with 💖 by </Text>
            <ButtonGroup spacing="2">
                <Button size="xs" leftIcon={<FaGithub/>} color="gray.300" variant="ghost" onClick={() => handleOpenPage("https://github.com/jc-hiroto")}>jc-hiroto</Button>
                <Button size="xs" leftIcon={<FaGithub/>} color="gray.300" variant="ghost" onClick={() => handleOpenPage("https://github.com/swh00tw")}>swh00tw</Button>
                <Button size="xs" leftIcon={<FaGithub/>} color="gray.300" variant="ghost" onClick={() => handleOpenPage("https://github.com/Wil0408")}>Wil0408</Button>
            </ButtonGroup>
            {isMobile? <></>:<Spacer />}
            <ButtonGroup spacing="2">
                <Button size="xs" variant="ghost" color="gray.500" leftIcon={<FaGithub/>} mx="1" onClick={() => handleOpenPage("https://github.com/NTUCourse-Neo")}>Github</Button>
                <Button size="xs" variant="ghost" color="gray.500" leftIcon={<FaHeartbeat/>} mx="1" onClick={() => handleOpenPage("https://status.course.myntu.me/")}>服務狀態</Button>
                <Button size="xs" variant="ghost" color="gray.500" leftIcon={<FaExclamationTriangle/>} mx="1" onClick={() => handleOpenPage("https://www.surveycake.com/s/LzWd6")}>問題回報</Button>
            </ButtonGroup>
        </Flex>
    );
}
export default Footer;