import {
  Flex,
  Spacer,
  Text,
  Button,
  ButtonGroup,
  HStack,
  Icon,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaCodeBranch, FaGithub, FaHeartbeat } from "react-icons/fa";
import Link from "next/link";
import { DiscordIcon } from "components/CustomIcons";
import Image from "next/image";

function Footer() {
  const ver = "beta (20220721)";
  const secondaryColor = useColorModeValue("gray.400", "gray.500");
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
      borderColor={useColorModeValue("gray.200", "gray.700")}
      zIndex="9999"
      css={{ gap: "10px" }}
      bg={useColorModeValue("white", "black")}
    >
      <Link href="/">
        <Center w="30px" h="30px">
          <Image
            src={`/img/ncn_logo.png`}
            alt="ncnLogo"
            display={{ base: "inline-block", md: "none" }}
            height="30px"
            width="30px"
            layout="fixed"
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
        <Icon as={FaCodeBranch} color={secondaryColor} size="4"></Icon>
        <Text fontSize="xs" color={secondaryColor} fontWeight="600">
          {ver}
        </Text>
      </HStack>
      <Spacer display={{ base: "none", lg: "inline-block" }} />
      <ButtonGroup spacing="2" h="100%">
        <Button
          size={{ base: "sm", md: "xs" }}
          variant="ghost"
          color={secondaryColor}
          px="1"
          justifyContent={"center"}
          alignItems={"center"}
          onClick={() => handleOpenPage("https://status.course.myntu.me/")}
        >
          <Center
            w={{ base: "20px", md: "20px" }}
            h={{ base: "20px", md: "20px" }}
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
          size={{ base: "sm", md: "xs" }}
          variant="ghost"
          color={secondaryColor}
          px="1"
          justifyContent={"center"}
          alignItems={"center"}
          onClick={() => handleOpenPage("https://discord.gg/M7NrenYEbS")}
        >
          <Center
            w={{ base: "15px", md: "20px" }}
            h={{ base: "15px", md: "20px" }}
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
          size={{ base: "sm", md: "xs" }}
          variant="ghost"
          color={secondaryColor}
          px="1"
          justifyContent={"center"}
          alignItems={"center"}
          onClick={() => handleOpenPage("https://github.com/NTUCourse-Neo")}
        >
          <Center
            w={{ base: "20px", md: "20px" }}
            h={{ base: "20px", md: "20px" }}
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
