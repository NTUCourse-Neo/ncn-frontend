import {
  Flex,
  useDisclosure,
  FlexProps,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { Global } from "@emotion/react";
import { ImArrowUpRight2 } from "react-icons/im";

interface ModalButtonProps extends FlexProps {
  readonly title: string;
  readonly isExternal?: boolean;
}
export function ModalButton(props: ModalButtonProps) {
  const { title, isExternal = false, ...rest } = props;
  return (
    <HStack spacing={0} mx={4}>
      <Flex
        mr={isExternal ? 1 : 0}
        sx={{
          fontSize: "14px",
          lineHeight: "20px",
          color: "#007aff",
          textDecoration: "underline",
          cursor: "pointer",
        }}
        {...rest}
      >
        {title}
      </Flex>
      {isExternal ? (
        <Icon as={ImArrowUpRight2} w={4} h={4} color="#6f6f6f" />
      ) : null}
    </HStack>
  );
}

interface InstructionModalProps {
  readonly title: string;
  readonly children: React.ReactNode;
}
function InstructionModal(props: InstructionModalProps) {
  const { title, children } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Global
        styles={{
          "@font-face": {
            fontFamily: "SF Pro Text",
            src: 'url("/fonts/SFProText-Regular.ttf")',
          },
        }}
      />
      <ModalButton title={title} onClick={onOpen} />
      <Modal size="xl" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxH="670px" maxW="850px" overflowY="auto">
          <ModalHeader
            borderRadius="4px"
            sx={{
              shadow: "0px 32px 64px -12px rgba(85, 105, 135, 0.08)",
            }}
          >
            {title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            pt={8}
            px={16}
            pb={16}
            sx={{
              fontFamily: "SF Pro Text",
              fontSize: "14px",
              lineHeight: "18px",
              letterSpacing: "-0.078px",
              color: "#2d2d2d",
            }}
          >
            {children}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default InstructionModal;
