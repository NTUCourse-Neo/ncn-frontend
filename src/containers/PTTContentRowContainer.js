import React from 'react';
import {
  Badge,
  Flex,
  Spacer,
  Text,
  VStack,
  Icon,
  HStack,
  Image,
} from '@chakra-ui/react';
import { IoMdOpen } from 'react-icons/io';
import ParrotGif from "../img/parrot/parrot.gif";

const mock = {
  review: [
    {
      "title": "[評價] 109-2 劉宗德 計算機結構",
      "aid": "1WtOYoRb",
      "author": "kamelus",
      "date": "7/01",
      "url": "https://www.ptt.cc/bbs/NTUcourse/M.1625131186.A.6E5.html"
    },
    {
      "title": "[評價] 109-2 劉宗德 計算機結構",
      "aid": "1WtOYoRb",
      "author": "kamelus",
      "date": "7/01",
      "url": "https://www.ptt.cc/bbs/NTUcourse/M.1625131186.A.6E5.html"
    },
    {
      "title": "[評價] 109-2 劉宗德 計算機結構",
      "aid": "1WtOYoRb",
      "author": "kamelus",
      "date": "7/01",
      "url": "https://www.ptt.cc/bbs/NTUcourse/M.1625131186.A.6E5.html"
    },
    {
      "title": "[評價] 109-2 劉宗德 計算機結構",
      "aid": "1WtOYoRb",
      "author": "kamelus",
      "date": "7/01",
      "url": "https://www.ptt.cc/bbs/NTUcourse/M.1625131186.A.6E5.html"
    },
    {
      "title": "[評價] 109-2 劉宗德 計算機結構",
      "aid": "1WtOYoRb",
      "author": "kamelus",
      "date": "7/01",
      "url": "https://www.ptt.cc/bbs/NTUcourse/M.1625131186.A.6E5.html"
    },
  ],
  exam: [
    {
      "title": "[試題] 97下 楊佳玲 計算機結構 期中考",
      "aid": "19wPQnOw",
      "author": "robertshih",
      "date": "4/18",
      "url": "https://www.ptt.cc/bbs/NTU-Exam/M.1240045233.A.63A.html"
    },
    {
      "title": "[試題] 101-1 洪士灝 計算機結構 期中考",
      "aid": "1GdwpiaX",
      "author": "harry2145",
      "date": "11/11",
      "url": "https://www.ptt.cc/bbs/NTU-Exam/M.1352641772.A.921.html"
    },
    {
      "title": "[試題] 101上 洪士顥 計算機結構 期末考",
      "aid": "1Gxd4kwp",
      "author": "bztfir",
      "date": "1/10",
      "url": "https://www.ptt.cc/bbs/NTU-Exam/M.1357803822.A.EB3.html"
    },
    {
      "title": "[試題] 105-1 洪士灝 計算機結構 期中考",
      "aid": "1OalTuIR",
      "author": "candy357963",
      "date": "2/02",
      "url": "https://www.ptt.cc/bbs/NTU-Exam/M.1486026616.A.49B.html"
    },
    {
      "title": "[試題] 105-1 洪士灝 計算機結構 期中考",
      "aid": "1OalTuIR",
      "author": "candy357963",
      "date": "2/02",
      "url": "https://www.ptt.cc/bbs/NTU-Exam/M.1486026616.A.49B.html"
    },
    {
      "title": "[試題] 105-1 洪士灝 計算機結構 期中考",
      "aid": "1OalTuIR",
      "author": "candy357963",
      "date": "2/02",
      "url": "https://www.ptt.cc/bbs/NTU-Exam/M.1486026616.A.49B.html"
    },
    {
      "title": "[試題] 105-1 洪士灝 計算機結構 期中考",
      "aid": "1OalTuIR",
      "author": "candy357963",
      "date": "2/02",
      "url": "https://www.ptt.cc/bbs/NTU-Exam/M.1486026616.A.49B.html"
    },
    {
      "title": "[試題] 107-2 楊佳玲 計算機結構 期中考",
      "aid": "1SV_Rty5",
      "author": "dannyko",
      "date": "3/07",
      "url": "https://www.ptt.cc/bbs/NTU-Exam/M.1551890167.A.F05.html"
    }
  ]
}

function PTTContentRowContainer({ course, type, height, isLoading}){
  const RenderRow = (data) => {
    return(
      <Flex as="button" px="2" my="1" key={data.id} w="100%" h="10" bg="blue.50" justifyContent="start" alignItems="center" borderRadius="lg" onClick={() => window.open(data.url,"_blank")}>
        <Badge mr="1" colorScheme="blue">{data.date}</Badge>
        <Text w="50%" mr="2" fontSize="md" color="gray.700" fontWeight="500" textAlign="start" isTruncated>{data.title}</Text>
        <Text w="20%" as="i" fontSize="xs" color="gray.400" fontWeight="500" textAlign="start" isTruncated>- {data.author}</Text>
        <Spacer />
        <Icon as={IoMdOpen} color="gray.400" size="20px" />
      </Flex>
    );
  };
  if (isLoading){
    return(
      <Flex w="100%" h={height} mb="0" overflow="auto" flexDirection="column" justifyContent="center" alignItems="center">
        <VStack>
          <Image src={ParrotGif} h="32px" />
          <Text fontSize="lg" fontWeight="800" color="gray.500" textAlign="center">努力取得資訊中...</Text>
        </VStack>
      </Flex>
    );
  }
  return(
    <Flex w="100%" h={height} mb="0" overflow="auto" flexDirection="column">
      <VStack>
        {mock[type].map(RenderRow)}
      </VStack>
    </Flex>
  );
}

export default PTTContentRowContainer;