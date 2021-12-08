import { React, useState } from 'react';
import {
    Box,
    Flex,
    Text,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Switch,
    FormControl,
    FormLabel,
    Collapse,
    IconButton,
    Container,
} from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import CourseInfoRowContainer from './CourseInfoRowContainer';
import DataSet from '../components/FakeDataSet';
import CourseSearchInput from '../components/CourseSearchInput';


function CourseResultViewContainer() {
    const [ displayFilter, setDisplayFilter ] = useState(false);
    const renderSettingSwitch = (label, default_checked) => {
        return(
            <FormControl display='flex' alignItems='center' my="2">
                <Switch id='add-nol' defaultChecked={default_checked} mr="2"/>
                <FormLabel htmlFor='add-nol' mb='0' fontWeight="500" color="gray.600">
                    {label}
                </FormLabel>
            </FormControl>
        );
    };
    return (
        <Box display='flex'flexDirection="column" alignItems='center' h="95vh" overflow="auto" maxW="screen-md" mx="auto" pt="64px" pb="40px">
            <Flex w="100%" direction="column" position="sticky" top="0" bgColor="white" zIndex="100" boxShadow="md">
                <Flex w="100%" px="20vw" py="4" direction="column" >
                    <CourseSearchInput />
                    <Collapse in={displayFilter}>
                        <Box w="100%" py="8px" mt="4">
                            <Tabs>
                                <TabList>
                                    <Tab><Text color="gray.700" fontSize="xl" fontWeight="700">篩選</Text></Tab>
                                    <Tab><Text color="gray.700" fontSize="xl" fontWeight="700">設定</Text></Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                    讚
                                    </TabPanel>
                                    <TabPanel>
                                        <Flex flexDirection="column" alignItems="center">
                                            {renderSettingSwitch('顯示已選課程', true)}
                                            {renderSettingSwitch('只顯示未衝堂課程', false)}
                                            {renderSettingSwitch('同步新增至課程網', false)}
                                        </Flex>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Box>
                    </Collapse>
                </Flex>
                <IconButton size="sm" variant='ghost' icon={displayFilter? <FaChevronUp />:<FaChevronDown />} onClick={() => setDisplayFilter(!displayFilter)} />
            </Flex>
            <Flex direction="row" justifyContent="center" w="100%">
                <Flex direction="column" overflow="a">
                    <CourseInfoRowContainer flex='3' courseInfo={DataSet.courseInfo} />
                </Flex>
            </Flex>
        </Box>
    );
};

export default CourseResultViewContainer;
