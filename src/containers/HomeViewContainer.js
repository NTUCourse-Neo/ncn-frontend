import { React, useEffect, useState } from 'react';
import {
    Box,
    Flex,
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
    useToast,
    useMediaQuery,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Center,
    IconButton
  } from '@chakra-ui/react';
import homeMainSvg from '../img/home_main.svg';
import HomeCard from '../components/HomeCard';
import { useAuth0 } from '@auth0/auth0-react';
import { FaArrowDown, FaArrowRight, FaArrowUp, FaSortDown, FaSortUp } from "react-icons/fa";
import { animateScroll as scroll, scroller } from 'react-scroll'
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from 'react-spinners';
import { fetchUserById, registerNewUser, logIn } from '../actions/';
import { useDispatch } from 'react-redux';
import CourseDeadlineCountdown from '../components/CourseDeadlineCountdown';
import setPageMeta from '../utils/seo';
import {motion, AnimatePresence} from 'framer-motion';

const newsCard = [
  (
    <Flex h='180px' overflowY={'auto'} w={["80vw","80vw","50vw","25vw"]} justifyContent={["center","start" ]} alignItems="start" flexDirection="column" bg="teal.200" borderRadius="xl" boxShadow="xl" p="4" mt="8">
      <Text fontSize="xl" fontWeight="800" color="gray.700" mb="2">👋 We are hiring!</Text>
      <Text fontSize="md" fontWeight="500" color="gray.600">新夥伴招募中，想跟我們一起打造更優質的選課系統嗎？ 快來加入我們吧！🥰</Text>
      <Flex flexDirection='column' flexGrow={1} justify='end' w='100%'>
        <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
          <Text fontSize="sm" fontWeight="400" color="gray.500" mt="4">Team NTUCourse Neo - 20220303</Text>
          <Link to="/recruiting"><Button colorScheme="teal" variant="solid" size="sm" mt="4" rightIcon={<FaArrowRight />}>加入我們</Button></Link>
        </Flex>
      </Flex>
    </Flex>
  ),
  (
    <Flex h='180px' overflowY={'auto'} w={["80vw","80vw","50vw","25vw"]} justifyContent={["center","start" ]} alignItems="start" flexDirection="column" bg="teal.200" borderRadius="xl" boxShadow="xl" p="4" mt="8">
      <Text fontSize="xl" fontWeight="800" color="gray.700" mb="2">🎉 已更新臺大 110-2 課表</Text>
      <Text fontSize="md" fontWeight="500" color="gray.600">讚啦！我們已更新 110 學年度第二學期的課程囉！<br/>現在就開始規劃課程吧！ 🥰</Text>
      <Flex flexDirection='column' flexGrow={1} justify='end' w='100%'>
        <Text fontSize="sm" fontWeight="400" color="gray.500" mt="4">Team NTUCourse Neo - 20210115</Text>
      </Flex>
    </Flex>
  ),
]

function HomeViewContainer(props) {
  const toast = useToast();
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isWarningOpen, onOpen: onWarningOpen, onClose: onWarningClose } = useDisclosure();
  const dispatch = useDispatch();

  const [ isRegistering, setIsRegistering ] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 760px)") 
  const [ displayingCard, setDisplayingCard ] = useState(0);

  const scroll_config = {duration: 1000,delay: 50,smooth: true, offset: -60};

  const handleGoToUserInfoPage = () => {
    onClose();
    navigate("user/info");
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    if(isMobile && !localStorage.getItem("NCN_NO_MOBILE_WARNING")) {
      onWarningOpen();
    }
    setPageMeta({title: `首頁 | NTUCourse Neo`, desc: `首頁 | NTUCourse Neo，全新的臺大選課網站。`});
  } , []) // eslint-disable-line react-hooks/exhaustive-deps

  const renderMobileWarning = () => {
    return(
      <AlertDialog
        motionPreset='slideInBottom'
        onClose={onWarningClose}
        isOpen={isWarningOpen}
        size="sm"
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>溫馨提醒</AlertDialogHeader>
          <AlertDialogBody>
            <Text fontWeight="400" color="gray.600">
              行動裝置介面仍在調整測試中。建議使用電腦瀏覽，能讓您獲得更好的選課體驗。
            </Text>
            <Text mt="2" fontWeight="700" color="gray.600">
              我們正在努力讓 NTUCourse Neo 更加進步，若有任何建議歡迎至問題回報處告訴我們 🙏
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={() => {onWarningClose(); localStorage.setItem("NCN_NO_MOBILE_WARNING", true)}} variant="ghost">
              不要再提醒我
            </Button>
            <Button colorScheme='blue' ml={3} onClick={() => {onWarningClose();}}>
              好
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  // refactor API call to redux action later
  useEffect(() => {
    const registerNewUserToDB = async () => {
      if (!isLoading && isAuthenticated) {
        const token = await getAccessTokenSilently();
        let user_data;
        try {
          user_data = await dispatch(fetchUserById(token, user.sub));
        } catch (error) {
          navigate(`/error/${error.status_code}`, { state: error });
          return;
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
          catch (error) {
            navigate(`/error/${error.status_code}`, { state: error });
          }
          dispatch(logIn(new_user_data));
        } else {
          dispatch(logIn(user_data))
        }
      }
    }

    registerNewUserToDB();
  }, [user, isLoading, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

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
          {renderMobileWarning()}
        <Flex justifyContent="space-between" mb={4} grow="1" flexDirection="column" alignItems="center">
          <Spacer/>
          <Flex justifyContent={["center","space-between" ]} flexDirection={{base: 'column-reverse', lg: 'row'}} alignItems="center" w="90vw">
            <Flex flexDirection="column" pt={10}>
              <Text align={{base: 'center', lg: 'start'}} fontSize={["4xl","6xl"]} fontWeight="800" color="gray.700">Course Schedule</Text>
              <Text align={{base: 'center', lg: 'start'}} fontSize={["4xl","6xl"]} fontWeight="extrabold" color="gray.700" mt={-4} mb={2}>Re-imagined.</Text>
              <Text align={{base: 'center', lg: 'start'}} fontSize={["xl","3xl"]} fontWeight="500" color="gray.500">修課安排不再是難事。</Text>
              <Spacer my={4}/>
              <Flex justifyContent={{base: 'center', lg: 'start'}} alignItems="center" flexDirection="row">
                <Link to="/course"><Button colorScheme="teal" variant="solid" size="lg" mr={4}>開始使用</Button></Link>
                <Link to="/about"><Button colorScheme="teal" variant="outline" size="lg" mr={4}>了解更多</Button></Link>
              </Flex> 
              <Flex alignItems="start" justifyContent={{base: 'center', lg: 'start'}}>
                <Flex flexDirection="column" alignItems="start">
                  <AnimatePresence initial={true} exitBeforeEnter={true}>
                    <motion.div key={displayingCard} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{duration: 0.4}}>
                      {newsCard[displayingCard]}
                    </motion.div>
                  </AnimatePresence>
                  <Spacer my="4" />
                  <CourseDeadlineCountdown />
                </Flex>
                <Flex flexDirection={'column'} justify='start'  mt="10"> 
                  <IconButton ml="2" icon={<FaSortUp color="gray.500"/>} variant="ghost" size="sm" onClick={() => setDisplayingCard((displayingCard + 1)%newsCard.length)} />
                  <IconButton ml="2" icon={<FaSortDown color="gray.500"/>} variant="ghost" size="sm" onClick={() => setDisplayingCard((displayingCard - 1)<0?(displayingCard-1+newsCard.length):(displayingCard - 1))} />
                </Flex>
              </Flex>
            </Flex>
            <Spacer/>
            <Image src={homeMainSvg} alt="home_main" w={["80vw","50vw"]}/>
          </Flex>
          <Spacer my={10}/>
          <Button variant="ghost" size="lg" onClick={() => scroller.scrollTo("card1", scroll_config)} leftIcon={<FaArrowDown/>}>我們有...</Button>
          <Spacer my={5} name="card1"/>
          <HomeCard title="搜尋篩選功能，快速找到你要的課程 🚀"
           desc={["試著在空堂塞入課程，想看看禮拜一下午究竟還有哪些課？", "還是距離畢業還缺 A8 通識，想知道有哪些可以修呢 🤔", "讓我們的篩選功能，快速滿足你各式各樣的需求！"]} 
           img='https://imgur.com/jC8IUuw.gif' 
           bg="gray.100">
          </HomeCard>
          <Spacer my={10}/>
          <Button variant="ghost" size="lg" onClick={() => scroller.scrollTo("card2", scroll_config)} leftIcon={<FaArrowDown/>}>受夠一直切分頁看課表了嗎？</Button>
          <Spacer my={5} name="card2"/>
          <HomeCard 
            title="並列互動式課表，讓使用更直覺 😉" 
            desc={["👀 這堂課到底是第幾節上課？會不會卡到我的必修？","互動式課表讓課程時間不再只是簡單的數字，而是在課表中即時顯示。讓你更直覺地看到課程時間與你的規劃。", "提醒您，一般課表有儲存期限，若要永久保存，請先註冊登入喔 😘"]} 
            img="https://i.imgur.com/CJhqamD.png"
            bg="gray.100"
          >
          </HomeCard>
          <Spacer my={10}/>
          <Button variant="ghost" size="lg" onClick={() => scroller.scrollTo("card3", scroll_config)} leftIcon={<FaArrowDown/>}>小孩子才做選擇</Button>
          <Spacer my={5} name="card3"/>
          <HomeCard 
            title="我全都要。不怕選課衝堂，順序輕鬆排 🥰" 
            desc={["體育通識好難選，通通加進課表後都長得落落長。 我們顛覆以往的線上課表模式，不只可衝堂加課，還能決定優先順序！","你只需要好好挑選適合的課程，剩下的交給我們。👌"]}
            img="https://i.imgur.com/oA2qanv.png"
            bg="gray.100" 
          >
          </HomeCard>
          <Spacer my={10}/>
          <Button variant="ghost" size="lg" onClick={() => scroller.scrollTo("card4", scroll_config)} leftIcon={<FaArrowDown/>}>填志願好麻煩？</Button>
          <Spacer my={5} name="card4"/>
          <HomeCard 
            title="一鍵加入課程網，填寫志願一目瞭然 🧐" 
            desc={["還在埋頭研究課程志願的先後順序嗎？只要決定好衝堂課程的順序偏好，就能將課程快速加入課程網，同時告別加入時瘋狂彈出的課表。別忘了，你還能參考我們顯示的志願序數字直接填入選課系統。", "就是這麼簡單，一塊蛋糕 🍰"]}
            img="https://i.imgur.com/nxjAycJ.png"
            bg="gray.100" 
          ></HomeCard>
          <Spacer my={10}/>
          <Button variant="ghost" size="lg" onClick={() => scroller.scrollTo("card5", scroll_config)} leftIcon={<FaArrowDown/>}>網服真的太讚啦，先存</Button>
          <Spacer my={5} name="card5"/>
          <HomeCard title="加入最愛，收藏喜歡的課程 💕" 
            desc={["這堂課好有趣，但這學期學分要爆了，等下學期或下下學期吧 🥵", "除了記在腦袋佔記憶體外，你還可以利用最愛功能收藏喜歡的課程，建立你的畢業前必修課程清單，讓你不再錯過任何一堂課！"]} 
            img="https://imgur.com/IHw3FG1.gif"
            bg="gray.100">
          </HomeCard>
          <Spacer mt="10" mb="10"/>
          <Button variant="ghost" size="lg" onClick={() => scroll.scrollTo(0)} leftIcon={<FaArrowUp/>}>返回頂端</Button>
        </Flex>
      </Box>
    );
}

export default HomeViewContainer;