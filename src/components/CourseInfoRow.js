// Props
// | courseInfo: Obj
//
import { React } from 'react';
import {
    Box,
    Flex,
    Heading,
    Badge,
    Spacer,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Tag,
    TagLeftIcon,
    TagLabel,
    IconButton,
  } from '@chakra-ui/react';
import CourseDrawerContainer from '../containers/CourseDrawerContainer';
import { FaUserPlus, FaPuzzlePiece, FaPlus} from 'react-icons/fa';
function CourseInfoRow(props) {
    return(
        <AccordionItem id={props.index} bg="gray.100" borderRadius="md">
            <AccordionButton>
                <Flex alignItems="center" justifyContent="start" flexDirection="row" w="100%" px="5px">
                    <Flex alignItems="center" justifyContent="start">
                        <Badge variant='outline' mr="4px">{props.courseInfo.id}</Badge>
                        <Badge colorScheme="blue" variant='solid' mx="4px">{props.courseInfo.department[0]}</Badge>
                        <Heading as="h3" size="md" ml="10px" mr="5px" color="gray.600">{props.courseInfo.course_name}</Heading>
                        <Badge variant='outline' colorScheme="gray">{props.courseInfo.credit[0]}</Badge>
                        <Heading as="h3" size="sm" ml="20px" mr="5px" color="gray.500" fontWeight="500">{props.courseInfo.teacher}</Heading>
                    </Flex>
                    <Spacer />
                    <Flex alignItems="center" justifyContent="end">
                        <Tag mx="2px" variant='subtle' colorScheme='blue'>
                            <TagLeftIcon boxSize='12px' as={FaUserPlus} />
                            <TagLabel>{props.courseInfo.total_slot}</TagLabel>
                        </Tag>
                        <Tag mx="2px" variant='subtle' colorScheme='blue'>
                            <TagLeftIcon boxSize='12px' as={FaPuzzlePiece} />
                            <TagLabel>{props.courseInfo.is_required}</TagLabel>
                        </Tag>
                        <IconButton ml="20px" colorScheme='blue' icon={<FaPlus />}/>
                    </Flex>
                </Flex>
            </AccordionButton>
            <AccordionPanel>
                <CourseDrawerContainer courseInfo={props.courseInfo}/>
            </AccordionPanel>
        </AccordionItem>
    );
}
export default CourseInfoRow;