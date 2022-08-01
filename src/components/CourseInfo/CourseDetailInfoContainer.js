import {
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
  Tag,
  VStack,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FaCircle, FaRss } from "react-icons/fa";
import BetaBadge from "components/BetaBadge";
import { info_view_map } from "data/mapping_table";
import parseCourseSchedlue from "utils/parseCourseSchedule";
import {
  SignUpPanel,
  EnrollStatusPanel,
  NTURatingPanel,
  PTTReviewPanel,
  PTTExamPanel,
  SyllabusPanel,
  GradePolicyPanel,
} from "components/CourseInfo/Panel";

function DataSourceTag({ source }) {
  return (
    <HStack spacing="2">
      <FaRss color="gray" size="12" />
      <Text
        fontSize="sm"
        textAlign="center"
        color={useColorModeValue("gray.500", "gray.400")}
      >
        資料來源: {source}
      </Text>
    </HStack>
  );
}

function CourseDetailInfoContainer({ course }) {
  const course_codes_1 = [
    { title: "流水號", value: course.serial },
    { title: "課號", value: course.code },
    { title: "課程識別碼", value: course.identifier },
    { title: "班次", value: course?.class ?? "無" },
  ];
  const course_codes_2 = [
    { title: "人數上限", value: course.slot },
    {
      title: "必選修",
      value: info_view_map.requirement.map[course.requirement],
    },
    { title: "開課學期", value: course.semester },
    { title: "授課語言", value: info_view_map.language.map[course.language] },
  ];
  const headingColor = useColorModeValue("heading.light", "heading.dark");
  const textColor = useColorModeValue("text.light", "text.dark");
  const statsTitleColor = useColorModeValue("gray.500", "gray.500");
  const bgCard = useColorModeValue("card.light", "card.dark");

  return (
    <Flex
      w="100%"
      minH="83vh"
      pt={{ base: "150px", lg: 0 }}
      flexDirection={{ base: "column", lg: "row" }}
      flexWrap="wrap"
      justify={"center"}
      bg={useColorModeValue("white", "black")}
    >
      {/* COL 1 */}
      <Flex w={{ base: "100%", lg: "30%" }} flexDirection={"column"}>
        {/* Box1 */}
        <Flex
          bg={bgCard}
          my="1vh"
          px="6"
          py="4"
          borderRadius="xl"
          flexDirection="column"
          flexGrow={1}
          flexShrink={1}
        >
          <Text fontSize="2xl" fontWeight="800" color={headingColor}>
            詳細資料
          </Text>
          <Flex
            mt="4"
            justifyContent="start"
            alignItems="start"
            flexWrap="wrap"
            gap="2"
          >
            <Flex mr="16" flexDirection="column" flexWrap="wrap">
              {course_codes_1.map((item, index) => {
                if (!item.value) {
                  return null;
                }
                return (
                  <Stat key={"code_stats_1" + index}>
                    <StatLabel color={statsTitleColor} mb="-1">
                      {item.title}
                    </StatLabel>
                    <StatNumber mb="2">{item.value}</StatNumber>
                  </Stat>
                );
              })}
            </Flex>
            <Flex mr="16" flexDirection="column" flexWrap="wrap">
              {course_codes_2.map((item, index) => {
                if (!item.value) {
                  return null;
                }
                return (
                  <Stat key={"code_stats_2" + index}>
                    <StatLabel color={statsTitleColor} mb="-1">
                      {item.title}
                    </StatLabel>
                    <StatNumber mb="2">{item.value}</StatNumber>
                  </Stat>
                );
              })}
            </Flex>
            <Flex flexDirection="column" flexWrap="wrap">
              <Stat>
                <StatLabel color={statsTitleColor} mb="-1">
                  系所
                </StatLabel>
                <StatNumber mb="1">
                  <HStack spacing="2">
                    {course.departments.length === 0 ? (
                      <Tag colorScheme="blackAlpha" size="lg">
                        無資訊
                      </Tag>
                    ) : (
                      <Flex flexDirection={"row"} flexWrap="wrap">
                        {course.departments.map((department, index) => {
                          return (
                            <Tag
                              key={"department_" + index}
                              colorScheme="blue"
                              size="lg"
                              m={1}
                            >
                              {department.name_full}
                            </Tag>
                          );
                        })}
                      </Flex>
                    )}
                  </HStack>
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel color={statsTitleColor} mb="-1">
                  學分
                </StatLabel>
                <StatNumber mb="2">{course.credits}</StatNumber>
              </Stat>
              {course.enroll_method ? (
                <Stat>
                  <StatLabel color={statsTitleColor} mb="-1">
                    加簽方式
                  </StatLabel>
                  <StatNumber mb="2">
                    <HStack spacing="2">
                      <Tag
                        colorScheme="blue"
                        size="md"
                        fontWeight="800"
                        fontSize="lg"
                      >
                        {course.enroll_method}
                      </Tag>
                      <Text>
                        {info_view_map.enroll_method.map[course.enroll_method]}
                      </Text>
                    </HStack>
                  </StatNumber>
                </Stat>
              ) : null}
              <Stat>
                <StatLabel color={statsTitleColor} mb="-1">
                  開課單位
                </StatLabel>
                <StatNumber>{course.provider.toUpperCase()}</StatNumber>
              </Stat>
            </Flex>
          </Flex>
          <Divider mt="4" mb="4" borderColor="gray.300" />
          {course?.limitation && (
            <VStack mt="2" align="start">
              <Text
                fontSize="md"
                textAlign="center"
                color={headingColor}
                fontWeight="700"
              >
                修課限制
              </Text>
              <Text fontSize="sm" color={textColor} align="start">
                {course.limitation}
              </Text>
            </VStack>
          )}
          {course?.note && (
            <VStack mt="2" align="start">
              <Text
                fontSize="md"
                textAlign="center"
                color={headingColor}
                fontWeight="700"
              >
                備註
              </Text>
              <Text fontSize="sm" color={textColor} align="start">
                {course.note}
              </Text>
            </VStack>
          )}
          <Divider mt="4" mb="4" borderColor="gray.300" />
          <Text mb="2" fontSize="lg" color={headingColor} fontWeight="700">
            節次資訊
          </Text>
          <Text fontSize="sm" color={textColor}>
            {parseCourseSchedlue(course) ?? "無資訊"}
          </Text>
        </Flex>
        {/* Box2 */}
        <Flex
          bg={bgCard}
          my="1vh"
          px="6"
          py="4"
          borderRadius="xl"
          flexDirection="column"
          justifyContent="space-between"
          flexGrow={1}
          flexShrink={1}
        >
          <Tabs variant="soft-rounded" size="sm">
            <HStack spacing="4">
              <Text fontSize="2xl" fontWeight="800" color={headingColor}>
                選課資訊
              </Text>
              <TabList>
                <Tab>
                  <Icon mr="2" w="2" as={FaCircle} color="red.600" />
                  即時
                </Tab>
              </TabList>
            </HStack>
            <TabPanels my="3">
              <TabPanel>
                <EnrollStatusPanel courseSerial={course.serial} />
              </TabPanel>
              <TabPanel></TabPanel>
            </TabPanels>
          </Tabs>
          <DataSourceTag source={"臺大選課系統"} />
        </Flex>
      </Flex>
      {/* COL 2 */}
      <Flex
        w={{ base: "100%", lg: "30%" }}
        mx={{ base: 0, lg: "1%" }}
        flexDirection={"column"}
      >
        {/* Box3 */}
        <Flex
          bg={bgCard}
          my="1vh"
          px="6"
          py="4"
          borderRadius="xl"
          flexDirection="column"
          flexGrow={1}
          flexShrink={1}
        >
          <Text fontSize="2xl" fontWeight="800" color={headingColor}>
            加簽資訊
            <BetaBadge content="beta" size="sm" />
          </Text>
          <SignUpPanel courseId={course.id} />
        </Flex>
        {/* Box4 */}
        <Flex
          bg={bgCard}
          my="1vh"
          px="6"
          py="4"
          borderRadius="xl"
          flexDirection="column"
          justifyContent="space-between"
          flexGrow={1}
          flexShrink={1}
        >
          <Tabs h="100%" variant="soft-rounded" size="sm">
            <HStack spacing="4">
              <Text fontSize="2xl" fontWeight="800" color={headingColor}>
                評價
              </Text>
              <TabList>
                <Tab color={textColor}>PTT</Tab>
                <Tab color={textColor}>NTURating</Tab>
              </TabList>
            </HStack>
            <TabPanels>
              <TabPanel>
                <PTTReviewPanel courseId={course.id} />
              </TabPanel>
              <TabPanel>
                <NTURatingPanel courseId={course.id} />
              </TabPanel>
            </TabPanels>
          </Tabs>
          <DataSourceTag source="PTT NTUCourse, NTURating" />
        </Flex>
        {/* Box5 */}
        <Flex
          bg={bgCard}
          my="1vh"
          px="6"
          py="4"
          borderRadius="xl"
          flexDirection="column"
          justifyContent="space-between"
          flexGrow={1}
          flexShrink={1}
        >
          <Tabs variant="soft-rounded" size="sm">
            <HStack spacing="4">
              <Text fontSize="2xl" fontWeight="800" color={headingColor}>
                考古題資訊
              </Text>
              <TabList>
                <Tab>PTT</Tab>
              </TabList>
            </HStack>
            <TabPanels>
              <TabPanel>
                <PTTExamPanel courseId={course.id} />
              </TabPanel>
            </TabPanels>
          </Tabs>
          <DataSourceTag source="PTT NTU-Exam" />
        </Flex>
      </Flex>
      {/* COL 3 */}
      <Flex w={{ base: "100%", lg: "30%" }} flexDirection={"column"}>
        {/* Box6 */}
        <Flex
          bg={bgCard}
          h={{ base: "", md: "55vh" }}
          my="1vh"
          px="6"
          py="4"
          borderRadius="xl"
          flexDirection="column"
          justifyContent="space-between"
          flexGrow={1}
          flexShrink={1}
        >
          <VStack h="95%" align="start">
            <Text fontSize="2xl" fontWeight="800" color={headingColor}>
              課程大綱
            </Text>
            <SyllabusPanel courseId={course.id} />
          </VStack>
          <DataSourceTag source="臺大課程網" />
        </Flex>
        {/* Box7 */}
        <Flex
          bg={bgCard}
          h={{ base: "", md: "31vh" }}
          my="1vh"
          px="6"
          py="4"
          borderRadius="xl"
          flexDirection="column"
          justifyContent="space-between"
          flexGrow={1}
          flexShrink={1}
        >
          <Text fontSize="2xl" fontWeight="800" color={headingColor}>
            評分方式
          </Text>
          <GradePolicyPanel courseId={course.id} />
          <DataSourceTag source="臺大課程網" />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default CourseDetailInfoContainer;
