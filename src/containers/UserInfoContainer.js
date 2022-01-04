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
    useToast,
    Select,
    Icon,

} from '@chakra-ui/react';
import LoadingOverlay from 'react-loading-overlay';
import { HashLoader } from 'react-spinners';
import { fetchUserById, logIn } from '../actions/';
import { useDispatch, useSelector } from 'react-redux';
import { FaFacebook, FaGithub, FaGoogle } from 'react-icons/fa';

function UserInfoContainer(props) {
  const toast = useToast();
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.user);
 
  const { user, isLoading }  = useAuth0();
  const userLoading = isLoading || !userInfo;
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      if(!isLoading && user) {
        try {
          const user_data = await dispatch(fetchUserById(user.sub));
          await dispatch(logIn(user_data));
        } catch (e) {
          toast({
            title: '取得用戶資料失敗.',
            description: "請聯繫客服(?)",
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
          // Other subsequent actions?
        }
      }
    }

    fetchUserInfo();
  }, [user]);

  const renderConnectedSocialAccounts = () => {
    // console.log("userInfo: ", userInfo.auth0);
    const connected_accounts = userInfo.auth0.identities;
    return(
      connected_accounts.map((account, index) => {
        // console.log("account: ",account);
        if(account.provider.includes("google")){
          const user_name = account.profileData ? account.profileData.name : userInfo.auth0.email;
          return(
            <Flex key={index} alignItems="center" justifyContent="center" borderRadius="lg" border="2px" borderColor="gray.300" p="2" px="4" mr="2">
              <Icon as={FaGoogle} w={6} h={6} color="gray.500" />
              <Text ml="2" fontWeight="800" color="gray.600">{user_name}</Text>
            </Flex>
          );
        }
        if(account.provider.includes("github")){
          const user_name = account.profileData.name ? account.profileData.name : userInfo.auth0.name;
          return(
            <Flex key={index} alignItems="center" justifyContent="center" borderRadius="lg" border="2px" borderColor="gray.300" p="2" px="4" mr="2">
              <Icon as={FaGithub} w={6} h={6} color="gray.500" />
              <Text ml="2" fontWeight="800" color="gray.600">{user_name}</Text>
            </Flex>
          );
        }
        if(account.provider.includes("facebook")){
          const user_name = account.profileData.name ? account.profileData.name : userInfo.auth0.name;
          return(
            <Flex key={index} alignItems="center" justifyContent="center" borderRadius="lg" border="2px" borderColor="gray.300" p="2" px="4">
              <Icon as={FaFacebook} w={6} h={6} color="gray.500" />
              <Text ml="2" fontWeight="800" color="gray.600">{user_name}</Text>
            </Flex>
          );
        }
      }
    ));
  }

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
    <Box maxW="60vw" mx="auto" overflow="visible" p="64px">
      <Flex justifyContent="space-between" mb={4} grow="1" flexDirection="column" alignItems="center">
        <Text fontSize="3xl" fontWeight="700" color="gray.600" my="8">✌️ 歡迎回來，{userInfo.db.name}</Text>
        <Flex w="100%" h="100%" flexDirection="column" justifyContent="start" alignItems="start" p="4" borderRadius="lg" border='1px' borderColor='gray.200'>
          <Text fontSize="2xl" fontWeight="700" color="gray.600">個人資料</Text>
          <Divider mt="1" mb="4"/>
          <Flex w="100%" flexDirection="row" justifyContent="start" alignItems="center" p="2">
            <Flex w="100%" flexDirection="column" justifyContent="start" alignItems="start" px="4">
              <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">姓名</Text>
              <Input w="50%" fontSize="lg" fontWeight="500" color="gray.600" defaultValue={userInfo.db.name}/>
              <Spacer my="1" />
              <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">Email</Text>
              <Input w="50%" fontSize="lg" fontWeight="500" color="gray.600" defaultValue={userInfo.db.email} disabled/>
              <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">已綁定帳號</Text>
              <Flex w="100%" flexDirection="row" justifyContent="start" alignItems="start" flexWrap="wrap">
                {renderConnectedSocialAccounts()}
              </Flex>
            </Flex>
            <Avatar name={userInfo.db.name} size="2xl" src={user.picture}/>
          </Flex>
          <Text fontSize="2xl" fontWeight="700" color="gray.600">學業</Text>
          <Divider mt="1" mb="4"/>
          <Flex w="100%" flexDirection="column" justifyContent="start" alignItems="start" px="4">
              <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">學號</Text>
              <Flex w="50%" alignItems="center">
                <Input w="50%" fontSize="lg" fontWeight="500" color="gray.600" defaultValue={userInfo.db.student_id}/>
                <Button colorScheme="teal" mx="4">傳送驗證碼</Button>
              </Flex>
              <Spacer my="1" />
              <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">主修</Text>
                <Flex w="50%" alignItems="center">
                  <Select w="50%" variant='filled' placeholder='主修學系' />
                  <Button variant="ghost" colorScheme="blue" mx="4">新增雙主修</Button>
                </Flex>
              <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">輔系</Text>
                <Flex w="50%" alignItems="center">
                  <Select w="50%" variant='filled' placeholder='輔系' />
                  <Button variant="ghost" colorScheme="blue" mx="4">新增輔系</Button>
                </Flex>
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