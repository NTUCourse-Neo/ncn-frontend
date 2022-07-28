import { React } from "react";
import {
  Avatar,
  Box,
  Divider,
  Flex,
  HStack,
  Spacer,
  Text,
  VStack,
  Icon,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import Head from "next/head";
import { reportEvent } from "utils/ga";

const teams = [
  {
    name: "張博皓",
    img: "/img/team_avatar/jc-hiroto.png",
    dept: "工科海洋系 B07",
    quote: "WP 讚啦",
    github: "jc-hiroto",
    desc: "",
  },
  {
    name: "許書維",
    img: "/img/team_avatar/swh00tw.png",
    dept: "電機系 B07",
    quote: "WP 讚啦",
    github: "swh00tw",
    desc: "",
  },
  {
    name: "謝維勝",
    img: "/img/team_avatar/wil0408.png",
    dept: "電機系 B07",
    quote: "WP 讚啦",
    github: "Wil0408",
    desc: "",
  },
];

function TeamMemberCard({ person }) {
  return (
    <Box
      w="400"
      p="8"
      bg={useColorModeValue("white", "gray.800")}
      boxShadow="xl"
      borderRadius="xl"
    >
      <VStack spacing="4">
        <HStack align="center" justify="center" spacing="4">
          <Avatar src={person.img} name={person.name} size="2xl" />
          <VStack spacing="2" alignItems="start">
            <Spacer />
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color={useColorModeValue("heading.light", "heading.dark")}
            >
              {person.name}
            </Text>
            <Text
              fontSize="md"
              fontWeight="500"
              color={useColorModeValue("text.light", "text.dark")}
            >
              {person.dept}
            </Text>
            <Button
              size="sm"
              alignItems="center"
              justifyContent="center"
              spacing="2"
              borderRadius="md"
              borderWidth="2px"
              px="3"
              onClick={() => {
                window.open(
                  `https://www.github.com/${person.github}`,
                  "_blank"
                );
                reportEvent("about", "click", "github_" + person.github);
              }}
            >
              <Icon
                as={FaGithub}
                size="2em"
                color={useColorModeValue("gray.500", "gray.300")}
                mr="3"
              />
              <Text
                fontSize="md"
                fontWeight="500"
                color={useColorModeValue("gray.500", "gray.300")}
              >
                {person.github}
              </Text>
            </Button>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
}

function AboutPage() {
  return (
    <>
      <Head>
        <title>{`關於 | NTUCourse Neo`}</title>
        <meta
          name="description"
          content="`關於 Neo | NTUCourse Neo，全新的臺大選課網站。`"
        />
      </Head>
      <Flex
        direction="column"
        alignItems="center"
        minH="100vh"
        px={["10", "20", "100", "200"]}
        pt="100px"
        bg={useColorModeValue("white", "black")}
      >
        <Text
          fontSize={["3xl", "4xl", "5xl"]}
          fontWeight="800"
          color={useColorModeValue("heading.light", "heading.dark")}
        >
          關於
        </Text>
        <Divider />
        <Flex
          direction="column"
          alignItems="start"
          px={["4", "8", "32"]}
          py="16"
          color={useColorModeValue("text.light", "text.dark")}
        >
          <Text fontSize={["lg", "xl", "2xl"]} fontWeight="400" mb="4">
            NTUCourse Neo
            是一個專屬於台大學生的選課工具，您是否曾經覺得台大課程網搜尋課程篩選不好用，或是介面不夠精簡令人眼花撩亂，抑或是加入課表時瘋狂彈出的視窗很煩呢？
          </Text>
          <Text fontSize={["lg", "xl", "2xl"]} fontWeight="400" mb="4">
            We are here to help!
            我們提供多樣篩選條件，讓用戶可以更快速的找到想要的課程，也提供了互動式課表，讓同學們安排下學期的課程時不用再狂切視窗了！
            🥴
            除此之外，還能更方便的排序選課優先順序、一鍵匯入台大課程網，大幅減少同學們花費在找課選課排志願序的時間！
          </Text>
          <Text fontSize={["lg", "xl", "2xl"]} fontWeight="400">
            希望 NTUCourse Neo 可以讓你我的選課都更加直覺，好用。
          </Text>
        </Flex>
        <Text
          fontSize={["3xl", "4xl", "5xl"]}
          fontWeight="800"
          color={useColorModeValue("heading.light", "heading.dark")}
        >
          團隊
        </Text>
        <Divider />
        <HStack
          justifyContent="center"
          px={["4", "8", "16"]}
          wrap="wrap"
          css={{ gap: "2rem" }}
          py="16"
        >
          {teams.map((member) => (
            <TeamMemberCard key={member.github} person={member} />
          ))}
        </HStack>
      </Flex>
    </>
  );
}

export default AboutPage;
