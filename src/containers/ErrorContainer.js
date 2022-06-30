import { Flex, Image, Text, Button, HStack } from "@chakra-ui/react";
import { FaHeartbeat, FaCheckCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import sendLogs from "utils/sendLogs";
import { BounceLoader } from "react-spinners";
import { v4 as uuidv4 } from "uuid";
import setPageMeta from "utils/seo";

function ErrorContainer({ code }) {
  const error_page_states = useLocation().state;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleOpenPage = (page) => {
    window.open(page, "_blank");
  };
  const error_img_src = `https://http.cat/${code}`;
  // can random pick one msg from the list, welcome to add more msgs
  const error_msgs = [`太無情了你真的太無情了`, `出事了阿北`, `==?`, `哭啊`];
  const error_message = error_msgs[Math.floor(Math.random() * error_msgs.length)];
  const [isReportingError, setIsReportingError] = useState(false);
  const { loading, user, isAuthenticated } = useAuth0();
  const uuid = uuidv4(); // eslint-disable-line no-unused-vars

  useEffect(() => {
    async function redirect_and_send_logs() {
      if (!error_page_states) {
        navigate(`/`);
      } else if ((!loading && user) || !isAuthenticated) {
        setIsReportingError(true);
        const error_obj = {
          uuid: uuid,
          component: "ncn-frontend",
          log: "```" + JSON.stringify(error_page_states, null, " ") + "```",
          code: code,
          user_id: isAuthenticated ? user.sub : "guest",
          agent: navigator.userAgent,
        };
        await sendLogs("error", error_obj);
        setIsReportingError(false);
      }
    }
    redirect_and_send_logs();
    setPageMeta({ title: `${code} 錯誤 | NTUCourse Neo`, desc: `${code} 錯誤頁面 | NTUCourse Neo，全新的臺大選課網站。` });
  }, [user, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyItems="center"
      maxW={{ base: "100vw", md: "80vw", lg: "70vw" }}
      mx="auto"
      overflow="visible"
      p="64px"
      h="95vh"
    >
      <Image mt="5vh" src={error_img_src} w="auto" h="80%" />
      <a href="https://youtu.be/yKrR5IHwT0k" target="_blank" rel="noreferrer noopener">
        <Text fontSize="4xl" color="gray.500" mt="2vh">
          {error_message}
        </Text>
      </a>
      <HStack spacing={2} mt="4">
        <Button variant="solid" onClick={() => handleOpenPage("https://www.surveycake.com/s/LzWd6")}>
          點我回報問題 🥺
        </Button>
        <Button variant="solid" colorScheme="teal" leftIcon={<FaHeartbeat />} onClick={() => handleOpenPage("https://status.course.myntu.me/")}>
          服務狀態
        </Button>
      </HStack>
      <HStack spacing={2} mt="4">
        {isReportingError || loading ? <BounceLoader size="20px" color="teal" /> : <FaCheckCircle color="teal" />}
        <Text fontSize="lg" color="gray.500" mt="2vh" fontWeight="800">
          {isReportingError || loading ? "正在回報錯誤" : "已回報錯誤"}
        </Text>
      </HStack>
      {uuid === "" || isReportingError || loading ? (
        <></>
      ) : (
        <Text fontSize="sm" color="gray.500" mt="1vh" fontWeight="500">
          {"Tracking ID: " + uuid}
        </Text>
      )}
    </Flex>
  );
}

export default ErrorContainer;
