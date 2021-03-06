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
  Image,
} from "@chakra-ui/react";
import {
  FaArrowDown,
  FaArrowRight,
  FaEdit,
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
import { reportEvent } from "utils/ga";

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
        <ModalHeader>π ζ­‘θΏζ°ζε</ModalHeader>
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
                  θ³ζεζ­₯δΈ­...
                </Text>
              </Flex>
            ) : (
              <Text fontSize="3xl" fontWeight="800" color="gray.600">
                εε {newUser ? newUser.name : ""} !
              </Text>
            )}
            <Spacer my="2" />
            <Text fontSize="xl">
              ζθ¬ζ¨θ¨»ε NTUCourse-Neo π₯° <br />{" "}
              ηΊδΊθ?ζεζ΄θͺθ­δ½ οΌθ«ε?ζδ½ ηεδΊΊθ³ζγ
            </Text>
            <Spacer my="4" />
            <Text fontSize="sm" color="gray.400">
              ζι»ιΈη¨εΎεθͺͺοΌε―θ³εδΊΊθ³ζι ι’η·¨θΌ―θ³ζγ
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={() => {
              onClose();
              reportEvent("new_user_modal", "click", "close");
            }}
            isLoading={isLoading}
            spinner={<BeatLoader size={8} color="gray" />}
          >
            η¨εΎεθͺͺ
          </Button>
          <Button
            colorScheme="blue"
            rightIcon={<FaArrowRight />}
            isLoading={isLoading}
            spinner={<BeatLoader size={8} color="white" />}
            onClick={() => {
              onClose();
              reportEvent("new_user_modal", "click", "go_to_profile");
              router.push("user/info");
            }}
          >
            εεΎθ¨­ε?
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
      if (!userData?.user?.db) {
        setIsRegistering(true);
        try {
          await handleFetch("/api/user/register", {
            email: user.email,
          });
        } catch (e) {
          toast({
            title: "θ¨»εη¨ζΆε€±ζ",
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
      key="1111CourseCard"
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
        π ε°ε€§θͺ²η¨ηΆ² 111-1 θͺ²η¨ε·²ζ΄ζ°οΌ
      </Text>
      <Text
        fontSize="md"
        fontWeight="500"
        color={useColorModeValue("text.light", "text.dark")}
      >
        θ?ε¦οΌζ°ηε­Έζε³ε°ε°δΎοΌηΎε¨ε°±ιε§θ¦εθͺ²η¨ε§γδ½Ώη¨δΉι€δΉζ­‘θΏεε©ε°ε€§θͺ²η¨ηΆ²ε‘«ε―«δ½Ώη¨ηΏζ£εε·οΌθ?ζεθ½θ?εΎζ΄ε₯½γ
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
            Team NTUCourse Neo - 20220729
          </Text>
          <Button
            colorScheme="teal"
            variant="solid"
            size="sm"
            mt="4"
            leftIcon={<FaEdit />}
            onClick={() =>
              window.open("https://forms.gle/8MZZBLc9buhntM8R6", "_blank")
            }
          >
            εε·θͺΏζ₯
          </Button>
        </Flex>
      </Flex>
    </Flex>,
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
        π€© ε¨οΌθΊε€§οΌ
      </Text>
      <Text
        fontSize="md"
        fontWeight="500"
        color={useColorModeValue("text.light", "text.dark")}
      >
        ηΆιζεθθ³θ¨η΅ηε€§εζ¨εοΌζεε°δ»₯ζ­€ε°ζ‘ηΊεΊη€θθΊε€§εδ½ιηΌζ°δΈδ»£θͺ²η¨ηΆ²οΌεΈζθ½εΈΆη΅¦θΊε€§ε­Έηζ΄δΎΏε©ηιΈθͺ²ι«ι©γ
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
            η­θ§£ζ΄ε€
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
        π We are hiring!
      </Text>
      <Text
        fontSize="md"
        fontWeight="500"
        color={useColorModeValue("heading.light", "heading.dark")}
      >
        ζ°ε€₯δΌ΄ζεδΈ­οΌζ³θ·ζεδΈθ΅·ζι ζ΄εͺθ³ͺηιΈθͺ²η³»η΅±εοΌ εΏ«δΎε ε₯ζεε§οΌπ₯°
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
          <Tooltip
            label="ζ«ζιιε ><"
            placement="top"
            shouldWrapChildren
            hasArrow
          >
            <Button
              colorScheme="teal"
              variant="solid"
              size="sm"
              mt="4"
              rightIcon={<FaArrowRight />}
              disabled
            >
              ε ε₯ζε
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
    </Flex>,
  ];

  return (
    <>
      <Head>
        <title>ι¦ι  | NTUCourse Neo</title>
        <meta
          name="description"
          content="ι¦ι  | NTUCourse NeoοΌε¨ζ°ηθΊε€§ιΈθͺ²ηΆ²η«γ"
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
            px={{ base: "5vw", xl: "10vw" }}
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
                δΏ?θͺ²ε?ζδΈεζ―ι£δΊγ
              </Text>
              <Spacer my={4} />
              <Flex
                justifyContent={{ base: "center", lg: "start" }}
                alignItems="center"
                flexDirection="row"
              >
                <Link href="/course">
                  <Button colorScheme="teal" variant="solid" size="lg" mr={4}>
                    ιε§δ½Ώη¨
                  </Button>
                </Link>
                <Link href="/about">
                  <Button colorScheme="teal" variant="outline" size="lg" mr={4}>
                    δΊθ§£ζ΄ε€
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
                      setDisplayingCard(
                        displayingCard - 1 < 0
                          ? displayingCard - 1 + newsCard.length
                          : displayingCard - 1
                      )
                    }
                  />
                  <IconButton
                    ml="2"
                    color={useColorModeValue("heading.light", "heading.dark")}
                    icon={<FaSortDown />}
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setDisplayingCard((displayingCard + 1) % newsCard.length)
                    }
                  />
                </Flex>
              </Flex>
            </Flex>
            <Spacer />
            <Box w={["80vw", "40vw"]}>
              <Image
                src={`/img/home_main.svg`}
                alt="home_main"
                maxH="900px"
                pointerEvents="none"
              />
            </Box>
          </Flex>
          <Button
            variant="ghost"
            size="lg"
            mt={{ base: "8", md: "32" }}
            color={useColorModeValue("heading.light", "heading.dark")}
            onClick={() => scroller.scrollTo("card1", scroll_config)}
            leftIcon={<FaArrowDown />}
          >
            Why Neo?
          </Button>
          <Spacer my={5} name="card1" />
          <HomeCard
            title="ζε°η―©ιΈοΌζ΄εΏ«ζ΄ζΊγ π"
            desc={[
              "θ©¦θε¨η©Ίε ε‘ε₯θͺ²η¨οΌζθε¨ζΎε°η³»δΈηεΏδΏ?εοΌ",
              "ζεηη―©ιΈεθ½οΌζδΎζιγη³»ζθι‘ε₯η­ζ’δ»Άθ€εη―©ιΈοΌδΈζδ½ ζΎδΈε°θͺ²οΌεͺζδ½ ι£δ»₯ζζοΌ",
            ]}
            img="/img/home_cards/search.svg"
            bg={useColorModeValue("white", "black")}
          />
          <Spacer my={5} />
          <Button
            variant="ghost"
            size="lg"
            color={useColorModeValue("heading.light", "heading.dark")}
            onClick={() => scroller.scrollTo("card2", scroll_config)}
            leftIcon={<FaArrowDown />}
          >
            εε€ δΈη΄εει δΊεοΌ
          </Button>
          <Spacer my={5} name="card2" />
          <HomeCard
            title="δΈ¦εδΊεεΌθͺ²θ‘¨οΌιΈθͺ²ζ΄η΄θ¦Ίγ"
            desc={[
              "ιε θͺ²ζ―η¬¬εΉΎη―δΈθͺ²οΌζδΈζε‘ε°εΏδΏ?οΌ",
              "δΊεεΌθͺ²θ‘¨θ?ζιδΈεεͺζ―η°‘ε?ηζΈε­οΌθζ―ε¨θͺ²θ‘¨δΈ­ε³ζι‘―η€Ίγθ?δ½ ζ΄η΄θ¦Ίε°ηε°θͺ²η¨ζιθδ½ ηθ¦εγ",
            ]}
            img="/img/home_cards/course_table.svg"
            bg={useColorModeValue("white", "black")}
            imgAtLeft={true}
          />
          <Spacer my={5} />
          <Button
            variant="ghost"
            size="lg"
            color={useColorModeValue("heading.light", "heading.dark")}
            onClick={() => scroller.scrollTo("card3", scroll_config)}
            leftIcon={<FaArrowDown />}
          >
            ε°ε­©ε­ζειΈζ
          </Button>
          <Spacer my={5} name="card3" />
          <HomeCard
            title="ζε¨ι½θ¦γδΈζθ‘ε οΌι εΊθΌι¬ζγ"
            desc={[
              "ιΈθͺ²ε₯½θ²ͺεΏοΌθͺ²θ‘¨θ?εΎθΆη΄η‘ζ΅ι·...",
              "ζει‘θ¦δ»₯εΎηη·δΈθͺ²θ‘¨ζ¨‘εΌοΌδΈεͺε―θ‘ε ε θͺ²οΌζ΄θ½εε₯θͺΏζ΄θ‘ε θͺ²η¨ηι εΊεε₯½οΌ",
              "δ½ εͺιθ¦ε₯½ε₯½ζιΈι©εηθͺ²η¨οΌε©δΈηδΊ€η΅¦ζεγπ",
            ]}
            img="/img/home_cards/selection.svg"
            bg={useColorModeValue("white", "black")}
          />
          <Spacer my={5} />
          <Button
            variant="ghost"
            size="lg"
            color={useColorModeValue("heading.light", "heading.dark")}
            onClick={() => scroller.scrollTo("card4", scroll_config)}
            leftIcon={<FaArrowDown />}
          >
            ε¬εΏι‘εΊε₯½ιΊ»η©οΌ
          </Button>
          <Spacer my={5} name="card4" />
          <HomeCard
            title="δΈι΅ε ε₯θͺ²η¨ηΆ²οΌεΏι‘εΊδΈη?η­ηΆγ"
            desc={[
              "ιε¨ει ­η η©Άθͺ²η¨εΏι‘ηεεΎι εΊεοΌ",
              "θͺΏζ΄θ‘ε εε¨ι¨θͺ²η¨ηεΏι‘εΊεΎοΌι»ζε°θͺ²η¨η΄ζ₯ε ε₯θͺ²η¨ηΆ²οΌεζεε₯ηηε½εΊηι ιΈθͺ²η¨ι ι’γε₯εΏδΊοΌδ½ ιθ½εθζει‘―η€ΊηεΏι‘εΊζΈε­η΄ζ₯ε‘«ε₯ιΈθͺ²η³»η΅±γ",
              "ε°±ζ―ιιΊΌη°‘ε?οΌδΈε‘θη³γ π°",
            ]}
            img="/img/home_cards/sync.svg"
            bg={useColorModeValue("white", "black")}
            imgAtLeft={true}
          />
          <Spacer my={5} />
          <Button
            variant="ghost"
            size="lg"
            color={useColorModeValue("heading.light", "heading.dark")}
            onClick={() => scroller.scrollTo("card5", scroll_config)}
            leftIcon={<FaArrowDown />}
          >
            θͺ²η¨θ³θ¨δΈζζ
          </Button>
          <Spacer my={5} name="card5" />
          <HomeCard
            title="η«ε¨ε·¨δΊΊηθ©θδΈγ"
            desc={[
              "ιε¨ιδΈε ει οΌε°θζΎζ£θ½ηθͺ²η¨θ³θ¨εοΌ",
              "εΎιΈθͺ²δΊΊζΈγθͺ²η¨ε€§ηΆ±γε η°½θ³θ¨*οΌηθ³ζΌθͺ²η¨θ©εΉθ·θε€ι‘**οΌζεηθͺ²η¨θ³θ¨ι ι’ιεδΊε?ζΉθιε?ζΉηθ³ζοΌδΈζη΅±ζ΄ζζδ½ ιθ¦ηιΈθͺ²θ³θ¨γ",
              "θ?δ½ θΌι¬η«ε¨ε·¨δΊΊηθ©θδΈιΈθͺ²γ",
            ]}
            img="/img/home_cards/dashboard.svg"
            bg={useColorModeValue("white", "black")}
          />
          <Flex w="100%" justifyContent="start" alignItems="center" px="10vw">
            <Text
              fontSize="xs"
              fontWeight="500"
              color={useColorModeValue("gray.300", "gray.600")}
            >
              * ε η°½θ³θ¨ηΊη€ΎηΎ€εε ±θ³θ¨οΌεδΎεθοΌε―¦ιε η°½ζζ³ε―θ½ζζζδΈεγ
              <br />
              ** θ³θ¨δΎθͺ PTT NTUCourse, PTT NTUExam οΌ
              ε§ε?ΉεδΎεθδΈδΈδ»£θ‘¨ζ¬η«η«ε ΄γ
            </Text>
          </Flex>
          <Flex
            w="100vw"
            bg="gray.700"
            px={{ base: "8", md: "16", lg: "32" }}
            py="16"
            mt="16"
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
                  εζεθιηΌ
                </Text>
                <Text mt="2" fontSize="lg" color="gray.100" fontWeight="500">
                  δΈη?‘ζ― Issue γ PR ζηθ³ε ε₯ζε οΌζ­‘θΏδΈθ΅·δΎθ? NTUCourse Neo
                  θ?εΎζ΄ε ε?ηΎγ
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
                onClick={() => {
                  window.open("https://github.com/NTUCourse-Neo/");
                  reportEvent("home_page", "click", "github_repo");
                }}
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
                onClick={() => {
                  window.open(
                    "https://github.com/NTUCourse-Neo/ncn-frontend/issues/new/choose"
                  );
                  reportEvent("home_page", "click", "github_issue");
                }}
              >
                εθ½ε»Ίθ­°
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
                  ε ε₯η€ΎηΎ€
                </Text>
                <Text mt="2" fontSize="lg" color="gray.100" fontWeight="500">
                  δΈθ΅·ι²δΎθθε€©γεε ±ει‘ζη΅¦δΊεθ½ε»Ίθ­°οΌι½θΆθ?ηε¦οΌ
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
                onClick={() => {
                  window.open("https://discord.gg/M7NrenYEbS");
                  reportEvent("home_page", "click", "discord");
                }}
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
            px={{ base: "8", md: "16", lg: "32" }}
            pt="8"
            justifyContent="space-between"
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
                fontSize={{ base: "3xl", md: "4xl" }}
                color={useColorModeValue("text.light", "text.dark")}
                fontWeight="800"
              >
                ηΎε¨ε°±ιε§ι«ι©ζ°δΈδ»£ηιΈθͺ²ε§γ
              </Text>
              <Text fontSize="lg" color="teal.500" fontWeight="500">
                η±ε­ΈηιηΌγηΆ­ιοΌζζδ½ ηιΈθͺ²ηΆ²η«γ
              </Text>
              <Link href="course">
                <Button mt="8" variant="solid" size="lg" colorScheme="teal">
                  ιε§δ½Ώη¨
                </Button>
              </Link>
            </Flex>
            <Image
              alt=""
              src={`/img/home_footer.svg`}
              height="256px"
              width="256px"
              pointerEvents="none"
            />
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default HomePage;
