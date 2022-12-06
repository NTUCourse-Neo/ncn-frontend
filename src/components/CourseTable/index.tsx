import { Course } from "@/types/course";
import {
  Flex,
  Center,
  Table,
  Tbody,
  Tr,
  Th as ChakraTh,
  Td as ChakraTd,
  TableColumnHeaderProps,
  TableCellProps,
  TableContainer,
  Thead,
  Box,
  Fade,
} from "@chakra-ui/react";
import CourseTableCard from "@/components/CourseTable/CourseTableCard";
import { intervals } from "@/constant";
import courses2rle from "@/utils/courses2rle";
import { customScrollBarCss } from "@/styles/customScrollBar";
import { useState } from "react";
import { usePopper } from "react-popper";
import Portal from "@/components/Portal";

const TABLE_BORDER_WIDTH = 1; //px

interface ThProps extends TableColumnHeaderProps {
  readonly children: React.ReactNode;
}
const Th: React.FC<ThProps> = ({ children, ...rest }) => {
  return (
    <ChakraTh
      sx={{
        textAlign: "center",
        lineHeight: 1.4,
        color: "#2d2d2d",
        fontWeight: 400,
        fontSize: "14px",
      }}
      {...rest}
    >
      {children}
    </ChakraTh>
  );
};

interface TdProps extends TableCellProps {
  readonly children: React.ReactNode;
  readonly isFirstDay: boolean;
  readonly isLastDay: boolean;
  readonly isFirstInterval: boolean;
  readonly isLastInterval: boolean;
  readonly id: string;
  readonly openPortal: string | null;
  readonly setOpenPortal: (id: string | null) => void;
}
const Td: React.FC<TdProps> = ({
  children,
  isFirstDay,
  isLastDay,
  isFirstInterval,
  isLastInterval,
  id,
  openPortal,
  setOpenPortal,
  ...rest
}) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "right-start",
    strategy: "fixed",
  });
  return (
    <ChakraTd
      sx={{
        boxSizing: "border-box",
        textAlign: "center",
        lineHeight: 1.4,
        color: "#2d2d2d",
        fontWeight: 400,
        fontSize: "14px",
        borderRadius: `${isFirstDay && isFirstInterval ? "4px" : "0px"} ${
          isLastDay && isFirstInterval ? "4px" : "0px"
        } ${isLastDay && isLastInterval ? "4px" : "0px"} ${
          isFirstDay && isLastInterval ? "4px" : "0px"
        }`,
        borderTop: `${TABLE_BORDER_WIDTH}px solid #CCCCCC${
          isFirstInterval ? "" : "80"
        }`,
        borderLeft: `${TABLE_BORDER_WIDTH}px solid #CCCCCC${
          isFirstDay ? "" : "80"
        }`,
        borderRight: `${isLastDay ? TABLE_BORDER_WIDTH : 0}px solid #CCCCCC`,
        borderBottom: `${
          isLastInterval ? TABLE_BORDER_WIDTH : 0
        }px solid #CCCCCC`,
        overflow: "visible",
        position: "relative",
      }}
      {...rest}
    >
      <Box
        sx={{
          zIndex: 99,
          position: "absolute",
          top: isFirstInterval ? `-${TABLE_BORDER_WIDTH / 2}px` : 0,
          left: 0,
          bg: "linear-gradient(0deg, rgba(204, 204, 204, 0.24), rgba(204, 204, 204, 0.24)), #FFFFFF",
          opacity: 0.32,
          w: "100%",
          h: "100%",
        }}
      />
      <Box
        position="absolute"
        sx={{
          top: isFirstInterval ? `-${TABLE_BORDER_WIDTH / 2}px` : 0,
          left: 0,
          zIndex: 100,
        }}
        ref={setReferenceElement}
        onClick={
          children !== null
            ? () => {
                if (openPortal === id) {
                  setOpenPortal(null);
                } else {
                  setOpenPortal(id);
                }
              }
            : undefined
        }
      >
        {children}
      </Box>
      <Portal>
        <Box
          ref={setPopperElement}
          style={{ ...styles.popper, zIndex: 200 }}
          {...attributes.popper}
        >
          <Fade in={id === openPortal} unmountOnExit>
            <Box
              sx={{
                w: 200,
                h: 200,
                bg: "yellow",
              }}
            ></Box>
          </Fade>
        </Box>
      </Portal>
    </ChakraTd>
  );
};

export const TableCellProperty = {
  w: 160,
  h: 50,
} as const;

interface CourseTableProps {
  readonly courses: Course[];
}

function CourseTable(props: CourseTableProps) {
  const { courses } = props;
  const days = ["一", "二", "三", "四", "五", "六"];
  const [openPortal, setOpenPortal] = useState<string | null>(null);

  const coursesRle = courses2rle(courses);

  return (
    <Flex>
      <Flex flexDirection={"column"}>
        <Box h={`${TableCellProperty.h + 8}px`} />
        {intervals.map((interval) => (
          <Center
            key={interval}
            sx={{
              h: `${TableCellProperty.h}px`,
              w: 12,
              fontWeight: 500,
              fontSize: "18px",
              lineHeight: 1.4,
              color: "#1A181C",
            }}
          >
            {interval}
          </Center>
        ))}
      </Flex>
      <TableContainer sx={customScrollBarCss}>
        <Table
          variant={"unstyled"}
          sx={{
            borderCollapse: "separate",
            borderSpacing: "0 0",
          }}
        >
          <Thead>
            <Tr h={`${TableCellProperty.h}px`}>
              {days.map((day) => {
                return (
                  <Th
                    key={day}
                    w={`${TableCellProperty.w}px`}
                    maxW={`${TableCellProperty.w}px`}
                  >
                    <Center>{day}</Center>
                  </Th>
                );
              })}
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <ChakraTd h="8px" p="0" m="0">
                {null}
              </ChakraTd>
            </Tr>
          </Tbody>
          <Tbody
            sx={{
              border: "1px solid #909090",
              borderRadius: "4px",
            }}
          >
            {Array.from({ length: intervals.length }, (_, intervalIndex) => {
              return (
                <Tr
                  key={intervalIndex}
                  sx={{
                    borderRadius: "4px",
                  }}
                  h={`${TableCellProperty.h}px`}
                  maxH={`${TableCellProperty.h}px`}
                >
                  {days.map((day, dayIndex) => {
                    return (
                      <Td
                        key={dayIndex}
                        minW={`${TableCellProperty.w}px`}
                        w={`${TableCellProperty.w}px`}
                        maxW={`${TableCellProperty.w}px`}
                        minH={`${TableCellProperty.h}px`}
                        h={`${TableCellProperty.h}px`}
                        isFirstDay={dayIndex === 0}
                        isLastDay={dayIndex === days.length - 1}
                        isFirstInterval={intervalIndex === 0}
                        isLastInterval={intervalIndex === intervals.length - 1}
                        id={`${dayIndex + 1}-${intervalIndex}`}
                        openPortal={openPortal}
                        setOpenPortal={setOpenPortal}
                      >
                        {coursesRle?.[`${dayIndex + 1}-${intervalIndex}`] ? (
                          <CourseTableCard
                            courseRle={
                              coursesRle[`${dayIndex + 1}-${intervalIndex}`]
                            }
                            h={
                              coursesRle[`${dayIndex + 1}-${intervalIndex}`]
                                .duration *
                                TableCellProperty.h -
                              TABLE_BORDER_WIDTH
                            }
                            w={`${TableCellProperty.w - TABLE_BORDER_WIDTH}px`}
                          />
                        ) : null}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
}

export default CourseTable;
