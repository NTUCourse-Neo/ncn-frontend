import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Center,
  Box,
  Text,
  Skeleton,
  Tooltip,
} from '@chakra-ui/react'
import { useState } from 'react';
import CourseTableCard from '../components/CourseTableCard';
import { weekdays_map } from '../data/mapping_table';

function CourseTableContainer(props) {
  const days = ["1", "2", "3", "4", "5"];
  const interval = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "A", "B", "C", "D"];
  const [ activeDayCol, setActiveDayCol ] = useState(0);
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
  const renderTableContent = (days, interval, i) => {
    return(
      <Tr key={i+"_Tr"}>
        {
          days.map((day, j) => {
            if(props.loading){
              return(
                <Td>
                  <Skeleton borderRadius="lg" speed={1+(i+j)*0.1}>
                    <Box h="12" w="4vw"/>
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
  };
  const renderTable = () => {
    return(
        <Table variant='simple' colorScheme='blue' borderRadius="lg" w="100%">
        <Thead>
          {
            activeDayCol === 0 ?
            (
              <Tr>
                {
                  days.map((day, j) => {
                    return(
                      <Tooltip hasArrow placement="top" label="點擊展開單日" bg='gray.600' color='white'>
                        <Th key={day+"_Th"} onClick={() => setActiveDayCol(day)} cursor="pointer"><Center key={day+"_Center"}>{weekdays_map[day]}</Center></Th>
                      </Tooltip>
                    );
                  })
                }
              </Tr>
            ):
            (
              <Tr>
                {
                  <Tooltip hasArrow placement="top" label="點擊收合" bg='gray.600' color='white'>
                    <Th onClick={() => setActiveDayCol(0)} cursor="pointer"><Center>{weekdays_map[activeDayCol]}</Center></Th>
                  </Tooltip>
                }
              </Tr>
            )
          }
        </Thead>
        <Tbody>
          {
            interval.map((interval, i) => {
              if(activeDayCol === 0){
                return renderTableContent(days, interval, i);
              }
              return renderTableContent([activeDayCol], interval, i);
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