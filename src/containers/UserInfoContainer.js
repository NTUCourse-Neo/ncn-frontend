import { React, useState, useEffect, useRef } from 'react';
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
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
    Stack,
    HStack,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Alert,
    AlertIcon
} from '@chakra-ui/react';
import LoadingOverlay from 'react-loading-overlay';
import { HashLoader } from 'react-spinners';
import { fetchUserById, logIn } from '../actions/';
import { useDispatch, useSelector } from 'react-redux';
import { FaFacebook, FaGithub, FaGoogle, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { deleteUserAccount, deleteUserProfile, registerNewUser, verify_recaptcha } from '../actions/';
import { dept_list } from '../data/department';
import ReCAPTCHA from "react-google-recaptcha";

function UserInfoContainer(props) {
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.user);
 
  const { user, isLoading, logout, getAccessTokenSilently }  = useAuth0();
  const userLoading = isLoading || !userInfo;

  // states for updating userInfo 
  const [name, setName] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [major, setMajor] = useState(null);
  const [minor, setMinor] = useState(null);

  // alert dialog states
  const cancelRef = useRef();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [ deleteMode, setDeleteMode] = useState(null);
  const [ confirm, setConfirm ] = useState('');
  const [ isDeleting, setIsDeleting ] = useState(false);

  const [allowSendOTP, setAllowSendOTP] = useState(false);

  const recaptchaRef = useRef();

  // useEffect(()=>{
  //   console.log('name: ', name);
  //   console.log('studentId: ', studentId);
  // },[name, studentId]);

  const recOnChange = async(value) => {
    let resp
    console.log('Captcha value:', value);
    if(value){
      try{
        const token = await getAccessTokenSilently();
        resp = await dispatch(verify_recaptcha(token, value));
      }catch(err){
        console.log(err);
        recaptchaRef.current.reset();
      }
      if(resp.data.success){
        setAllowSendOTP(true);
      }else{
        setAllowSendOTP(false);
        recaptchaRef.current.reset();
      }
    }
  };

  // TODO
  const generateUpdateObject = () => {
    let updateObject = {};
    if (name!==null && name!==userInfo.db.name){
      updateObject.name = name;
    }
    if (studentId!==null && studentId!==userInfo.db.student_id){
      updateObject.student_id = studentId;
    }
    // TODO: major and minor
    console.log('updateObject: ', updateObject);
    return updateObject;
  }

  // TODO
  const updateUserInfo = async () => {
    const updateObject = generateUpdateObject();
    try {
      // await dispatch(patchUserInfo(updateObject, userInfo.db._id));
    } catch (e) {
      // use toast
    }
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      if(!isLoading && user) {
        try {
          const token = await getAccessTokenSilently();
          const user_data = await dispatch(fetchUserById(token, user.sub));
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

  const clearUserProfile = async () => {
    try {
      const token = await getAccessTokenSilently();
      await dispatch(deleteUserProfile(token, userInfo.db._id));
      await dispatch(registerNewUser(token, user.email))
    } catch (e) {
      toast({
        title: '刪除用戶資料失敗.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const clearUserAccount = async () => {
    try {
      const token = await getAccessTokenSilently();
      await dispatch(deleteUserAccount(token, userInfo.db._id));
    } catch (e) {
      toast({
        title: '刪除用戶帳號失敗.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }
  

  const renderAlertDialog = () => {
    //console.log('deleteMode: ', deleteMode);

    const onClose = () => {
      setIsAlertOpen(false);
      setDeleteMode(null);
      setConfirm('');
    }

    const onDelete = async () => {
      // do API calling...
      setIsDeleting(true);
      if (deleteMode==='User Profile'){
        await clearUserProfile();
        onClose();
      }
      else if (deleteMode==='User Account'){
        await clearUserAccount();
        onClose();
        logout();
      } else {
        onClose();
      }
      setIsDeleting(false);
    }

    const confirmMessage = `The quick brown fox jumps over the lazy dog`;

    return (
      <AlertDialog
      isOpen={isAlertOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete {deleteMode}
            </AlertDialogHeader>

            <AlertDialogBody>
              <Alert status='warning' >
                <AlertIcon boxSize='24px' as={FaExclamationTriangle}/>
                Are you sure? You can't undo this action afterwards.
              </Alert>
              <Divider mt='3'/>
              <Text fontSize='md' mt='2' color='gray.500' fontWeight='bold'>Please type "{confirmMessage}" to confirm.</Text>
              <Input mt='2' variant='filled' placeholder='' onChange={(e)=>{setConfirm(e.currentTarget.value)}} />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={onDelete} ml={3} disabled={confirm!==confirmMessage} isLoading={isDeleting}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    )
  }

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
          const user_name = account.profileData ? account.profileData.name : userInfo.auth0.name;
          return(
            <Flex key={index} alignItems="center" justifyContent="center" borderRadius="lg" border="2px" borderColor="gray.300" p="2" px="4" mr="2">
              <Icon as={FaGithub} w={6} h={6} color="gray.500" />
              <Text ml="2" fontWeight="800" color="gray.600">{user_name}</Text>
            </Flex>
          );
        }
        if(account.provider.includes("facebook")){
          const user_name = account.profileData ? account.profileData.name : userInfo.auth0.name;
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
              <Input w="50%" fontSize="lg" fontWeight="500" color="gray.600" defaultValue={userInfo.db.name} onChange={(e)=>{setName(e.currentTarget.value)}}/>
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
          <Text fontSize="2xl" fontWeight="700" color="gray.600" mt="5">學業</Text>
          <Divider mt="1" mb="4"/>
          <Flex w="100%" flexDirection="column" justifyContent="start" alignItems="start" px="4">
              <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">學號</Text>
              <Flex w="80%" alignItems="start" flexDirection="column">
                <Input w="50%" fontSize="lg" fontWeight="500" color="gray.600" defaultValue={userInfo.db.student_id} onChange={(e)=>{setStudentId(e.currentTarget.value)}} disabled={userInfo.db.student_id !== ""}/>
                <Flex w="100%" flexDirection="row" justifyContent="start" alignItems="center" mt="2">
                  <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCHA_CLIENT_KEY} onChange={recOnChange} ref={recaptchaRef}/>
                  <Button colorScheme="teal" mx="4" disabled={userInfo.db.student_id !== "" || !allowSendOTP}>{userInfo.db.student_id === "" ? "傳送驗證碼":"已綁定臺大學號"}</Button>
                </Flex>
              </Flex>
              <Spacer my="1" />
              <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">主修</Text>
                <Flex w="50%" alignItems="center">
                  <Select w="50%" variant='filled' placeholder='選擇主修學系' onChange={(e)=>{setMajor(e.currentTarget.value)}} defaultValue={userInfo.db.department.length>0?userInfo.db.department[0]:''}>
                    {dept_list.map((dept) => {
                      return (<option id={dept.code} value={dept.full_name}>{dept.full_name}</option>)
                    })}
                  </Select>
                  <Button variant="ghost" colorScheme="blue" mx="4">新增雙主修</Button>
                </Flex>
              <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">輔系</Text>
                <Flex w="50%" alignItems="center">
                  <Select w="50%" variant='filled' placeholder='選擇輔系' onChange={(e)=>{setMinor(e.currentTarget.value)}} defaultValue={userInfo.db.minor}>
                    {dept_list.map((dept) => {
                        return (<option id={dept.code} value={dept.full_name}>{dept.full_name}</option>)
                      })}
                  </Select>
                  <Button variant="ghost" colorScheme="blue" mx="4">新增輔系</Button>
                </Flex>
            </Flex>
          <Text fontSize="2xl" fontWeight="700" color="gray.600" mt="5">課程</Text>
          <Divider mt="1" mb="4"/>
          <Button colorScheme="teal" size="md" w="20%" my="4" variant="outline">匯入修課紀錄</Button>
          <Divider mt="1" mb="4"/>
          <Button colorScheme="teal" size="md" w="20%" my="4" onClick={()=>{updateUserInfo()}}>儲存</Button>
        </Flex>
        <Flex w="100%" h="100%" mt="8" flexDirection="column" justifyContent="start" alignItems="start" p="4" borderRadius="lg" border='1px' borderColor='red.600'>
          <Text fontSize="2xl" fontWeight="700" color="red.600" mt="2">危險區域</Text>
          <Divider mt="1" mb="4"/>
          <Flex flexDirection="column" justifyContent="start" alignItems="start" p="2">
            <HStack spacing={8}>
              <Button colorScheme="red" variant="outline" size="md" my="4" onClick={()=>{setIsAlertOpen(true); setDeleteMode('User Profile')}}>清除個人資料</Button>
              <Text color="red.600" fontWeight="500">將會刪除您的使用者個人資料，包含課表、最愛課程與修課紀錄等，且資料無法回復。<br />您的帳號將不會被刪除，未來不需重新註冊即可繼續使用此服務。</Text>
            </HStack>
            <HStack spacing={8} justify="start">
              <Button colorScheme="red" variant="outline" size="md" my="4" onClick={()=>{setIsAlertOpen(true); setDeleteMode('User Account')}}>徹底刪除帳號</Button>
              <Text color="red.600" fontWeight="500">注意：此動作將會徹底刪除您的帳號與個人資料，且資料無法回復。<br/>未來如需使用此服務需重新註冊。</Text>
            </HStack>
            {renderAlertDialog()}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

export default withAuthenticationRequired(UserInfoContainer, {
  onRedirecting: () => <h1>Redirect...</h1>,
  returnTo: '/',
});