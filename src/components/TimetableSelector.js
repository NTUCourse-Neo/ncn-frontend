import React from "react";
import TableDragSelect from "react-table-drag-select";
import "react-table-drag-select/style.css";
import { Flex, Text } from '@chakra-ui/react';
 
class TimetableSelector extends React.Component {
  state = {
    cells: [
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
    ]
  };
  days = ["日", "一", "二", "三", "四", "五", "六"];
  interval = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "A", "B", "C", "D"];
 
  render = () =>
  <Flex px="20" flexDirection="column">
    <Flex flexDirection="row" justifyContent="space-between" mx="4vw">
      {this.days.map((day, j) => {
        return (
          <Text key={j} fontWeight="700" fontSize="xl" color="gray.500">{day}</Text>
        );
      })}
    </Flex>
    <Flex flexDirection="row">
      <Flex flexDirection="column" justifyContent="space-between" my="1vw" alignItems="center" mr="2">
        {this.interval.map((interval, j) => {
          return (
            <Text key={j} fontWeight="700" fontSize="xl" color="gray.400">{interval}</Text>
          );
        })}
      </Flex>
      <TableDragSelect value={this.state.cells} onChange={cells => this.setState({ cells })}>
        {this.interval.map((day, i) =>{
          return (
            <tr key={i}>
              {this.days.map((interval, j) => {
                return (
                  <td key={j} />
                );
              })}
            </tr>
          );
        })}
      </TableDragSelect>
      <Flex flexDirection="column" justifyContent="space-between" my="1vw" alignItems="center" ml="2">
        {this.interval.map((interval, j) => {
          return (
            <Text key={j} fontWeight="700" fontSize="xl" color="gray.400">{interval}</Text>
          );
        })}
      </Flex>
    </Flex>
  </Flex>
}
export default TimetableSelector