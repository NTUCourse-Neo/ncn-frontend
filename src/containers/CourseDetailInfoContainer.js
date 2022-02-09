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
  Tag,
  Spacer,
  VStack,
} from '@chakra-ui/react';
import { PieChart } from 'react-minimal-pie-chart';
import { FaCircle, FaRss } from 'react-icons/fa';
import { IoMdOpen } from 'react-icons/io';
import BetaBadge from '../components/BetaBadge';
import { info_view_map } from '../data/mapping_table';

// fake data
const pieMock = [
  { title: '作業', value: 40, color: '#E38627' },
  { title: '期中考', value: 30, color: '#C13C37' },
  { title: '期末考', value: 30, color: '#6A2135' },
]
const ratingMock = {
  "sweety": 4.75,
  "breeze": 1.5,
  "workload": 3.75,
  "quality": 5,
  "count": 2,
  "url": "https://rating.myntu.me/course-overview?_id=611654f61ca507248a5ca342&instructor=呂宛蓁&courseName=桌球初級"
}
const syllabusMock = {
  intro: "土木系大一必修課程，會從最基礎的內容教起。",
  objective: "透過 Python 電腦程式語言的介紹與實際寫作，提昇學生邏輯思考與善用現代化資訊工具的能力，並能利用電腦程式解決簡單的工程領域相關問題。 ",
  requirement: "來上課來上機課程資訊閱讀作業及程式實作來考試：小考、期中考、期末考",
  office_hour: "",
  material: "待補",
  specify: ""
}
const syllabusTitle = {
  intro: "概述",
  objective: "目標",
  requirement: "要求",
  office_hour: "Office Hour",
  material: "參考書目",
  specify: "指定閱讀"
}

function CourseDetailInfoContainer({ course }){
  const [isMobile] = useMediaQuery('(max-width: 1000px)')
  console.log(isMobile);
  const course_codes_1 = [
    {title: "流水號", value: course.id},
    {title: "課號", value: course.course_code},
    {title: "課程識別碼", value: course.course_id},
    {title: "班次", value: course.class_id ? course.class_id : "無"},
  ];
  const course_codes_2 = [
    {title: "人數上限", value: course.total_slot},
    {title: "必選修", value: info_view_map.required.map[course.required]},
    {title: "開課學期", value: course.semester},
    {title: "授課語言", value: info_view_map.language.map[course.language]},
  ];
  const renderDataSource = (dataSource) => {
    return(
      <HStack spacing="2">
        <FaRss color="gray" size="12"/>
        <Text fontSize="sm" textAlign="center" color="gray.500">資料來源: {dataSource}</Text>
      </HStack>
    );
  }
  return(
    <Flex w="100%" minH="83vh" flexDirection={isMobile?'column':'row'} flexWrap="wrap" justify={'center'}>
      {/* COL 1 */}
      <Flex w={isMobile?"100%": "30%"} flexDirection={'column'}>
        {/* Box1 */}
        <Flex bg='gray.100' h="70%" my='1%' px="6" py="4" borderRadius='xl' flexDirection="column">
          <Text fontSize="2xl" fontWeight="800" color="gray.700">課程詳細資料</Text>
          <Flex mt="4" justifyContent="start" alignItems="start" fontSize={{base: 'sm', lg: 'lg'}}>
            <Flex mr="16" flexDirection="column" flexWrap="wrap">
              {
                course_codes_1.map((item, index) => {
                  return(
                    <Stat key={"code_stats_"+index}>
                      <StatLabel>{item.title}</StatLabel>
                      <StatNumber>{item.value}</StatNumber>
                    </Stat>
                  );
                })
              }
            </Flex>
            <Flex mr="16" flexDirection="column" flexWrap="wrap">
              {
                course_codes_2.map((item, index) => {
                  return(
                    <Stat key={"code_stats_"+index}>
                      <StatLabel>{item.title}</StatLabel>
                      <StatNumber>{item.value}</StatNumber>
                    </Stat>
                  );
                })
              }
            </Flex>
            <Flex flexDirection="column" flexWrap="wrap">
              <Stat>
                <StatLabel>系所</StatLabel>
                <StatNumber>
                  <HStack spacing="2">
                    {
                      course.department === "" ? "無":
                      course.department.map((item, index) => {
                        return(
                          <Tag key={"department_"+index} colorScheme="blue" size="lg">{item}</Tag>
                          );
                        })
                    }
                  </HStack>
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>學分</StatLabel>
                <StatNumber>{course.credit}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>加簽方式</StatLabel>
                <StatNumber>
                  <HStack spacing="2">
                    <Tag colorScheme="blue" size="lg" fontWeight="800" fontSize="xl">{course.enroll_method}</Tag>
                    <Text>{info_view_map.enroll_method.map[course.enroll_method]}</Text>
                  </HStack>
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>開課單位</StatLabel>
                <StatNumber>{course.provider.toUpperCase()}</StatNumber>
              </Stat>
            </Flex>
          </Flex>
        </Flex>
        {/* Box2 */}
        <Flex bg='gray.100' h={isMobile? "":"26%"} my='1%' px="6" py="4" borderRadius='xl' flexDirection="column">
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
      </Flex>
      {/* COL 2 */}
      <Flex w={isMobile?"100%": "30%"} mx={isMobile? "":"1%"} flexDirection={'column'}>
        {/* Box3 */}
        <Flex h="20%" h={isMobile? "":"20%"} bg='gray.100' my='1%' px="6" py="4" borderRadius='xl' flexDirection="column">
          <Text fontSize="2xl" fontWeight="800" color="gray.700">加簽資訊<BetaBadge content="coming soon" size="sm"/></Text>
        </Flex>
        {/* Box4 */}
        <Flex h={isMobile? "":"30%"} bg='gray.100' my='1%' px="6" py="4" borderRadius='xl' flexDirection="column" justifyContent="space-between">
          <Tabs variant='soft-rounded' size="sm">
            <HStack spacing="4">
              <Text fontSize="2xl" fontWeight="800" color="gray.700">課程評價<BetaBadge content="preview" size="sm"/></Text>
              <TabList>
                <Tab>PTT</Tab>
                <Tab>NTURating</Tab>
              </TabList>
            </HStack>
            <TabPanels>
              <TabPanel>
                <p>PTT</p>
              </TabPanel>
              <TabPanel>
                <Flex h="100%" my="4" flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Flex flexDirection="column" justifyContent="center" alignItems="center">
                    <HStack w="100%" spacing={2} justify="start">
                      <Text fontSize="lg" fontWeight="600" color="gray.700">甜</Text>
                      <Text fontSize="lg" fontWeight="600" color="gray.700">{ratingMock.sweety}</Text>
                    </HStack>
                    <HStack w="100%" spacing={2} justify="start">
                      <Text fontSize="lg" fontWeight="600" color="gray.700">涼</Text>
                      <Text fontSize="lg" fontWeight="600" color="gray.700">{ratingMock.breeze}</Text>
                    </HStack>
                    <HStack w="100%" spacing={2} justify="start">
                      <Text fontSize="lg" fontWeight="600" color="gray.700">紮實</Text>
                      <Text fontSize="lg" fontWeight="600" color="gray.700">{ratingMock.workload}</Text>
                    </HStack>
                    <HStack w="100%" spacing={2} justify="start">
                      <Text fontSize="lg" fontWeight="600" color="gray.700">品質</Text>
                      <Text fontSize="lg" fontWeight="600" color="gray.700">{ratingMock.quality}</Text>
                    </HStack>
                  </Flex>
                  <Flex flexDirection="column" justifyContent="center" alignItems="center">
                    <Text fontSize="lg" fontWeight="600" color="gray.700">NTURating 上共有 {ratingMock.count} 筆評價</Text>
                    <Button my="2" colorScheme="blue" variant="outline" size="sm" rightIcon={<IoMdOpen/>} onClick={() => window.open(ratingMock.url, "_blank")}>前往課程評價頁面</Button>
                  </Flex>
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
          {renderDataSource("PTT NTUCourse, NTURating")}
        </Flex>
        {/* Box5 */}
        <Flex h={isMobile? "":"44.5%"} bg='gray.100' my='1%' px="6" py="4" borderRadius='xl' flexDirection="column">
          <Text fontSize="2xl" fontWeight="800" color="gray.700">考古題資訊<BetaBadge content="preview" size="sm"/></Text>
          {renderDataSource("PTT NTU-Exam")}
        </Flex>
      </Flex>
      {/* COL 3 */}
      <Flex w={isMobile?"100%": "30%"} flexDirection={'column'}>
        {/* Box6 */}
        <Flex bg='gray.100' h='60%' my='1%' px="6" py="4" borderRadius='xl' flexDirection="column" justifyContent="space-between">
          <VStack align="start">
            <Text fontSize="2xl" fontWeight="800" color="gray.700">課程大綱</Text>
            <Flex w="100%" my="4" flexDirection="column" justifyContent="space-evenly" alignItems="start" wordBreak="break-all" overflow='auto'>
              {
                Object.keys(syllabusMock).map((key, index) => {
                  return(
                    <>
                      <Text fontSize="lg" fontWeight="600" color="gray.700">{syllabusTitle[key]}</Text>
                      <Text mb="2" fontSize="md" fontWeight="400" color="gray.600">{syllabusMock[key] !== "" ? syllabusMock[key]:"無"}</Text>
                    </>
                  );
                })
              }
            </Flex>
          </VStack>
          {renderDataSource("臺大課程網")}
        </Flex>
        {/* Box7 */}
        <Flex h={isMobile? "":"36%"} bg='gray.100' my='1%' px="6" py="4" borderRadius='xl' flexDirection="column">
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
    </Flex>
  );
}

export default CourseDetailInfoContainer;