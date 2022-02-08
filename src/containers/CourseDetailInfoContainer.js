import{
  Flex,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  HStack,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  Icon,
  useMediaQuery,
  Box,
  Button,
} from '@chakra-ui/react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { PieChart } from 'react-minimal-pie-chart';
import { FaCircle, FaRss } from 'react-icons/fa';
import React from 'react';
import { IoMdOpen } from 'react-icons/io';
import BetaBadge from '../components/BetaBadge';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);
const pieMock = [
  { title: '作業', value: 40, color: '#E38627' },
  { title: '期中考', value: 30, color: '#C13C37' },
  { title: '期末考', value: 30, color: '#6A2135' },
]
const radarMock = {
  labels: ["甜", "涼", "紮實", "品質"],
  datasets: [
    {
      label: "評分",
      data: [4.2, 3.6, 3.5, 4],
      backgroundColor: "rgba(179,181,198,0.2)",
      borderColor: "rgba(179,181,198,1)",
      borderWidth: 1,
    },
  ],
}
const syllabusMock = {
  intro: "土木系大一必修課程，會從最基礎的內容教起。",
  objective: "透過 Python 電腦程式語言的介紹與實際寫作，提昇學生邏輯思考與善用現代化資訊工具的能力，並能利用電腦程式解決簡單的工程領域相關問題。 ",
  requirement: "來上課來上機課程資訊閱讀作業及程式實作來考試：小考、期中考、期末考",
  office_hour: "",
  material: "待補",
  specify: ""
}
function CourseDetailInfoContainer({ course }){
  const [isMobile] = React.useState(useMediaQuery('(max-width: 760px)'));
  const renderDataSource = (dataSource) => {
    return(
      <HStack spacing="2">
        <FaRss color="gray" size="12"/>
        <Text fontSize="sm" textAlign="center" color="gray.500">資料來源: {dataSource}</Text>
      </HStack>
    );
  }
  return(
    <Flex w="100%" h="100%" flexDirection="column" flexWrap="wrap">
      <Flex bg='gray.100' m='2' px="6" py="4" borderRadius='xl' flexDirection="column">
        <Text fontSize="2xl" fontWeight="800" color="gray.700">課程詳細資料</Text>
      </Flex>
      <Flex  bg='gray.100' m='2' px="6" py="4" borderRadius='xl' flexDirection="column">
        <Tabs variant='soft-rounded' size="sm">
          <HStack spacing="4">
            <Text fontSize="2xl" fontWeight="800" color="gray.700">選課資訊<BetaBadge content="preview" size="sm"/></Text>
            <TabList>
              <Tab><Icon mr="2" w="2" as={FaCircle} color="red.600"/>即時</Tab>
              <Tab>歷史資料</Tab>
            </TabList>
          </HStack>
          <TabPanels>
            <TabPanel>
              <Flex w="100%" flexDirection="row" justifyContent="center" alignItems={isMobile? "start":"center"} flexWrap="wrap">
                <Stat>
                  <StatLabel>選上人數</StatLabel>
                  <StatNumber>10</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>選上外系人數</StatLabel>
                  <StatNumber>0</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>登記人數</StatLabel>
                  <StatNumber>100</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>剩餘</StatLabel>
                  <StatNumber>20</StatNumber>
                </Stat>
              </Flex>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>        
          {renderDataSource("臺大選課系統")}
      </Flex>
      <Flex  h="20%" bg='gray.100' m='2' px="6" py="4" borderRadius='xl' flexDirection="column">
        <Text fontSize="2xl" fontWeight="800" color="gray.700">加簽資訊<BetaBadge content="coming soon" size="sm"/></Text>
      </Flex>
      <Flex  h="400px" bg='gray.100' m='2' px="6" py="4" borderRadius='xl' flexDirection="column" justifyContent="space-between">
        <Tabs variant='soft-rounded' size="sm">
          <HStack spacing="4">
            <Text fontSize="2xl" fontWeight="800" color="gray.700">課程評價</Text>
            <TabList>
              <Tab>PTT</Tab>
              <Tab>NTURating</Tab>
            </TabList>
          </HStack>
          <TabPanels>
            <TabPanel>
              <p>one!</p>
            </TabPanel>
            <TabPanel>
              <Flex h="100%" my="4" flexDirection="row" justifyContent="space-between" alignItems="center">
                <Box w="220px" h="220px">
                  <Radar data={radarMock}/>
                </Box>
                <Flex flexDirection="column" justifyContent="center" alignItems="center">
                  <Text fontSize="lg" fontWeight="600" color="gray.700">NTURating 上<br/>共有 2 筆評價</Text>
                  <Button my="2" colorScheme="blue" variant="outline" size="sm" rightIcon={<IoMdOpen/>} >前往 NTURating</Button>
                </Flex>
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
        {renderDataSource("PTT NTUCourse, NTURating")}
      </Flex>
      <Flex  h="400px" bg='gray.100' m='2' px="6" py="4" borderRadius='xl' flexDirection="column">
        <Text fontSize="2xl" fontWeight="800" color="gray.700">考古題資訊</Text>
        {renderDataSource("PTT NTU-Exam")}
      </Flex>
      <Flex  bg='gray.100' m='2' px="6" py="4" borderRadius='xl' flexDirection="column">
        <Text fontSize="2xl" fontWeight="800" color="gray.700">課程大綱</Text>
        {renderDataSource("臺大課程網")}
      </Flex>
      <Flex  bg='gray.100' m='2' px="6" py="4" borderRadius='xl' flexDirection="column">
        <Text fontSize="2xl" fontWeight="800" color="gray.700">評分方式</Text>
        <Flex my="4" flexDirection="row" justifyContent="space-around" alignItems="center">
          <Box w="200px" h="200px">
            <PieChart
              lineWidth={50}
              label={({ dataEntry }) => dataEntry.value+"%"}
              labelPosition={75}
              data={pieMock}
              labelStyle={(index) => ({
                fill: "white",
                fontSize: '10px',
                fontFamily: 'sans-serif',
              })}/>
          </Box>
        </Flex>
        {renderDataSource("臺大課程網")}
      </Flex>
    </Flex>
  );
}

export default CourseDetailInfoContainer;