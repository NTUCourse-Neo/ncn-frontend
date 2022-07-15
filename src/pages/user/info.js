import { React, useState, useEffect, useRef } from "react";
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
  HStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Alert,
  AlertIcon,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import Select from "react-select";
import { HashLoader } from "react-spinners";
import {
  FaFacebook,
  FaGithub,
  FaGoogle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useRouter } from "next/router";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { dept_list_bachelor_only } from "data/department";
import { useUserData } from "components/Providers/UserProvider";
import handleFetch from "utils/CustomFetch";
import Head from "next/head";

function ConnectedAccountTags({ userInfo }) {
  const connected_accounts = userInfo.auth0.identities;
  const cardColor = useColorModeValue("white", "gray.600");
  const textColor = useColorModeValue("text.light", "text.dark");
  return connected_accounts.map((account, index) => {
    let user_name = null;
    let icon = null;
    if (account.provider.includes("google")) {
      user_name = account.profileData
        ? account.profileData.name
        : userInfo.auth0.email;
      icon = <FaGoogle />;
    } else if (account.provider.includes("github")) {
      user_name = account.profileData
        ? account.profileData.name
        : userInfo.auth0.name;
      icon = <FaGithub />;
    } else if (account.provider.includes("facebook")) {
      icon = <FaFacebook />;
      user_name = account.profileData
        ? account.profileData.name
        : userInfo.auth0.name;
    }
    if (!icon) {
      return null;
    }
    return (
      <Flex
        key={index}
        alignItems="center"
        justifyContent="center"
        borderRadius="lg"
        border="2px"
        borderColor="gray.300"
        p="2"
        px="4"
        mr="2"
        bg={cardColor}
        color={textColor}
      >
        <Flex w={6} h={6} justifyContent={"center"} alignItems="center">
          {icon}
        </Flex>
        <Text ml="2" fontWeight="800">
          {user_name}
        </Text>
      </Flex>
    );
  });
}

function DeleteDialog({
  isAlertOpen,
  setIsAlertOpen,
  deleteMode,
  setDeleteMode,
}) {
  const { setUser } = useUserData();
  const confirmMessage = `我確定`;
  const cancelRef = useRef();
  const toast = useToast();
  const { user } = useUser();
  const router = useRouter();

  const [confirm, setConfirm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const onClose = () => {
    setIsAlertOpen(false);
    setDeleteMode(null);
    setConfirm("");
  };

  const clearUserProfile = async () => {
    try {
      await handleFetch("/api/user/deleteProfile", {});
      await handleFetch("/api/user/register", {
        email: user?.email,
      });
    } catch (e) {
      toast({
        title: "刪除用戶資料失敗.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      if (e?.response?.data?.msg === "access_token_expired") {
        router.push("/api/auth/login");
      }
    }
  };

  const clearUserAccount = async () => {
    try {
      await handleFetch("/api/user/deleteAccount", {});
      setUser(null);
    } catch (e) {
      toast({
        title: "刪除用戶帳號失敗.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      if (e?.response?.data?.msg === "access_token_expired") {
        router.push("/api/auth/login");
      }
    }
  };

  const onDelete = async () => {
    // do API calling...
    setIsDeleting(true);
    if (deleteMode === "User Profile") {
      await clearUserProfile();
      router.push("/");
      onClose();
    } else if (deleteMode === "User Account") {
      await clearUserAccount();
      onClose();
      router.push("/api/auth/logout");
    } else {
      onClose();
    }
    setIsDeleting(false);
  };

  return (
    <AlertDialog
      isOpen={isAlertOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
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
            <Text
              fontSize="md"
              mt="2"
              color={useColorModeValue("text.light", "text.dark")}
              fontWeight="bold"
            >
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
            <Button
              colorScheme="red"
              onClick={onDelete}
              ml={3}
              disabled={confirm !== confirmMessage}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default function UserInfoPage({ user }) {
  const { setUser, user: userInfo } = useUserData();
  const textColor = useColorModeValue("text.light", "text.dark");
  const cardColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.300", "gray.900");
  const dangerZoneColor = useColorModeValue("white", "red.200");
  const router = useRouter();
  const toast = useToast();
  const deptOptions = dept_list_bachelor_only.map((dept) => ({
    value: dept.full_name,
    label: dept.code + " " + dept.full_name,
  }));

  const userLoading = !userInfo;

  // states for updating userInfo
  const [name, setName] = useState(userInfo ? userInfo.db.name : null);
  const [major, setMajor] = useState(
    userInfo ? userInfo.db.department.major : null
  );
  const [doubleMajor, setDoubleMajor] = useState(
    userInfo ? userInfo.db.department.d_major : null
  );
  const [minor, setMinor] = useState(
    userInfo ? userInfo.db.department.minors : null
  ); // arr
  const [saveLoading, setSaveLoading] = useState(false);

  // alert dialog states
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(null);

  const generateUpdateObject = () => {
    const updateObject = {};
    if (name !== userInfo.db.name) {
      updateObject.name = name;
    }
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
      (updateObject.department.major === updateObject.department.d_major &&
        updateObject.department.major !== "") ||
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
    if (
      updateObject.department.minors.includes(updateObject.department.d_major)
    ) {
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
      const updatedUser = await handleFetch("/api/user/patch", {
        updated_obj: updateObject,
      });
      setUser(updatedUser);
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
      if (e?.response?.data?.msg === "access_token_expired") {
        router.push("/api/auth/login");
      }
    }
  };

  useEffect(() => {
    // fetch on render
    const fetchUserInfo = async () => {
      if (user) {
        try {
          const user_data = await handleFetch("/api/user", {
            user_id: user?.sub,
          });
          await setUser(user_data);
        } catch (e) {
          toast({
            title: "取得用戶資料失敗.",
            description: "請聯繫客服(?)",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          if (e?.response?.data?.msg === "access_token_expired") {
            router.push("/api/auth/login");
          } else {
            router.push("/404");
          }
          // Other subsequent actions?
        }
      }
    };

    fetchUserInfo();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.db.name);
      setMajor(userInfo.db.department.major);
      setDoubleMajor(userInfo.db.department.d_major);
      setMinor(userInfo.db.department.minors);
    }
  }, [userInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  if (userLoading) {
    return (
      <Box maxW="screen-md" h="95vh" mx="auto" overflow="visible" p="64px">
        <Flex
          h="90vh"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
        >
          <HashLoader size="60px" color="teal" />
        </Flex>
      </Box>
    );
  }
  return (
    <>
      <Head>
        <title>{`${name} 的個人資料 | NTUCourse Neo`}</title>
        <meta
          name="description"
          content={`個人資料頁面 | NTUCourse Neo，全新的臺大選課網站。`}
        />
      </Head>
      <Box
        maxW={{ base: "100vw", md: "60vw" }}
        mx="auto"
        overflow="visible"
        px={{ base: "32px", md: "64px" }}
        pt="64px"
      >
        <Flex
          justifyContent="space-between"
          mb={4}
          grow="1"
          flexDirection="column"
          alignItems="center"
        >
          <Text
            fontSize={["xl", "3xl"]}
            fontWeight="700"
            color={textColor}
            my="8"
          >
            ✌️ 歡迎回來，{userInfo.db.name}
          </Text>
          <Flex
            w="100%"
            h="100%"
            flexDirection="column"
            justifyContent="start"
            alignItems="start"
            p="4"
            borderRadius="xl"
            border="1px"
            borderColor={borderColor}
            bg={cardColor}
          >
            <Text fontSize="2xl" fontWeight="700" color={textColor}>
              個人資料
            </Text>
            <Divider mt="1" mb="4" />
            <Flex
              w="100%"
              flexDirection="row"
              justifyContent="start"
              alignItems="center"
              p="2"
              flexWrap="wrap-reverse"
            >
              <Flex
                w="100%"
                flexDirection="column"
                justifyContent="start"
                alignItems="start"
                px="4"
              >
                <Text my="4" fontSize="xl" fontWeight="700" color={textColor}>
                  姓名
                </Text>
                <Input
                  w="50%"
                  fontSize="lg"
                  fontWeight="500"
                  color={textColor}
                  defaultValue={userInfo.db.name}
                  onChange={(e) => {
                    setName(e.currentTarget.value);
                  }}
                />
                <Spacer my="1" />
                <Text my="4" fontSize="xl" fontWeight="700" color={textColor}>
                  Email
                </Text>
                <Input
                  w="50%"
                  fontSize="lg"
                  fontWeight="500"
                  color={textColor}
                  defaultValue={userInfo.db.email}
                  disabled
                />
                <Text my="4" fontSize="xl" fontWeight="700" color={textColor}>
                  已綁定帳號
                </Text>
                <Flex
                  w="100%"
                  flexDirection="row"
                  justifyContent="start"
                  alignItems="start"
                  flexWrap="wrap"
                >
                  <ConnectedAccountTags userInfo={userInfo} />
                </Flex>
              </Flex>
              <Avatar name={userInfo.db.name} size="2xl" src={user.picture} />
            </Flex>
            <Text fontSize="2xl" fontWeight="700" color={textColor} mt="5">
              學業
            </Text>
            <Divider mt="1" mb="4" />
            <Flex
              w="100%"
              flexDirection="column"
              justifyContent="start"
              alignItems="start"
              px="4"
            >
              <Text my="4" fontSize="xl" fontWeight="700" color={textColor}>
                主修
              </Text>
              <Flex w="100%" alignItems="center">
                {/* react selector */}
                {major === null ? (
                  <></>
                ) : (
                  <Box w={{ base: "100%", md: "20vw" }} color={textColor}>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={
                        major === ""
                          ? { value: "", label: "請選擇" }
                          : { value: major, label: major }
                      }
                      isSearchable={TextTrackCue}
                      options={deptOptions}
                      onChange={(e) => {
                        setMajor(e.value);
                      }}
                    />
                  </Box>
                )}
              </Flex>
              <Text my="4" fontSize="xl" fontWeight="700" color={textColor}>
                雙主修
              </Text>
              <Flex w="100%" alignItems="center">
                {/* react selector */}
                {doubleMajor === null ? (
                  <></>
                ) : (
                  <Box w={{ base: "100%", md: "20vw" }} color={textColor}>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={
                        doubleMajor === ""
                          ? { value: "", label: " 請選擇 " }
                          : { value: doubleMajor, label: doubleMajor }
                      }
                      isSearchable={TextTrackCue}
                      options={[
                        { value: "", label: " 請選擇 " },
                        ...deptOptions,
                      ]}
                      onChange={(e) => {
                        setDoubleMajor(e.value);
                      }}
                    />
                  </Box>
                )}
              </Flex>
              <Text my="4" fontSize="xl" fontWeight="700" color={textColor}>
                輔系
              </Text>
              <Flex w="100%" alignItems="center">
                {/* react selector */}
                {minor === null ? (
                  <></>
                ) : (
                  <Box w={{ base: "100%", md: "20vw" }} color={textColor}>
                    <Select
                      isMulti
                      w="100%"
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={minor.map((dept) => ({
                        value: dept,
                        label: dept,
                      }))}
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
              <Text fontSize="2xl" fontWeight="700" color={textColor}>
                課程
              </Text>
              <Badge colorScheme="blue" variant="subtle" fontSize="sm" mx="2">
                Coming soon
              </Badge>
            </HStack>
            <Divider mt="1" mb="4" />
            <Button
              colorScheme="teal"
              size="md"
              my="4"
              variant="outline"
              disabled
            >
              匯入修課紀錄
            </Button>
            <Divider mt="1" mb="8" />
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
            bg={dangerZoneColor}
          >
            <Text fontSize="2xl" fontWeight="700" color="red.600" mt="2">
              危險區域
            </Text>
            <Divider mt="1" mb="4" />
            <Flex
              flexDirection="column"
              justifyContent="start"
              alignItems="start"
              p="2"
            >
              <HStack spacing={4} justify="start">
                <Button
                  colorScheme="red"
                  variant="outline"
                  color="red.500"
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
              <HStack spacing={8} justify="start">
                <Button
                  colorScheme="red"
                  variant="outline"
                  color="red.500"
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
              <DeleteDialog
                isAlertOpen={isAlertOpen}
                setIsAlertOpen={setIsAlertOpen}
                deleteMode={deleteMode}
                setDeleteMode={setDeleteMode}
              />
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired();