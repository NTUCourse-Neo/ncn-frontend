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
} from "@chakra-ui/react";

import { intervals } from "@/constant";
import courses2rle from "@/utils/courses2rle";

// TODO: add courseTableCard components

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
}
const Td: React.FC<TdProps> = ({
  children,
  isFirstDay,
  isLastDay,
  isFirstInterval,
  isLastInterval,
  ...rest
}) => {
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
        borderTop: `${isFirstInterval ? 2 : 1}px solid #CCCCCC`,
        borderLeft: `${isFirstDay ? 2 : 1}px solid #CCCCCC`,
        borderRight: `${isLastDay ? 2 : 1}px solid #CCCCCC`,
        borderBottom: `${isLastInterval ? 2 : 1}px solid #CCCCCC`,
        overflow: "visible",
        position: "relative",
        bg: "linear-gradient(0deg, rgba(204, 204, 204, 0.24), rgba(204, 204, 204, 0.24)), #FFFFFF",
      }}
      {...rest}
    >
      <Flex
        position="absolute"
        sx={{
          top: isFirstInterval ? "-1px" : 0,
          left: 0,
          zIndex: 100,
        }}
      >
        {children}
      </Flex>
    </ChakraTd>
  );
};

interface CourseTableProps {
  readonly courses: Course[];
}

function CourseTable(props: CourseTableProps) {
  const { courses } = props;
  const days = ["一", "二", "三", "四", "五", "六"];
  const tableCellProperty = {
    w: 100,
    h: 50,
  } as const;

  console.log(courses2rle(courses));

  return (
    <Flex>
      <Flex flexDirection={"column"}>
        <Box h={`${tableCellProperty.h + 8}px`} />
        {intervals.map((interval) => (
          <Center
            flexGrow={1}
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
      <TableContainer>
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
                  <Th key={day}>
                    <Center minW={`${tableCellProperty.w}px`}>{day}</Center>
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
                        minH={`${tableCellProperty.h}px`}
                        h={`${tableCellProperty.h}px`}
                        isFirstDay={dayIndex === 0}
                        isLastDay={dayIndex === days.length - 1}
                        isFirstInterval={intervalIndex === 0}
                        isLastInterval={intervalIndex === intervals.length - 1}
                      >
                        {(dayIndex === 0 && intervalIndex === 0) ||
                        (dayIndex === 1 && intervalIndex === 1) ? (
                          <Box h="98px" w="100px" bg="red" />
                        ) : (
                          <Box>{`${dayIndex} ${intervalIndex}`}</Box>
                        )}
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
