import React from 'react';
import {
  Flex,
  Heading,
  Button,
  Spacer,
  Avatar,
  AvatarBadge,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  MenuDivider,
  Text,
  Badge

} from '@chakra-ui/react';
import {ChevronRightIcon} from "@chakra-ui/icons"
import { FaCheck, FaExclamation, FaBook, FaInfoCircle, FaBookmark } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import BeatLoader from 'react-spinners/BeatLoader';
import { logOut } from "../actions/"; 
import { useDispatch } from "react-redux"; 
// import { ColorModeSwitcher } from '../ColorModeSwitcher';

function HeaderBar() {
  const dispatch = useDispatch();
  const { loginWithRedirect, user, isAuthenticated, isLoading, logout  }  = useAuth0();
  const renderSignInButton = () => {
    if(isLoading) {
      return <Button colorScheme="blue" variant="ghost" size="md" ml="10px" mr="10px" spinner={<BeatLoader size={8} color='white' />} isLoading />
    }
    if(isAuthenticated) {
      return (
        <>
          <Link to="/user/my"><Button colorScheme="blue" variant="ghost" size="md" mx="2" mr="4" leftIcon={<FaBookmark/>}>最愛</Button></Link>
          <Menu>
            <MenuButton as={Avatar} name={user.name} src={user.picture} _hover={{cursor:"pointer"}}>
              {
                user.email_verified ?
                <AvatarBadge boxSize='1.25em' bg='green.500'><FaCheck size="10"/></AvatarBadge>:
                <AvatarBadge boxSize='1.25em' bg='orange.500'><FaExclamation size="10"/></AvatarBadge>
              }
            </MenuButton>
            <MenuList>
              <MenuGroup title='帳戶'>
                <Link to="/user/info"><MenuItem>個人資料</MenuItem></Link>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title='更多'>
                <Link to="/about"><MenuItem>關於</MenuItem></Link>
              </MenuGroup>
              <MenuDivider />
              <Flex justifyContent="end" alignItems="center">
                <Flex flexDirection="column" justifyContent="center" alignItems="start" m="2" ml="4">
                  <Badge colorScheme={user.email_verified ? "green":"yellow"} mb="1">{user.email_verified ? "已驗證":"未驗證"}</Badge>
                  <Text fontSize="sm" color="gray.600" fontWeight="700">{user.name}</Text>
                  <Text fontSize="xs" color="gray.500" fontWeight="500">{user.email}</Text>
                </Flex>
                <Button colorScheme="red" variant="outline" size="md" m="2" mr="4" onClick={() => {
                  dispatch(logOut());
                  logout();
                }}>登出</Button>
              </Flex>
            </MenuList>
          </Menu>
        </>
      );
    }
    return(
      <>
        <Link to="/about"><Button colorScheme="blue" variant="ghost" leftIcon={<FaInfoCircle/>} size="md" ml="10px" mr="10px">關於</Button></Link>
        <Button colorScheme="yellow" rightIcon={<ChevronRightIcon/>} size="md" ml="10px" mr="10px" onClick={() => loginWithRedirect()}>登入 / 註冊</Button>
      </>
    );
  };
  return (
    <Flex position="fixed" w="100%" h="64px" bg="teal.300" flexDirection="row" justifyContent="start" alignItems="center" zIndex="1000">
      <Flex justifyContent="center" alignItems="center" ml="60px">
        <Link to="/"><Heading fontSize="2xl" fontWeight="700" mr="auto" color="gray.700" minW="200px">NTUCourse Neo</Heading></Link>
        <Link to="/course"><Button colorScheme="blue" variant="ghost" size="md" ml="30px" leftIcon={<FaBook />}>課程</Button></Link>
      </Flex>
      <Spacer />
      <Flex justifyContent="center" alignItems="center" mr="60px">
        {renderSignInButton()}
      </Flex>
    </Flex>
  );
}

export default HeaderBar;
