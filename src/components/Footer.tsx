import { Flex, Text, Heading } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import openPage from "@/utils/openPage";

function Footer() {
  return (
    <Flex w="100%" flexDirection={"column"}>
      <Flex
        w="100%"
        h="115px"
        bg={"#ececec"}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        sx={{
          p: "32px 144px",
        }}
      >
        <Flex justifyContent="flex-start" alignItems="center" flex={1}>
          <Link href="/" passHref>
            <Flex alignItems="center" flexDirection="row" cursor="pointer">
              <Image
                src={`/img/ncn_logo.png`}
                alt="ncnLogo"
                width="25"
                height="25"
                layout="fixed"
              />
              <Heading
                ml="2"
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="700"
                color={"heading.light"}
                display={{ base: "none", md: "inline-block" }}
              >
                NTUCourse Neo
              </Heading>
            </Flex>
          </Link>
        </Flex>
        <Flex
          sx={{
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "1.4",
            color: "#484848",
          }}
        >
          <Text
            onClick={() => {
              openPage("https://www.ntu.edu.tw");
            }}
            cursor="pointer"
          >
            國立臺灣大學首頁
          </Text>
          <Text mx={4}>|</Text>
          <Text
            onClick={() => {
              openPage("https://www.aca.ntu.edu.tw/w/aca/index");
            }}
            cursor="pointer"
          >
            教務處首頁
          </Text>
        </Flex>
      </Flex>
      <Flex
        bg="white"
        sx={{
          p: "24px 16px",
          h: "68px",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "14px",
          lineHeight: "1.4",
          color: "#484848",
        }}
      >
        Copyright © 2022 國立臺灣大學教務處 Office of Academic Affairs, National
        Taiwan University
      </Flex>
    </Flex>
  );
}
export default Footer;
