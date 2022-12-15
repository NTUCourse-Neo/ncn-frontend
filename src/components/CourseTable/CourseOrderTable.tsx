import {
  Flex,
  Box,
  Center,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Th as ChakraTh,
  Td as ChakraTd,
  TableColumnHeaderProps,
  TableCellProps,
  Thead,
} from "@chakra-ui/react";
import { Course } from "@/types/course";
import { CourseTableCellProps } from "@/components/CourseTable/index";
import { customScrollBarCss } from "@/styles/customScrollBar";
import { intervals, days } from "@/constant";

interface CourseTableProps {
  readonly courses: Course[];
  readonly tableCellProperty: CourseTableCellProps;
}

interface ThProps extends TableColumnHeaderProps {
  readonly children: React.ReactNode;
}
const Th: React.FC<ThProps> = ({ children, ...rest }) => {
  return (
    <ChakraTh
      sx={{
        textAlign: "center",
        lineHeight: 1.4,
        color: "#1A181C",
        fontWeight: 500,
        fontSize: "18px",
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
  readonly dayIndex: number;
  readonly intervalIndex: number;
  readonly tableCellProperty: CourseTableCellProps;
}
const Td: React.FC<TdProps> = ({
  children,
  isFirstDay,
  isLastDay,
  isFirstInterval,
  isLastInterval,
  dayIndex,
  intervalIndex,
  tableCellProperty,
  ...rest
}) => {
  const id = `${dayIndex + 1}-${intervalIndex}`;

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
        borderTop: `${tableCellProperty.borderWidth}px solid #CCCCCC${
          isFirstInterval ? "" : "80"
        }`,
        borderLeft: `${tableCellProperty.borderWidth}px solid #CCCCCC${
          isFirstDay ? "" : "80"
        }`,
        borderRight: `${
          isLastDay ? tableCellProperty.borderWidth : 0
        }px solid #CCCCCC`,
        borderBottom: `${
          isLastInterval ? tableCellProperty.borderWidth : 0
        }px solid #CCCCCC`,
        overflow: "visible",
        position: "relative",
      }}
      {...rest}
    >
      <Box
        sx={{
          zIndex: 98,
          position: "absolute",
          top: 0,
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
          top: 0,
          left: 0,
          zIndex: 100,
        }}
        onClick={children !== null ? () => {} : undefined}
      >
        {children}
      </Box>
    </ChakraTd>
  );
};

export default function CourseOrderTable(props: CourseTableProps) {
  const { courses, tableCellProperty } = props;

  return (
    <Flex
      w="100%"
      minH="70vh"
      justifyContent={"center"}
      alignItems="center"
      overflow={"auto"}
      pt={4}
      px={4}
      pb={12}
    >
      <Flex overflowX={"auto"}>
        <Flex flexDirection={"column"}>
          <Box h={`${tableCellProperty.h + 8}px`} />
          {intervals.map((interval) => (
            <Center
              key={interval}
              sx={{
                h: `${tableCellProperty.h}px`,
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
              <Tr h={`${tableCellProperty.h}px`}>
                {days.map((day) => {
                  return (
                    <Th
                      key={day}
                      w={`${tableCellProperty.w}px`}
                      maxW={`${tableCellProperty.w}px`}
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
                    h={`${tableCellProperty.h}px`}
                    maxH={`${tableCellProperty.h}px`}
                  >
                    {days.map((day, dayIndex) => {
                      return (
                        <Td
                          key={dayIndex}
                          minW={`${tableCellProperty.w}px`}
                          w={`${tableCellProperty.w}px`}
                          maxW={`${tableCellProperty.w}px`}
                          minH={`${tableCellProperty.h}px`}
                          h={`${tableCellProperty.h}px`}
                          isFirstDay={dayIndex === 0}
                          isLastDay={dayIndex === days.length - 1}
                          isFirstInterval={intervalIndex === 0}
                          isLastInterval={
                            intervalIndex === intervals.length - 1
                          }
                          dayIndex={dayIndex}
                          intervalIndex={intervalIndex}
                          tableCellProperty={tableCellProperty}
                        >
                          {`${dayIndex + 1}-${intervalIndex}`}
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
    </Flex>
  );
}
