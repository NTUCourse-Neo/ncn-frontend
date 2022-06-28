import { React } from "react";
import TableDragSelect from "react-table-drag-select";
import "react-table-drag-select/style.css";
import { Flex, Text } from "@chakra-ui/react";

function TimetableSelector({ selectedTime, setSelectedTime }) {
  const days = ["一", "二", "三", "四", "五", "六", "日"];
  const interval = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "A", "B", "C", "D"];

  return (
    <Flex px={{ base: "1", md: "20" }} flexDirection="column">
      <Flex flexDirection="row" justifyContent="space-around" mx={{ base: 6, md: 10 }}>
        {days.map((day, j) => {
          return (
            <Text key={j} fontWeight="700" fontSize={{ base: "md", md: "xl" }} color="gray.500">
              {day}
            </Text>
          );
        })}
      </Flex>
      <Flex flexDirection="row">
        <Flex flexDirection="column" justifyContent="space-between" my="1vw" alignItems="center" mr={{ base: "0", md: "2" }}>
          {interval.map((interval, j) => {
            return (
              <Text key={j} fontWeight="700" fontSize={{ base: "md", md: "xl" }} color="gray.400">
                {interval}
              </Text>
            );
          })}
        </Flex>
        <TableDragSelect value={selectedTime} onChange={(new_time_table) => setSelectedTime(new_time_table)}>
          {interval.map((day, i) => {
            return (
              <tr key={i}>
                {days.map((interval, j) => {
                  return <td key={j} />;
                })}
              </tr>
            );
          })}
        </TableDragSelect>
        <Flex flexDirection="column" justifyContent="space-between" my="1vw" alignItems="center" ml={{ base: "0", md: "2" }}>
          {interval.map((interval, j) => {
            return (
              <Text key={j} fontWeight="700" fontSize={{ base: "md", md: "xl" }} color="gray.400">
                {interval}
              </Text>
            );
          })}
        </Flex>
      </Flex>
    </Flex>
  );
}
export default TimetableSelector;
