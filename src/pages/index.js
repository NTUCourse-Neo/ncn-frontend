import { React, useEffect, useState } from "react";
import {
  Box,
  Flex,
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
  IconButton,
  Icon,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaArrowDown,
  FaArrowRight,
  FaGithub,
  FaInfoCircle,
  FaSortDown,
  FaSortUp,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { scroller } from "react-scroll";
import { BeatLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import HomeCard from "components/HomeCard";
import { DiscordIcon } from "components/CustomIcons";
import useUserInfo from "hooks/useUserInfo";
import { useUser } from "@auth0/nextjs-auth0";
import handleFetch from "utils/CustomFetch";
import Image from "next/image";

function NewRegisterModal({ isOpen, onClose, isLoading, newUser }) {
  const router = useRouter();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>🎉 歡迎新朋友</ModalHeader>
        <ModalBody>
          <Flex
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            h="100%"
          >
            {isLoading ? (
              <Flex
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <BeatLoader color="teal" size={10} />
                <Text fontSize="3xl" fontWeight="800" color="gray.600" ml={4}>
                  資料同步中...
                </Text>
              </Flex>
            ) : (
              <Text fontSize="3xl" fontWeight="800" color="gray.600">
                哈囉 {newUser ? newUser.name : ""} !
              </Text>
            )}
            <Spacer my="2" />
            <Text fontSize="xl">
              感謝您註冊 NTUCourse-Neo 🥰 <br />{" "}
              為了讓我們更認識你，請完成你的個人資料。
            </Text>
            <Spacer my="4" />
            <Text fontSize="sm" color="gray.400">
              或點選稍後再說，可至個人資料頁面編輯資料。
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={onClose}
            isLoading={isLoading}
            spinner={<BeatLoader size={8} color="gray" />}
          >
            稍後再說
          </Button>
          <Button
            colorScheme="blue"
            rightIcon={<FaArrowRight />}
            isLoading={isLoading}
            spinner={<BeatLoader size={8} color="white" />}
            onClick={() => {
              onClose();
              router.push("user/info");
            }}
          >
            前往設定
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function HomePage() {
  const toast = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [displayingCard, setDisplayingCard] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isLoading: isAuthLoading } = useUser();
  useUserInfo(user?.sub, {
    onSuccessCallback: async (userData, key, config) => {
      if (!userData) {
        setIsRegistering(true);
        try {
          await handleFetch("/api/user/register", {
            email: user.email,
          });
        } catch (e) {
          toast({
            title: "註冊用戶失敗",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
        setIsRegistering(false);
      }
    },
  });
  useEffect(() => {
    if (user && !isAuthLoading) {
      if (isRegistering && !isOpen) {
        onOpen();
      }
    }
  }, [isRegistering, isAuthLoading, user, onOpen, toast, isOpen]);

  const bg = useColorModeValue("white", "black");

  const scroll_config = {
    duration: 1000,
    delay: 50,
    smooth: true,
    offset: -60,
  };

  const newsCard = [
    <Flex
      key="NTUCollaborationCard"
      h={{ base: "220px", lg: "200px" }}
      overflowY={"auto"}
      w={["80vw", "80vw", "50vw", "25vw"]}
      justifyContent={["center", "start"]}
      alignItems="start"
      flexDirection="column"
      bg={useColorModeValue("teal.light", "teal.dark")}
      borderRadius="xl"
      boxShadow="xl"
      p="4"
      mt="8"
    >
      <Text
        fontSize="xl"
        fontWeight="800"
        color={useColorModeValue("heading.light", "heading.dark")}
        mb="2"
      >
        🤩 嗨！臺大！
      </Text>
      <Text
        fontSize="md"
        fontWeight="500"
        color={useColorModeValue("text.light", "text.dark")}
      >
        經過教務處資訊組的大力推動，我們將以此專案為基礎與臺大合作開發新一代課程網！希望能帶給臺大學生更便利的選課體驗。
      </Text>
      <Flex flexDirection="column" flexGrow={1} justify="end" w="100%">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          flexDirection="row"
        >
          <Text
            fontSize={{ base: "xs", lg: "sm" }}
            fontWeight="400"
            color="gray.500"
            mt="4"
          >
            Team NTUCourse Neo - 20220628
          </Text>
          <Button
            colorScheme="teal"
            variant="solid"
            size="sm"
            mt="4"
            leftIcon={<FaInfoCircle />}
            onClick={() =>
              window.open(
                "https://www.facebook.com/NTUSA/posts/pfbid04j6dfUzvHFPJEK54FDreNnXKy5C7yBZghErKAPWe8yoWXUFRcVqshqyNydqnicMWl",
                "_blank"
              )
            }
          >
            瞭解更多
          </Button>
        </Flex>
      </Flex>
    </Flex>,
    <Flex
      key="RecrutingCard"
      h={{ base: "220px", lg: "200px" }}
      overflowY={"auto"}
      w={["80vw", "80vw", "50vw", "25vw"]}
      justifyContent={["center", "start"]}
      alignItems="start"
      flexDirection="column"
      bg={useColorModeValue("teal.light", "teal.dark")}
      borderRadius="xl"
      boxShadow="xl"
      p="4"
      mt="8"
    >
      <Text
        fontSize="xl"
        fontWeight="800"
        color={useColorModeValue("heading.light", "heading.dark")}
        mb="2"
      >
        👋 We are hiring!
      </Text>
      <Text
        fontSize="md"
        fontWeight="500"
        color={useColorModeValue("heading.light", "heading.dark")}
      >
        新夥伴招募中，想跟我們一起打造更優質的選課系統嗎？ 快來加入我們吧！🥰
      </Text>
      <Flex flexDirection="column" flexGrow={1} justify="end" w="100%">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          flexDirection="row"
        >
          <Text
            fontSize={{ base: "xs", lg: "sm" }}
            fontWeight="400"
            color="gray.500"
            mt="4"
          >
            Team NTUCourse Neo - 20220303
          </Text>
          <Tooltip label="暫時關閉囉 ><" placement="top">
            <Button
              colorScheme="teal"
              variant="solid"
              size="sm"
              mt="4"
              rightIcon={<FaArrowRight />}
            >
              加入我們
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
    </Flex>,
  ];

  return (
    <>
      <Head>
        <title>首頁 | NTUCourse Neo</title>
        <meta
          name="description"
          content="首頁 | NTUCourse Neo，全新的臺大選課網站。"
        />
      </Head>
      <Box
        maxW="screen-md"
        mx="auto"
        overflow="visible"
        pt="64px"
        mb="-15px"
        bg={bg}
      >
        <NewRegisterModal
          isOpen={isOpen}
          onClose={onClose}
          isLoading={isRegistering}
          newUser={user}
        />
        <Flex
          justifyContent="space-between"
          mb={4}
          grow="1"
          flexDirection="column"
          alignItems="center"
        >
          <Spacer />
          <Flex
            justifyContent={["center", "space-between"]}
            flexDirection={{ base: "column-reverse", lg: "row" }}
            alignItems="center"
            w="100%"
            px="5vw"
          >
            <Flex flexDirection="column" pt={10}>
              <Text
                align={{ base: "center", lg: "start" }}
                fontSize={["4xl", "6xl"]}
                fontWeight="800"
                color={useColorModeValue("heading.light", "heading.dark")}
              >
                Course Schedule
              </Text>
              <Text
                align={{ base: "center", lg: "start" }}
                fontSize={["4xl", "6xl"]}
                fontWeight="extrabold"
                color={useColorModeValue("heading.light", "heading.dark")}
                mt={-4}
                mb={2}
              >
                Re-imagined.
              </Text>
              <Text
                align={{ base: "center", lg: "start" }}
                fontSize={["xl", "3xl"]}
                fontWeight="500"
                color={useColorModeValue("text.light", "text.dark")}
              >
                修課安排不再是難事。
              </Text>
              <Spacer my={4} />
              <Flex
                justifyContent={{ base: "center", lg: "start" }}
                alignItems="center"
                flexDirection="row"
              >
                <Link href="/course">
                  <Button colorScheme="teal" variant="solid" size="lg" mr={4}>
                    開始使用
                  </Button>
                </Link>
                <Link href="/about">
                  <Button colorScheme="teal" variant="outline" size="lg" mr={4}>
                    了解更多
                  </Button>
                </Link>
              </Flex>
              <Flex
                alignItems="start"
                justifyContent={{ base: "center", lg: "start" }}
              >
                <Flex flexDirection="column" alignItems="start">
                  <AnimatePresence initial={true} exitBeforeEnter={true}>
                    <motion.div
                      key={displayingCard}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.4 }}
                    >
                      {newsCard[displayingCard]}
                    </motion.div>
                  </AnimatePresence>
                  <Spacer my="4" />
                </Flex>
                <Flex flexDirection={"column"} justify="start" mt="10">
                  <IconButton
                    ml="2"
                    color={useColorModeValue("heading.light", "heading.dark")}
                    icon={<FaSortUp />}
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setDisplayingCard((displayingCard + 1) % newsCard.length)
                    }
                  />
                  <IconButton
                    ml="2"
                    color={useColorModeValue("heading.light", "heading.dark")}
                    icon={<FaSortDown />}
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setDisplayingCard(
                        displayingCard - 1 < 0
                          ? displayingCard - 1 + newsCard.length
                          : displayingCard - 1
                      )
                    }
                  />
                </Flex>
              </Flex>
            </Flex>
            <Spacer />
            <Box w={["80vw", "50vw"]}>
              <Image
                src={`/img/home_main.svg`}
                alt="home_main"
                layout="responsive"
                height={7}
                width={10}
                priority={true}
              />
            </Box>
          </Flex>
          <Spacer my={5} />
          <Button
            variant="ghost"
            size="lg"
            color={useColorModeValue("heading.light", "heading.dark")}
            onClick={() => scroller.scrollTo("card1", scroll_config)}
            leftIcon={<FaArrowDown />}
          >
            我們有...
          </Button>
          <Spacer my={5} name="card1" />
          <HomeCard
            title="搜尋篩選功能，快速找到你要的課程 🚀"
            desc={[
              "試著在空堂塞入課程，想看看禮拜一下午究竟還有哪些課？",
              "還是距離畢業還缺 A8 通識，想知道有哪些可以修呢 🤔",
              "讓我們的篩選功能，快速滿足你各式各樣的需求！",
            ]}
            img="https://imgur.com/jC8IUuw.gif"
            bg={useColorModeValue("card.light", "card.dark")}
          />
          <Spacer my={5} />
          <Button
            variant="ghost"
            size="lg"
            color={useColorModeValue("heading.light", "heading.dark")}
            onClick={() => scroller.scrollTo("card2", scroll_config)}
            leftIcon={<FaArrowDown />}
          >
            受夠一直切分頁看課表了嗎？
          </Button>
          <Spacer my={5} name="card2" />
          <HomeCard
            title="並列互動式課表，讓使用更直覺 😉"
            desc={[
              "👀 這堂課到底是第幾節上課？會不會卡到我的必修？",
              "互動式課表讓課程時間不再只是簡單的數字，而是在課表中即時顯示。讓你更直覺地看到課程時間與你的規劃。",
              "提醒您，一般課表有儲存期限，若要永久保存，請先註冊登入喔 😘",
            ]}
            img="https://i.imgur.com/CJhqamD.png"
            bg={useColorModeValue("card.light", "card.dark")}
          />
          <Spacer my={5} />
          <Button
            variant="ghost"
            size="lg"
            color={useColorModeValue("heading.light", "heading.dark")}
            onClick={() => scroller.scrollTo("card3", scroll_config)}
            leftIcon={<FaArrowDown />}
          >
            小孩子才做選擇
          </Button>
          <Spacer my={5} name="card3" />
          <HomeCard
            title="我全都要。不怕選課衝堂，順序輕鬆排 🥰"
            desc={[
              "體育通識好難選，通通加進課表後都長得落落長。 我們顛覆以往的線上課表模式，不只可衝堂加課，還能決定優先順序！",
              "你只需要好好挑選適合的課程，剩下的交給我們。👌",
            ]}
            img="https://i.imgur.com/oA2qanv.png"
            bg={useColorModeValue("card.light", "card.dark")}
          />
          <Spacer my={5} />
          <Button
            variant="ghost"
            size="lg"
            color={useColorModeValue("heading.light", "heading.dark")}
            onClick={() => scroller.scrollTo("card4", scroll_config)}
            leftIcon={<FaArrowDown />}
          >
            填志願好麻煩？
          </Button>
          <Spacer my={5} name="card4" />
          <HomeCard
            title="一鍵加入課程網，填寫志願一目瞭然 🧐"
            desc={[
              "還在埋頭研究課程志願的先後順序嗎？只要決定好衝堂課程的順序偏好，就能將課程快速加入課程網，同時告別加入時瘋狂彈出的課表。別忘了，你還能參考我們顯示的志願序數字直接填入選課系統。",
              "就是這麼簡單，一塊蛋糕 🍰",
            ]}
            img="https://i.imgur.com/nxjAycJ.png"
            bg={useColorModeValue("card.light", "card.dark")}
          />
          <Spacer my={5} />
          <Button
            variant="ghost"
            size="lg"
            color={useColorModeValue("heading.light", "heading.dark")}
            onClick={() => scroller.scrollTo("card5", scroll_config)}
            leftIcon={<FaArrowDown />}
          >
            網服真的太讚啦，先存起來
          </Button>
          <Spacer my={5} name="card5" />
          <HomeCard
            title="加入最愛，收藏喜歡的課程 💕"
            desc={[
              "這堂課好有趣，但這學期學分要爆了，等下學期或下下學期吧 🥵",
              "除了記在腦袋佔記憶體外，你還可以利用最愛功能收藏喜歡的課程，建立你的畢業前必修課程清單，讓你不再錯過任何一堂課！",
            ]}
            img="https://imgur.com/IHw3FG1.gif"
            bg={useColorModeValue("card.light", "card.dark")}
          />
          <Flex
            w="100vw"
            bg="gray.700"
            px={{ base: "8", md: "16", lg: "32" }}
            py="16"
            flexDirection={{ base: "column", lg: "row" }}
            justifyContent="space-between"
            alignItems="center"
            css={{ gap: "2rem" }}
          >
            <Flex
              w={{ base: "100%", lg: "70%" }}
              flexDirection={{ base: "column", md: "row" }}
              align={"center"}
            >
              <Icon mx="8" mb="4" as={FaGithub} boxSize="16" color="white" />
              <Flex
                flexDirection="column"
                align={{ base: "center", md: "start" }}
                textAlign={{ base: "center", md: "start" }}
              >
                <Text fontSize="4xl" color="gray.100" fontWeight="800">
                  動手參與開發
                </Text>
                <Text mt="2" fontSize="lg" color="gray.100" fontWeight="500">
                  不管是 Issue 、 PR 或甚至加入我們 ，歡迎一起來讓 NTUCourse Neo
                  變得更加完美。
                </Text>
              </Flex>
            </Flex>
            <Flex
              justify={{ base: "center", md: "start" }}
              flexDirection={{ base: "column", md: "row" }}
              flexWrap="wrap"
            >
              <Button
                m={2}
                variant="solid"
                size="lg"
                onClick={() => window.open("https://github.com/NTUCourse-Neo/")}
                leftIcon={<FaGithub />}
              >
                GitHub
              </Button>
              <Button
                m={2}
                variant="outline"
                size="lg"
                color="gray.200"
                borderColor="gray.500"
                onClick={() =>
                  window.open(
                    "https://github.com/NTUCourse-Neo/ncn-frontend/issues/new/choose"
                  )
                }
              >
                功能建議
              </Button>
            </Flex>
          </Flex>
          <Flex
            w="100vw"
            bg="#5865F2"
            px={{ base: "8", md: "16", lg: "32" }}
            py="16"
            flexDirection={{ base: "column", lg: "row" }}
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            css={{ gap: "2rem" }}
          >
            <Flex
              w={{ base: "100%", lg: "65%" }}
              flexDirection={{ base: "column", md: "row" }}
              align={"center"}
            >
              <Icon mx="8" mb="4" as={DiscordIcon} boxSize="16" color="white" />
              <Flex
                flexDirection="column"
                align={{ base: "center", md: "start" }}
                textAlign={{ base: "center", md: "start" }}
              >
                <Text fontSize="4xl" color="gray.100" fontWeight="800">
                  加入社群
                </Text>
                <Text mt="2" fontSize="lg" color="gray.100" fontWeight="500">
                  一起進來聊聊天、回報問題或給予功能建議，都超讚的啦！
                </Text>
              </Flex>
            </Flex>
            <Flex
              justify={{ base: "center", md: "start" }}
              flexDirection={{ base: "column", md: "row" }}
            >
              <Button
                variant={"solid"}
                size="lg"
                onClick={() => window.open("https://discord.gg/M7NrenYEbS")}
                bg={"white"}
                color={"#5865F2"}
                leftIcon={<DiscordIcon />}
              >
                Join #NTUCourse-Neo
              </Button>
            </Flex>
          </Flex>
          <Flex
            w="100vw"
            px="8"
            pt="8"
            justifyContent="space-around"
            alignItems="center"
            flexDirection={{ base: "column", lg: "row" }}
            css={{ gap: "2rem" }}
          >
            <Flex
              flexDirection="column"
              align={{ base: "center", lg: "start" }}
              textAlign={{ base: "center", md: "start" }}
            >
              <Text
                py={2}
                fontSize="3xl"
                color={useColorModeValue("text.light", "text.dark")}
                fontWeight="800"
              >
                現在就開始體驗新世代的選課吧。
              </Text>
              <Text fontSize="lg" color="teal.500" fontWeight="500">
                由學生開發、維運，最懂你的選課網站。
              </Text>
              <Link href="course">
                <Button mt="8" variant="solid" size="lg" colorScheme="teal">
                  開始使用
                </Button>
              </Link>
            </Flex>
            <Image
              alt=""
              src={`/img/home_footer.svg`}
              height="256px"
              width="256px"
            />
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default HomePage;
