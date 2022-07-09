import {
  Flex,
  Spacer,
  Text,
  Button,
  ButtonGroup,
  Image,
  HStack,
  Icon,
  Center,
} from "@chakra-ui/react";
import { FaCodeBranch, FaGithub, FaHeartbeat } from "react-icons/fa";
import Link from "next/link";
import { DiscordIcon } from "components/CustomIcons";

function Footer() {
  const ver = "beta (20220619)";
  const handleOpenPage = (page) => {
    window.open(page, "_blank");
  };
  return (
    <Flex
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="space-between"
      alignItems="center"
      px="4"
      py={{ base: 2, md: 4 }}
      borderTop="1px solid"
      borderColor="gray.200"
      zIndex="9999"
      css={{ gap: "10px" }}
    >
      <Link href="/">
        <Center w="30px" h="30px">
          <Image
            src={`/img/ncn_logo.png`}
            alt="ncnLogo"
            boxSize="6"
            display={{ base: "inline-block", md: "none" }}
            htmlHeight="20px"
            htmlWidth="20px"
          />
        </Center>
      </Link>
      <Text
        size="sm"
        color="gray.500"
        ml="2"
        fontWeight="800"
        display={{ base: "none", md: "inline-block" }}
      >
        NTUCourse Neo
      </Text>
      <HStack ml="2">
        <Icon as={FaCodeBranch} color="gray.300" size="4"></Icon>
        <Text fontSize="xs" color="gray.300" fontWeight="600">
          {ver}
        </Text>
      </HStack>
      <Spacer />
      <Text
        fontSize="sm"
        color="gray.300"
        display={{ base: "none", lg: "inline-block" }}
      >
        Made with 💖 by{" "}
      </Text>
      <ButtonGroup spacing="2" display={{ base: "none", lg: "inline-block" }}>
        <Button
          size="xs"
          leftIcon={<FaGithub />}
          color="gray.300"
          variant="ghost"
          onClick={() => handleOpenPage("https://github.com/jc-hiroto")}
        >
          jc-hiroto
        </Button>
        <Button
          size="xs"
          leftIcon={<FaGithub />}
          color="gray.300"
          variant="ghost"
          onClick={() => handleOpenPage("https://github.com/swh00tw")}
        >
          swh00tw
        </Button>
        <Button
          size="xs"
          leftIcon={<FaGithub />}
          color="gray.300"
          variant="ghost"
          onClick={() => handleOpenPage("https://github.com/Wil0408")}
        >
          Wil0408
        </Button>
      </ButtonGroup>
      <Spacer display={{ base: "none", lg: "inline-block" }} />
      <ButtonGroup spacing="2" h="100%">
        <Button
          size={{ base: "md", md: "xs" }}
          variant="ghost"
          color="gray.400"
          px="1"
          justifyContent={"center"}
          alignItems={"center"}
          onClick={() => handleOpenPage("https://status.course.myntu.me/")}
        >
          <Center
            w={{ base: "25px", md: "20px" }}
            h={{ base: "25px", md: "20px" }}
          >
            <FaHeartbeat size="20" />
          </Center>
          <Text
            display={{ base: "none", md: "inline-block" }}
            fontSize={{ base: "sm", md: "xs" }}
            pl={2}
            py={2}
          >
            服務狀態
          </Text>
        </Button>
        <Button
          size={{ base: "md", md: "xs" }}
          variant="ghost"
          color="gray.400"
          px="1"
          justifyContent={"center"}
          alignItems={"center"}
          onClick={() => handleOpenPage("https://discord.gg/M7NrenYEbS")}
        >
          <Center
            w={{ base: "25px", md: "20px" }}
            h={{ base: "25px", md: "20px" }}
          >
            <DiscordIcon boxSize={5} />
          </Center>
          <Text
            display={{ base: "none", md: "inline-block" }}
            fontSize={{ base: "sm", md: "xs" }}
            pl={2}
            py={2}
          >
            Discord
          </Text>
        </Button>
        <Button
          size={{ base: "md", md: "xs" }}
          variant="ghost"
          color="gray.400"
          px="1"
          justifyContent={"center"}
          alignItems={"center"}
          onClick={() => handleOpenPage("https://github.com/NTUCourse-Neo")}
        >
          <Center
            w={{ base: "25px", md: "20px" }}
            h={{ base: "25px", md: "20px" }}
          >
            <FaGithub size="20" />
          </Center>
          <Text
            display={{ base: "none", md: "inline-block" }}
            fontSize={{ base: "sm", md: "xs" }}
            pl={2}
            py={2}
          >
            Github
          </Text>
        </Button>
      </ButtonGroup>
    </Flex>
  );
}
export default Footer;
