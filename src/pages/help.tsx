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
  Divider,
  Center,
} from "@chakra-ui/react";
import CustomBreadcrumb from "@/components/Breadcrumb";
import { customScrollBarCss } from "@/styles/customScrollBar";
import { useInView } from "react-intersection-observer";
import React, {
  useState,
  createRef,
  RefObject,
  forwardRef,
  useRef,
} from "react";

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

const sections = [
  {
    id: "nol",
    name: "課程網",
    tutorial: (
      <Center my={5} w="80%" h="52vh" bg="#d9d9d9">
        Tutorial PPT / Video{" "}
      </Center>
    ),
    faq: null,
  },
  {
    id: "selection1",
    name: "初選第一階段",
    tutorial: (
      <Center my={5} w="80%" h="52vh" bg="#d9d9d9">
        Tutorial PPT / Video{" "}
      </Center>
    ),
    faq: (
      <Center my={5} w="80%" h="100vh" bg="#d9d9d9">
        Accordion Placeholder
      </Center>
    ),
  },
  {
    id: "selection2",
    name: "初選第二階段",
    tutorial: (
      <Center my={5} w="80%" h="52vh" bg="#d9d9d9">
        Tutorial PPT / Video{" "}
      </Center>
    ),
    faq: (
      <Center my={5} w="80%" h="100vh" bg="#d9d9d9">
        Accordion Placeholder
      </Center>
    ),
  },
  {
    id: "enrollWeeks",
    name: "加退選",
    tutorial: (
      <Center my={5} w="80%" h="52vh" bg="#d9d9d9">
        Tutorial PPT / Video{" "}
      </Center>
    ),
    faq: null,
  },
  {
    id: "manualEnrollWeeks",
    name: "人工加簽",
    tutorial: (
      <Center my={5} w="80%" h="52vh" bg="#d9d9d9">
        Tutorial PPT / Video{" "}
      </Center>
    ),
    faq: null,
  },
] as const;
type SectionId = typeof sections[number]["id"];

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

// can be moved to custom hook
const SectionWrapper = forwardRef<
  HTMLDivElement,
  {
    readonly sectionRefs: Record<string, RefObject<HTMLDivElement>>;
    readonly setCurrentSection: (sectionId: SectionId) => void;
    readonly id: SectionId;
    readonly children: React.ReactNode;
  }
>((props, ref) => {
  const { sectionRefs, setCurrentSection, id, children } = props;
  const scrollSectionRef = sectionRefs[id];
  const container = ref as RefObject<HTMLDivElement>;
  const containerBody = container?.current;
  const ROOT_MARGIN_BOX_HEIGHT = 50;
  const offsetBottom = containerBody?.clientHeight
    ? `-${containerBody.clientHeight - ROOT_MARGIN_BOX_HEIGHT}px`
    : "-88%";

  const { ref: inViewRef } = useInView({
    /* Optional options */
    root: containerBody ?? null,
    rootMargin: `0px 0px ${offsetBottom} 0px`,
    onChange: (inView, entry) => {
      if (inView) {
        setCurrentSection((entry?.target?.id as SectionId) ?? "nol");
      }
    },
  });

  return (
    <Flex position={"relative"} w="100%">
      <Box
        ref={inViewRef}
        id={id}
        h="1px"
        w="100%"
        bg="transparent"
        position={"absolute"}
        top={0}
      />
      <Flex ref={scrollSectionRef} id={id} w="100%">
        {children}
      </Flex>
    </Flex>
  );
});

function TutorialTab() {
  const containerBodyRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState<SectionId>("selection1");
  // clickable navigation link && scrollIntoView effect
  const sectionRefs = sections.reduce((refsObj, section) => {
    refsObj[section.id] = createRef<HTMLDivElement>();
    return refsObj;
  }, {} as Record<string, RefObject<HTMLDivElement>>);
  const scrollToSection = (sectionId: SectionId) => {
    sectionRefs?.[sectionId]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Flex w="100%" h="65vh" position="relative" ref={containerBodyRef}>
      <Flex
        w="25%"
        justifyContent={"end"}
        overflow="hidden"
        pr={"52px"}
        position="sticky"
        top={0}
      >
        <Box mt={9}>
          {sections.map((section, index) => {
            return (
              <Box alignItems={"center"}>
                {index !== 0 ? <Divider w="60%" mx="auto" /> : null}
                <Flex
                  justify={"center"}
                  p="16px 10px"
                  sx={{
                    color:
                      currentSection === section.id ? "#081D59" : "#6F6F6F",
                    cursor: "pointer",
                    fontWeight: currentSection === section.id ? 500 : 400,
                  }}
                  onClick={() => {
                    scrollToSection(section.id);
                  }}
                >
                  {section.name}
                </Flex>
              </Box>
            );
          })}
        </Box>
      </Flex>
      <Box
        h="100%"
        w="75%"
        justifyContent={"column"}
        overflowY="scroll"
        sx={{
          ...customScrollBarCss,
        }}
      >
        {sections.map((section) => {
          return (
            <SectionWrapper
              id={section.id}
              sectionRefs={sectionRefs}
              setCurrentSection={setCurrentSection}
              ref={containerBodyRef}
            >
              <Flex
                w="100%"
                flexDirection={"column"}
                ref={sectionRefs[section.id]}
              >
                <Flex
                  sx={{
                    color: "#2d2d2d",
                    fontWeight: 500,
                    fontSize: "18px",
                    lineHeight: 1.4,
                    py: 6,
                  }}
                >{`使用教學 - ${section.name}`}</Flex>
                <Flex w="80%" borderBottom="1px solid #000000" />
                {section.tutorial}
              </Flex>
            </SectionWrapper>
          );
        })}
      </Box>
    </Flex>
  );
}

function FAQTab() {
  // these code can be moved to custom hook -------
  const containerBodyRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState<SectionId>("selection1");
  // clickable navigation link && scrollIntoView effect
  const sectionRefs = sections.reduce((refsObj, section) => {
    refsObj[section.id] = createRef<HTMLDivElement>();
    return refsObj;
  }, {} as Record<string, RefObject<HTMLDivElement>>);
  const scrollToSection = (sectionId: SectionId) => {
    sectionRefs?.[sectionId]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  // ---------------------------------------------

  return (
    <Flex w="100%" h="65vh" position="relative" ref={containerBodyRef}>
      <Flex
        w="25%"
        justifyContent={"end"}
        overflow="hidden"
        pr={"52px"}
        position="sticky"
        top={0}
      >
        <Box mt={9}>
          {sections
            .filter((s) => s.faq !== null)
            .map((section, index) => {
              return (
                <Box alignItems={"center"}>
                  {index !== 0 ? <Divider w="60%" mx="auto" /> : null}
                  <Flex
                    justify={"center"}
                    p="16px 10px"
                    sx={{
                      color:
                        currentSection === section.id ? "#081D59" : "#6F6F6F",
                      cursor: "pointer",
                      fontWeight: currentSection === section.id ? 500 : 400,
                    }}
                    onClick={() => {
                      scrollToSection(section.id);
                    }}
                  >
                    {section.name}
                  </Flex>
                </Box>
              );
            })}
        </Box>
      </Flex>
      <Box
        h="100%"
        w="75%"
        justifyContent={"column"}
        overflowY="scroll"
        sx={{
          ...customScrollBarCss,
        }}
      >
        {sections.map((section) => {
          if (!section.faq) {
            return null;
          }
          return (
            <SectionWrapper
              id={section.id}
              sectionRefs={sectionRefs}
              setCurrentSection={setCurrentSection}
              ref={containerBodyRef}
            >
              <Flex
                w="100%"
                flexDirection={"column"}
                ref={sectionRefs[section.id]}
              >
                <Flex
                  sx={{
                    color: "#2d2d2d",
                    fontWeight: 500,
                    fontSize: "18px",
                    lineHeight: 1.4,
                    py: 6,
                  }}
                >{`${section.name} FAQs`}</Flex>
                {section.faq}
              </Flex>
            </SectionWrapper>
          );
        })}
      </Box>
    </Flex>
  );
}

export default function HelpCenterPage() {
  const [tab, setTab] = useState<TabId>("tutorial");

  const tabContent: Record<TabId, React.ReactNode> = {
    tutorial: <TutorialTab />,
    FAQ: <FAQTab />,
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
              overflowY={"hidden"}
              justifyContent={tab === "contact" ? "center" : "start"}
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
