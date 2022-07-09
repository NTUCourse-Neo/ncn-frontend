import {
  Flex,
  Text,
  HStack,
  Button,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
  Badge,
  Textarea,
  Input,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { social_user_type_map } from "data/mapping_table";
import handleFetch from "utils/CustomFetch";
import { useRouter } from "next/router";

function SignUpReportForm({ courseId, haveSubmitted, submitCallback }) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const router = useRouter();
  const toast = useToast();
  const [sendingForm, setSendingForm] = useState(false);
  const [signUpCardForm, setSignUpCardForm] = useState({
    user_type: "",
    amount: "",
    when: "",
    rule: "",
    comment: "",
  });

  const handleSubmitSignUpCardForm = async () => {
    // check all fields first
    for (const key in signUpCardForm) {
      // check negative amount
      if (key === "amount") {
        const amount = parseInt(signUpCardForm[key]);
        if (amount < 0) {
          toast({
            title: "加簽人數請填入大於0的數字",
            description: "",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
      }
      // each field should not be empty except comment
      if (key !== "comment") {
        if (signUpCardForm[key] === "") {
          toast({
            title: "請填寫所有欄位",
            description: "",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
      }
    }
    // send to server
    try {
      const post = {
        type: "sign_up_info",
        content: {
          amount: signUpCardForm.amount,
          when: signUpCardForm.when,
          rule: signUpCardForm.rule,
          comment: signUpCardForm.comment,
        },
        user_type: signUpCardForm.user_type,
      };
      await handleFetch("/api/social/createPost", { courseId, post });
      toast({
        title: "發送成功",
        description: "感謝您的填寫！",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: "發送失敗，請稍後再試",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      if (e?.response?.data?.msg === "access_token_expired") {
        router.push("/api/auth/login");
      }
    }
    return true;
  };

  return (
    <Popover
      placement="bottom"
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Button
          colorScheme="blue"
          variant="solid"
          size="md"
          isDisabled={haveSubmitted}
        >
          {haveSubmitted ? "已提供過" : "提供資訊"}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <Flex p="4" flexDirection="column" alignItems="start">
          <Text
            mb="2"
            fontSize="md"
            fontWeight="800"
            color="gray.700"
            textAlign="center"
          >
            提供加簽相關資訊
          </Text>
          <HStack pb={1}>
            <Text
              fontSize="sm"
              fontWeight="800"
              color="gray.700"
              textAlign="center"
            >
              我是...
            </Text>
            <Badge colorScheme={"blue"}>必填</Badge>
          </HStack>
          <Select
            mb="2"
            placeholder="請選擇身份"
            onChange={(e) => {
              setSignUpCardForm({
                ...signUpCardForm,
                user_type: e.currentTarget.value,
              });
            }}
          >
            {Object.keys(social_user_type_map).map((key) => {
              return (
                <option value={key} key={key}>
                  {social_user_type_map[key]}
                </option>
              );
            })}
          </Select>
          <HStack pb={1}>
            <Text
              fontSize="sm"
              fontWeight="800"
              color="gray.700"
              textAlign="center"
            >
              加簽人數
            </Text>
            <Badge colorScheme={"blue"}>必填</Badge>
          </HStack>
          <Input
            mb="2"
            type="number"
            placeholder="限填數字。若不確定，請於下方補充"
            onChange={(e) => {
              setSignUpCardForm({
                ...signUpCardForm,
                amount: e.currentTarget.value,
              });
            }}
          />
          <HStack pb={1}>
            <Text
              fontSize="sm"
              fontWeight="800"
              color="gray.700"
              textAlign="center"
            >
              加簽時間
            </Text>
            <Badge colorScheme={"blue"}>必填</Badge>
          </HStack>
          <Input
            mb="2"
            type="text"
            placeholder="第一週上課、2/15 等..."
            onChange={(e) => {
              setSignUpCardForm({
                ...signUpCardForm,
                when: e.currentTarget.value,
              });
            }}
          />
          <HStack pb={1}>
            <Text
              fontSize="sm"
              fontWeight="800"
              color="gray.700"
              textAlign="center"
            >
              加簽方式
            </Text>
            <Badge colorScheme={"blue"}>必填</Badge>
          </HStack>
          <Input
            mb="2"
            type="text"
            placeholder="抽學生證、填表單、網路抽選 等..."
            onChange={(e) => {
              setSignUpCardForm({
                ...signUpCardForm,
                rule: e.currentTarget.value,
              });
            }}
          />
          <Text
            fontSize="sm"
            fontWeight="800"
            color="gray.700"
            textAlign="center"
          >
            更多資訊
          </Text>
          <Textarea
            mb="2"
            size="md"
            placeholder="輸入補充資訊"
            onChange={(e) => {
              setSignUpCardForm({
                ...signUpCardForm,
                comment: e.currentTarget.value,
              });
            }}
          />
          <ButtonGroup w="100%" size="sm" d="flex" justifyContent="end">
            <Button
              colorScheme="blue"
              isLoading={sendingForm}
              isDisabled={
                signUpCardForm.amount === "" ||
                signUpCardForm.user_type === "" ||
                signUpCardForm.when === "" ||
                signUpCardForm.rule === ""
              }
              onClick={async () => {
                setSendingForm(true);
                const res = await handleSubmitSignUpCardForm();
                setSendingForm(false);
                if (res === true) {
                  onClose();
                  await submitCallback();
                }
              }}
            >
              送出
            </Button>
          </ButtonGroup>
        </Flex>
      </PopoverContent>
    </Popover>
  );
}

export default SignUpReportForm;
