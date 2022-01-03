import { React, useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {
    Box,
    Flex,
    Spacer,
    Text
} from '@chakra-ui/react';
import LoadingOverlay from 'react-loading-overlay';
import { HashLoader } from 'react-spinners';
import { fetchUserById } from '../actions/';
import { useDispatch, useSelector } from 'react-redux';

function UserInfoContainer(props) {
  const dispatch = useDispatch();
  // store user object in db, refactor to redux?
  const [userInfo, setUserInfo] = useState(null); 
  const { user, isLoading }  = useAuth0();
  const userLoading = isLoading || !userInfo;
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      if(!isLoading && user) {
        // console.log("User: ",user);
        try {
          const user_data = await dispatch(fetchUserById(user.sub));
          if (user_data){
            const db_user = user_data.db;
            // console.log("UserInfo: ",db_user);
            setUserInfo(db_user);
          }
        } catch (e) {
          // refactor: use toast?
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
        <Text fontSize="3xl" fontWeight="700" color="gray.600" my="4">✌️ 歡迎回來，{userInfo.name}</Text>
        <Flex h="80vh" w="100%" flexDirection="column" justifyContent="start" alignItems="center" p="4" bg="gray.100" borderRadius="xl" boxShadow="lg">

        </Flex>
      </Flex>
    </Box>
  );
}

export default UserInfoContainer;