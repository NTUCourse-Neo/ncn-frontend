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
  Tooltip,
  InputGroup,
  InputRightElement,
  Input,
  InputLeftElement,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { FaArrowRight, FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/router";
import Head from "next/head";
import { BeatLoader } from "react-spinners";
import useUserInfo from "hooks/useUserInfo";
import { useUser } from "@auth0/nextjs-auth0";
import handleFetch from "utils/CustomFetch";
import { reportEvent } from "utils/ga";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import useHorizontalScrollable from "@/hooks/useHorizontalScrollable";
import searchModeList from "@/data/searchMode";
import { availableSemesters } from "@/constant";
import SearchFilters from "@/components/SearchFilters";
import { precautions } from "@/components/InstructionModals";

// deprecated
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
  const semesterRef = useRef<HTMLInputElement>(null);
  const semesterMenuRef = useRef<HTMLDivElement>(null);
  const searchModeRef = useRef<HTMLDivElement>(null);
  const {
    isScrollable,
    reachLeft,
    reachRight,
    updateReachStates,
    scrollLeft,
    scrollRight,
  } = useHorizontalScrollable(searchModeRef);
  const {
    searchSemester,
    setSearchSemester,
    searchMode,
    setSearchMode,
    searchSettings,
    setSearchSettings,
    setSearch,
  } = useCourseSearchingContext();
  const toast = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isLoading: isAuthLoading } = useUser();

  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter();
  const startSearch = (keyword: string) => {
    setSearch(keyword);
    router.push("/course");
  };

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
        mb="-15px"
        bg={"white"}
      >
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
            gap={4}
          >
            <Flex
              mt="10"
              justifyContent={"start"}
              w="80%"
              overflowX="hidden"
              overflowY={"hidden"}
              h="36px"
              position={"relative"}
            >
              <Box
                position="absolute"
                left="0"
                w="36px"
                h="36px"
                zIndex={20}
                bg="linear-gradient(90deg, #d9d9d9, #d9d9d950)"
                onClick={() => {
                  scrollLeft();
                }}
                display={isScrollable && !reachLeft ? "block" : "none"}
              >
                <ChevronLeftIcon
                  color="white"
                  h="100%"
                  w="36px"
                  cursor={"pointer"}
                />
              </Box>
              <Flex
                position="absolute"
                top="0"
                left="0"
                bottom={"-15px"}
                overflowX="auto"
                overflowY="hidden"
                ref={searchModeRef}
                onScroll={() => {
                  updateReachStates();
                }}
              >
                {searchModeList.map((option, index) => (
                  <Box
                    key={option.id}
                    px={5}
                    py={2}
                    w="fit-content"
                    minWidth={"fit-content"}
                    borderLeft={index !== 0 ? "1px solid #F6F6F6" : "none"}
                    sx={{
                      fontSize: "16px",
                      fontWeight: 500,
                      lineHeight: "20px",
                      color: searchMode.id === option.id ? "white" : "#484848",
                      transition: "all 0.2s ease-in-out",
                    }}
                    cursor="pointer"
                    onClick={() => {
                      setSearchMode(option);
                    }}
                  >
                    {option.chinese}
                  </Box>
                ))}
              </Flex>
              <Box
                position="absolute"
                right="0"
                w="36px"
                h="36px"
                zIndex={20}
                bg="linear-gradient(270deg, #d9d9d9, #d9d9d950)"
                onClick={() => {
                  scrollRight();
                }}
                display={isScrollable && !reachRight ? "block" : "none"}
              >
                <ChevronRightIcon
                  color="white"
                  h="100%"
                  w="36px"
                  cursor={"pointer"}
                />
              </Box>
            </Flex>
            <Flex
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
                {searchMode.chinese}
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
                  placeholder="搜尋課程名稱 / 教師姓名 / 教室 / 流水號"
                  sx={{
                    fontSize: "18px",
                    lineHeight: "24px",
                    _placeholder: {
                      color: "#818181",
                    },
                  }}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      startSearch(searchKeyword);
                    }
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
                        onClick={() => {
                          startSearch(searchKeyword);
                        }}
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
                      {({ onClose }) => (
                        <>
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
                              borderLeft={`0.1px solid white`}
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
                                onClick={onClose}
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
                        </>
                      )}
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
                <SearchFilters />
              </Flex>
            </Flex>
            <Flex w="80%" bg="transparent" flexWrap={"wrap"}>
              {searchMode.precautions.map((precaution) => {
                const component = precautions[precaution];
                return (
                  <React.Fragment key={`${precaution}`}>
                    {component}
                  </React.Fragment>
                );
              })}
            </Flex>
          </Flex>
          <Flex w="100vw" h="50vh" justify={"center"} alignItems="center">
            資訊介紹版位 (In progress)
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default HomePage;
