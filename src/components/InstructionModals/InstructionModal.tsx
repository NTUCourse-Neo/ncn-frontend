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
} from "@chakra-ui/react";
import { Global } from "@emotion/react";

interface ModalButtonProps extends FlexProps {
  readonly title: string;
}
export function ModalButton(props: ModalButtonProps) {
  const { title, ...rest } = props;
  return (
    <Flex
      mx={4}
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
