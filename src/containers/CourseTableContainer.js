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

function CourseTableContainer(props) {
  const [courseTimes, setCourseTimes] = useState({});
  const extract_course_info = () => {
    let course_time_tmp = Object.assign({}, courseTimes);
    if (!course_time_tmp.parsed){
      course_time_tmp.parsed = [];
    }
    if (!course_time_tmp.time_map){
      course_time_tmp.time_map = [];
    }
    Object.keys(props.courses).forEach(key => {
      if (course_time_tmp.parsed.includes(props.courses[key]._id)){
        return;
      }
      props.courses[key].time_loc_pair.map(time_loc_pair => {
        Object.keys(time_loc_pair.time).forEach(day => {
          time_loc_pair.time[day].map(time => {
            if (!(day in course_time_tmp.time_map)) {
              course_time_tmp.time_map[day] = {};
            }
            if (! (time in course_time_tmp.time_map[day])){
              course_time_tmp.time_map[day][time] = [props.courses[key]._id];
            }else{
              course_time_tmp.time_map[day][time].push(props.courses[key]._id);
            }
          })
        })
      })
      course_time_tmp.parsed.push(props.courses[key]._id);
    })
    setCourseTimes(course_time_tmp);
  };
  useEffect(() => {
    extract_course_info();
    console.log(courseTimes);
  }, [props.courses]);
  const days = ["1", "2", "3", "4", "5", "6" ,"7"];
  const interval = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "A", "B", "C", "D"];
  return(
    <Table variant='simple' size='lg'>
      <Thead>
        <Tr>
          {
            days.map((day, j) => {
              return(
                <Th key={j}>{day}</Th>
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
                <Td>{interval}</Td>
                <Td>{interval}</Td>
                <Td>{interval}</Td>
                <Td>{interval}</Td>
                <Td>{interval}</Td>
                <Td>{interval}</Td>
                <Td>{interval}</Td>
              </Tr>
            );
          })
        }
      </Tbody>
    </Table>
  );
}

export default CourseTableContainer;