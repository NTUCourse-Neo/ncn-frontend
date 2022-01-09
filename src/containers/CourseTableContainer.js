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
  Skeleton,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import CourseTableCard from '../components/CourseTableCard';
import { weekdays_map } from '../data/mapping_table';

function CourseTableContainer(props) {
  const days = ["1", "2", "3", "4", "5"];
  const interval = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "A", "B", "C", "D"];
  const renderCourseBox = (course, hover, day, interval) => {
    if (course.time_map[day][interval].includes(hover.time_map[day][interval][0])){
      return(
        <CourseTableCard hoverId={hover.time_map[day][interval][0]} courseTime={course.time_map[day][interval]} courseData={props.courses} interval={interval} day={weekdays_map[day]}/>
      );
    }
    return(
      <>
        <CourseTableCard isHover courseTime={course.time_map[day][interval]} courseData={hover.course_data} interval={interval} day={weekdays_map[day]}/>
        <CourseTableCard courseTime={course.time_map[day][interval]} courseData={props.courses} interval={interval} day={weekdays_map[day]}/>
      </>
    );
  };
  const renderTable = () => {
    return(
        <Table variant='simple' colorScheme='blue' borderRadius="lg" w="100%">
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
                      if(props.loading){
                        return(
                          <Td>
                            <Skeleton borderRadius="lg" speed={1+(i+j)*0.1}>
                              <Box h="12"/>
                            </Skeleton>
                          </Td>
                        );
                      }
                      if (props.courseTimes.time_map && day in props.courseTimes.time_map && interval in props.courseTimes.time_map[day]){
                        if(props.hoveredCourse && props.hoveredCourseTime && day in props.hoveredCourseTime.time_map && interval in props.hoveredCourseTime.time_map[day]){
                          return(
                            <Td>
                              {renderCourseBox(props.courseTimes, props.hoveredCourseTime, day, interval)}
                            </Td>
                          );
                        }
                        return(
                          <Td key={i+"_"+j}>
                            <CourseTableCard courseTime={props.courseTimes.time_map[day][interval]} courseData={props.courses} interval={interval} day={weekdays_map[day]}/>
                          </Td>
                        );
                      }
                      if(props.hoveredCourse && props.hoveredCourseTime && day in props.hoveredCourseTime.time_map && interval in props.hoveredCourseTime.time_map[day]){
                        return(
                          <Td key={i+"_"+j}>
                            <CourseTableCard isHover courseTime={[]} courseData={props.hoveredCourseTime.course_data} interval={interval} day={weekdays_map[day]}/>
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