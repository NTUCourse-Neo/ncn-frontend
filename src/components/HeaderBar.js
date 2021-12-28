import React from 'react';
import {
  Flex,
  Heading,
  Button,
  Spacer,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Kbd,
} from '@chakra-ui/react';
import {ChevronRightIcon, Search2Icon} from "@chakra-ui/icons"
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
      return (<Button colorScheme="yellow" variant="outline" size="md" ml="10px" mr="10px" onClick={() => {logout()}}>{user.name}</Button>);
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
