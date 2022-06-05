import { React, useState, useEffect, useRef } from "react";
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
  Icon,
  HStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Alert,
  AlertIcon,
  Collapse,
  PinInput,
  PinInputField,
  Badge,
} from "@chakra-ui/react";
import Select from "react-select";
import { HashLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { FaFacebook, FaGithub, FaGoogle, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { verify_recaptcha, logIn } from "actions/";
import {
  fetchUserById,
  registerNewUser,
  patchUserInfo,
  deleteUserAccount,
  deleteUserProfile,
  request_otp_code,
  use_otp_link_student_id,
} from "actions/users";
import { dept_list_bachelor_only } from "data/department";
import ReCAPTCHA from "react-google-recaptcha";
import useCountDown from "react-countdown-hook";
import setPageMeta from "utils/seo";

function UserInfoContainer() {
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user);
  const deptOptions = dept_list_bachelor_only.map((dept) => ({ value: dept.full_name, label: dept.code + " " + dept.full_name }));

  const { user, isLoading, logout, getAccessTokenSilently } = useAuth0();
  const userLoading = isLoading || !userInfo;

  // states for updating userInfo
  const [name, setName] = useState(userInfo ? userInfo.db.name : null);
  const [studentId, setStudentId] = useState(userInfo ? userInfo.db.student_id : null);
  const [major, setMajor] = useState(userInfo ? userInfo.db.department.major : null);
  const [doubleMajor, setDoubleMajor] = useState(userInfo ? userInfo.db.department.d_major : null);
  const [minor, setMinor] = useState(userInfo ? userInfo.db.department.minors : null); // arr
  const [saveLoading, setSaveLoading] = useState(false);

  // alert dialog states
  const cancelRef = useRef();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(null);
  const [confirm, setConfirm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [allowSendOTP, setAllowSendOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, actions] = useCountDown(0, 1000);
  const [otpInputStatus, setOtpInputStatus] = useState(0);

  const recaptchaRef = useRef();

  // useEffect(()=>{
  //   console.log('name: ', name);
  //   console.log('studentId: ', studentId);
  //   console.log('major: ', major);
  //   console.log('doubleMajor: ', doubleMajor);
  //   console.log('minor: ', minor);
  // },[name, studentId, major, doubleMajor, minor]);

  const recOnChange = async (value) => {
    let resp;
    // console.log('Captcha value:', value);
    if (value) {
      try {
        resp = await dispatch(verify_recaptcha(value));
      } catch (err) {
        // console.log(err);
        recaptchaRef.current.reset();
      }
      if (resp.data.success) {
        setAllowSendOTP(true);
      } else {
        setAllowSendOTP(false);
        recaptchaRef.current.reset();
      }
    }
  };

  const handleSendOTP = async () => {
    if (studentId === "") {
      // console.log("Please input student id");
      toast({
        title: "Please input student id",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const token = await getAccessTokenSilently();
    try {
      await dispatch(request_otp_code(token, studentId));
      setOtpSent(true);
      setOtpInputStatus(1);
      actions.start(300 * 1000);
    } catch (err) {
      toast({
        title: "request otp code failed",
        description: "請聯繫管理員><",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleVerifyOTP = async (otp) => {
    try {
      setOtpInputStatus(0);
      const token = await getAccessTokenSilently();
      await dispatch(use_otp_link_student_id(token, studentId, otp));
      // refresh page or data
      window.location.reload();
    } catch (err) {
      // console.log(err);
      setOtpInputStatus(-1);
    }
  };

  // TODO
  const generateUpdateObject = () => {
    const updateObject = {};
    if (name !== userInfo.db.name) {
      updateObject.name = name;
    }
    // if (studentId!==userInfo.db.student_id){
    //   updateObject.student_id = studentId;
    // }
    //major, doubleMajor, minor
    const new_department = {};
    if (major !== userInfo.db.department.major) {
      new_department.major = major;
    } else {
      new_department.major = userInfo.db.department.major;
    }
    if (doubleMajor !== userInfo.db.department.d_major) {
      new_department.d_major = doubleMajor;
    } else {
      new_department.d_major = userInfo.db.department.d_major;
    }
    if (minor !== userInfo.db.department.minors) {
      new_department.minors = minor;
    } else {
      new_department.minors = userInfo.db.department.minors;
    }

    if (new_department !== userInfo.db.department) {
      updateObject.department = new_department;
    }

    // console.log('updateObject: ', updateObject);
    return updateObject;
  };

  // TODO
  const updateUserInfo = async () => {
    const updateObject = generateUpdateObject();
    if (
      (updateObject.department.major === updateObject.department.d_major && updateObject.department.major !== "") ||
      updateObject.department.minors.includes(updateObject.department.major)
    ) {
      toast({
        title: "更改用戶資料失敗.",
        description: "主修不能跟雙主修或輔系一樣",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (updateObject.department.minors.includes(updateObject.department.d_major)) {
      toast({
        title: "更改用戶資料失敗.",
        description: "雙主修不能出現在輔系",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const token = await getAccessTokenSilently();
      await dispatch(patchUserInfo(token, updateObject));
      toast({
        title: "更改用戶資料成功.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: "更改用戶資料失敗.",
        description: "請檢查網路連線，或聯絡系統管理員",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isLoading && user) {
        try {
          const token = await getAccessTokenSilently();
          const user_data = await dispatch(fetchUserById(token, user.sub));
          await dispatch(logIn(user_data));
        } catch (error) {
          toast({
            title: "取得用戶資料失敗.",
            description: "請聯繫客服(?)",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          navigate(`/error/${error.status_code}`, { state: error });
          // Other subsequent actions?
        }
      }
    };

    fetchUserInfo();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.db.name);
      setStudentId(userInfo.db.student_id);
      setMajor(userInfo.db.department.major);
      setDoubleMajor(userInfo.db.department.d_major);
      setMinor(userInfo.db.department.minors);
      setPageMeta({ title: `${name} 的個人資料 | NTUCourse Neo`, desc: `個人資料頁面 | NTUCourse Neo，全新的臺大選課網站。` });
    }
  }, [userInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearUserProfile = async () => {
    try {
      const token = await getAccessTokenSilently();
      await dispatch(deleteUserProfile(token, userInfo.db._id));
      await dispatch(registerNewUser(token, user.email));
    } catch (e) {
      toast({
        title: "刪除用戶資料失敗.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const clearUserAccount = async () => {
    try {
      const token = await getAccessTokenSilently();
      await dispatch(deleteUserAccount(token, userInfo.db._id));
    } catch (e) {
      toast({
        title: "刪除用戶帳號失敗.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const renderAlertDialog = () => {
    //console.log('deleteMode: ', deleteMode);

    const onClose = () => {
      setIsAlertOpen(false);
      setDeleteMode(null);
      setConfirm("");
    };

    const onDelete = async () => {
      // do API calling...
      setIsDeleting(true);
      if (deleteMode === "User Profile") {
        await clearUserProfile();
        onClose();
      } else if (deleteMode === "User Account") {
        await clearUserAccount();
        onClose();
        logout();
      } else {
        onClose();
      }
      setIsDeleting(false);
    };

    const confirmMessage = `我確定`;

    return (
      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {deleteMode === "User Profile" ? "重設個人資料" : "徹底刪除帳號"}
            </AlertDialogHeader>

            <AlertDialogBody>
              <Alert status="warning">
                <AlertIcon boxSize="24px" as={FaExclamationTriangle} />
                但咧，你確定嗎？此動作將無法回復！
              </Alert>
              <Divider mt="3" />
              <Text fontSize="md" mt="2" color="gray.500" fontWeight="bold">
                請輸入 "{confirmMessage}"
              </Text>
              <Input
                mt="2"
                variant="filled"
                placeholder=""
                onChange={(e) => {
                  setConfirm(e.currentTarget.value);
                }}
                isInvalid={confirm !== confirmMessage && confirm !== ""}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onDelete} ml={3} disabled={confirm !== confirmMessage} isLoading={isDeleting}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    );
  };

  const renderConnectedSocialAccounts = () => {
    // console.log("userInfo: ", userInfo.auth0);
    const connected_accounts = userInfo.auth0.identities;
    return connected_accounts.map((account, index) => {
      // console.log("account: ",account);
      if (account.provider.includes("google")) {
        const user_name = account.profileData ? account.profileData.name : userInfo.auth0.email;
        return (
          <Flex key={index} alignItems="center" justifyContent="center" borderRadius="lg" border="2px" borderColor="gray.300" p="2" px="4" mr="2">
            <Icon as={FaGoogle} w={6} h={6} color="gray.500" />
            <Text ml="2" fontWeight="800" color="gray.600">
              {user_name}
            </Text>
          </Flex>
        );
      }
      if (account.provider.includes("github")) {
        const user_name = account.profileData ? account.profileData.name : userInfo.auth0.name;
        return (
          <Flex key={index} alignItems="center" justifyContent="center" borderRadius="lg" border="2px" borderColor="gray.300" p="2" px="4" mr="2">
            <Icon as={FaGithub} w={6} h={6} color="gray.500" />
            <Text ml="2" fontWeight="800" color="gray.600">
              {user_name}
            </Text>
          </Flex>
        );
      }
      if (account.provider.includes("facebook")) {
        const user_name = account.profileData ? account.profileData.name : userInfo.auth0.name;
        return (
          <Flex key={index} alignItems="center" justifyContent="center" borderRadius="lg" border="2px" borderColor="gray.300" p="2" px="4">
            <Icon as={FaFacebook} w={6} h={6} color="gray.500" />
            <Text ml="2" fontWeight="800" color="gray.600">
              {user_name}
            </Text>
          </Flex>
        );
      }
      return <></>;
    });
  };
  const renderStudentIdLinkSection = () => {
    if (otpSent) {
      return (
        <Flex w="80%" alignItems="start" flexDirection="column">
          <Flex w="100%" flexDirection="row" justifyContent="start" alignItems="center" mb="2">
            <Input w="50%" fontSize="lg" fontWeight="500" color="gray.600" defaultValue={userInfo.db.student_id} disabled />
            <Button colorScheme="teal" mx="4" disabled>
              {"已送出驗證碼"}
            </Button>
          </Flex>
          <Text color="gray.500" fontWeight="600">
            已寄送一組 6 位數驗證碼至您的台大信箱: {studentId}@ntu.edu.tw
          </Text>
          <Flex w="100%" flexDirection="row" justifyContent="start" alignItems="center" mt="2">
            <HStack mr="4">
              <PinInput
                otp
                autoFocus
                onComplete={handleVerifyOTP}
                isInvalid={otpInputStatus === -1}
                isDisabled={otpInputStatus === 0}
                onChange={() => setOtpInputStatus(1)}
              >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
            <Text color="gray.500" fontWeight="600">
              {"驗證碼即將在 " + timeLeft / 1000 + " 秒後失效。"}
            </Text>
          </Flex>
        </Flex>
      );
    }
    if (userInfo.db.student_id) {
      return (
        <Flex w="80%" alignItems="start" flexDirection="column">
          <Flex w="100%" flexDirection="row" justifyContent="start" alignItems="center" mt="2">
            <Input w="50%" fontSize="lg" fontWeight="500" color="gray.600" defaultValue={userInfo.db.student_id} disabled />
            <Button colorScheme="teal" mx="4" disabled>
              {"已綁定學號"}
            </Button>
          </Flex>
        </Flex>
      );
    }
    return (
      <Flex w="80%" alignItems="start" flexDirection="column">
        <Flex w="100%" flexDirection="row" justifyContent="start" alignItems="center" mb="2">
          <Input
            w="50%"
            fontSize="lg"
            fontWeight="500"
            color="gray.600"
            defaultValue={userInfo.db.student_id}
            onChange={(e) => {
              setStudentId(e.currentTarget.value);
            }}
            disabled={userInfo.db.student_id !== ""}
          />
          <Collapse in={studentId !== ""}>
            <Button colorScheme="teal" mx="4" disabled={studentId === "" || !allowSendOTP} onClick={() => handleSendOTP()}>
              {"傳送驗證碼"}
            </Button>
          </Collapse>
        </Flex>
        <Collapse in={studentId !== ""}>
          <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCHA_CLIENT_KEY} onChange={recOnChange} ref={recaptchaRef} />
        </Collapse>
      </Flex>
    );
  };

  if (userLoading) {
    return (
      <Box maxW="screen-md" h="95vh" mx="auto" overflow="visible" p="64px">
        <Flex h="90vh" justifyContent="center" flexDirection="column" alignItems="center">
          <HashLoader size="60px" color="teal" />
        </Flex>
      </Box>
    );
  }
  return (
    <Box maxW={{ base: "100vw", md: "60vw" }} mx="auto" overflow="visible" px={{ base: "32px", md: "64px" }} pt="64px">
      <Flex justifyContent="space-between" mb={4} grow="1" flexDirection="column" alignItems="center">
        <Text fontSize={["xl", "3xl"]} fontWeight="700" color="gray.600" my="8">
          ✌️ 歡迎回來，{userInfo.db.name}
        </Text>
        <Flex
          w="100%"
          h="100%"
          flexDirection="column"
          justifyContent="start"
          alignItems="start"
          p="4"
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
        >
          <Text fontSize="2xl" fontWeight="700" color="gray.600">
            個人資料
          </Text>
          <Divider mt="1" mb="4" />
          <Flex w="100%" flexDirection="row" justifyContent="start" alignItems="center" p="2" flexWrap="wrap-reverse">
            <Flex w="100%" flexDirection="column" justifyContent="start" alignItems="start" px="4">
              <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">
                姓名
              </Text>
              <Input
                w="50%"
                fontSize="lg"
                fontWeight="500"
                color="gray.600"
                defaultValue={userInfo.db.name}
                onChange={(e) => {
                  setName(e.currentTarget.value);
                }}
              />
              <Spacer my="1" />
              <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">
                Email
              </Text>
              <Input w="50%" fontSize="lg" fontWeight="500" color="gray.600" defaultValue={userInfo.db.email} disabled />
              <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">
                已綁定帳號
              </Text>
              <Flex w="100%" flexDirection="row" justifyContent="start" alignItems="start" flexWrap="wrap">
                {renderConnectedSocialAccounts()}
              </Flex>
            </Flex>
            <Avatar name={userInfo.db.name} size="2xl" src={user.picture} />
          </Flex>
          <Text fontSize="2xl" fontWeight="700" color="gray.600" mt="5">
            學業
          </Text>
          <Divider mt="1" mb="4" />
          <Flex w="100%" flexDirection="column" justifyContent="start" alignItems="start" px="4">
            <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">
              學號
            </Text>
            {renderStudentIdLinkSection()}
            <Spacer my="1" />
            <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">
              主修
            </Text>
            <Flex w="100%" alignItems="center">
              {/* react selector */}
              {major === null ? (
                <></>
              ) : (
                <Box w={{ base: "100%", md: "20vw" }}>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={major === "" ? { value: "", label: "請選擇" } : { value: major, label: major }}
                    isSearchable={TextTrackCue}
                    name="color"
                    options={deptOptions}
                    onChange={(e) => {
                      setMajor(e.value);
                    }}
                  />
                </Box>
              )}
            </Flex>
            <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">
              雙主修
            </Text>
            <Flex w="100%" alignItems="center">
              {/* react selector */}
              {doubleMajor === null ? (
                <></>
              ) : (
                <Box w={{ base: "100%", md: "20vw" }}>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={doubleMajor === "" ? { value: "", label: " 請選擇 " } : { value: doubleMajor, label: doubleMajor }}
                    isSearchable={TextTrackCue}
                    name="color"
                    options={[{ value: "", label: " 請選擇 " }, ...deptOptions]}
                    onChange={(e) => {
                      setDoubleMajor(e.value);
                    }}
                  />
                </Box>
              )}
            </Flex>
            <Text my="4" fontSize="xl" fontWeight="700" color="gray.600">
              輔系
            </Text>
            <Flex w="100%" alignItems="center">
              {/* react selector */}
              {minor === null ? (
                <></>
              ) : (
                <Box w={{ base: "100%", md: "20vw" }}>
                  <Select
                    isMulti
                    w="100%"
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={minor.map((dept) => ({ value: dept, label: dept }))}
                    isSearchable={TextTrackCue}
                    name="color"
                    options={deptOptions}
                    onChange={(e) => {
                      setMinor(e.map((dept) => dept.value));
                    }}
                  />
                </Box>
              )}
            </Flex>
          </Flex>
          <HStack spacing={4} alignItems="center" mt="5">
            <Text fontSize="2xl" fontWeight="700" color="gray.600">
              課程
            </Text>
            <Badge colorScheme="blue" variant="subtle" fontSize="sm" mx="2">
              Coming soon
            </Badge>
          </HStack>
          <Divider mt="1" mb="4" />
          <Button colorScheme="teal" size="md" my="4" variant="outline" disabled>
            匯入修課紀錄
          </Button>
          <Divider mt="1" m="8" />
          <Button
            colorScheme="teal"
            size="md"
            w="20%"
            my="4"
            isLoading={saveLoading}
            onClick={async () => {
              setSaveLoading(true);
              await updateUserInfo();
              setSaveLoading(false);
            }}
          >
            儲存
          </Button>
        </Flex>
        <Flex
          w="100%"
          h="100%"
          mt="8"
          flexDirection="column"
          justifyContent="start"
          alignItems="start"
          p="4"
          borderRadius="lg"
          border="1px"
          borderColor="red.600"
        >
          <Text fontSize="2xl" fontWeight="700" color="red.600" mt="2">
            危險區域
          </Text>
          <Divider mt="1" mb="4" />
          <Flex flexDirection="column" justifyContent="start" alignItems="start" p="2">
            <HStack spacing={8} wrap="wrap">
              <Button
                colorScheme="red"
                variant="outline"
                size="md"
                my="4"
                onClick={() => {
                  setIsAlertOpen(true);
                  setDeleteMode("User Profile");
                }}
              >
                重設個人資料
              </Button>
              <Text color="red.600" fontWeight="500">
                將會刪除您的使用者個人資料，包含課表、最愛課程與修課紀錄等，且資料無法回復。
                <br />
                您的帳號將不會被刪除，未來不需重新註冊即可繼續使用此服務。
              </Text>
            </HStack>
            <HStack spacing={8} justify="start" wrap="wrap">
              <Button
                colorScheme="red"
                variant="outline"
                size="md"
                my="4"
                onClick={() => {
                  setIsAlertOpen(true);
                  setDeleteMode("User Account");
                }}
              >
                徹底刪除帳號
              </Button>
              <Text color="red.600" fontWeight="500">
                注意：此動作將會徹底刪除您的帳號與個人資料，且資料無法回復。
                <br />
                未來如需使用此服務需重新註冊。
              </Text>
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
  returnTo: "/",
});
