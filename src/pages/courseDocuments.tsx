import Head from "next/head";
import { Box, Flex } from "@chakra-ui/react";
import CustomBreadcrumb from "@/components/Breadcrumb";
import { format } from "date-fns";
import openPage from "@/utils/openPage";
import { customScrollBarCss } from "@/styles/customScrollBar";

const documents: {
  title: string;
  href: string;
  date?: Date | number | null;
}[] = [
  {
    href: "https://aca.ntu.edu.tw/WebUPD/aca/UAADForms/selcou.pdf",
    title: "選課及註冊說明.pdf",
    date: new Date("2022-01-03"),
  },
  {
    href: "https://nol.ntu.edu.tw/nol/coursesearch/classtime.htm",
    title: "課程節次代號說明.pdf",
  },
  {
    href: "https://www.aca.ntu.edu.tw/WebUPD/aca/UAADForms/110-2CREDIT.pdf",
    title: "{{110-2}} 修課學分數上下限規定.pdf",
    date: new Date("2022-01-03"),
  },
  {
    href: "https://nol.ntu.edu.tw/nol/note/110-2/casge.pdf",
    title: "採計為通識學分之專業基礎科目.pdf",
    date: new Date("2021-01-08"),
  },
  {
    href: "https://nol.ntu.edu.tw/nol/guest/HisCourseNote.pdf",
    title: "查詢歷年課程之操作說明.pdf",
  },
  {
    href: "https://nol2.aca.ntu.edu.tw/nol/guest/%E8%AA%B2%E7%A8%8B%E7%B7%A8%E7%A2%BC%E8%AA%AA%E6%98%8E.pdf",
    title: "本校課程編碼及科目名稱說明.pdf",
  },
  {
    href: "https://nol2.aca.ntu.edu.tw/nol/guest/%E9%96%8B%E8%AA%B2%E5%96%AE%E4%BD%8D%E8%88%87%E8%8B%B1%E6%96%87%E8%AA%B2%E8%99%9F%E7%B8%AE%E5%AF%AB%E5%B0%8D%E7%85%A7%E8%A1%A8.pdf",
    title: "開課單位與英文課號縮寫對照表.pdf",
  },
  {
    href: "http://ftp.ntu.edu.tw/NTU/course/course.htm",
    title: " {{110}} 學年下學期課程 Excel 檔下載.pdf",
  },
  {
    href: "https://nol.ntu.edu.tw/nol/cur/16.htm",
    title: "校際選課辦法.pdf",
    date: new Date("2019-07-24"),
  },
  {
    href: "https://www.aca.ntu.edu.tw/WebUPD/aca/UAADForms/%E7%A0%94%E7%A9%B6%E7%94%9F%E6%A0%A1%E9%9A%9B%E9%81%B8%E8%AA%B2%E7%B0%BD%E7%B4%84%E6%A0%A1%E7%B3%BB%E4%B8%80%E8%A6%BD%E8%A1%A8.pdf",
    title: "碩博士班校際選課系所一覽表.pdf",
    date: new Date("2022-01-04"),
  },
  {
    href: "https://www.aca.ntu.edu.tw/WebUPD/aca/UAADForms/%E5%AD%B8%E5%A3%AB%E7%8F%AD%E6%A0%A1%E9%9A%9B%E9%81%B8%E8%AA%B2%E7%B0%BD%E7%B4%84%E6%A0%A1%E7%B3%BB%E4%B8%80%E8%A6%BD%E8%A1%A8.pdf",
    title: "學士班校際選課系所一覽表.pdf",
    date: new Date("2021-08-02"),
  },
];

function DocumentRow({
  updateDate,
  documentName,
  documentLink,
}: {
  updateDate?: Date | number | null;
  documentName: string;
  documentLink: string;
}) {
  const date = !updateDate ? "N/A" : format(updateDate, "yyyy/MM/dd");
  return (
    <Flex
      w="100%"
      px="6"
      py="3"
      sx={{
        fontSize: "14px",
        lineHeight: "1.4",
        shadow: "0px 1px 3px rgba(144, 144, 144, 0.2)",
      }}
    >
      <Flex w="15%">{date}</Flex>
      <Flex
        onClick={() => {
          openPage(documentLink);
        }}
        sx={{
          color: "#4681FF",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        {documentName}
      </Flex>
    </Flex>
  );
}

export default function CourseDocumentsPage() {
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
                text: "課程相關說明文件",
                href: "/courseDocuments",
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
            課程相關說明文件
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
              py="3"
              sx={{
                fontSize: "14px",
                lineHeight: "1.4",
                borderRadius: "4px 4px 0 0",
              }}
            >
              <Flex w="15%">更新日期</Flex>
              <Flex w="85%">檔案名稱</Flex>
            </Flex>
            <Box
              maxH="65vh"
              overflowY={"auto"}
              sx={{
                ...customScrollBarCss,
              }}
            >
              {documents.map((document) => (
                <DocumentRow
                  updateDate={document.date}
                  documentName={document.title}
                  documentLink={document.href}
                />
              ))}
            </Box>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
