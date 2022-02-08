import{
  Flex,
} from '@chakra-ui/react';
function CourseDetailInfoContainer({ course }){
  return(
    <Flex w='100%' h='100%' flexDirection={{base: 'column', md: 'row'}} justify='space-around'>
      <Flex w={{base: '100%', md: '30%'}} flexDirection='column' justify='start'>
          <Flex bg='gray.200' h='75%' borderRadius='2xl' fontSize='3xl' mb={5}>課程基本資訊</Flex>
          <Flex bg='gray.200' h='25%' borderRadius='2xl' fontSize='3xl' mb={5}>加簽資訊( StatusModal / History data )</Flex>
      </Flex>
      <Flex w={{base: '100%', md: '30%'}} flexDirection='column' justify='start'>
          <Flex bg='gray.200' h='55%' borderRadius='2xl' fontSize='3xl' mb={5}>Little Time Table (show time-loc info)</Flex>
          <Flex bg='gray.200' h='45%' borderRadius='2xl' fontSize='3xl' mb={5}>Rating from ptt or other source</Flex>
      </Flex>
      <Flex w={{base: '100%', md: '30%'}} flexDirection='column' justify='start'>
          <Flex bg='gray.200' h='100%' borderRadius='2xl' fontSize='3xl' mb={5}>課程大綱</Flex>
      </Flex>
    </Flex>
  );
}

export default CourseDetailInfoContainer;