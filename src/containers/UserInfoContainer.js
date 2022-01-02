import { React, useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {
    Box,
    Flex,
    Spacer,
    Text
} from '@chakra-ui/react';
import { get_user_by_id } from '../api/users';
import LoadingOverlay from 'react-loading-overlay';
import { HashLoader } from 'react-spinners';
function UserInfoContainer(props) {
  const [userInfo, setUserInfo] = useState(null);
  const { user, isLoading }  = useAuth0();
  const userLoading = isLoading || !userInfo;
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      if(!isLoading && user) {
        console.log("User: ",user);
        // await get_user_by_id(user.sub).then(res => {
        //   setUserInfo(res.data);
        // }).catch(err => {
        //   console.log(err);
        // });
        try {
          const resp = await get_user_by_id(user.sub)
          console.log("UserInfo: ",resp.data);
          setUserInfo(resp.data);
        } catch (e) {
          console.log(e);
        }
      }
    }

    fetchUserInfo();
  }, [user]);

  if(userLoading) {
    return(
      <Box maxW="screen-md" h="95vh" mx="auto" overflow="visible" p="64px">
        <Flex h="90vh" justifyContent="center" flexDirection="column" alignItems="center">
          <HashLoader size="60px" color="teal"/>
        </Flex>
      </Box>
    );
  }
  return(
    <Box maxW="screen-md" h="95vh" mx="auto" overflow="visible" p="64px">
      <Flex justifyContent="space-between" mb={4} grow="1" flexDirection="column" alignItems="center">
        <Text fontSize="3xl" fontWeight="700" color="gray.600" my="4">✌️ 歡迎回來，{userInfo.db.name}</Text>
        <Flex h="80vh" w="100%" flexDirection="column" justifyContent="start" alignItems="center" p="4" bg="gray.100" borderRadius="xl" boxShadow="lg">

        </Flex>
      </Flex>
    </Box>
  );
}

export default UserInfoContainer;