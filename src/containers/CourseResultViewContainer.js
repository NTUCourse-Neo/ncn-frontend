import { React } from 'react';
import {
    Box,
    Flex,
    Text,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
} from '@chakra-ui/react';
import CourseInfoRowContainer from './CourseInfoRowContainer';
import DataSet from '../components/FakeDataSet';


function CourseResultViewContainer() {
    return (
        <Box maxW="screen-md" mx="auto" overflow="visible" px="64px" pt="64px" pb="40px">
            <Flex direction="row" justifyContent="center" w="100%">
                <Flex direction="column">
                    <Box w="60vw" px="16px" py="16px" my="4" bgColor="blue.50" borderRadius="md">
                        <Tabs>
                            <TabList>
                                <Tab><Text color="gray.700" fontSize="xl" fontWeight="700">篩選</Text></Tab>
                                <Tab><Text color="gray.700" fontSize="xl" fontWeight="700">排序</Text></Tab>
                                <Tab><Text color="gray.700" fontSize="xl" fontWeight="700">顯示設定</Text></Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                讚
                                </TabPanel>
                                <TabPanel>
                                讚讚
                                </TabPanel>
                                <TabPanel>
                                讚讚讚
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                    <CourseInfoRowContainer flex='3' courseInfo={DataSet.courseInfo} />
                </Flex>
            </Flex>
        </Box>
    );
};

export default CourseResultViewContainer;
