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
  Divider,
  Center,
  TextProps,
} from "@chakra-ui/react";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  ArrowForwardIcon,
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
import Dropdown from "@/components/Dropdown";
import { LATEST_NEWS_LASTCHECK_TS } from "@/constant";
import useNeoLocalStorage from "@/hooks/useNeoLocalStorage";

interface MegaMenuLinkProps extends TextProps {
  readonly href: string;
  readonly isExternal?: boolean;
}
function MegaMenuLink(props: MegaMenuLinkProps) {
  const { href, isExternal = true, children, ...restProps } = props;
  const router = useRouter();
  return (
    <Flex alignItems={"center"} gap={1}>
      <Text
        sx={{
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          _hover: {
            opacity: 0.7,
          },
        }}
        onClick={() => {
          if (isExternal) {
            window.open(href, "_blank");
          } else {
            router.push(href);
          }
        }}
        {...restProps}
      >
        {children}
      </Text>
      {!isExternal ? <ArrowForwardIcon /> : null}
    </Flex>
  );
}

function DropdownButton(props: {
  readonly isOpen: boolean;
  readonly title: string;
}) {
  const { title, isOpen } = props;
  return (
    <HStack
      spacing={0}
      sx={{
        cursor: "pointer",
      }}
      color={isOpen ? "primary.main" : "black"}
    >
      <Text textStyle={"body1"}>{title}</Text>
      <ChevronDownIcon
        boxSize={"24px"}
        transform={isOpen ? "rotate(180deg)" : ""}
        transition="all ease-in-out 0.4s"
      />
    </HStack>
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
  const { neoLocalStorage, setNeoLocalStorage } = useNeoLocalStorage();
  const [isHeaderFilterActive, setIsHeaderFilterActive] = useState(false);
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
  const { isSearchBoxInView, isFiltersEdited } = useCourseSearchingContext();
  const isSearchModeEnable =
    router.pathname === "/course" ? (isSearchBoxInView ? false : true) : false;

  const hasNewPost = true; // TODO: check if there is new post

  useEffect(() => {
    if (!isSearchModeEnable) {
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
        pr={{ base: 6, md: 10, lg: 20 }}
        pl={!isSearchModeEnable ? { base: 6, md: 10, lg: 20 } : "9%"}
        shadow={
          isHeaderFilterActive
            ? "none"
            : "0px 20px 24px -4px rgba(85, 105, 135, 0.04), 0px 8px 8px -4px rgba(85, 105, 135, 0.02)"
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
            w={{ lg: "75%", xl: "60%" }}
            gap={5}
          >
            <CourseSearchInput />
            <Center
              p={2}
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
              position="relative"
              transition="all ease-in-out 0.2s"
            >
              <BiFilterAlt size={"24px"} />
              {isFiltersEdited ? (
                <Box
                  position={"absolute"}
                  top={0.5}
                  right={0.5}
                  w="8px"
                  h="8px"
                  sx={{
                    borderRadius: "full",
                    bg: "blue.500",
                    border: "0.1px solid white",
                  }}
                />
              ) : null}
            </Center>
          </Flex>
        ) : (
          <Flex flexDirection={"row"} alignItems="center" gap={6}>
            <Dropdown
              renderDropdownButton={(isOpen) => (
                <DropdownButton title={"課程資訊"} isOpen={isOpen} />
              )}
            >
              <Flex
                flexDirection={{ base: "column", md: "row" }}
                gap={6}
                px={10}
                pt={4}
                pb={6}
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
                  <MegaMenuLink href="/courseDocuments" isExternal={false}>
                    課程相關說明文件
                  </MegaMenuLink>
                  <MegaMenuLink href="http://140.112.161.31/NTUVoxCourse/index.php/uquery/index">
                    必修科目及應修學分
                  </MegaMenuLink>
                  <MegaMenuLink href="https://specom.aca.ntu.edu.tw/">
                    領域專長
                  </MegaMenuLink>
                  <MegaMenuLink href="http://coursemap.aca.ntu.edu.tw/course_map_all/index.php.htm">
                    台大課程地圖
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
            </Dropdown>
            <Dropdown
              renderDropdownButton={(isOpen) => (
                <DropdownButton title={"課程網站"} isOpen={isOpen} />
              )}
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
                <MegaMenuLink href="https://www.n2.org.tw/enter/main">
                  全國夏季學院
                </MegaMenuLink>
              </Flex>
            </Dropdown>
            <Dropdown
              renderDropdownButton={(isOpen) => (
                <DropdownButton title={"正式選課"} isOpen={isOpen} />
              )}
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
            </Dropdown>
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
                  <Text
                    textStyle={"body1"}
                    cursor="pointer"
                    onClick={() => {
                      const now = Math.floor(Date.now() / 1000);
                      setNeoLocalStorage({
                        ...neoLocalStorage,
                        latestNewsLastCheckTs: now,
                      });
                      localStorage.setItem(LATEST_NEWS_LASTCHECK_TS, `${now}`);
                    }}
                  >
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
              <Link href="/help">
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
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

export default HeaderBar;
