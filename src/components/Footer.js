import { Flex, Spacer, Text, Button, ButtonGroup, useMediaQuery, Image, IconButton, HStack, Icon } from '@chakra-ui/react';
import { FaCodeBranch, FaExclamationTriangle, FaGithub, FaHeartbeat } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ncnLogo from '../img/ncn_logo.png';

function Footer({mini}) {
    const ver = "beta (20220306)"
    const handleOpenPage = (page) => {
        window.open(page, '_blank');
    };
    const [isMobile] = useMediaQuery("(max-width: 760px)") 
    return (
        <Flex flexDirection="row" flexWrap="wrap" justifyContent="center" alignItems="start" px="4" py={mini && isMobile ? "2":"4"} borderTop="1px solid" borderColor="gray.200" zIndex="9999" css={{gap: "10px"}}>
            {
                mini && isMobile?
                <>
                    <Flex w="100%" flexDirection="row" justifyContent="space-between" alignItems="center">
                        <Link to="/"><Image src={ncnLogo} alt="ncnLogo" boxSize="6"/></Link>
                        <HStack>
                            <Icon as={FaCodeBranch} color="gray.300" size="4"></Icon>
                            <Text fontSize="xs" color="gray.300" fontWeight="600">{ver}</Text>
                        </HStack>
                        <ButtonGroup spacing="2">
                            <IconButton size="sm" variant="ghost" color="gray.400" icon={<FaGithub size="20"/>} mx="1" onClick={() => handleOpenPage("https://github.com/NTUCourse-Neo")} />
                            <IconButton size="sm" variant="ghost" color="gray.400" icon={<FaHeartbeat size="20"/>} mx="1" onClick={() => handleOpenPage("https://status.course.myntu.me/")} />
                            <IconButton size="sm" variant="ghost" color="gray.400" icon={<FaExclamationTriangle size="20"/>} mx="1" onClick={() => handleOpenPage("https://www.surveycake.com/s/LzWd6")} />
                        </ButtonGroup>
                    </Flex>
                </>
                :
                <>
                    <Text size="sm" color="gray.500" ml="2" fontWeight="800">NTUCourse Neo</Text>
                    <HStack ml="2">
                        <Icon as={FaCodeBranch} color="gray.300" size="4"></Icon>
                        <Text fontSize="xs" color="gray.300" fontWeight="600">{ver}</Text>
                    </HStack>
                    {isMobile? <></>:<Spacer />}
                    <Text fontSize="sm" color="gray.300">Made with 💖 by </Text>
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
                </>
            }
        </Flex>
    );
}
export default Footer;