import React, { useEffect, useState, useRef } from "react";
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
  Icon,
  Tooltip,
  useColorModeValue,
  Image,
  SpacerProps,
  InputGroup,
  InputRightElement,
  Input,
  InputLeftElement,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  HStack,
  MenuOptionGroup,
  FlexProps,
  Checkbox,
  Radio,
  RadioGroup,
  Fade,
  Divider,
  Stack,
  Badge,
} from "@chakra-ui/react";
import {
  FaArrowDown,
  FaArrowRight,
  FaGithub,
  FaChevronDown,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { scroller, Element as ScrollAnchorElement } from "react-scroll";
import { BeatLoader } from "react-spinners";
import HomeCard from "components/HomeCard";
import { DiscordIcon } from "components/CustomIcons";
import useUserInfo from "hooks/useUserInfo";
import { useUser } from "@auth0/nextjs-auth0";
import handleFetch from "utils/CustomFetch";
import { reportEvent } from "utils/ga";
import { SearchIcon } from "@chakra-ui/icons";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import { EnrollMethod } from "types/search";

function setCheckList<T>(array: T[], member: T): T[] {
  const idx = array.indexOf(member);
  if (idx === -1) {
    return [...array, member];
  } else {
    return array.filter((item) => item !== member);
  }
}

interface ScrollAnchorSpacerProps extends SpacerProps {
  readonly name: string;
}
function ScrollAnchorSpacer(props: ScrollAnchorSpacerProps) {
  return (
    <ScrollAnchorElement name={props.name}>
      <Spacer {...props} />
    </ScrollAnchorElement>
  );
}

function FilterButton(props: FlexProps) {
  return (
    <Flex
      borderRadius={"24px"}
      height="36px"
      px="16px"
      py="6px"
      border="0.5px solid #4B4B4B"
      alignItems={"center"}
      color="#4b4b4b"
      cursor={"pointer"}
      transition={"all 0.2s ease-in-out"}
      _hover={{
        bg: "#4b4b4b20",
      }}
      {...props}
    />
  );
}

function FilterDropDown(props: {
  readonly title: string;
  readonly isOpen: boolean;
  readonly children: React.ReactNode;
  readonly onClick: () => void;
  readonly onSave: () => void;
  readonly onClear: () => void;
  readonly isEmpty?: boolean;
}) {
  const {
    title,
    isOpen,
    isEmpty = false,
    children,
    onClick,
    onClear,
    onSave,
  } = props;
  return (
    <Flex
      position="relative"
      flexDirection={"column"}
      alignItems="start"
      justifyContent={"start"}
      sx={{
        transition: "all 0.4s ease-in-out",
      }}
    >
      <FilterButton onClick={onClick} bg={isOpen ? "#cccccc" : "white"}>
        <HStack>
          <Text>{title}</Text>
          <Icon
            as={FaChevronDown}
            transform={isOpen ? "rotate(180deg)" : ""}
            transition="all ease-in-out 0.4s"
          />
        </HStack>
      </FilterButton>
      <Fade in={isOpen} unmountOnExit={true}>
        <Box
          boxSizing="border-box"
          sx={{
            transition: "all 1s ease-in-out",
            border: "0.5px solid #6F6F6F",
            borderRadius: "4px",
          }}
          top="42px"
          w="fit-content"
          bg="white"
          position="absolute"
          color="black"
          zIndex={1000}
        >
          <Flex flexDirection={"column"} gap={3} p={6}>
            {children}
            <Divider />
            <Flex justifyContent={"end"} alignItems={"center"}>
              <Button
                variant={"unstyled"}
                sx={{
                  color: "#4b4b4b",
                  fontSize: "13px",
                  lineHeight: "18px",
                  fontWeight: 600,
                }}
                onClick={onClear}
                isDisabled={isEmpty}
                ml={6}
              >
                清除
              </Button>
              <Button
                ml="2"
                w="58px"
                h="34px"
                sx={{
                  borderRadius: "50px",
                  fontSize: "13px",
                  lineHeight: "18px",
                  fontWeight: 600,
                  bg: "#4b4b4b",
                  _hover: {
                    bg: "#4b4b4b",
                    opacity: 0.8,
                  },
                  _active: {
                    bg: "#4b4b4b",
                    opacity: 0.7,
                  },
                }}
                onClick={onSave}
              >
                套用
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Fade>
    </Flex>
  );
}

interface NewRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}
function NewRegisterModal({
  isOpen,
  onClose,
  isLoading,
}: NewRegisterModalProps) {
  const { user: newUser } = useUser();
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
            onClick={() => {
              onClose();
              reportEvent("new_user_modal", "click", "close");
            }}
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
              reportEvent("new_user_modal", "click", "go_to_profile");
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
  const availableSemesters = ["1111", "1102"];
  const semesterRef = useRef<HTMLInputElement>(null);
  const semesterMenuRef = useRef<HTMLDivElement>(null);
  const [openPanel, setOpenPanel] = useState<
    null | "registerMethod" | "targetStudent" | "otherLimit"
  >(null);
  const { searchSemester, setSearchSemester, searchFilters, setSearchFilters } =
    useCourseSearchingContext();
  const toast = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isLoading: isAuthLoading } = useUser();
  useUserInfo(user?.sub ?? null, {
    onSuccessCallback: async (userData, key, config) => {
      if (!userData?.user?.db && user?.email) {
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

  // local states
  const [selectedEnrollMethod, setSelectedEnrollMethod] = useState<
    EnrollMethod[]
  >(searchFilters.enroll_method);

  const bg = useColorModeValue("white", "black");

  const scroll_config = {
    duration: 1000,
    delay: 50,
    smooth: true,
    offset: -60,
  };

  return (
    <>
      <Head>
        <title>首頁 | NTUCourse Neo</title>
        <meta
          name="description"
          content="首頁 | NTUCourse Neo，全新的臺大選課網站。"
        />
      </Head>
      <Box maxW="screen-md" mx="auto" overflow="visible" mb="-15px" bg={bg}>
        <NewRegisterModal
          isOpen={isOpen}
          onClose={onClose}
          isLoading={isRegistering}
        />
        <Flex
          justifyContent="space-between"
          mb={4}
          grow="1"
          flexDirection="column"
          alignItems="center"
          position={"relative"}
          overflowX="hidden"
        >
          <Box
            position={"absolute"}
            w="4656px"
            h="4656px"
            borderRadius={"50%"}
            bg="#d9d9d9"
            top="-4268px"
          />
          <Flex
            w="100%"
            h="470px"
            bg="transparent"
            zIndex={1}
            flexDirection="column"
            justifyContent={"center"}
            alignItems="center"
          >
            <Flex
              mt="10"
              w="80%"
              bg="white"
              borderRadius={"8px"}
              boxShadow="drop-shadow-2xl"
              px={12}
              pt={8}
              pb={14}
              flexDirection="column"
            >
              <Text
                sx={{
                  fontSize: "32px",
                  lineHeight: "44px",
                  fontWeight: "500",
                }}
              >
                快速搜尋
              </Text>
              <InputGroup
                w="60%"
                bg="#f9f9f9"
                border="0.8px solid #9B9B9B"
                borderRadius={"8px"}
                my="6"
              >
                <InputLeftElement pointerEvents="none" h="100%" pl="2">
                  <SearchIcon boxSize="22px" color="#818181" />
                </InputLeftElement>
                <Input
                  h="56px"
                  py={6}
                  type={"text"}
                  placeholder="搜尋課程名稱/教師姓名/教室/課號/課程識別碼"
                  sx={{
                    fontSize: "18px",
                    lineHeight: "24px",
                    _placeholder: {
                      color: "#818181",
                    },
                  }}
                />
                <InputRightElement w="fit-content" h="100%" px="2">
                  <ButtonGroup isAttached>
                    <Tooltip
                      hasArrow
                      placement="top"
                      label={"點擊搜尋查看所有課程"}
                      bg="gray.600"
                      color="white"
                    >
                      <Button
                        colorScheme="blue"
                        size={"md"}
                        variant="solid"
                        onClick={() => {}}
                        px="8"
                      >
                        <Text display={{ base: "none", md: "inline" }}>
                          搜尋
                        </Text>
                      </Button>
                    </Tooltip>
                    <Menu
                      onOpen={() => {
                        const offsetY =
                          parseInt(semesterRef?.current?.id?.[0] ?? "0", 10) ??
                          0;
                        if (semesterMenuRef?.current) {
                          semesterMenuRef.current.scrollTop = 44 * offsetY;
                        }
                      }}
                    >
                      <Tooltip
                        hasArrow
                        placement="top"
                        label={"選擇學期"}
                        bg="gray.600"
                        color="white"
                      >
                        <MenuButton
                          as={Button}
                          colorScheme="blue"
                          size={"md"}
                          variant="solid"
                          borderLeft={`0.1px solid ${useColorModeValue(
                            "white",
                            "black"
                          )}`}
                        >
                          <FaChevronDown size={10} />
                        </MenuButton>
                      </Tooltip>
                      <MenuList
                        border="0.5px solid #6F6F6F"
                        borderRadius={"4px"}
                        minW={0}
                        w="fit-content"
                        position={"relative"}
                      >
                        <Box
                          position="absolute"
                          top="0"
                          w="100%"
                          h="54px"
                          zIndex={2}
                          pointerEvents="none"
                          sx={{
                            background:
                              "linear-gradient(181.46deg, #FFFFFF -82.1%, #FFFFFF 32.01%, rgba(255, 255, 255, 0) 48.34%)",
                          }}
                        />
                        <RadioGroup
                          value={searchSemester ?? undefined}
                          onChange={setSearchSemester}
                          w="fit-content"
                        >
                          <Flex
                            px={6}
                            py={6}
                            flexDirection={"column"}
                            h="180px"
                            overflowY="scroll"
                            ref={semesterMenuRef}
                          >
                            {availableSemesters.map((semester, index) => (
                              <Radio
                                colorScheme={"green"}
                                key={semester}
                                value={semester}
                                h="32px"
                                py="6px"
                                id={`${index}-${semester}`}
                                ref={
                                  searchSemester === semester
                                    ? semesterRef
                                    : undefined
                                }
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: 500,
                                  lineHeight: "20px",
                                  color: "#666666",
                                }}
                              >
                                {` ${semester.slice(0, 3)}-${semester.slice(
                                  3,
                                  4
                                )}`}
                              </Radio>
                            ))}
                          </Flex>
                        </RadioGroup>
                        <Box
                          position="absolute"
                          bottom="0"
                          w="100%"
                          h="54px"
                          zIndex={2}
                          pointerEvents="none"
                          sx={{
                            transform: "rotate(-180deg)",
                            background:
                              "linear-gradient(181.46deg, #FFFFFF -82.1%, #FFFFFF 32.01%, rgba(255, 255, 255, 0) 48.34%)",
                          }}
                        />
                      </MenuList>
                    </Menu>
                  </ButtonGroup>
                </InputRightElement>
              </InputGroup>
              <Flex flexDirection={"row"} alignItems={"center"}>
                <Text
                  sx={{
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#6f6f6f",
                  }}
                  w="72px"
                >
                  篩選條件
                </Text>
                <Flex alignItems={"center"} flexWrap="wrap" gap="3">
                  <FilterButton>上課時間</FilterButton>
                  <FilterButton>開課系所</FilterButton>
                  <FilterDropDown
                    isOpen={openPanel === "registerMethod"}
                    title="加選方式"
                    onClick={() => {
                      if (openPanel === "registerMethod") {
                        setOpenPanel(null);
                      } else {
                        setSelectedEnrollMethod(searchFilters.enroll_method);
                        setOpenPanel("registerMethod");
                      }
                    }}
                    onSave={() => {
                      setSearchFilters({
                        ...searchFilters,
                        enroll_method: selectedEnrollMethod,
                      });
                      setOpenPanel(null);
                    }}
                    onClear={() => {
                      setSelectedEnrollMethod([]);
                    }}
                    isEmpty={selectedEnrollMethod.length === 0}
                  >
                    <Stack
                      w="280px"
                      spacing={3}
                      sx={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        fontWeight: 500,
                        color: "#666666",
                        letterSpacing: "0.05em",
                      }}
                    >
                      <Checkbox
                        isChecked={selectedEnrollMethod.includes("1")}
                        onChange={() => {
                          setSelectedEnrollMethod(
                            setCheckList(selectedEnrollMethod, "1")
                          );
                        }}
                      >
                        1 - 不限人數，直接上網加選
                      </Checkbox>
                      <Checkbox
                        isChecked={selectedEnrollMethod.includes("2")}
                        onChange={() => {
                          setSelectedEnrollMethod(
                            setCheckList(selectedEnrollMethod, "2")
                          );
                        }}
                      >
                        2 - 向教師取得授權碼後加選
                      </Checkbox>
                      <Checkbox
                        isChecked={selectedEnrollMethod.includes("3")}
                        onChange={() => {
                          setSelectedEnrollMethod(
                            setCheckList(selectedEnrollMethod, "3")
                          );
                        }}
                      >
                        3 - 有人數限制，上網登記後分發
                      </Checkbox>
                    </Stack>
                  </FilterDropDown>
                  <FilterDropDown
                    isOpen={openPanel === "targetStudent"}
                    title="授課年級"
                    onClick={() => {
                      if (openPanel === "targetStudent") {
                        // write onCancel logic here
                        console.log("cancel");
                        setOpenPanel(null);
                      } else {
                        // write onOpen logic here
                        console.log("open");
                        setOpenPanel("targetStudent");
                      }
                    }}
                    onSave={() => {
                      console.log("saved");
                      setOpenPanel(null);
                    }}
                    onClear={() => {
                      console.log("cleared");
                    }}
                  >
                    <Stack
                      spacing={3}
                      sx={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        fontWeight: 500,
                        color: "#666666",
                        letterSpacing: "0.05em",
                      }}
                      w="fit-content"
                    >
                      <Checkbox>大一</Checkbox>
                      <Checkbox>大二</Checkbox>
                      <Checkbox>大三</Checkbox>
                      <Checkbox>大四</Checkbox>
                      <Checkbox>碩士</Checkbox>
                      <Checkbox>博士</Checkbox>
                    </Stack>
                  </FilterDropDown>
                  <FilterDropDown
                    isOpen={openPanel === "otherLimit"}
                    title="其他限制"
                    onClick={() => {
                      if (openPanel === "otherLimit") {
                        // write onCancel logic here
                        console.log("cancel");
                        setOpenPanel(null);
                      } else {
                        // write onOpen logic here
                        console.log("open");
                        setOpenPanel("otherLimit");
                      }
                    }}
                    onSave={() => {
                      console.log("saved");
                      setOpenPanel(null);
                    }}
                    onClear={() => {
                      console.log("cleared");
                    }}
                  >
                    <Stack
                      spacing={3}
                      sx={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        fontWeight: 500,
                        color: "#666666",
                        letterSpacing: "0.05em",
                      }}
                      w="300px"
                    >
                      <Stack spacing={3} w="fit-content">
                        <Text
                          sx={{
                            fontSize: "16px",
                            lineHeight: "21px",
                            fontWeight: 600,
                          }}
                        >
                          上課形式
                        </Text>
                        <Checkbox>只顯示英文授課</Checkbox>
                      </Stack>
                      <Divider />
                      <Stack spacing={3} w="fit-content">
                        <Text
                          sx={{
                            fontSize: "16px",
                            lineHeight: "21px",
                            fontWeight: 600,
                          }}
                        >
                          課程調整
                        </Text>
                        <Checkbox>只顯示異動課程</Checkbox>
                        <Checkbox>只顯示加開課程</Checkbox>
                      </Stack>
                      <Divider />
                      <Stack spacing={3} w="fit-content">
                        <Text
                          sx={{
                            fontSize: "16px",
                            lineHeight: "21px",
                            fontWeight: 600,
                          }}
                        >
                          個人設定
                        </Text>
                        <Checkbox>只顯示沒有先修規定/資格限制的課程</Checkbox>
                        <Checkbox isDisabled>
                          只顯示未衝堂課程<Badge>即將推出</Badge>
                        </Checkbox>
                        <Checkbox isDisabled>
                          只顯示未選課程<Badge>即將推出</Badge>
                        </Checkbox>
                      </Stack>
                    </Stack>
                  </FilterDropDown>
                </Flex>
              </Flex>
              <Checkbox mt="4" w="fit-content">
                <Text
                  sx={{
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#666666",
                  }}
                >
                  嚴格篩選條件
                </Text>
              </Checkbox>
            </Flex>
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
          <ScrollAnchorSpacer my={5} name="card1" />
          <HomeCard
            title="搜尋篩選，更快更準。 🚀"
            desc={[
              "試著在空堂塞入課程，或者在找尋系上的必修嗎？",
              "我們的篩選功能，提供時間、系所與類別等條件複合篩選，不怕你找不到課，只怕你難以抉擇！",
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
            受夠一直切分頁了嗎？
          </Button>
          <ScrollAnchorSpacer my={5} name="card2" />
          <HomeCard
            title="並列互動式課表，選課更直覺。"
            desc={[
              "這堂課是第幾節上課？會不會卡到必修？",
              "互動式課表讓時間不再只是簡單的數字，而是在課表中即時顯示。讓你更直覺地看到課程時間與你的規劃。",
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
            小孩子才做選擇
          </Button>
          <ScrollAnchorSpacer my={5} name="card3" />
          <HomeCard
            title="我全都要。不怕衝堂，順序輕鬆排。"
            desc={[
              "選課好貪心，課表變得超級無敵長...",
              "我們顛覆以往的線上課表模式，不只可衝堂加課，更能分別調整衝堂課程的順序偏好！",
              "你只需要好好挑選適合的課程，剩下的交給我們。👌",
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
            喬志願序好麻煩？
          </Button>
          <ScrollAnchorSpacer my={5} name="card4" />
          <HomeCard
            title="一鍵加入課程網，志願序一目瞭然。"
            desc={[
              "還在埋頭研究課程志願的先後順序嗎？",
              "調整衝堂及全部課程的志願序後，點擊將課程直接加入課程網，同時告別瘋狂彈出的預選課程頁面。別忘了，你還能參考我們顯示的志願序數字直接填入選課系統。",
              "就是這麼簡單，一塊蛋糕。 🍰",
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
            課程資訊一把抓
          </Button>
          <ScrollAnchorSpacer my={5} name="card5" />
          <HomeCard
            title="站在巨人的肩膀上。"
            desc={[
              "還在開一堆分頁，到處找散落的課程資訊嗎？",
              "從選課人數、課程大綱、加簽資訊*，甚至於課程評價跟考古題**，我們的課程資訊頁面集合了官方與非官方的資料，一手統整所有你需要的選課資訊。",
              "讓你輕鬆站在巨人的肩膀上選課。",
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
              * 加簽資訊為社群回報資訊，僅供參考，實際加簽情況可能會有所不同。
              <br />
              ** 資訊來自 PTT NTUCourse, PTT NTUExam ，
              內容僅供參考且不代表本站立場。
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
              pointerEvents="none"
            />
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default HomePage;
