import React, { useEffect, useState, useRef, forwardRef } from "react";
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
  InputGroup,
  InputRightElement,
  Input,
  InputLeftElement,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  HStack,
  FlexProps,
  Checkbox,
  Radio,
  RadioGroup,
  Fade,
  Divider,
  Stack,
  Badge,
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
import { EnrollMethod } from "types/search";
import useHorizontalScrollable from "@/hooks/useHorizontalScrollable";
import searchModeList from "@/data/searchMode";
import useOutsideDetecter from "@/hooks/useOutsideDetecter";
import TimeFilterModal from "@/components/FilterModals/TimeFilterModal";
import DeptFilterModal from "@/components/FilterModals/DeptFilterModal";
import { mapStateToIntervals } from "utils/timeTableConverter";
import { isEnrollMethodFilterActive } from "utils/searchFilter";

function setCheckList<T>(array: T[], member: T): T[] {
  const idx = array.indexOf(member);
  if (idx === -1) {
    return [...array, member];
  } else {
    return array.filter((item) => item !== member);
  }
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

const FilterDropDown = forwardRef<
  HTMLDivElement,
  {
    readonly id?: string;
    readonly title: string;
    readonly isOpen: boolean;
    readonly children: React.ReactNode;
    readonly onClick: () => void;
    readonly onSave: () => void;
    readonly onClear: () => void;
    readonly isEmpty?: boolean;
    readonly isActive?: boolean;
  }
>((props, ref) => {
  const {
    id = "",
    title,
    isOpen,
    isEmpty = false,
    isActive = false,
    children,
    onClick,
    onClear,
    onSave,
  } = props;
  const isDarkBackground = isActive || isOpen;
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
      <FilterButton
        onClick={onClick}
        bg={isDarkBackground ? "#cccccc" : "white"}
        id={id}
      >
        <HStack id={id}>
          <Text id={id}>{title}</Text>
          <Icon
            id={id}
            as={FaChevronDown}
            transform={isOpen ? "rotate(180deg)" : ""}
            transition="all ease-in-out 0.4s"
          />
        </HStack>
      </FilterButton>
      <Fade in={isOpen} unmountOnExit={true}>
        <Box
          ref={ref}
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
});

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
  const searchModeRef = useRef<HTMLDivElement>(null);
  const {
    isScrollable,
    reachLeft,
    reachRight,
    updateReachStates,
    scrollLeft,
    scrollRight,
  } = useHorizontalScrollable(searchModeRef);
  const [openPanel, setOpenPanel] = useState<
    null | "registerMethod" | "targetGrade" | "otherLimit"
  >(null);
  const registerMethodRef = useRef<HTMLDivElement>(null);
  const targetStudentRef = useRef<HTMLDivElement>(null);
  const otherLimitRef = useRef<HTMLDivElement>(null);
  useOutsideDetecter(registerMethodRef, "registerMethod", () => {
    setOpenPanel(null);
  });
  useOutsideDetecter(targetStudentRef, "targetGrade", () => {
    setOpenPanel(null);
  });
  useOutsideDetecter(otherLimitRef, "otherLimit", () => {
    setOpenPanel(null);
  });
  const {
    searchSemester,
    setSearchSemester,
    searchFilters,
    setSearchFilters,
    searchMode,
    setSearchMode,
    searchSettings,
    setSearchSettings,
  } = useCourseSearchingContext();
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
                  <TimeFilterModal
                    title={`上課時間${
                      mapStateToIntervals(searchFilters.time) === 0
                        ? ""
                        : ` (${mapStateToIntervals(searchFilters.time)})`
                    }`}
                    isActive={mapStateToIntervals(searchFilters.time) > 0}
                  />
                  <DeptFilterModal
                    title={`開課系所${
                      searchFilters.department.length > 0
                        ? ` (${searchFilters.department.length})`
                        : ""
                    }`}
                    isActive={searchFilters.department.length > 0}
                  />
                  <FilterDropDown
                    id="registerMethod"
                    ref={registerMethodRef}
                    isOpen={openPanel === "registerMethod"}
                    title={`加選方式${
                      isEnrollMethodFilterActive(searchFilters.enroll_method)
                        ? ` (${[...searchFilters.enroll_method]
                            .sort()
                            .join(", ")})`
                        : ""
                    }`}
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
                    isActive={isEnrollMethodFilterActive(
                      searchFilters.enroll_method
                    )}
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
                    id="targetGrade"
                    ref={targetStudentRef}
                    isOpen={openPanel === "targetGrade"}
                    title="授課年級"
                    onClick={() => {
                      if (openPanel === "targetGrade") {
                        // write onCancel logic here
                        console.log("cancel");
                        setOpenPanel(null);
                      } else {
                        // write onOpen logic here
                        console.log("open");
                        setOpenPanel("targetGrade");
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
                    id="otherLimit"
                    ref={otherLimitRef}
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
                        <Checkbox>只顯示遠距課程</Checkbox>
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
              <Checkbox
                mt="4"
                w="fit-content"
                isChecked={searchSettings.strict_search_mode}
                onChange={(e) => {
                  setSearchSettings({
                    ...searchSettings,
                    strict_search_mode: e.currentTarget.checked,
                  });
                }}
              >
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
          <Flex w="100vw" h="50vh" justify={"center"} alignItems="center">
            資訊介紹版位 (In progress)
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default HomePage;
