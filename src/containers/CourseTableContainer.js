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
      <Table variant='simple' size='md' colorScheme='blue'>
      <Thead>
        <Tr>
          {
            days.map((day, j) => {
              return(
                <Th key={day+"_Th"}><Center key={day+"_Center"}>{weekdays_map[day]}</Center></Th>
              );
            })
          }
        </Tr>
      </Thead>
      <Tbody>
        {
          interval.map((interval, i) => {
            return(
              <Tr key={i+"_Tr"}>
                {
                  days.map((day, j) => {
                    if (props.courseTimes.time_map && day in props.courseTimes.time_map && interval in props.courseTimes.time_map[day]){
                      if(props.hoveredCourseTime && day in props.hoveredCourseTime.time_map && interval in props.hoveredCourseTime.time_map[day]){
                        return(
                          <Td>
                            <CourseTableCard isHover={true} courseTime={[]} courseData={props.hoveredCourseTime.course_data} interval={interval} day={weekdays_map[day]}/>
                            <CourseTableCard isHover={false} courseTime={props.courseTimes.time_map[day][interval]} courseData={props.courses} interval={interval} day={weekdays_map[day]}/>
                          </Td>
                        );
                      }
                      return(
                        <Td key={i+"_"+j}>
                          <CourseTableCard isHover={false} courseTime={props.courseTimes.time_map[day][interval]} courseData={props.courses} interval={interval} day={weekdays_map[day]}/>
                        </Td>
                      );
                    }
                    if(props.hoveredCourseTime && day in props.hoveredCourseTime.time_map && interval in props.hoveredCourseTime.time_map[day]){
                      return(
                        <Td key={i+"_"+j}>
                          <CourseTableCard isHover={true} courseTime={[]} courseData={props.hoveredCourseTime.course_data} interval={interval} day={weekdays_map[day]}/>
                        </Td>
                      );
                    }
                    return(
                      <Td key={i+"_"+j}><Flex w="4vw" h="3vh" mb="1" justifyContent="center" alignItems="center">
                        <Text color="gray.300" fontSize="5xl" fontWeight="700" key={i+"_"+j}>{interval}</Text>
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