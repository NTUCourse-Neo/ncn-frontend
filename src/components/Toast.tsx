import { NeoToast } from "@/hooks/useNeoToast";
import {
  Box,
  Flex,
  RenderProps,
  HStack,
  Center,
  Button,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

export interface ToastProps extends RenderProps {
  readonly description: string;
  readonly toast: NeoToast;
  readonly undoCallback?: () => void;
}

export function CustomToast(props: ToastProps) {
  const { id, onClose, description, toast, undoCallback = () => {} } = props;
  const { icon: Icon, isSuccess, chineseTitle, type } = toast;
  const themeColor = isSuccess ? "success.600" : "error.600";
  return (
    <Flex
      bg={"#ffffff"}
      py={3}
      px={4}
      borderRadius={4}
      border="0.5px solid #6F6F6F"
      justifyContent="start"
      gap={"12px"}
      alignItems="center"
      w="300px"
      position={"relative"}
    >
      <Center
        position={"absolute"}
        top={0}
        left={0}
        w="20px"
        h="20px"
        sx={{
          transform: "translate(-30%, -40%)",
          bg: "white",
          borderRadius: "10px",
          border: "0.5px solid #2D2D2D",
        }}
        cursor="pointer"
        onClick={() => {
          onClose();
        }}
      >
        <CloseIcon boxSize={"18px"} p={1} />
      </Center>
      <HStack
        sx={{
          color: themeColor,
          fontWeight: 500,
          fontSize: "14px",
          lineHeight: "1.4",
        }}
        spacing={1}
      >
        <Center>
          <Icon size="22px" />
        </Center>
        <Box whiteSpace={"nowrap"}>{chineseTitle}</Box>
      </HStack>
      <Flex
        flexGrow={1}
        noOfLines={1}
        wrap="nowrap"
        sx={{
          fontSize: "14px",
          lineHeight: "1.4",
        }}
      >
        {description}
      </Flex>
      {type === "remove_course" || type === "remove_favorite" ? (
        <Button
          variant={"unstyled"}
          h="25px"
          sx={{
            fontSize: "14px",
            lineHeight: "1.4",
            color: themeColor,
          }}
          onClick={() => {
            undoCallback();
            onClose();
          }}
        >
          {"復原"}
        </Button>
      ) : null}
    </Flex>
  );
}
