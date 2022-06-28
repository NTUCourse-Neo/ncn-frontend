import React from "react";
import {
  Flex,
  Heading,
  Button,
  Avatar,
  AvatarBadge,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  MenuDivider,
  Text,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { FaCheck, FaExclamation, FaBook, FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import BeatLoader from "react-spinners/BeatLoader";
import { useUserData } from "components/Providers/UserProvider";

function SignInButton() {
  const { logOut } = useUserData();
  const { loginWithRedirect, user, isAuthenticated, isLoading, logout } = useAuth0();

  if (isLoading) {
    return <Button colorScheme="blue" variant="ghost" size="md" ml="10px" mr="10px" spinner={<BeatLoader size={8} color="white" />} isLoading />;
  }

  if (isAuthenticated) {
    return (
      <Menu>
        <MenuButton as={Avatar} name={user.name} src={user.picture} _hover={{ cursor: "pointer" }} ml={{ base: 0, md: 6 }}>
          {user.email_verified ? (
            <AvatarBadge boxSize="1.25em" bg="green.500">
              <FaCheck size="10" />
            </AvatarBadge>
          ) : (
            <AvatarBadge boxSize="1.25em" bg="orange.500">
              <FaExclamation size="10" />
            </AvatarBadge>
          )}
        </MenuButton>
        <MenuList>
          <MenuGroup title="帳戶">
            <Link to="/user/info">
              <MenuItem>個人資料</MenuItem>
            </Link>
            <Link to="/user/my">
              <MenuItem>最愛</MenuItem>
            </Link>
          </MenuGroup>
          <MenuDivider display={{ base: "block", md: "none" }} />
          <MenuGroup title="更多" display={{ base: "inline-block", md: "none" }}>
            <Link to="/about">
              <MenuItem display={{ base: "inline-block", md: "none" }}>關於</MenuItem>
            </Link>
          </MenuGroup>
          <MenuDivider />
          <Flex justifyContent="end" alignItems="center">
            <Flex flexDirection="column" justifyContent="center" alignItems="start" m="2" ml="4">
              <Badge colorScheme={user.email_verified ? "green" : "yellow"} mb="1">
                {user.email_verified ? "已驗證" : "未驗證"}
              </Badge>
              <Text fontSize="sm" color="gray.600" fontWeight="700">
                {user.name}
              </Text>
              <Text fontSize="xs" color="gray.500" fontWeight="500">
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
                logOut();
                logout();
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
      <Menu display={{ base: "inline", md: "none" }}>
        <MenuButton as={Avatar} _hover={{ cursor: "pointer" }} display={{ base: "inline", md: "none" }} />
        <MenuList>
          <MenuGroup title="更多">
            <Link to="/about">
              <MenuItem>關於</MenuItem>
            </Link>
          </MenuGroup>
          <MenuDivider />
          <Flex justifyContent="end" alignItems="center">
            <Button colorScheme="yellow" rightIcon={<ChevronRightIcon />} variant="solid" size="md" m="2" mr="4" onClick={() => loginWithRedirect()}>
              登入 / 註冊
            </Button>
          </Flex>
        </MenuList>
      </Menu>
      <Button
        colorScheme="yellow"
        rightIcon={<ChevronRightIcon />}
        size="md"
        ml="10px"
        mr="10px"
        onClick={() => loginWithRedirect()}
        display={{ base: "none", md: "inline-block" }}
      >
        登入 / 註冊
      </Button>
    </>
  );
}

function HeaderBar() {
  return (
    <Flex
      position="fixed"
      w="100%"
      h="64px"
      bg="teal.300"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      zIndex="1000"
      px={{ base: 6, md: 14 }}
    >
      <Flex justifyContent="center" alignItems="center">
        <Link to="/">
          <Heading fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" color="gray.600">
            NTUCourse Neo
          </Heading>
        </Link>
        <Link to="/course">
          <Button colorScheme="blue" variant="ghost" size="md" ml={{ base: 0, md: 6 }} leftIcon={<FaBook />}>
            課程
          </Button>
        </Link>
      </Flex>
      <Flex justifyContent="center" alignItems="center">
        <Link to="/about">
          <Button colorScheme="blue" variant="ghost" size="md" ml="30px" display={{ base: "none", md: "inline-block" }}>
            <HStack>
              <FaInfoCircle />
              <Text>關於</Text>
            </HStack>
          </Button>
        </Link>
        <SignInButton />
      </Flex>
    </Flex>
  );
}

export default HeaderBar;
