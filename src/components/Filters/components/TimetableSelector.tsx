import TableDragSelect from "react-table-drag-select";
import { Flex, Text, Box, Center } from "@chakra-ui/react";
import { intervals, days } from "constant";

const intervalToTime = {
  "0": "07:10 ı 08:00",
  "1": "08:10 ı 09:00",
  "2": "09:10 ı 10:00",
  "3": "10:20 ı 11:10",
  "4": "11:20 ı 12:10",
  "5": "12:20 ı 13:10",
  "6": "13:20 ı 14:10",
  "7": "14:20 ı 15:10",
  "8": "15:30 ı 16:20",
  "9": "16:30 ı 17:20",
  "10": "17:30 ı 18:20",
  A: "18:25 ı 19:15",
  B: "19:20 ı 20:10",
  C: "20:15 ı 21:05",
  D: "21:10 ı 22:00",
};

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
            const timeString = intervalToTime[interval];
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
