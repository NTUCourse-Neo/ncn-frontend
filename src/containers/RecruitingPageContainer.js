import { React, useEffect ,useState, useRef } from 'react';
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
    useToast,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody
  } from '@chakra-ui/react';
import ReCAPTCHA from "react-google-recaptcha";
import { FaCheckCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { send_logs, verify_recaptcha } from '../actions';
import setPageMeta from '../utils/seo';
import hiringPeopleSvg from '../img/hiring_people.svg';
import hiringCollabSvg from '../img/hiring_collab.svg';
import hiringOfficeSvg from '../img/hiring_office.svg';


function RecruitingPageContainer(props){
  const toast = useToast();
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [personalWebsite, setPersonalWebsite] = useState('');
  const [portfolio, setPortfolio] = useState('');

  const recaptchaRef = useRef();

  // useEffect(()=>{
  //   console.log('name: ', name);
  //   console.log('email: ', email);
  //   console.log('school: ', school);
  //   console.log('personalWebsite: ', personalWebsite);
  //   console.log('portfolio: ', portfolio);
  // },[name, email, school, personalWebsite, portfolio]);

  const recOnChange = async(value) => {
    let resp
    // console.log('Captcha value:', value);
    if(value){
      try{
        resp = await dispatch(verify_recaptcha(value));
      }catch(err){
        // console.log(err);
        recaptchaRef.current.reset();
      }
      if(resp.data.success){
        setIsCaptchaVerified(true);
        console.log('recaptcha success');
      }else{
        console.log('recaptcha fail');
        setIsCaptchaVerified(false);
        recaptchaRef.current.reset();
      }
    }
  };

  const onSubmit = async() => {
    setIsSubmiting(true);
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
      type: "Recruiting Application Form",
      name: name,
      email: email,
      school: school,
      personalWebsite: personalWebsite===''?null:personalWebsite,
      portfolio: portfolio===''?null:portfolio,
    }
    // API call
    try {
      await dispatch(send_logs("info", form));
      setIsSubmiting(false);
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

  const isFilledRequiredFields = () => {
    return name !== '' && email !== '' && school !== ''
  }

  return(
      <Flex minH="95vh" direction="column" alignItems="center" px={["5", "20", "100","200"]} pt="100px">
        <HStack w="100%" align="end" justify="space-between">
          <Image src={hiringOfficeSvg} alt="hire_office" w={{ md: '25%'}} display={{base: 'none', md: 'inline-block'}}/>
          <Image src={hiringPeopleSvg} alt="hire_people" w={{ base: '90%', md: '25%'}} />
          <Image src={hiringCollabSvg} alt="hire_collab" w={{ md: '25%'}} display={{base: 'none', md: 'inline-block'}}/>
        </HStack>
        <Flex my={4} w="100%" flexDirection={{base: 'column', lg: 'row'}} justifyContent="space-between" alignItems="center" mt="20px">
          <Flex w="100%" direction="column" alignItems={{base: 'center', lg: 'start'}} justifyContent="center">
            <Text as="h1" fontSize={{base: '5xl', md: '7xl'}} fontWeight="bold" color="gray.700">We are hiring!</Text>
            <Text mt="-20px" ml="2" as="h1" fontSize="5xl" fontWeight="500" color="gray.500">新夥伴招募</Text>
            <Flex mt="8" w={{base: '100%', md: '80%'}} px="8" py="4" direction="column" alignItems="start" justifyContent="center" border="2px" borderColor="gray.400" borderRadius="lg">
              <Flex w="100%" justifyContent="space-between" alignItems="center">
                <HStack>
                  <Icon as={FaCheckCircle} boxSize="4" color="gray.500" />
                  <Text fontSize="lg" fontWeight="800" color="gray.500">Active</Text>
                </HStack>
                <Text fontSize="sm" fontWeight="500" color="gray.400">2020-03-02</Text>
              </Flex>
              <HStack my="2">
                <Text fontSize="xl" fontWeight="600" color="gray.700">Full-Stack Web Developer</Text>
              </HStack>
              <Flex flexDirection="column" w="100%" alignItems="start">
                <Text fontSize="md" fontWeight="700" color="gray.500">In this role, you will...</Text>
                <Text fontSize="md" fontWeight="500" color="gray.500">- Co-develop the course selection service to enhance user experience.</Text>
                <Text fontSize="md" fontWeight="500" color="gray.500">- Work with innovative teammates.</Text>
                <Text fontSize="md" fontWeight="500" color="gray.500">- Designing and developing APIs.</Text>
                <Text fontSize="md" fontWeight="500" color="gray.500">- Staying abreast of developments in web applications and programming languages.</Text>
              </Flex>
              <Flex flexDirection="column" mt="4" w="100%" alignItems="start">
                <Text fontSize="md" fontWeight="700" color="gray.500">Ideal candidate</Text>
                <Text fontSize="md" fontWeight="500" color="gray.500">- Capability to teamwork and communicate.</Text>
                <Text fontSize="md" fontWeight="500" color="gray.500">- Familiar with React and Node.js development.</Text>
                <Text fontSize="md" fontWeight="500" color="gray.500">- Experience on Git.</Text>
                <Text fontSize="md" fontWeight="500" color="gray.500">- Experience on Docker and CI/CD tools is a plus.</Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex my={4} w={{base: "95%", md:"80%"}} direction="column" alignItems="end" justifyContent="center">
            <Flex w="100%" direction="column" alignItems="start" justifyContent="center">
              <Text my="4" fontSize={{base:"xl", md:"3xl"}} fontWeight="600" color="gray.600">Join us @ NTUCourse Neo!</Text>
            </Flex>
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
            <Flex mt="8" w="100%" justify="space-between" align="center" flexDirection={{base: 'column', lg: 'row'}}>
              <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCHA_CLIENT_KEY} onChange={recOnChange} ref={recaptchaRef}/>
              <Flex w="100%" flexDirection={{base: "column", md:"row", lg: "column"}} alignItems={{lg: "end"}} justifyContent={{base: "space-between"}} mt={{base: 4, md:0}}>
                <HStack>
                  <Checkbox alignContent="center" onChange={()=>{setIsChecked(!isChecked)}}>我已閱讀並同意</Checkbox>
                  <Popover placement='top-start'>
                    <PopoverTrigger>
                      <Text as="button" color="blue.500" size="sm"> <Text as="u">資料利用政策</Text></Text>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>
                        <Text fontWeight="800">個人資料利用政策</Text>
                      </PopoverHeader>
                      <PopoverBody h={{base: "300px", md: "500px"}} overflow="auto">
                      因應個人資料保護法及本團隊之個人資料管理規定，本團隊在向您蒐集個人資料之前，依法向您告知下列事項，當您勾選「我同意」，表示您已經閱讀、瞭解且同意接受下列之所有內容：<br/>
                      <br/>
                      <Text fontWeight="800">1. 蒐集目的及類別</Text>
                      為提供團隊成員招聘需求及本團隊內部管理使用之蒐集目的，而須獲取您下列個人資料： 姓名、電話、E-mail 或其他得以直接或間接方式識別您個人之資料。 <br/>
                      <br/>
                      <Text fontWeight="800">2.個人資料利用之期間、地區、對象及方式</Text>
                      您的個人資料，除涉及國際業務或活動外，僅供本團隊及相關業務合作夥伴，於上述蒐集目的之必要合理範圍內加以利用至前述蒐集目的消失時為止。 <br/>
                      <br/>
                      <Text fontWeight="800">3. 當事人權利行使</Text>
                      依據個人資料保護法第3條規定，您可向本團隊請求查詢或閱覽、製給複製、補充或更正、停止蒐集/處理/利用或刪除您的個人資料。 <br/>
                      <br/>
                      <Text fontWeight="800">4. 不提供個人資料之權益影響</Text>
                      如您不提供或未提供正確之個人資料，或要求停止蒐集/處理/利用/刪除個人資料、服務訊息的取消訂閱，本團隊將無法為您提供蒐集目的之相關服務。 <br/>
                      <br/>
                      <Text fontWeight="800">5. 第三方服務供應商</Text>
                      本辦法僅列出本平台服務所需之資料運用相關條款，關於使用牽涉本平台之第三方服務之資料收集與管理辦法，請自行參閱各服務供應商之文件。除本規章外，若行為違反第三方服務之任何守則導致之相關後果，不在本伺服器管理範圍內，與本平台無涉。 <br/>
                      <br/>
                      <Text fontWeight="800">個人資料同意提供： </Text>
                      一、本人確已閱讀並瞭解上述告知事項，並勾選「我同意」授權貴團隊於所列目的之必要合理範圍內，蒐集、處理及利用本人之個人資料。 <br/>
                      <br/>
                      二、本人瞭解此同意書符合個人資料保護法及相關法規之要求，並提供予貴團隊留存及日後查證使用。 <br/>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </HStack>
                <Button isDisabled={!isChecked || !isFilledRequiredFields() || !isCaptchaVerified}  isLoading={isSubmiting} size='md' colorScheme='blue' mt={{base: 5, md: 3}} w={{base: '100%', md: '150px'}} onClick={()=>{onSubmit()}}>送出 / Submit</Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
  );
}

export default RecruitingPageContainer;