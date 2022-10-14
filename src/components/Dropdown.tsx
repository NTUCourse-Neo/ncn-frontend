import React, { useState, useRef, useEffect } from "react";
import { Flex, Fade, Box, BoxProps } from "@chakra-ui/react";
import useOutsideDetecter from "@/hooks/useOutsideDetecter";

export interface DropdownProps {
  readonly children: React.ReactNode;
  readonly renderDropdownButton: (isOpen: boolean) => React.ReactNode;
  readonly enableOutsideDetecter?: boolean;
  readonly onOpen?: () => void;
  readonly onClose?: () => void;
  readonly reverse?: boolean;
  readonly disabled?: boolean;
  readonly renderDropdownFooter?: (
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => React.ReactNode;
  readonly menuBoxProps?: BoxProps;
}

function Dropdown(props: DropdownProps) {
  const {
    children,
    renderDropdownButton,
    enableOutsideDetecter = true,
    onOpen = () => {},
    onClose = () => {},
    reverse = false,
    disabled = false,
    renderDropdownFooter = () => null,
    menuBoxProps = {},
  } = props;
  const buttonRef = useRef<HTMLDivElement>(null);
  const menuBoxRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  useOutsideDetecter(
    menuBoxRef,
    "menuBoxRef",
    enableOutsideDetecter
      ? (e) => {
          // click inside button, don't close filter dropdown
          if (
            buttonRef.current &&
            buttonRef.current.contains(e?.target as Node)
          ) {
            return;
          }
          setIsOpen(false);
        }
      : () => {}
  );
  const menuOffsetY = (buttonRef.current?.clientHeight ?? 50) + 5;

  useEffect(() => {
    if (isOpen) {
      onOpen();
    } else {
      onClose();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex
      flexDirection={"column"}
      justifyContent="center"
      alignItems={"center"}
      position="relative"
      sx={{
        transition: "all 0.4s ease-in-out",
      }}
    >
      {reverse ? (
        <Fade in={isOpen} unmountOnExit={true}>
          <Box
            ref={menuBoxRef}
            boxSizing="border-box"
            sx={{
              transition: "all 1s ease-in-out",
              transform: "translate(-50%, 0)",
              border: "0.5px solid #6F6F6F",
              borderRadius: "4px",
            }}
            bottom={`${menuOffsetY}px`}
            w="fit-content"
            bg="white"
            position="absolute"
            color="black"
            p={2}
            zIndex={500}
            {...menuBoxProps}
          >
            {children}
            {renderDropdownFooter(setIsOpen)}
          </Box>
        </Fade>
      ) : null}

      <Flex
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
          }
        }}
        sx={{
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        cursor={"pointer"}
        ref={buttonRef}
      >
        {renderDropdownButton(isOpen)}
      </Flex>

      {!reverse ? (
        <Fade in={isOpen} unmountOnExit={true}>
          <Box
            ref={menuBoxRef}
            boxSizing="border-box"
            sx={{
              transition: "all 1s ease-in-out",
              transform: "translate(-50%, 0)",
              border: "0.5px solid #6F6F6F",
              borderRadius: "4px",
            }}
            top={`${menuOffsetY}px`}
            w="fit-content"
            bg="white"
            position="absolute"
            color="black"
            p={2}
            zIndex={500}
            {...menuBoxProps}
          >
            {children}
            {renderDropdownFooter(setIsOpen)}
          </Box>
        </Fade>
      ) : null}
    </Flex>
  );
}

export default Dropdown;
