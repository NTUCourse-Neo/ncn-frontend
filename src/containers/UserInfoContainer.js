import { React, useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {
    Box,
    Flex,
    Text
} from '@chakra-ui/react';
import { get_user_by_id } from '../api/users';
function UserInfoContainer(props) {
  const [userInfo, setUserInfo] = useState({});
  const { user, isLoading }  = useAuth0();
  useEffect(async() => {
    if(!isLoading && user) {
      console.log(user);
      await get_user_by_id(user.sub).then(res => {
        setUserInfo(res.data);
      }).catch(err => {
        console.log(err);
      });
      console.log(userInfo);
    }
  }, [user]);

  return (
    <Box maxW="screen-md" minH="95vh" mx="auto" overflow="visible" p="64px">
      <Flex justifyContent="space-between" mb={4} grow="1" flexDirection="column" alignItems="center">
        <Text>歡迎回來，{userInfo.db.name}</Text>
      </Flex>
    </Box>
  );
}

export default UserInfoContainer;