import {
  Accordion,
  AccordionItem as ChakraAccordionItem,
  AccordionItemProps as ChakraAccordionItemProps,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";

export interface AccordionItemProps
  extends Omit<ChakraAccordionItemProps, "children"> {
  readonly title: string;
  readonly children?: React.ReactNode;
}

function AccordionItem(props: AccordionItemProps) {
  const { children, title, ...restProps } = props;
  return (
    <ChakraAccordionItem
      sx={{
        border: "1px solid #CCCCCC",
        mb: "10px",
        borderRadius: "4px",
      }}
      {...restProps}
    >
      <AccordionButton
        bg="white"
        sx={{
          _hover: {
            bg: "linear-gradient(0deg, rgba(70, 129, 255, 0.1), rgba(70, 129, 255, 0.1)), #FFFFFF",
          },
          p: "24px 16px 16px",
          borderRadius: "4px",
        }}
      >
        <Box
          flex="1"
          textAlign="left"
          gap={"4px"}
          sx={{
            fontSize: "12px",
            lineHeight: "1.4",
            color: "#2d2d2d",
          }}
        >
          {title}
        </Box>
        <AccordionIcon boxSize={"24px"} />
      </AccordionButton>
      <AccordionPanel
        sx={{
          p: "16px 80px 32px 44px",
          fontSize: "12px",
          lineHeight: "1.4",
          color: "#6f6f6f",
        }}
      >
        {children}
      </AccordionPanel>
    </ChakraAccordionItem>
  );
}

export default function FaqAccordion({
  items,
}: {
  readonly items: ReadonlyArray<AccordionItemProps>;
}) {
  return (
    <Box w="80%" minH="58vh">
      <Accordion allowToggle defaultIndex={0}>
        {items.map((item, index) => (
          <AccordionItem
            title={`Q${index + 1}. ${item.title}`}
            key={`${item.title}-${index}`}
          >
            {item.children}
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
}