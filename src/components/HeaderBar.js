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

} from '@chakra-ui/react';
import {ChevronRightIcon, Search2Icon} from "@chakra-ui/icons"
import { FaCheck, FaExclamation } from 'react-icons/fa';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";


function HeaderBar() {
  const { loginWithRedirect, user, isAuthenticated, isLoading, logout  }  = useAuth0();
  const renderSignInButton = () => {
    if(isLoading) {
      return <Button colorScheme="blue" variant="ghost" size="md" ml="10px" mr="10px" isLoading />
    }
    if(isAuthenticated) {
      return (
        <>
          <Menu>
            <MenuButton as={Avatar} name={user.name} src={user.picture}>
              {
                user.email_verified ?
                <AvatarBadge boxSize='1.25em' bg='green.500'><FaCheck size="10"/></AvatarBadge>:
                <AvatarBadge boxSize='1.25em' bg='orange.500'><FaExclamation size="10"/></AvatarBadge>
              }
            </MenuButton>
            <MenuList>
              <MenuGroup title='帳戶'>
                <MenuItem>個人資料</MenuItem>
                <MenuItem>設定</MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title='更多'>
                <MenuItem>常見問題</MenuItem>
                <MenuItem>關於</MenuItem>
              </MenuGroup>
              <Flex justifyContent="end" alignItems="center">
                <Button colorScheme="red" variant="solid" size="md" m="2" onClick={() => logout()}>登出</Button>
              </Flex>
            </MenuList>
          </Menu>
        </>
      );
    }
    return(
      <>
        <Button colorScheme="yellow" rightIcon={<ChevronRightIcon/>} size="md" ml="10px" mr="10px" onClick={() => loginWithRedirect()}>登入 / 註冊</Button>
      </>
    );
  };
  return (
    <Flex position="fixed" w="100%" h="64px" bg="teal.300" flexDirection="row" justifyContent="start" alignItems="center" zIndex="1000">
      <Flex justifyContent="center" alignItems="center" ml="60px">
        <Link to="/"><Heading fontSize="2xl" fontWeight="700" mr="auto" color="gray.700" minW="200px">NTUCourse Neo</Heading></Link>
        <Link to="/course"><Button colorScheme="blue" variant="ghost" size="md" ml="30px">課程</Button></Link>
      </Flex>
      <Spacer />
      <Flex justifyContent="center" alignItems="center" mr="60px">
        {renderSignInButton()}
      </Flex>
    </Flex>
  );
}

export default HeaderBar;
