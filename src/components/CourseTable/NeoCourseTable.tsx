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
  Thead,
} from "@chakra-ui/react";
import { intervals, days } from "@/constant";
import { customScrollBarCss } from "@/styles/customScrollBar";
import React from "react";

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

export interface CourseTableCellProps {
  readonly w: number;
  readonly h: number;
  readonly borderWidth: number;
}

export interface NeoCourseTableProps {
  readonly tableCellProperty: CourseTableCellProps;
  readonly renderCustomCell: (
    dayIndex: number,
    intervalIndex: number
  ) => React.ReactNode;
}

export default function NeoCourseTable(props: NeoCourseTableProps) {
  const { tableCellProperty, renderCustomCell } = props;

  return (
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
                      <React.Fragment key={`${dayIndex}-${intervalIndex}`}>
                        {renderCustomCell(dayIndex, intervalIndex)}
                      </React.Fragment>
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
