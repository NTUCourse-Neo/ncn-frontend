import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Flex,
  Spinner,
  Center,
  Box,
  Text,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import CourseTableCard from '../components/CourseTableCard';
import { weekdays_map } from '../data/mapping_table';

function CourseTableContainer(props) {
  const days = ["1", "2", "3", "4", "5"];
  const interval = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "A", "B", "C", "D"];
  const renderTable = () => {
    if (props.loading){
      return (
        <Flex justifyContent="center" alignItems="center" h="100vh">
          <Spinner />
        </Flex>
      );
    }
    return(
      <Table variant='simple' size='lg' colorScheme='blue'>
      <Thead>
        <Tr>
          {
            days.map((day, j) => {
              return(
                <Th key={j}><Center>{weekdays_map[day]}</Center></Th>
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
                        <Td>
                          <CourseTableCard courseTime={props.courseTimes.time_map[day][interval]} courseData={props.courses} />
                        </Td>
                      );
                    }
                    return(
                      <Td><Flex w="3vw" justifyContent="center" alignItems="center">
                        <Text color="gray.300" fontSize="5xl" fontWeight="700">{interval}</Text>
                      </Flex></Td>
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