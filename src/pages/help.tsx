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
import FaqAccordion from "@/components/FAQ/FaqAccordion";
import { sectionOneFaq, sectionTwoFaq } from "@/data/faq";

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
      <Center my={5} w={{ base: "95%", md: "80%" }} h="52vh" bg="#d9d9d9">
        Tutorial PPT / Video{" "}
      </Center>
    ),
    faq: null,
  },
  {
    id: "selection1",
    name: "初選第一階段",
    tutorial: (
      <Center my={5} w={{ base: "95%", md: "80%" }} h="52vh" bg="#d9d9d9">
        Tutorial PPT / Video{" "}
      </Center>
    ),
    faq: sectionOneFaq,
  },
  {
    id: "selection2",
    name: "初選第二階段",
    tutorial: (
      <Center my={5} w={{ base: "95%", md: "80%" }} h="52vh" bg="#d9d9d9">
        Tutorial PPT / Video{" "}
      </Center>
    ),
    faq: sectionTwoFaq,
  },
  {
    id: "enrollWeeks",
    name: "加退選",
    tutorial: (
      <Center my={5} w={{ base: "95%", md: "80%" }} h="52vh" bg="#d9d9d9">
        Tutorial PPT / Video{" "}
      </Center>
    ),
    faq: null,
  },
  {
    id: "manualEnrollWeeks",
    name: "人工加簽",
    tutorial: (
      <Center my={5} w={{ base: "95%", md: "80%" }} h="52vh" bg="#d9d9d9">
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
      <Text
        justifyContent={"center"}
        sx={{
          whiteSpace: "initial",
        }}
      >
        {children}
      </Text>
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
      px={{ base: 4, md: 10 }}
      sx={{
        border: "1px solid #CCCCCC",
        textAlign: alignStart ? "start" : "center",
        lineHeight: 1.4,
        color: "#2d2d2d",
        fontWeight: 400,
        fontSize: "14px",
        maxW: "170px",
        overflow: "hidden",
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
        <Flex wrap={"wrap"}>
          曾俊綺{" "}
          <ELink href="mailto:tsengchi@ntu.edu.tw">tsengchi@ntu.edu.tw</ELink>
        </Flex>
      ),
    },
    {
      questionType: "課程大綱建置相關問題",
      office: "教務處 課務組",
      contactInfo: (
        <Flex wrap={"wrap"}>
          曾俊綺{" "}
          <ELink href="mailto:tsengchi@ntu.edu.tw">tsengchi@ntu.edu.tw</ELink>
        </Flex>
      ),
    },
    {
      questionType: "帳號相關問題",
      office: "計中 帳號室",
      contactInfo: (
        <Flex wrap={"wrap"}>
          Tel: <Text>02-3366-5023</Text>、 <Text>02-3366-5022</Text>
        </Flex>
      ),
    },
    {
      questionType: "系統及其它相關問題",
      office: "教務處 資訊組",
      contactInfo: (
        <Flex wrap={"wrap"}>
          陳建吉{" "}
          <ELink href="mailto:ajaxchen@ntu.edu.tw">ajaxchen@ntu.edu.tw</ELink>
        </Flex>
      ),
    },
  ];
  return (
    <TableContainer w={{ base: "95%", md: "70%" }} border="1px solid #2D2D2D">
      <Table>
        <Thead>
          <Tr>
            <Th w={{ base: "50%", md: "40%" }}>問題類別</Th>
            <Th
              w={{ base: "0%", md: "20%" }}
              display={{ base: "none", md: "table-cell" }}
            >
              負責單位
            </Th>
            <Th
              w={{ base: "0%", md: "40%" }}
              display={{ base: "none", md: "table-cell" }}
            >
              負責人及聯絡資訊
            </Th>
            <Th
              w={{ base: "50%", md: "0%" }}
              display={{ base: "table-cell", md: "none" }}
            >
              負責單位 / 負責人 / 聯絡資訊
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row, index) => (
            <Tr key={`${row.questionType}-${row.office}-${index}`}>
              <Td alignStart>{row.questionType}</Td>
              <Td display={{ base: "none", md: "table-cell" }}>{row.office}</Td>
              <Td alignStart display={{ base: "none", md: "table-cell" }}>
                {row.contactInfo}
              </Td>
              <Td alignStart display={{ base: "table-cell", md: "none" }}>
                {row.office}
                <td />
                {row.contactInfo}
              </Td>
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
SectionWrapper.displayName = "SectionWrapper";

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
    <Flex w="100%" h="60vh" position="relative" ref={containerBodyRef}>
      <Flex
        w={{ base: "0%", md: "25%" }}
        justifyContent={"end"}
        overflow="hidden"
        pr={"52px"}
        position="sticky"
        top={0}
        display={{ base: "none", md: "block" }}
      >
        <Box mt={9}>
          {sections.map((section, index) => {
            return (
              <Box alignItems={"center"} key={`${section.id}-${index}`}>
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
        w={{ base: "100%", md: "75%" }}
        pl="7%"
        justifyContent={"column"}
        overflowY="scroll"
        sx={{
          ...customScrollBarCss,
        }}
      >
        {sections.map((section) => {
          return (
            <SectionWrapper
              key={section.id}
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
                    fontSize: { base: "16px", md: "18px" },
                    lineHeight: 1.4,
                    py: 6,
                  }}
                >{`使用教學 - ${section.name}`}</Flex>
                <Flex
                  w={{ base: "95%", md: "80%" }}
                  borderBottom="1px solid #000000"
                />
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
    <Flex w="100%" h="60vh" position="relative" ref={containerBodyRef}>
      <Flex
        w={{ base: "0%", md: "25%" }}
        justifyContent={"end"}
        overflow="hidden"
        pr={"52px"}
        position="sticky"
        top={0}
        display={{ base: "none", md: "block" }}
      >
        <Box mt={9}>
          {sections
            .filter((s) => s.faq !== null)
            .map((section, index) => {
              return (
                <Box alignItems={"center"} key={section.id}>
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
        w={{ base: "100%", md: "75%" }}
        pl="7%"
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
              key={section.id}
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
                    fontSize: { base: "16px", md: "18px" },
                    lineHeight: 1.4,
                    py: 6,
                  }}
                >{`${section.name} FAQs`}</Flex>
                <FaqAccordion items={section.faq} />
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
      <Flex w="100vw" justifyContent={"center"} alignItems="center" py={6}>
        <Flex flexDirection={"column"} w={{ base: "100%", md: "80%" }}>
          <CustomBreadcrumb
            ms={{ base: "16px", md: "0px" }}
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
            ms={{ base: "16px", md: "0px" }}
            sx={{
              fontSize: { base: "20px", md: "24px" },
              lineHeight: "1.4",
            }}
          >
            幫助中心
          </Flex>
          <Box
            w="100%"
            sx={{
              shadow: "0px 3px 8px rgba(75, 75, 75, 0.08)",
              borderRadius: { base: "0px", md: "4px" },
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
                borderRadius: { base: "0px", md: "4px 4px 0 0" },
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
                    fontSize: { base: "14px", md: "16px" },
                    lineHeight: { base: "0.8", md: "1.4" },
                  }}
                >
                  {tabItem.text}
                </Flex>
              ))}
            </Flex>
            <Flex
              flexDirection={"column"}
              h={{ base: "100%", md: "60vh" }}
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
