import { React, useEffect } from "react";
import { Avatar, Box, Divider, Flex, HStack, Spacer, Text, VStack, Image, Icon, Button, Tooltip } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { SiNotion, SiDiscord } from "react-icons/si";
import { GiLiver } from "react-icons/gi";
import jchiroto from "img/team_avatar/jc-hiroto.png";
import swh00tw from "img/team_avatar/swh00tw.png";
import wil0408 from "img/team_avatar/wil0408.png";
import setPageMeta from "utils/seo";

const teams = [
  {
    name: "張博皓",
    img: jchiroto,
    dept: "工科海洋系 B07",
    quote: "WP 讚啦",
    github: "jc-hiroto",
    desc: "",
  },
  {
    name: "許書維",
    img: swh00tw,
    dept: "電機系 B07",
    quote: "WP 讚啦",
    github: "swh00tw",
    desc: "",
  },
  {
    name: "謝維勝",
    img: wil0408,
    dept: "電機系 B07",
    quote: "WP 讚啦",
    github: "Wil0408",
    desc: "",
  },
];

function TeamMemberCard({ person }) {
  return (
    <Box w="400" p="8" bg="white" boxShadow="xl" borderRadius="xl">
      <VStack spacing="4">
        <HStack align="center" justify="center" spacing="4">
          <Avatar src={person.img} name={person.name} size="2xl" />
          <VStack spacing="2" alignItems="start">
            <Spacer />
            <Text fontSize="3xl" fontWeight="bold" color="gray.700">
              {person.name}
            </Text>
            <Text fontSize="md" fontWeight="500" color="gray.500">
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
              onClick={() => window.open(`https://www.github.com/${person.github}`, "_blank")}
            >
              <Icon as={FaGithub} size="2em" color="gray.500" mr="3" />
              <Text fontSize="md" fontWeight="500" color="gray.500">
                {person.github}
              </Text>
            </Button>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
}

function InfoPageContainer() {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta({ title: `關於 | NTUCourse Neo`, desc: `關於頁面 | NTUCourse Neo，全新的臺大選課網站。` });
  }, []);

  return (
    <>
      <Flex direction="column" alignItems="center" px={["10", "20", "100", "200"]} pt="100px">
        <Text fontSize={["3xl", "4xl", "5xl"]} fontWeight="800" color="gray.700">
          關於
        </Text>
        <Divider />
        <Flex direction="column" alignItems="start" px={["4", "8", "32"]} py="16">
          <Text fontSize={["lg", "xl", "2xl"]} fontWeight="400" color="gray.500" mb="4">
            NTUCourse Neo
            是一個專屬於台大學生的選課工具，您是否曾經覺得台大課程網搜尋課程篩選不好用，或是介面不夠精簡令人眼花撩亂，抑或是加入課表時瘋狂彈出的視窗很煩呢？
          </Text>
          <Text fontSize={["lg", "xl", "2xl"]} fontWeight="400" color="gray.500" mb="4">
            We are here to help!
            我們提供多樣篩選條件，讓用戶可以更快速的找到想要的課程，也提供了互動式課表，讓同學們安排下學期的課程時不用再狂切視窗了！ 🥴
            除此之外，還能更方便的排序選課優先順序、一鍵匯入台大課程網，大幅減少同學們花費在找課選課排志願序的時間！
          </Text>
          <Text fontSize={["lg", "xl", "2xl"]} fontWeight="400" color="gray.500">
            希望 NTUCourse Neo 可以讓你我的選課都更加直覺，好用。
          </Text>
        </Flex>
        <Text fontSize={["3xl", "4xl", "5xl"]} fontWeight="800" color="gray.700">
          團隊
        </Text>
        <Divider />
        <HStack justifyContent="center" px={["4", "8", "16"]} wrap="wrap" css={{ gap: "2rem" }} py="16">
          {teams.map((member) => (
            <TeamMemberCard key={member.github} person={member} />
          ))}
        </HStack>
        <Text fontSize={["3xl", "4xl", "5xl"]} fontWeight="800" color="gray.700">
          簡報影片
        </Text>
        <Divider />
        <Flex direction="column" alignItems="center" py="16">
          <iframe
            width="320"
            src="https://www.youtube.com/embed/r98m09bb4pU"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </Flex>
        <Text fontSize={["3xl", "4xl", "5xl"]} fontWeight="800" color="gray.700">
          Powered by...
        </Text>
        <Divider />
        <Flex alignItems="center" justifyContent="center" p="16" spacing="8" wrap="wrap" w="90vw" css={{ gap: "2em" }}>
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Microsoft_Azure_Logo.svg/1200px-Microsoft_Azure_Logo.svg.png"
            height="50px"
          />
          <Image src="https://res.cloudinary.com/citiar/image/upload/v1611373461/ucamc/common/react_icon.png" height="50px" />
          <Image src="https://cg2010studio.files.wordpress.com/2016/07/nodejs.png?w=584" height="50px" />
          <Image src="https://upload.wikimedia.org/wikipedia/commons/0/00/Mongodb.png" height="50px" />
          <Image src="https://www.drupal.org/files/project-images/brand%20evolution_logo_Auth0_black.png" height="50px" />
          <Image src="https://brands.home-assistant.io/_/sendgrid/logo.png" height="50px" />
          <Image src="https://segmentfault.com/img/bVtSeK" height="50px" />
          <Image src="https://miro.medium.com/max/1200/0*4L-GqAxAp7KsObMj.png" height="50px" />
          <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/RecaptchaLogo.svg/1200px-RecaptchaLogo.svg.png" height="50px" />
        </Flex>
        <HStack spacing={4} mb="4" wrap="wrap">
          <Text fontSize="2xl" fontWeight="500" color="gray.700">
            with the help of...
          </Text>
          <Icon as={FaGithub} w="8" h="8" color="gray.700" />
          <Icon as={SiDiscord} w="8" h="8" color="gray.700" />
          <Icon as={SiNotion} w="8" h="8" color="gray.700" />
          <Text fontSize="2xl" fontWeight="500" color="gray.700">
            + our 🔥 and 💖 !{" "}
          </Text>
        </HStack>
        <HStack spacing={2} mb="4">
          <Text fontSize="2xl" fontWeight="500" color="gray.700">
            ... and don't forget our
          </Text>
          <Tooltip hasArrow placement="top" label="肝 ㄍㄢ Liver" bg="gray.600" color="white">
            <span>
              <Icon as={GiLiver} w="8" h="8" color="red.500" pt="2" />
            </span>
          </Tooltip>
        </HStack>
      </Flex>
    </>
  );
}

export default InfoPageContainer;
