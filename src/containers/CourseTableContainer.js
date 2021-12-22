import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import { weekdays_map } from '../data/mapping_table';

function CourseTableContainer(props) {
  const days = ["1", "2", "3", "4", "5", "6" ,"7"];
  const interval = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "A", "B", "C", "D"];
  const renderTable = () => {
    if (props.loading){
      return (<div>Loading...</div>);
    }
    return(
      <Table variant='simple' size='lg'>
      <Thead>
        <Tr>
          {
            days.map((day, j) => {
              return(
                <Th key={j}>{weekdays_map[day]}</Th>
              );
            })
          }
        </Tr>
      </Thead>
      <Tbody>
        {
          interval.map((interval, i) => {
            return(
              <Tr key={i}>
                {
                  days.map((day, j) => {
                    if (props.courseTimes.time_map && day in props.courseTimes.time_map && interval in props.courseTimes.time_map[day]){
                      return(
                        <Td>{props.courseTimes.time_map[day][interval]}</Td>
                      );
                    }
                    return(
                      <Td>{interval}</Td>
                    );
                  })
                }
              </Tr>
            );
          })
        }
      </Tbody>
    </Table>
    );
  }
  return(
    <>
      {renderTable()}
    </>
  );
}

export default CourseTableContainer;