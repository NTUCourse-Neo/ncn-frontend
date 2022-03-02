import { React, useEffect } from 'react';
import {
  Input,
    Flex,
    HStack,
    Text,
    Image,
    InputGroup,
    Checkbox,
    InputRightAddon,
    Button,
  } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import setPageMeta from '../utils/seo';
import hiringPeopleSvg from '../img/hiring_people.svg';
import hiringCollabSvg from '../img/hiring_collab.svg';
import hiringOfficeSvg from '../img/hiring_office.svg';


function RecruitingPageContainer(props){
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta({title: `招募 | NTUCourse Neo`, desc: `招募頁面 | NTUCourse Neo，全新的臺大選課網站。`});
  } , [])
  return(
    <>
      <Flex h="95vh" direction="column" alignItems="center" px={["10", "20", "100","200"]} pt="100px">
        <HStack w="100%" align="end" justify="space-between">
          <Image src={hiringOfficeSvg} alt="hire_office" w="20vw"/>
          <Image src={hiringPeopleSvg} alt="hire_people" w="20vw"/>
          <Image src={hiringCollabSvg} alt="hire_collab" w="20vw"/>
        </HStack>
        <Flex h="600px" w="100%" flexDirection="row" justifyContent="space-between" alignItems="center" mt="20px">
          <Flex w="100%" direction="column" alignItems="start" justifyContent="center">
            <Text as="h1" fontSize="8xl" fontWeight="bold" color="gray.700">We are hiring!</Text>
            <Text as="h1" fontSize="5xl" fontWeight="500" color="gray.500">新夥伴招募</Text>
          </Flex>
          <Flex w="70%" direction="column" alignItems="end" justifyContent="center">
            <InputGroup my="2" size='lg'>
              <Input variant='outline' placeholder={"姓名 / Name"} />
              <InputRightAddon children='必填' />
            </InputGroup>
            <InputGroup my="2" size='lg'>
              <Input variant='outline' placeholder='電子郵件 / E-mail Address' />
              <InputRightAddon children='必填' />
            </InputGroup>
            <InputGroup my="2" size='lg'>
              <Input variant='outline' placeholder='就讀、畢業學校 / School' />
              <InputRightAddon children='必填' />
            </InputGroup>
            <Input size='lg' my="2" variant='outline' placeholder='個人網站 / Personal Website' />
            <Input size='lg' my="2" variant='outline' placeholder='簡歷、作品集網址 / CV or Portfolio Link' />
            <HStack mt="8" w="100%" justify="space-between">
              <HStack>
                <Checkbox alignContent="center">我已閱讀並同意</Checkbox>
                <Text as="button" color="blue.500" size="sm"> <Text as="u">資料利用政策</Text></Text>
              </HStack>
              <Button size='md' colorScheme='blue' mt="20px">送出 / Submit</Button>
            </HStack>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default RecruitingPageContainer;