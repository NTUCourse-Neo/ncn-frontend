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
  StatHelpText,
  Divider,
} from '@chakra-ui/react';
import { PieChart } from 'react-minimal-pie-chart';
import { FaCircle, FaRss } from 'react-icons/fa';
import { IoMdOpen } from 'react-icons/io';
import BetaBadge from '../components/BetaBadge';
import { info_view_map } from '../data/mapping_table';
import PTTContentRowContainer from './PTTContentRowContainer';

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
    <Flex w="100%" minH="83vh" pt={isMobile ? "150px":""} flexDirection={isMobile?'column':'row'} flexWrap="wrap" justify={'center'}>
      {/* COL 1 */}
      <Flex w={isMobile?"100%": "30%"} flexDirection={'column'}>
        {/* Box1 */}
        <Flex bg='gray.100' h="70%" my='1%' px="6" py="4" borderRadius='xl' flexDirection="column">
          <Text fontSize="2xl" fontWeight="800" color="gray.700">詳細資料</Text>
          <Flex mt="4" justifyContent="start" alignItems="start" flexWrap='wrap' gap="2">
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
          <Divider mt="4" mb="4" borderColor="gray.300"/>
          <VStack mt="2" align="start">
            <Text fontSize="md" textAlign="center" color="gray.700" fontWeight="700">修課限制</Text>
            <Text fontSize="sm" textAlign="center" color="gray.600">{course.limit}</Text>
          </VStack>
          <VStack mt="2" align="start">
            <Text fontSize="md" textAlign="center" color="gray.700" fontWeight="700">備註</Text>
            <Text fontSize="sm" textAlign="center" color="gray.600">{course.note}</Text>
          </VStack>
          <Divider mt="4" mb="4" borderColor="gray.300"/>
          <Text fontSize="lg" color="gray.700" fontWeight="700">節次資訊</Text>
          <Text fontSize="sm" color="gray.600">{course.time_loc}</Text>
        </Flex>
        {/* Box2 */}
        <Flex bg='gray.100' h={isMobile? "":"26%"} my='1%' px="6" py="4" borderRadius='xl' flexDirection="column" justifyContent="space-between">
          <Tabs variant='soft-rounded' size="sm">
            <HStack spacing="4">
              <Text fontSize="2xl" fontWeight="800" color="gray.700">選課資訊</Text>
              <TabList>
                <Tab><Icon mr="2" w="2" as={FaCircle} color="red.600"/>即時</Tab>
                <Tab isDisabled cursor="not-allowed">歷史<BetaBadge content="coming soon" size="xs"/></Tab>
              </TabList>
            </HStack>
            <TabPanels>
              <TabPanel>
                <Flex w="100%" mt="4" flexDirection="row" justifyContent="center" alignItems={isMobile? "start":"center"} flexWrap="wrap">
                  <Stat>
                    <StatLabel>選上</StatLabel>
                    <StatNumber>10</StatNumber>
                    <StatHelpText>人</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>選上外系</StatLabel>
                    <StatNumber>0</StatNumber>
                    <StatHelpText>人</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>登記</StatLabel>
                    <StatNumber>100</StatNumber>
                    <StatHelpText>人</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>剩餘</StatLabel>
                    <StatNumber>20</StatNumber>
                    <StatHelpText>空位</StatHelpText>
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
          <Tabs h="100%" variant='soft-rounded' size="sm">
            <HStack spacing="4">
              <Text fontSize="2xl" fontWeight="800" color="gray.700">課程評價<BetaBadge content="preview" size="sm"/></Text>
              <TabList>
                <Tab>PTT</Tab>
                <Tab>NTURating</Tab>
              </TabList>
            </HStack>
            <TabPanels>
              <TabPanel>
                <PTTContentRowContainer course={course} type="review" height="14vh"/>
              </TabPanel>
              <TabPanel>
                <Flex h="100%" flexDirection="column" alignItems="start">
                  <Text fontSize="md" fontWeight="600" color="gray.700">NTURating 上共有 {ratingMock.count} 筆評價</Text>
                  <HStack w="100%" justify="space-between" my="2">
                    <Stat>
                      <StatLabel>甜度</StatLabel>
                      <StatNumber>{ratingMock.sweety}</StatNumber>
                      <StatHelpText>平均值</StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>涼度</StatLabel>
                      <StatNumber>{ratingMock.breeze}</StatNumber>
                      <StatHelpText>平均值</StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>紮實度</StatLabel>
                      <StatNumber>{ratingMock.workload}</StatNumber>
                      <StatHelpText>平均值</StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>品質</StatLabel>
                      <StatNumber>{ratingMock.quality}</StatNumber>
                      <StatHelpText>平均值</StatHelpText>
                    </Stat>
                  </HStack>
                  <Button colorScheme="blue" variant="outline" size="sm" rightIcon={<IoMdOpen/>} onClick={() => window.open(ratingMock.url+"?referrer=ntucourse_neo", "_blank")}>前往 NTURating 查看該課程評價</Button>
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
          {renderDataSource("PTT NTUCourse, NTURating")}
        </Flex>
        {/* Box5 */}
        <Flex h={isMobile? "":"44.5%"} bg='gray.100' my='1%' px="6" py="4" borderRadius='xl' flexDirection="column" justifyContent="space-between">
          <Tabs variant='soft-rounded' size="sm">
            <HStack spacing="4">
              <Text fontSize="2xl" fontWeight="800" color="gray.700">考古題資訊<BetaBadge content="preview" size="sm"/></Text>
              <TabList>
                <Tab>PTT</Tab>
              </TabList>
            </HStack>
            <TabPanels>
              <TabPanel>
                  <PTTContentRowContainer course={course} type="exam" height="25vh"/>
              </TabPanel>
            </TabPanels>
          </Tabs>
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
                      <Text mb="4" fontSize="md" fontWeight="400" color="gray.600">{syllabusMock[key] !== "" ? syllabusMock[key]:"無"}</Text>
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