import { React } from 'react';
import {
    Box,
    Flex,
    Heading,
    Badge,
    Text,
    Spacer,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Tag,
    TagLeftIcon,
    TagLabel,
    IconButton,
    Button,
    ButtonGroup,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react';
  import { FaPlus, FaInfoCircle } from 'react-icons/fa';
  import { IoMdOpen } from 'react-icons/io';
import { info_view_map } from '../data/mapping_table';

function RenderNolContentBtn(course, title, key){
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Button variant="ghost" colorScheme="blue" leftIcon={<FaInfoCircle/>} size="sm" onClick={onOpen} key={"NolContent_"+key}>{title}</Button>

            <Modal size="xl" isOpen={isOpen} onClose={onClose} motionPreset='slideInBottom' scrollBehavior="outside" key={"NolContent_Modal_"+key}>
            <ModalOverlay key={"NolContent_ModalOverlay_"+key}/>
            <ModalContent maxW="850px" height="90vh" key={"NolContent_Modal_"+key}>
                <ModalHeader key={"NolContent_Header_"+key}>課程詳細資訊</ModalHeader>
                <ModalCloseButton key={"NolContent_ModalCloseButton_"+key}/>
                <ModalBody key={"NolContent_ModalBody_"+key}>
                <iframe title={course.id} sandbox="allow-scripts" src={genNolUrl(course)} height="100%" width="100%" key={"NolContent_iframe_"+key}/>   
                </ModalBody>
                <ModalFooter key={"NolContent_ModalFooter_"+key}>
                <Text fontWeight="500" fontSize="sm" color="gray.300">資料來自 台大課程網</Text>
                <Spacer key={"NolContent_Spacer_"+key}/>
                <Button key={"NolContent_Button_"+key} size="sm" mr="-px" rightIcon={<IoMdOpen />} onClick={() => openPage(genNolUrl(course), false)}>在新分頁中打開</Button>
                </ModalFooter>
            </ModalContent>
            </Modal>
        </>
    );
}

function openPage(url, doClose){
    let wnd = window.open(url, '_blank');
    if(doClose){
        console.log("closing");
        setTimeout(() => {
            wnd.close();
        }, 1000);
    }
}
const genNolAddUrl = (course) => {
    let d_id = "T010"
    return `https://nol.ntu.edu.tw/nol/coursesearch/myschedule.php?add=${course.id}&ddd=${d_id}`;
    
};
const genNolUrl = (course) => {
    let lang="CH";
    let base_url = "https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?";
    let params = `course_id=${course.course_id.substr(0,3)}%20${course.course_id.substr(3)}&class=${course.class_id}&ser_no=${course.id}&semester=${course.semester.substr(0,3)}-${course.semester.substr(3,1)}&lang=${lang}`;
    return base_url+params;
}

function CourseDrawerContainer(props) {
    const renderDataElement = (fieldName, data) => {
        if (data === "") {
            return (<></>);
        }
        return(
            <Flex flexDirection="row" alignItems="center" justifyContent="start" mr="4" minW="10vw">
                <Badge variant='solid' colorScheme="gray" >{fieldName}</Badge>
                <Heading as="h3" color="gray.600" fontSize="sm" ml="4px">{data}</Heading>
            </Flex>
        );
    };
    const renderHyperButton = (fieldName, url) => {
        if (url === "" || !url) {
            return (<></>);
        }
        return(
            <Button size="sm" mr="-px" onClick={() => openPage(url)}>{fieldName}</Button>
        );
    };
    return(
        <Flex px="1" flexDirection="column" width="100%" alignItems="start" justifyContent="space-between">
            <Flex ml="2px" flexDirection="row" alignItems="center" justifyContent="start" flexWrap="wrap">
                {renderDataElement("課程識別碼", props.courseInfo.course_id)}
                {renderDataElement("課號", props.courseInfo.course_code)}
                {renderDataElement("班次", props.courseInfo.class_id)}
                {renderDataElement(info_view_map.enroll_method.name, info_view_map.enroll_method.map[props.courseInfo.enroll_method])}
                {renderDataElement(info_view_map.language.name, info_view_map.language.map[props.courseInfo.language])}
                {renderDataElement("開課單位", props.courseInfo.provider.toUpperCase())}
            </Flex>
            <Spacer my="2" />
            <Flex w="100%" flexDirection="row" alignItems="start" justifyContent="start" borderRadius="md" border="2px" borderColor="gray.200">
                <Flex w="30%" flexDirection="column" alignItems="start" justifyContent="start" p="2">
                    <Heading as="h3" color="gray.600" fontSize="lg" ml="4px" mb="1">修課限制</Heading>
                    <Text fontSize="sm" color="gray.800" mx="4px">{props.courseInfo.limit === "" ? "無" : props.courseInfo.limit}</Text>
                </Flex>
                <Flex w="70%" flexDirection="column" alignItems="start" justifyContent="start" p="2">
                    <Heading as="h3" color="gray.600" fontSize="lg" ml="4px" mb="1">備註</Heading>
                    <Text fontSize="sm" color="gray.800" mx="4px">{props.courseInfo.note === "" ? "無" : props.courseInfo.note}</Text>
                </Flex>
            </Flex>
            <Spacer my="2" />
            <Flex w="100%" flexDirection="row" alignItems="center" justifyContent="start">
                <ButtonGroup size="sm" isAttached variant='outline' colorScheme="blue">
                    {renderHyperButton("CEIBA", props.courseInfo.url["ceiba"])}
                    {renderHyperButton("COOL", props.courseInfo.url["cool"])}
                </ButtonGroup>
                <Spacer/>
                <Button variant="ghost" colorScheme="blue" leftIcon={<FaPlus/>} size="sm" onClick={() => openPage(genNolAddUrl(props.courseInfo), true)}>加入課程網</Button>
                {RenderNolContentBtn(props.courseInfo, "課程詳細資訊", props.courseInfo.course_id)}
            </Flex>
        </Flex>
    );
}

export { CourseDrawerContainer, RenderNolContentBtn };