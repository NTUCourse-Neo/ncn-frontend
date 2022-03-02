import { React, useEffect ,useState } from 'react';
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
    Icon,
    useToast
  } from '@chakra-ui/react';
import { FaGithub, FaHandshake } from 'react-icons/fa';
import setPageMeta from '../utils/seo';
import hiringPeopleSvg from '../img/hiring_people.svg';
import hiringCollabSvg from '../img/hiring_collab.svg';
import hiringOfficeSvg from '../img/hiring_office.svg';


function RecruitingPageContainer(props){
  const toast = useToast();
  const [isChecked, setIsChecked] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [personalWebsite, setPersonalWebsite] = useState('');
  const [portfolio, setPortfolio] = useState('');

  // useEffect(()=>{
  //   console.log('name: ', name);
  //   console.log('email: ', email);
  //   console.log('school: ', school);
  //   console.log('personalWebsite: ', personalWebsite);
  //   console.log('portfolio: ', portfolio);
  // },[name, email, school, personalWebsite, portfolio]);

  const onSubmit = () => {
    // check required fields
    if (name === '' || email === '' || school === '') {
      toast({
        title: '請填寫必填欄位',
        description: 'Please fill out all required fields',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    const form = {
      name: name,
      email: email,
      school: school,
      personalWebsite: personalWebsite===''?null:personalWebsite,
      portfolio: portfolio===''?null:portfolio,
    }
    // API call
    try {
      // placeholder
      toast({
        title: '我們收到囉！',
        description: '請等候我們的聯絡',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: '發生錯誤',
        description: '請稍後再試',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta({title: `招募 | NTUCourse Neo`, desc: `招募頁面 | NTUCourse Neo，全新的臺大選課網站。`});
  } , [])

  return(
      <Flex minH="95vh" direction="column" alignItems="center" px={["10", "20", "100","200"]} pt="100px">
        <HStack w="100%" align="end" justify="space-between">
          <Image src={hiringOfficeSvg} alt="hire_office" w={{ md: '25%'}} display={{base: 'none', md: 'inline-block'}}/>
          <Image src={hiringPeopleSvg} alt="hire_people" w={{ base: '90%', md: '25%'}} />
          <Image src={hiringCollabSvg} alt="hire_collab" w={{ md: '25%'}} display={{base: 'none', md: 'inline-block'}}/>
        </HStack>
        <Flex my={4} w="100%" flexDirection={{base: 'column', lg: 'row'}} justifyContent="space-between" alignItems="center" mt="20px">
          <Flex w="100%" direction="column" alignItems={{base: 'center', lg: 'start'}} justifyContent="center">
            <Text as="h1" fontSize={{base: '5xl', md: '8xl'}} fontWeight="bold" color="gray.700">We are hiring!</Text>
            <Text mt="-20px" ml="2" as="h1" fontSize="5xl" fontWeight="500" color="gray.500">新夥伴招募</Text>
            <Flex mt="8" w={{base: '100%', md: '80%'}} px="8" py="4" direction="column" alignItems="start" justifyContent="center" border="2px" borderColor="gray.400" borderRadius="lg">
              <Flex w="100%" justifyContent="space-between" alignItems="center">
                <HStack>
                  <Icon as={FaHandshake} boxSize="5" color="gray.500" />
                  <Text fontSize="lg" fontWeight="500" color="gray.500">招募中</Text>
                </HStack>
                <Text fontSize="sm" fontWeight="500" color="gray.400">2020-03-02</Text>
              </Flex>
              <HStack>
                <Text fontSize="xl" fontWeight="600" color="gray.700">Full-Stack Web Developer</Text>
                <Text as="i" fontSize="md" fontWeight="500" color="gray.600"> － Part-time</Text>
              </HStack>
              <Flex flexDirection="column" mt="2" w="100%" alignItems="start">
                <Text fontSize="md" fontWeight="700" color="gray.500">In this role, you will...</Text>
                <Text fontSize="md" fontWeight="500" color="gray.500">- Co-develop the course selection service with NTU.</Text>
                <Text fontSize="md" fontWeight="500" color="gray.500">- Work with an innovative team.</Text>
              </Flex>
              <Flex flexDirection="column" mt="2" w="100%" alignItems="start">
                <Text fontSize="md" fontWeight="700" color="gray.500">Ideal candidate</Text>
                <Text fontSize="md" fontWeight="500" color="gray.500">- Good teamworking skills.</Text>
                <Text fontSize="md" fontWeight="500" color="gray.500">- Familiar with React.js development.</Text>
                <Text fontSize="md" fontWeight="500" color="gray.500">- Familiar with Node.js development.</Text>
                <Text fontSize="md" fontWeight="500" color="gray.500">- Experiences of DevOps or CI/CD is a plus.</Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex my={4} w="80%" direction="column" alignItems="end" justifyContent="center">
            <InputGroup my="2" size='lg'>
              <Input variant='outline' placeholder={"姓名 / Name"} onChange={(e)=>{setName(e.currentTarget.value)}}/>
              <InputRightAddon children='必填' />
            </InputGroup>
            <InputGroup my="2" size='lg'>
              <Input variant='outline' placeholder='電子郵件 / E-mail Address' onChange={(e)=>{setEmail(e.currentTarget.value)}}/>
              <InputRightAddon children='必填' />
            </InputGroup>
            <InputGroup my="2" size='lg'>
              <Input variant='outline' placeholder='就讀、畢業學校 / School' onChange={(e)=>{setSchool(e.currentTarget.value)}}/>
              <InputRightAddon children='必填' />
            </InputGroup>
            <Input size='lg' my="2" variant='outline' placeholder='個人網站 / Personal Website' onChange={(e)=>{setPersonalWebsite(e.currentTarget.value)}}/>
            <Input size='lg' my="2" variant='outline' placeholder='簡歷、作品集網址 / CV or Portfolio Link' onChange={(e)=>{setPortfolio(e.currentTarget.value)}}/>
            <Flex mt="8" w="100%" justify="space-between" align="center" flexDirection={{base: 'column', md: 'row'}}>
              <HStack>
                <Checkbox alignContent="center" onChange={()=>{setIsChecked(!isChecked)}}>我已閱讀並同意</Checkbox>
                <Text as="button" color="blue.500" size="sm"> <Text as="u">資料利用政策</Text></Text>
              </HStack>
              <Button isDisabled={!isChecked} size='md' colorScheme='blue' mt={{base: 5, md: 0}} w={{base: '100%', md: '30%'}} onClick={()=>{onSubmit()}}>送出 / Submit</Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
  );
}

export default RecruitingPageContainer;