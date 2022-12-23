import { Box, Flex, RadioGroup, Radio, VStack, Text } from "@chakra-ui/react";
import Head from "next/head";
import CustomBreadcrumb from "@/components/Breadcrumb";
import { customScrollBarCss } from "@/styles/customScrollBar";
import Dropdown from "@/components/Dropdown";
import { useState, useRef } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import useNews from "@/hooks/useNews";

export default function NewsPage() {
  const currentPageRef = useRef<HTMLDivElement>(null);
  const pageMenuRef = useRef<HTMLDivElement>(null);
  const [pageIndex, setPageIndex] = useState(0);

  // TODO: render news from hook
  const { numOfNewsPage: numOfPages } = useNews(pageIndex);

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
                text: "最新消息",
                href: "/news",
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
            最新消息
          </Flex>
          <Box
            w="100%"
            sx={{
              shadow: "0px 3px 8px rgba(75, 75, 75, 0.08)",
              borderRadius: "4px",
              border: "1px solid rgba(204, 204, 204, 0.4)",
              bg: "white",
            }}
            h="70vh"
          >
            <Flex
              w="100%"
              bg="#002F94"
              color="white"
              px="6"
              py="3"
              sx={{
                borderRadius: "4px 4px 0 0",
              }}
              justifyContent="space-between"
            >
              <Flex
                sx={{
                  color: "#F6F6F6",
                  fontSize: "14px",
                  lineHeight: "20px",
                  letterSpacing: "-0.24px",
                }}
              >{`共 ${1} 筆結果, 共 ${1} 頁`}</Flex>
              <Flex
                justifyContent="flex-end"
                flex={1}
                gap={4}
                sx={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  letterSpacing: "-0.24px",
                }}
              >
                <Flex gap={2} alignItems={"center"}>
                  <Flex
                    alignItems="center"
                    cursor="pointer"
                    sx={{
                      opacity: pageIndex === 0 ? 0.5 : 1,
                    }}
                    onClick={() => {
                      if (pageIndex > 0) {
                        setPageIndex(pageIndex - 1);
                      }
                    }}
                  >
                    <ChevronLeftIcon boxSize={"20px"} />
                    上一頁
                  </Flex>
                  <Flex
                    alignItems="center"
                    cursor="pointer"
                    sx={{
                      opacity:
                        pageIndex === numOfPages - 1 || numOfPages === 0
                          ? 0.5
                          : 1,
                    }}
                    onClick={() => {
                      if (pageIndex < numOfPages - 1) {
                        setPageIndex(pageIndex + 1);
                      }
                    }}
                  >
                    下一頁
                    <ChevronRightIcon boxSize={"20px"} />
                  </Flex>
                </Flex>
                <Flex alignItems={"center"}>
                  第
                  <Dropdown
                    closeAfterClick={true}
                    disabled={numOfPages === 0}
                    onOpen={() => {
                      const offsetY =
                        parseInt(currentPageRef?.current?.id ?? "0", 10) ?? 0;
                      if (pageMenuRef?.current) {
                        pageMenuRef.current.scrollTop =
                          36 * Math.max(offsetY - 3, 0);
                      }
                    }}
                    renderDropdownButton={() => (
                      <Flex
                        sx={{
                          border: "1px solid #CCCCCC",
                          borderRadius: "4px",
                          px: "8px",
                          mx: 1,
                        }}
                        minW="50px"
                        justifyContent={"space-between"}
                        bg="white"
                        color="black"
                      >
                        <Text noOfLines={1}>{pageIndex + 1}</Text>
                        <VStack h="22px" position={"relative"}>
                          <ChevronUpIcon position={"absolute"} />
                          <ChevronDownIcon position={"absolute"} />
                        </VStack>
                      </Flex>
                    )}
                  >
                    <Box
                      w="100%"
                      h="48px"
                      position={"absolute"}
                      zIndex={101}
                      top={0}
                      left={0}
                      bg="linear-gradient(180.5deg, #FFFFFF -84.02%, #FFFFFF 31.81%, rgba(255, 255, 255, 0) 49.08%)s"
                      pointerEvents={"none"}
                    />
                    <Box
                      sx={{
                        px: 4,
                        my: 2,
                      }}
                      position="relative"
                      maxH="250px"
                      overflowY="scroll"
                      ref={pageMenuRef}
                    >
                      <Flex flexDirection={"column"} justifyContent={"center"}>
                        <RadioGroup
                          onChange={(i) => {
                            setPageIndex(parseInt(i));
                          }}
                          value={pageIndex}
                        >
                          {Array.from({ length: numOfPages }, (_, i) => (
                            <Radio value={i} height="36px" key={i}>
                              <Box
                                id={`${i}`}
                                ref={
                                  pageIndex === i ? currentPageRef : undefined
                                }
                              >
                                {i + 1}
                              </Box>
                            </Radio>
                          ))}
                        </RadioGroup>
                      </Flex>
                    </Box>
                    <Box
                      w="100%"
                      h="48px"
                      position={"absolute"}
                      zIndex={101}
                      bottom={0}
                      left={0}
                      bg="linear-gradient(180.5deg, #FFFFFF -84.02%, #FFFFFF 31.81%, rgba(255, 255, 255, 0) 49.08%)"
                      transform={"rotate(180deg)"}
                      pointerEvents={"none"}
                    />
                  </Dropdown>
                  頁
                </Flex>
              </Flex>
            </Flex>
            <Box
              maxH="65vh"
              overflowY={"auto"}
              sx={{
                ...customScrollBarCss,
              }}
            ></Box>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
