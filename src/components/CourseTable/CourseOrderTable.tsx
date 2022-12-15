import { Flex, Box, Td as ChakraTd, TableCellProps } from "@chakra-ui/react";
import { CourseTable } from "@/types/courseTable";
import { CourseTableCellProps } from "@/components/CourseTable/NeoCourseTable";
import { intervals, days } from "@/constant";
import NeoCourseTable from "@/components/CourseTable/NeoCourseTable";

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

interface CourseOrderTableProps {
  readonly courseTable: CourseTable | null;
  readonly tableCellProperty: CourseTableCellProps;
}

export default function CourseOrderTable(props: CourseOrderTableProps) {
  const { courseTable, tableCellProperty } = props;

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
      <NeoCourseTable
        tableCellProperty={tableCellProperty}
        renderCustomCell={(dayIndex, intervalIndex) => {
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
              isLastInterval={intervalIndex === intervals.length - 1}
              dayIndex={dayIndex}
              intervalIndex={intervalIndex}
              tableCellProperty={tableCellProperty}
            >{`${dayIndex + 1}-${intervalIndex}`}</Td>
          );
        }}
      />
    </Flex>
  );
}
