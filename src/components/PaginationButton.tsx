import {
  ButtonGroup,
  Button,
  Center,
  IconButton,
  ButtonProps,
  IconButtonProps,
  ButtonGroupProps,
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";

function checkIsPositiveInteger(value: number) {
  return value > 0 && value === Math.floor(value);
}

// currentPage is 0-indexed
function generatePageNumbers(
  totalPages: number,
  maxVisiblePages: number,
  currentPageZeroIndexed: number
): number[] {
  const currentPage = currentPageZeroIndexed + 1;
  const half = Math.floor(maxVisiblePages / 2);
  let to;
  to = maxVisiblePages;
  if (currentPage + half >= totalPages) {
    to = totalPages;
  } else if (currentPage > half) {
    to = currentPage + half;
  }
  const from = to - maxVisiblePages;
  return Array.from({ length: maxVisiblePages }, (_, i) => i + 1 + from);
}

export interface PaginationButtonProps {
  readonly numberOfPages: number;
  readonly maxVisiblePages: number;
  readonly onClick: (page: number) => void;
  readonly navButtonProps?: ButtonProps;
  readonly numberButtonProps?: IconButtonProps;
  readonly buttonGroupProps?: ButtonGroupProps;
  readonly useIcon?: boolean;
}

export default function PaginationButton(props: PaginationButtonProps) {
  const {
    numberOfPages,
    maxVisiblePages,
    onClick,
    navButtonProps = {},
    numberButtonProps = {},
    buttonGroupProps = {},
    useIcon = false,
  } = props;

  const [currentPage, setCurrentPage] = useState(0); // 0-indexed
  const buttonBaseStyle = {
    color: "#4b4b4b",
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: 400,
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
      shadow: "drop-shadow-2xl",
      bg: "#96B7FF30",
      borderColor: "#EEF0F3",
    },
    _disabled: {
      color: "black",
      opacity: 0.4,
      cursor: "not-allowed",
    },
  };

  const PageIndexNumbers: number[] = useMemo(() => {
    if (numberOfPages <= maxVisiblePages) {
      return Array.from({ length: numberOfPages }, (_, i) => i + 1);
    }
    return generatePageNumbers(numberOfPages, maxVisiblePages, currentPage);
  }, [currentPage, numberOfPages, maxVisiblePages]);

  if (
    !checkIsPositiveInteger(numberOfPages) ||
    !checkIsPositiveInteger(maxVisiblePages)
  ) {
    return null;
  }

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
          onMouseDown={(e) => {
            e.preventDefault();
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
          onMouseDown={(e) => {
            e.preventDefault();
          }}
        >
          Previous
        </Button>
      )}
      {PageIndexNumbers.map((pageIndex) => {
        const index = pageIndex - 1;
        return (
          <IconButton
            key={pageIndex}
            sx={{ ...buttonBaseStyle, ...numberButtonProps }}
            bg={currentPage === index ? "#f7f8f9" : "#ffffff"}
            aria-label={`page ${pageIndex}`}
            icon={<Center>{pageIndex}</Center>}
            onClick={() => {
              onClick(pageIndex);
              setCurrentPage(index);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
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
          onMouseDown={(e) => {
            e.preventDefault();
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
          onMouseDown={(e) => {
            e.preventDefault();
          }}
        >
          Next
        </Button>
      )}
    </ButtonGroup>
  );
}
