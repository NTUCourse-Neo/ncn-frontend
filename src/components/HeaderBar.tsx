import React, { useState, useRef } from "react";
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
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaCheck, FaExclamation } from "react-icons/fa";
import { useUser } from "@auth0/nextjs-auth0";
import BeatLoader from "react-spinners/BeatLoader";
import Image from "next/image";
import { reportEvent } from "utils/ga";
import useOutsideDetecter from "@/hooks/useOutsideDetecter";

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
        ml="10px"
        mr="10px"
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
          ml={{ base: 0, md: 6 }}
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
              登入 / 註冊
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
        rightIcon={<ChevronRightIcon />}
        size="md"
        ml="10px"
        mr="10px"
        onClick={() => {
          reportEvent("header", "click_external", "status");
          router.push("/api/auth/login");
        }}
        display={{ base: "none", md: "inline-block" }}
      >
        登入 / 註冊
      </Button>
    </>
  );
}

function HeaderBar() {
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

  return (
    <Flex
      top={0}
      position="sticky"
      w="100%"
      h="64px"
      bg={useColorModeValue("headerBar.light", "headerBar.dark")}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      zIndex="1000"
      px={{ base: 6, md: 10, lg: 20 }}
    >
      <Flex justifyContent="center" alignItems="center">
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
              color={useColorModeValue("heading.light", "heading.dark")}
              display={{ base: "none", md: "inline-block" }}
            >
              NTUCourse Neo
            </Heading>
          </Flex>
        </Link>
      </Flex>
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
          <Flex w="200px" ref={courseInfoRef}>
            123
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
          <Flex w="200px" ref={courseSitesRef}>
            123
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
          <Flex w="200px" ref={selectSitesRef}>
            123
          </Flex>
        </DropdownButton>
      </Flex>
      <Flex justifyContent="center" alignItems="center">
        <SignInButton />
      </Flex>
    </Flex>
  );
}

export default HeaderBar;
