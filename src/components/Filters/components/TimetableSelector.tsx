import TableDragSelect from "react-table-drag-select";
import { Flex, Text, Box, Center } from "@chakra-ui/react";
import { intervals, days } from "constant";
import { intervalSource } from "@/types/course";

function TimetableSelector({
  selectedTime,
  setSelectedTime,
}: {
  readonly selectedTime: boolean[][];
  readonly setSelectedTime: (time: boolean[][]) => void;
}) {
  return (
    <Flex flexDirection="column" alignItems={"center"} minW="628px">
      <Flex justifyContent={"end"}>
        <Box w="112px" />
        <Flex flexDirection="row" w="516px" justifyContent="space-around">
          {days.map((day, j) => {
            return (
              <Text
                key={j}
                sx={{
                  fontSize: "17px",
                  lineHeight: "22px",
                  color: "#000",
                }}
              >
                {day}
              </Text>
            );
          })}
        </Flex>
      </Flex>
      <Flex flexDirection="row" justifyContent={"end"}>
        <Flex
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
          w="48px"
          mr="8px"
        >
          {intervals.map((interval, j) => {
            const timeInterval = intervalSource[interval];
            const timeString = `${timeInterval.startAt} ı ${timeInterval.endAt}`;
            return (
              <Flex
                flexDirection={"column"}
                key={j}
                alignItems="center"
                justifyContent="center"
                sx={{
                  fontSize: "11px",
                  lineHeight: "13px",
                  color: "#2d2d2d",
                }}
                w="48px"
                h="48px"
                my="6px"
                bg="#F9F9F9"
                borderRadius={"4px"}
              >
                {timeString.split(" ").map((t, i) => (
                  <Text key={`${t}-${i}`}>{t}</Text>
                ))}
              </Flex>
            );
          })}
        </Flex>
        <Flex
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
          w="48px"
          mr="8px"
        >
          {intervals.map((interval, j) => {
            return (
              <Center
                key={j}
                sx={{
                  fontSize: "17px",
                  lineHeight: "22px",
                  color: "#000",
                }}
                w="48px"
                h="48px"
                my="6px"
              >
                {interval}
              </Center>
            );
          })}
        </Flex>
        <Flex w="516px" m={0} p={0}>
          <TableDragSelect
            value={selectedTime}
            onChange={(new_time_table: boolean[][]) =>
              setSelectedTime(new_time_table)
            }
          >
            {intervals.map((day, i) => {
              return (
                <tr key={i}>
                  {days.map((interval, j) => {
                    return (
                      <td
                        key={j}
                        style={{
                          width: "72px",
                          height: "60px",
                        }}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </TableDragSelect>
        </Flex>
      </Flex>
    </Flex>
  );
}
export default TimetableSelector;
