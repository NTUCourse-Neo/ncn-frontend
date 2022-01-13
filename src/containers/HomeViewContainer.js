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
    useToast
  } from '@chakra-ui/react';
import homeMainSvg from '../img/home_main.svg';
import HomeCard from '../components/HomeCard';
import { useAuth0 } from '@auth0/auth0-react';
import { FaArrowDown, FaArrowRight, FaArrowUp } from "react-icons/fa";
import { animateScroll as scroll } from 'react-scroll'
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from 'react-spinners';
import { fetchUserById, registerNewUser, logIn } from '../actions/';
import { useDispatch, useSelector } from 'react-redux';


function HomeViewContainer(props) {
  const toast = useToast();
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
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
        const token = await getAccessTokenSilently();
        let user_data;
        try {
          user_data = await dispatch(fetchUserById(token, user.sub));
        } catch (error) {
          navigate(`/error/${error}`);
        }
        if(!user_data){
          // if user is null (not found in db)
          // do register in background and display a modal.
          setIsRegistering(true);
          if(!isOpen){
            onOpen();
          }
          try{
            const token = await getAccessTokenSilently();
            await dispatch(registerNewUser(token, user.email));
            setIsRegistering(false);
          } catch (e) {
            toast({
              title: '註冊失敗.',
              description: "請聯繫客服(?)",
              status: 'error',
              duration: 3000,
              isClosable: true,
            })
            // setIsRegistering(false)? or other actions?
          }
          // Re-fetch user data from server
          let new_user_data;
          try{
            new_user_data = await dispatch(fetchUserById(token, user.sub));
          }
          catch (e) {
            navigate(`/error/${e}`);
          }
          dispatch(logIn(new_user_data));
        } else {
          dispatch(logIn(user_data))
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
          <Button variant="ghost" size="lg" onClick={() => scroll.scrollTo(770)} leftIcon={<FaArrowDown/>}>我們有...</Button>
          <Spacer my={5}/>
          <HomeCard title="搜尋篩選功能，快速找到你要的課程 🚀" desc={[]} bg="gray.100">
              <Flex w="100%" flexDirection="row" justifyContent="start" alignItems="center" mb="2">

              </Flex>
          </HomeCard>
          <Spacer my={10}/>
          <Button variant="ghost" size="lg" onClick={() => scroll.scrollTo(1540)} leftIcon={<FaArrowDown/>}>受夠一直切分頁看課表了嗎？</Button>
          <Spacer my={5}/>
          <HomeCard 
            title="並列互動式課表，讓使用更直覺 😉" 
            desc={["👀 這堂課到底是第幾節上課？會不會卡到我的必修？","互動式課表讓課程時間不再只是簡單的數字，而是在課表中即時顯示。讓你更直覺地看到課程時間與你的規劃。"]} 
            img="https://i.imgur.com/CJhqamD.png"
            bg="gray.100"
          >
          </HomeCard>
          <Spacer my={10}/>
          <Button variant="ghost" size="lg" onClick={() => scroll.scrollTo(2310)} leftIcon={<FaArrowDown/>}>小孩子才做選擇</Button>
          <Spacer my={10}/>
          <HomeCard 
            title="我全都要。不怕選課衝堂，順序輕鬆排 🥰" 
            desc={["體育通識好難選，通通加進課表後都長得落落長。 我們顛覆以往的線上課表模式，不只可衝堂加課，還能決定優先順序！","你只需要好好挑選適合的課程，剩下的交給我們。👌"]}
            img="https://i.imgur.com/oA2qanv.png"
            bg="gray.100" 
          >
          </HomeCard>
          <Spacer my={10}/>
          <Button variant="ghost" size="lg" onClick={() => scroll.scrollTo(3080)} leftIcon={<FaArrowDown/>}>填志願好麻煩？</Button>
          <Spacer my={5}/>
          <HomeCard 
            title="一鍵加入課程網，填寫志願一目瞭然 🧐" 
            desc={["還在埋頭研究課程志願的先後順序嗎？只要決定好衝堂課程的順序偏好，就能將課程快速加入課程網，同時告別加入時瘋狂彈出的課表。別忘了，你還能參考我們顯示的志願序數字直接填入選課系統。", "就是簡單，一塊蛋糕 🍰"]}
            img="https://i.imgur.com/nxjAycJ.png"
            bg="gray.100" 
          ></HomeCard>
          <Spacer my={10}/>
          <Button variant="ghost" size="lg" onClick={() => scroll.scrollTo(3700)} leftIcon={<FaArrowDown/>}>網服真的太讚啦，先存</Button>
          <Spacer my={5}/>
          <HomeCard title="加入最愛，收藏喜歡的課程 💕" desc={[]} bg="gray.100">
          </HomeCard>
          <Spacer mt="10" mb="10"/>
          <Button variant="ghost" size="lg" onClick={() => scroll.scrollTo(0)} leftIcon={<FaArrowUp/>}>返回頂端</Button>
        </Flex>
      </Box>
    );
}

export default HomeViewContainer;