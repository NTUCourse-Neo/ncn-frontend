import { React, useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {
    Box,
    Flex,
    Spacer,
    Text,
    Divider,
    Avatar,
    Input,
    Button,
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
    <Box maxW="screen-md" mx="auto" overflow="visible" p="64px">
      <Flex justifyContent="space-between" mb={4} grow="1" flexDirection="column" alignItems="center">
        <Text fontSize="3xl" fontWeight="700" color="gray.600" my="4">✌️ 歡迎回來，{userInfo.name}</Text>
        <Flex w="100%" h="100%" flexDirection="column" justifyContent="start" alignItems="start" p="4" borderRadius="lg" border='1px' borderColor='gray.200'>
          <Text fontSize="2xl" fontWeight="700" color="gray.600">個人資料</Text>
          <Divider mt="1" mb="4"/>
          <Flex w="100%" flexDirection="row" justifyContent="start" alignItems="center" p="2">
            <Flex w="100%" flexDirection="column" justifyContent="start" alignItems="start" px="4">
              <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">姓名</Text>
              <Input w="50%" fontSize="lg" fontWeight="500" color="gray.600" defaultValue={userInfo.name}/>
              <Spacer my="1" />
              <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">Email</Text>
              <Input w="50%" fontSize="lg" fontWeight="500" color="gray.600" defaultValue={userInfo.email} disabled/>
              <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">已綁定帳號</Text>
            </Flex>
            <Avatar name={userInfo.name} size="2xl" src={user.picture}/>
          </Flex>
          <Text fontSize="2xl" fontWeight="700" color="gray.600">學業</Text>
          <Divider mt="1" mb="4"/>
          <Flex w="100%" flexDirection="column" justifyContent="start" alignItems="start" px="4">
              <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">學號</Text>
              <Flex w="30%" alignItems="center">
                <Input w="50%" fontSize="lg" fontWeight="500" color="gray.600" defaultValue={userInfo.student_id}/>
                <Button colorScheme="teal" mx="4">傳送驗證碼</Button>
              </Flex>
              <Spacer my="1" />
              <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">主修</Text>
              <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">輔系</Text>
            </Flex>
          <Text fontSize="2xl" fontWeight="700" color="gray.600">課程</Text>
          <Divider mt="1" mb="4"/>
          <Text fontSize="2xl" fontWeight="700" color="red.600">危險區域</Text>
          <Divider mt="1" mb="4"/>
          <Flex flexDirection="column" justifyContent="start" alignItems="center" p="2">
            <Button colorScheme="red" variant="outline" size="md" w="100%" my="4">清除個人資料</Button>
            <Button colorScheme="red" variant="outline" size="md" w="100%" my="4">徹底刪除帳號</Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

export default UserInfoContainer;