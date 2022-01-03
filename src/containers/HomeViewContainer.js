import { React, useEffect, useState } from 'react';
import {
    Box,
    Flex,
    Heading,
    Image,
    Spacer,
    Button,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    useDisclosure,

  } from '@chakra-ui/react';
import homeMainSvg from '../img/home_main.svg';
import HomeCard from '../components/HomeCard';
import { useAuth0 } from '@auth0/auth0-react';
import { FaArrowDown, FaArrowRight } from "react-icons/fa";
import { animateScroll as scroll } from 'react-scroll'
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from 'react-spinners';
import { fetchUserById, registerNewUser } from '../actions/';
import { useDispatch, useSelector } from 'react-redux';


function HomeViewContainer(props) {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useAuth0();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();

  const [ isRegistering, setIsRegistering ] = useState(false);

  const handleGoToUserInfoPage = () => {
    onClose();
    navigate("user/info");
  }

  // refactor API call to redux action later
  useEffect(() => {
    const registerNewUserToDB = async () => {
      if (!isLoading && isAuthenticated) {
        const user_data = await dispatch(fetchUserById(user.sub));
        if(!user_data){
          // if user is null (not found in db)
          // do register in background and display a modal.
          setIsRegistering(true);
          if(!isOpen){
            onOpen();
          }
          try{
            await dispatch(registerNewUser(user.email));
            setIsRegistering(false);
          } catch (e) {
            // refactor: use toast?
            console.log("register failed");
          }
        }
      }
    }

    registerNewUserToDB();
  }, [user, isLoading, isAuthenticated]);

  const renderNewRegisterModal = () => {
    return(
      <>
        <Modal isOpen={isOpen} onClose={onClose} size="lg" closeOnOverlayClick={false} closeOnEsc={false}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>🎉 歡迎新朋友</ModalHeader>
            <ModalBody>
              <Flex justifyContent="center" alignItems="center" flexDirection="column" h="100%">
                { isRegistering ?
                  <Flex flexDirection="row" justifyContent="center" alignItems="center">
                    <BeatLoader color='teal' size={10} />
                    <Text fontSize="3xl" fontWeight="800" color="gray.600" ml={4}>資料同步中...</Text>
                  </Flex>
                  :
                  <Text fontSize="3xl" fontWeight="800" color="gray.600">
                    哈囉 {user? user.name:""} !
                  </Text>
                }
                <Spacer my="2" />
                <Text fontSize="xl">
                  感謝您註冊 NTUCourse-Neo 🥰 <br/> 為了讓我們更認識你，請完成你的個人資料。
                </Text>
                <Spacer my="4" />
                <Text fontSize="sm" color="gray.400">
                  或點選稍後再說，可至個人資料頁面編輯資料。
                </Text>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button variant='ghost' mr={3} onClick={onClose} isLoading={isRegistering} spinner={<BeatLoader size={8} color='gray'/>}>稍後再說</Button>
              <Button colorScheme='blue' rightIcon={<FaArrowRight />} isLoading={isRegistering} spinner={<BeatLoader size={8} color='white'/>} onClick={() => {handleGoToUserInfoPage()}}>
                前往設定
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };

    return (
        <Box maxW="screen-md" mx="auto" overflow="visible" p="64px">
          {renderNewRegisterModal()}
        <Flex justifyContent="space-between" mb={4} grow="1" flexDirection="column" alignItems="center">
          <Spacer/>
          <Flex justifyContent="space-between" flexDirection="row" alignItems="center" w="90vw">
            <Box>
              <Heading as="h1" fontSize="6xl" fontWeight="800" color="gray.700">Course Schedule</Heading>
              <Heading as="h1" fontSize="6xl" fontWeight="extrabold" color="gray.700" mb={4}>Re-imagined.</Heading>
              <Heading as="h1" fontSize="3xl" fontWeight="500" color="gray.500" mb={4}>修課安排不再是難事。</Heading>
              <Spacer my={8}/>
              <Flex justifyContent="start" alignItems="center" flexDirection="row">
                <Link to="/course"><Button colorScheme="teal" variant="solid" size="lg" mr={4}>開始使用</Button></Link>
                <Button colorScheme="teal" variant="outline" size="lg" mr={4}>了解更多</Button>
              </Flex> 
            </Box>
            <Spacer/>
            <Image src={homeMainSvg} alt="home_main" w="50vw"/>
          </Flex>
          <Spacer my={10}/>
          <Button variant="ghost" size="lg" onClick={() => scroll.scrollTo(750)}><FaArrowDown/></Button>
          <Spacer my={5}/>
          <HomeCard title="Section 1" bg="gray.100" img=""/>
          <Spacer mt="10" mb="10"/>
        </Flex>
      </Box>
    );
}

export default HomeViewContainer;