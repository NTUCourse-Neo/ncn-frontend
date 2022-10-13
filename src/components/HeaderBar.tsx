import React, { useState, useRef, useEffect } from "react";
import {
  Flex,
  Heading,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  MenuDivider,
  Text,
  HStack,
  AvatarBadge,
  Badge,
  useColorModeValue,
  Box,
  Fade,
  Divider,
  Center,
  TextProps,
  Checkbox,
} from "@chakra-ui/react";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  InfoOutlineIcon,
} from "@chakra-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaCheck, FaExclamation } from "react-icons/fa";
import { useUser } from "@auth0/nextjs-auth0";
import BeatLoader from "react-spinners/BeatLoader";
import Image from "next/image";
import { reportEvent } from "utils/ga";
import useOutsideDetecter from "@/hooks/useOutsideDetecter";
import { useCourseSearchingContext } from "components/Providers/CourseSearchingProvider";
import CourseSearchInput from "@/components/CourseSearchInput";
import { BiFilterAlt } from "react-icons/bi";
import SearchFilters from "@/components/SearchFilters";

interface MegaMenuLinkProps extends TextProps {
  readonly href: string;
  readonly isExternal?: boolean;
}
function MegaMenuLink(props: MegaMenuLinkProps) {
  const { href, isExternal = true, children, ...restProps } = props;
  return (
    <Text
      sx={{
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        _hover: {
          opacity: 0.7,
        },
      }}
      onClick={() => {
        window.open(href, isExternal ? "_blank" : "_self");
      }}
      {...restProps}
    >
      {children}
    </Text>
  );
}

function DropdownButton(props: {
  readonly id: string;
  readonly title: string;
  readonly children: React.ReactNode;
  readonly isOpen: boolean;
  readonly onClick: () => void;
}) {
  const { id, title, children, isOpen, onClick } = props;
  return (
    <Flex
      flexDirection={"column"}
      justifyContent="center"
      alignItems={"center"}
      sx={{
        transition: "all 0.4s ease-in-out",
      }}
      color={isOpen ? "primary.main" : "black"}
    >
      <HStack
        spacing={0}
        onClick={onClick}
        sx={{
          cursor: "pointer",
        }}
      >
        <Text textStyle={"body1"} id={id}>
          {title}
        </Text>
        <ChevronDownIcon
          id={id}
          boxSize={"24px"}
          transform={isOpen ? "rotate(180deg)" : ""}
          transition="all ease-in-out 0.4s"
        />
      </HStack>
      <Fade in={isOpen} unmountOnExit={true}>
        <Box
          boxSizing="border-box"
          sx={{
            transition: "all 1s ease-in-out",
            transform: "translate(-50%, 0)",
            border: "0.5px solid #6F6F6F",
            borderRadius: "4px",
          }}
          top="60px"
          w="fit-content"
          bg="white"
          position="absolute"
          color="black"
          p={2}
        >
          {children}
        </Box>
      </Fade>
    </Flex>
  );
}

function SignInButton() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const textColor = useColorModeValue("gray.600", "gray.300");
  const loginBtnBg = useColorModeValue("yellow.300", "yellow.600");

  if (isLoading) {
    return (
      <Button
        colorScheme="blue"
        variant="ghost"
        size="md"
        spinner={<BeatLoader size={8} color="white" />}
        isLoading
      />
    );
  }

  if (user) {
    return (
      <Menu>
        <MenuButton
          as={Avatar}
          name={user?.name ?? "User"}
          src={user?.picture ?? null}
          _hover={{ cursor: "pointer" }}
          boxSize="10"
        >
          {user.email_verified ? (
            <AvatarBadge boxSize="1em" bg="green.500" borderWidth="0.15em">
              <FaCheck size="8" />
            </AvatarBadge>
          ) : (
            <AvatarBadge boxSize="1em" bg="orange.500" borderWidth="0.15em">
              <FaExclamation size="8" />
            </AvatarBadge>
          )}
        </MenuButton>
        <MenuList>
          <MenuGroup title="帳戶">
            <Link href="/user/info">
              <MenuItem>個人資料</MenuItem>
            </Link>
            <Link href="/user/my">
              <MenuItem>最愛</MenuItem>
            </Link>
          </MenuGroup>
          <MenuDivider />
          <Flex justifyContent="end" alignItems="center">
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="start"
              m="2"
              ml="4"
            >
              <Badge
                colorScheme={user.email_verified ? "green" : "yellow"}
                mb="1"
              >
                {user.email_verified ? "已驗證" : "未驗證"}
              </Badge>
              <Text fontSize="sm" color={textColor} fontWeight="700">
                {user.name}
              </Text>
              <Text fontSize="xs" color={textColor} fontWeight="500">
                {user.email}
              </Text>
            </Flex>
            <Button
              colorScheme="red"
              variant="outline"
              size="md"
              m="2"
              mr="4"
              onClick={() => {
                reportEvent("header", "click", "logout");
                router.push("/api/auth/logout");
              }}
            >
              登出
            </Button>
          </Flex>
        </MenuList>
      </Menu>
    );
  }

  return (
    <>
      <Menu>
        <MenuButton
          as={Avatar}
          _hover={{ cursor: "pointer" }}
          display={{ base: "inline", md: "none" }}
        />
        <MenuList>
          <Flex justifyContent="end" alignItems="center">
            <Button
              colorScheme="yellow"
              rightIcon={<ChevronRightIcon />}
              variant="solid"
              size="md"
              m="2"
              mr="4"
              onClick={() => {
                reportEvent("header", "click", "login");
                router.push("/api/auth/login");
              }}
            >
              學生/教職員登入
            </Button>
          </Flex>
        </MenuList>
      </Menu>
      <Button
        bg={loginBtnBg}
        _hover={{
          bg: "yellow.400",
        }}
        color={"gray.800"}
        size="md"
        onClick={() => {
          reportEvent("header", "click_external", "status");
          router.push("/api/auth/login");
        }}
        display={{ base: "none", md: "inline-block" }}
      >
        學生/教職員登入
      </Button>
    </>
  );
}

function HeaderBar() {
  const [isHeaderFilterActive, setIsHeaderFilterActive] = useState(false);
  const [openPanel, setOpenPanel] = useState<
    null | "courseInfo" | "courseSites" | "selectSites"
  >(null);
  const courseInfoRef = useRef(null);
  const courseSitesRef = useRef(null);
  const selectSitesRef = useRef(null);
  useOutsideDetecter(courseInfoRef, "courseInfo", () => {
    setOpenPanel(null);
  });
  useOutsideDetecter(courseSitesRef, "courseSites", () => {
    setOpenPanel(null);
  });
  useOutsideDetecter(selectSitesRef, "selectSites", () => {
    setOpenPanel(null);
  });
  const headerFilterRef = useRef(null);
  const headerBarRef = useRef<HTMLDivElement>(null);
  useOutsideDetecter(headerFilterRef, "headerFilter", (e) => {
    // click inside header bar, don't close filter dropdown
    if (
      headerBarRef.current &&
      headerBarRef.current.contains(e?.target as Node)
    ) {
      return;
    }
    setIsHeaderFilterActive(false);
  });
  const router = useRouter();
  const {
    isSearchBoxInView,
    isFiltersEdited,
    searchSettings,
    setSearchSettings,
  } = useCourseSearchingContext();
  const isSearchModeEnable =
    router.pathname === "/course" ? (isSearchBoxInView ? false : true) : false;

  const hasNewPost = true; // TODO: check if there is new post

  useEffect(() => {
    if (isSearchModeEnable) {
      setOpenPanel(null);
    } else {
      setIsHeaderFilterActive(false);
    }
  }, [isSearchModeEnable]);

  return (
    <Box position={"relative"}>
      <Flex
        top={0}
        position="sticky"
        w="100%"
        h="64px"
        bg={"white"}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        zIndex="1000"
        px={{ base: 6, md: 10, lg: 20 }}
        shadow={
          isHeaderFilterActive ? "none" : "0px 1px 2px rgba(85, 105, 135, 0.1)"
        }
        ref={headerBarRef}
      >
        {isSearchModeEnable ? null : (
          <Flex justifyContent="flex-start" alignItems="center" flex={1}>
            <Link href="/" passHref>
              <Flex alignItems="center" flexDirection="row" cursor="pointer">
                <Image
                  src={`/img/ncn_logo.png`}
                  alt="ncnLogo"
                  width="25"
                  height="25"
                  layout="fixed"
                />
                <Heading
                  ml="2"
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="700"
                  color={"heading.light"}
                  display={{ base: "none", md: "inline-block" }}
                >
                  NTUCourse Neo
                </Heading>
              </Flex>
            </Link>
          </Flex>
        )}
        {isSearchModeEnable ? (
          <Flex
            flexDirection={"row"}
            alignItems="center"
            w="60%"
            ml={20}
            pl={2}
            gap={5}
          >
            <CourseSearchInput />
            <Center
              p={1.5}
              cursor={"pointer"}
              borderRadius="full"
              sx={{
                bg: isHeaderFilterActive ? "#ececec" : "white",
                border: isFiltersEdited
                  ? "0.6px solid #007AFF"
                  : "0.6px solid #ffffff",
              }}
              onClick={() => {
                setIsHeaderFilterActive(!isHeaderFilterActive);
              }}
              transition="all ease-in-out 0.2s"
            >
              <BiFilterAlt size={"24px"} />
            </Center>
          </Flex>
        ) : (
          <Flex flexDirection={"row"} alignItems="center" gap={6}>
            <DropdownButton
              id="courseInfo"
              title={"課程資訊"}
              isOpen={openPanel === "courseInfo"}
              onClick={() => {
                if (openPanel === "courseInfo") {
                  setOpenPanel(null);
                } else {
                  setOpenPanel("courseInfo");
                }
              }}
            >
              <Flex
                flexDirection={{ base: "column", md: "row" }}
                gap={6}
                px={10}
                pt={4}
                pb={6}
                ref={courseInfoRef}
                sx={{
                  fontSize: "16px",
                  lineHeight: 1.6,
                  color: "#484848",
                }}
              >
                <Flex
                  flexDirection={"column"}
                  gap={3}
                  w={{ md: "40%", lg: "192px" }}
                >
                  <Text
                    sx={{
                      fontSize: "18px",
                      fontWeight: "700",
                      lineHeight: 1.5,
                    }}
                  >
                    修課認識
                  </Text>
                  <Divider />
                  <MegaMenuLink href="http://140.112.161.31/NTUVoxCourse/index.php/uquery/index">
                    必修科目及應修學分
                  </MegaMenuLink>
                  <MegaMenuLink href="https://specom.aca.ntu.edu.tw/">
                    領域專長
                  </MegaMenuLink>
                  <MegaMenuLink href="http://coursemap.aca.ntu.edu.tw/course_map_all/index.php.htm">
                    台大課程地圖
                  </MegaMenuLink>
                  <MegaMenuLink href="/courseDocuments" isExternal={false}>
                    課程相關說明文件
                  </MegaMenuLink>
                </Flex>
                <Flex
                  flexDirection={"column"}
                  gap={3}
                  w={{ md: "40%", lg: "192px" }}
                >
                  <Text
                    sx={{
                      fontSize: "18px",
                      fontWeight: "700",
                      lineHeight: 1.5,
                    }}
                  >
                    相關申請
                  </Text>
                  <Divider />
                  <MegaMenuLink href="http://curri.aca.ntu.edu.tw/aca_doc/waive.asp">
                    學分抵免申請
                  </MegaMenuLink>
                  <MegaMenuLink href="/courseDocuments" isExternal={false}>
                    進階英語免修
                  </MegaMenuLink>
                </Flex>
                <Flex
                  flexDirection={"column"}
                  gap={3}
                  w={{ md: "40%", lg: "192px" }}
                >
                  <Text
                    sx={{
                      fontSize: "18px",
                      fontWeight: "700",
                      lineHeight: 1.5,
                    }}
                  >
                    其他
                  </Text>
                  <Divider />
                  <MegaMenuLink href="https://gra206.aca.ntu.edu.tw/classrm/">
                    教務處教室查詢借用系統
                  </MegaMenuLink>
                  <MegaMenuLink href="https://course.lib.ntu.edu.tw/">
                    臺灣大學歷年課表
                  </MegaMenuLink>
                </Flex>
              </Flex>
            </DropdownButton>
            <DropdownButton
              id="courseSites"
              title={"課程網站"}
              isOpen={openPanel === "courseSites"}
              onClick={() => {
                if (openPanel === "courseSites") {
                  setOpenPanel(null);
                } else {
                  setOpenPanel("courseSites");
                }
              }}
            >
              <Flex
                flexDirection={"column"}
                w="288px"
                gap={3}
                px={10}
                pt={4}
                pb={6}
                sx={{
                  fontSize: "16px",
                  lineHeight: 1.6,
                  color: "#484848",
                }}
                ref={courseSitesRef}
              >
                <MegaMenuLink href="https://eclass.fltc.ntu.edu.tw/">
                  線上英語課程
                </MegaMenuLink>
                <MegaMenuLink href="http://coursemap.aca.ntu.edu.tw/summer/">
                  暑期課程網
                </MegaMenuLink>
                <MegaMenuLink href="http://teach.cc.ntu.edu.tw/distance/Default.html">
                  臺大遠距教學
                </MegaMenuLink>
                <MegaMenuLink href="http://training.dpd.ntu.edu.tw/">
                  進修推廣部課程網
                </MegaMenuLink>
                <MegaMenuLink href="https://webpageprodvm.ntu.edu.tw/e-learning/">
                  計中資訊應用課程網
                </MegaMenuLink>
                <MegaMenuLink href="http://ocw.aca.ntu.edu.tw/ntu-ocw/">
                  臺大開放式課程
                </MegaMenuLink>
              </Flex>
            </DropdownButton>
            <DropdownButton
              id="selectSites"
              title={"正式選課"}
              isOpen={openPanel === "selectSites"}
              onClick={() => {
                if (openPanel === "selectSites") {
                  setOpenPanel(null);
                } else {
                  setOpenPanel("selectSites");
                }
              }}
            >
              <Flex
                flexDirection={"column"}
                w="288px"
                gap={3}
                px={10}
                pt={4}
                pb={6}
                sx={{
                  fontSize: "16px",
                  lineHeight: 1.6,
                  color: "#484848",
                }}
                ref={selectSitesRef}
              >
                <MegaMenuLink href="https://if192.aca.ntu.edu.tw/index.php">
                  網路選課系統 1
                </MegaMenuLink>
                <MegaMenuLink href="https://if177.aca.ntu.edu.tw/index.php">
                  網路選課系統 2
                </MegaMenuLink>
                <MegaMenuLink href="https://if177.aca.ntu.edu.tw/qcaureg/stulogin.asp">
                  選課結果查詢
                </MegaMenuLink>
              </Flex>
            </DropdownButton>
          </Flex>
        )}
        <Flex
          justifyContent="flex-end"
          alignItems="center"
          gap={{ base: 2, xl: 6 }}
          flex={1}
        >
          {isSearchModeEnable ? null : (
            <Flex gap={{ base: 2, xl: 6 }}>
              <Box position={"relative"}>
                <Link href="/newPost">
                  <Text textStyle={"body1"} cursor="pointer">
                    最新消息
                  </Text>
                </Link>
                {hasNewPost ? (
                  <Box
                    position={"absolute"}
                    boxSizing="content-box"
                    bg="#ff0000"
                    width="8px"
                    height="8px"
                    borderRadius="50%"
                    borderColor={"headerBar.light"}
                    borderWidth="2px"
                    top="0px"
                    right="-4px"
                    zIndex={100}
                  />
                ) : null}
              </Box>
              <Link href="/helpCenter">
                <Text textStyle={"body1"} cursor="pointer">
                  幫助中心
                </Text>
              </Link>
              <Text textStyle={"body1"} cursor="pointer">
                ENG
              </Text>
            </Flex>
          )}
          <SignInButton />
        </Flex>
      </Flex>
      <Flex
        ref={headerFilterRef}
        w="100%"
        bg="transparent"
        flexDirection={"column"}
        visibility={isHeaderFilterActive ? "visible" : "hidden"}
        top={0}
        position="absolute"
        zIndex="990"
        transform={
          isHeaderFilterActive ? "translateY(0%)" : "translateY(-200%)"
        }
        transition={"all ease-in-out .2s"}
        shadow={
          isHeaderFilterActive ? "0px 1px 2px rgba(85, 105, 135, 0.1)" : "none"
        }
      >
        <Flex h="64px" bg="transparent" />
        <Flex px="9%" bg="white" w="100%" h="100%" pb="20px">
          <Box py="20px" bg="white">
            <Flex alignItems={"center"}>
              <HStack
                sx={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#6f6f6f",
                }}
                w="fit-content"
                mr={3}
                spacing={1}
              >
                <BiFilterAlt size={"20px"} />
                <Flex>篩選條件</Flex>
              </HStack>
              <SearchFilters />
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
            <Flex mt={4} alignItems="center" gap={2}>
              <Center h="100%" justifyContent={"center"}>
                <InfoOutlineIcon boxSize={"20px"} color="primary.600" />
              </Center>
              <Text color="#4b4b4b50">External Links Placeholder</Text>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

export default HeaderBar;
