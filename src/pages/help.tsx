import Head from "next/head";
import {
  Box,
  Flex,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Td as ChakraTd,
  Tr,
  Th as ChakraTh,
  TableColumnHeaderProps,
  TableCellProps,
  Text,
} from "@chakra-ui/react";
import CustomBreadcrumb from "@/components/Breadcrumb";
import { customScrollBarCss } from "@/styles/customScrollBar";
import React, { useState } from "react";

const tabs = [
  {
    id: "tutorial",
    text: "使用教學",
  },
  {
    id: "FAQ",
    text: "FAQs",
  },
  {
    id: "contact",
    text: "聯絡我們",
  },
] as const;
type TabId = typeof tabs[number]["id"];

function ELink({
  children,
  href,
}: {
  readonly children: React.ReactNode;
  readonly href: string;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <Text
        sx={{
          color: "primary.500",
          textDecoration: "underline",
          display: "inline",
          mx: 1,
        }}
      >
        {children}
      </Text>
    </a>
  );
}

interface ThProps extends TableColumnHeaderProps {
  readonly children: React.ReactNode;
}
const Th: React.FC<ThProps> = ({ children, ...rest }) => {
  return (
    <ChakraTh
      sx={{
        border: "1px solid #CCCCCC",
        lineHeight: 1.4,
        color: "#2d2d2d",
        fontWeight: 400,
        fontSize: "14px",
        textAlign: "center",
        bg: "#ececec",
      }}
      {...rest}
    >
      {children}
    </ChakraTh>
  );
};

interface TdProps extends TableCellProps {
  readonly children: React.ReactNode;
  readonly alignStart?: boolean;
}
const Td: React.FC<TdProps> = ({ children, alignStart, ...rest }) => {
  return (
    <ChakraTd
      px={10}
      sx={{
        border: "1px solid #CCCCCC",
        textAlign: alignStart ? "start" : "center",
        lineHeight: 1.4,
        color: "#2d2d2d",
        fontWeight: 400,
        fontSize: "14px",
      }}
      {...rest}
    >
      {children}
    </ChakraTd>
  );
};

function ContactTab() {
  const rows = [
    {
      questionType: "課程查詢相關疑義",
      office: "教務處 課務組",
      contactInfo: (
        <Flex>
          曾俊綺{" "}
          <ELink href="mailto:tsengchi@ntu.edu.tw">tsengchi@ntu.edu.tw</ELink>
        </Flex>
      ),
    },
    {
      questionType: "課程大綱建置相關問題",
      office: "教務處 課務組",
      contactInfo: (
        <Flex>
          曾俊綺{" "}
          <ELink href="mailto:tsengchi@ntu.edu.tw">tsengchi@ntu.edu.tw</ELink>
        </Flex>
      ),
    },
    {
      questionType: "帳號相關問題",
      office: "計中 帳號室",
      contactInfo: "Tel: 02-3366-5023、 02-3366-5022",
    },
    {
      questionType: "系統及其它相關問題",
      office: "教務處 資訊組",
      contactInfo: (
        <Flex>
          陳建吉{" "}
          <ELink href="mailto:ajaxchen@ntu.edu.tw">ajaxchen@ntu.edu.tw</ELink>
        </Flex>
      ),
    },
  ];
  return (
    <TableContainer w="70%" border="1px solid #2D2D2D">
      <Table>
        <Thead>
          <Tr>
            <Th w="40%">問題類別</Th>
            <Th w="20%">負責單位</Th>
            <Th w="40%">負責人及聯絡資訊</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row) => (
            <Tr>
              <Td alignStart>{row.questionType}</Td>
              <Td>{row.office}</Td>
              <Td alignStart>{row.contactInfo}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

function TutorialTab() {}

export default function HelpCenterPage() {
  const [tab, setTab] = useState<TabId>("tutorial");

  const tabContent: Record<TabId, React.ReactNode> = {
    tutorial: <></>,
    FAQ: <></>,
    contact: <ContactTab />,
  };

  return (
    <>
      <Head>
        <title>首頁 | NTUCourse Neo</title>
        <meta
          name="description"
          content="課程相關說明文件 | NTUCourse Neo，全新的臺大選課網站。"
        />
      </Head>
      <Flex
        maxH="92vh"
        w="100vw"
        justifyContent={"center"}
        alignItems="center"
        py={6}
      >
        <Flex flexDirection={"column"} w="80%">
          <CustomBreadcrumb
            pageItems={[
              {
                text: "首頁",
                href: "/",
              },
              {
                text: "幫助中心",
                href: "/help",
              },
            ]}
          />
          <Flex
            w="100%"
            my={6}
            sx={{
              fontSize: "24px",
              lineHeight: "1.4",
            }}
          >
            幫助中心
          </Flex>
          <Box
            w="100%"
            sx={{
              shadow: "0px 3px 8px rgba(75, 75, 75, 0.08)",
              borderRadius: "4px",
              border: "1px solid rgba(204, 204, 204, 0.4)",
              bg: "white",
            }}
          >
            <Flex
              w="100%"
              bg="#002F94"
              color="white"
              px="6"
              pt={1}
              pb={2}
              sx={{
                fontSize: "14px",
                lineHeight: "1.4",
                borderRadius: "4px 4px 0 0",
              }}
              justifyContent="center"
              gap={16}
            >
              {tabs.map((tabItem) => (
                <Flex
                  key={tabItem.id}
                  py={3}
                  onClick={() => {
                    setTab(tabItem.id);
                  }}
                  color={tab === tabItem.id ? "white" : "#ffffff50"}
                  cursor="pointer"
                  transition={"0.3s ease-in-out"}
                  borderBottom={
                    tab === tabItem.id
                      ? "1.5px solid #FFFFFF"
                      : "1.5px solid transparent"
                  }
                  sx={{
                    fontWeight: 500,
                    fontSize: "16px",
                    lineHeight: "1.4",
                  }}
                >
                  {tabItem.text}
                </Flex>
              ))}
            </Flex>
            <Flex
              flexDirection={"column"}
              h="65vh"
              w="100%"
              overflowY={"auto"}
              sx={{
                ...customScrollBarCss,
              }}
              justifyContent="center"
              alignItems={"center"}
            >
              {tabContent[tab]}
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
