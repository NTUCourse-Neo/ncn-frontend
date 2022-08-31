import {
  ButtonGroup,
  Button,
  Center,
  IconButton,
  ButtonProps,
  IconButtonProps,
  ButtonGroupProps,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";

export interface PaginationButtonProps {
  readonly numberOfPages: number;
  readonly onClick: (page: number) => void;
  readonly navButtonProps?: ButtonProps;
  readonly numberButtonProps?: IconButtonProps;
  readonly buttonGroupProps?: ButtonGroupProps;
  readonly useIcon?: boolean;
}

export default function PaginationButton(props: PaginationButtonProps) {
  const {
    numberOfPages,
    onClick,
    navButtonProps = {},
    numberButtonProps = {},
    buttonGroupProps = {},
    useIcon = false,
  } = props;
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed
  const buttonBaseStyle = {
    color: "black",
    border: "1px solid #EEF0F3",
    shadow: "0px 1px 2px rgba(42, 51, 66, 0.06)",
    borderRadius: "6px",
    _hover: {
      bg: "#F7F8F9",
      color: "black",
      _disabled: {
        color: "black",
        opacity: 0.4,
        cursor: "not-allowed",
      },
    },
    _active: {
      bg: "#F7F8F9",
      opacity: 0.5,
    },
    _focus: {
      borderColor: "#EEF0F3",
    },
    _disabled: {
      color: "black",
      opacity: 0.4,
      cursor: "not-allowed",
    },
  };
  return (
    <ButtonGroup isAttached {...buttonGroupProps}>
      {useIcon ? (
        <IconButton
          aria-label="prev"
          sx={{ ...buttonBaseStyle, ...navButtonProps }}
          bg="#fff"
          isDisabled={currentPage === 0}
          onClick={() => {
            onClick(currentPage);
            setCurrentPage(currentPage - 1);
          }}
          icon={<ChevronLeftIcon />}
        />
      ) : (
        <Button
          sx={{ ...buttonBaseStyle, ...navButtonProps }}
          bg="#fff"
          isDisabled={currentPage === 0}
          onClick={() => {
            onClick(currentPage);
            setCurrentPage(currentPage - 1);
          }}
        >
          Previous
        </Button>
      )}
      {Array.from({ length: numberOfPages }, (_, index) => {
        const pageIndex = index + 1;
        return (
          <IconButton
            sx={{ ...buttonBaseStyle, ...numberButtonProps }}
            bg={currentPage === index ? "#f7f8f9" : "#ffffff"}
            aria-label={`page ${pageIndex}`}
            icon={<Center>{pageIndex}</Center>}
            onClick={() => {
              onClick(pageIndex);
              setCurrentPage(index);
            }}
          />
        );
      })}
      {useIcon ? (
        <IconButton
          aria-label="next"
          sx={{ ...buttonBaseStyle, ...navButtonProps }}
          bg="#fff"
          isDisabled={currentPage === numberOfPages - 1}
          onClick={() => {
            onClick(currentPage + 2);
            setCurrentPage(currentPage + 1);
          }}
          icon={<ChevronRightIcon />}
        />
      ) : (
        <Button
          sx={{ ...buttonBaseStyle, ...navButtonProps }}
          bg="#fff"
          isDisabled={currentPage === numberOfPages - 1}
          onClick={() => {
            onClick(currentPage + 2);
            setCurrentPage(currentPage + 1);
          }}
        >
          Next
        </Button>
      )}
    </ButtonGroup>
  );
}
