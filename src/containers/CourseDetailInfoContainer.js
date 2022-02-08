import{
  Flex,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  HStack,
  useMediaQuery,
} from '@chakra-ui/react';
import { FaRss } from 'react-icons/fa';
import React from 'react';
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
    <Flex w="100%" h="100%" flexDirection="column" flexWrap="wrap" gap="2" overflow="auto">
      <Flex w={["100%","30%"]} bg='gray.100' m='4' p="4" borderRadius='xl' flexDirection="column">
        <Text fontSize="2xl" fontWeight="800" color="gray.700">課程詳細資料</Text>
      </Flex>
      <Flex w={["100%","30%"]} bg='gray.100' m='4' px="6" py="4" borderRadius='xl' flexDirection="column">
        <Text fontSize="2xl" fontWeight="800" color="gray.700">選課即時資訊</Text>
          <Flex w="100%" my="4" flexDirection="row" justifyContent="center" alignItems={isMobile? "start":"center"} flexWrap="wrap">
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
          {renderDataSource("臺大選課系統")}
        </Flex>
      <Flex w={["100%","30%"]} bg='gray.100' m='4' p="4" borderRadius='xl' flexDirection="column">
        <Text fontSize="2xl" fontWeight="800" color="gray.700">加簽資訊</Text>
      </Flex>
      <Flex w={["100%","30%"]} bg='gray.100' m='4' p="4" borderRadius='xl' flexDirection="column">
        <Text fontSize="2xl" fontWeight="800" color="gray.700">課程評價</Text>
        {renderDataSource("PTT NTUCourse, NTURating")}
      </Flex>
      <Flex w={["100%","30%"]} bg='gray.100' m='4' p="4" borderRadius='xl' flexDirection="column">
        <Text fontSize="2xl" fontWeight="800" color="gray.700">考古題資料</Text>
        {renderDataSource("PTT NTU-Exam")}
      </Flex>
      <Flex w={["100%","30%"]} bg='gray.100' m='4' p="4" borderRadius='xl' flexDirection="column">
        <Text fontSize="2xl" fontWeight="800" color="gray.700">課程大綱</Text>
        {renderDataSource("臺大課程網")}
      </Flex>
    </Flex>
  );
}

export default CourseDetailInfoContainer;