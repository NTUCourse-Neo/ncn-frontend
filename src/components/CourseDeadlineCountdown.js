import { React } from 'react';
import {
    Text,
    Flex,
    Progress,
    HStack,
    Button,
} from '@chakra-ui/react';
import { FaClock } from 'react-icons/fa';
import { course_select_schedule, ntu_course_select_url, status_map } from '../data/course_select_schedule';

const identify_course_select_schedule = (timestamp) => {
    for (let i = 0; i < course_select_schedule.length; i++) {
        if (timestamp >= course_select_schedule[i].start && timestamp <= course_select_schedule[i].end) {
            if (course_select_schedule[i].end - timestamp <= 86400) {
                return {status_idx: 3, schedule_idx: i};
            }else if(course_select_schedule[i].end - timestamp <= 172800){
                return {status_idx: 2, schedule_idx: i};
            }
            // general
            return {status_idx: 1, schedule_idx: i};
        }
        if (i < course_select_schedule.length - 1 && timestamp <= course_select_schedule[i+1].start && timestamp >= course_select_schedule[i].end){
            return {status_idx: 0, schedule_idx: i+1};
        }
    }
    return {status_idx: -1, schedule_idx: -1};
}

function CourseDeadlineCountdown(){
    const ts = new Date().getTime()/1000;
    const { status_idx, schedule_idx } = identify_course_select_schedule(ts);
    if (status_idx === -1) {
        return (
            <></>
        );
    }
    const elasped_days = status_idx===0 ? Math.floor((course_select_schedule[schedule_idx].start - ts) / 86400) : Math.floor((course_select_schedule[schedule_idx].end - ts) / 86400);
    const elapsed_hours = status_idx===0 ? Math.floor((course_select_schedule[schedule_idx].start - ts) / 3600) % 24 : Math.floor((course_select_schedule[schedule_idx].end - ts) / 3600) % 24;
    const time_percent = status_idx===0 ? 0:(ts - course_select_schedule[schedule_idx].start) / (course_select_schedule[schedule_idx].end - course_select_schedule[schedule_idx].start);
    const process_percent = ((time_percent + schedule_idx)/(course_select_schedule.length-1) * 100);
    return(
        <>
            <Flex w={["80vw","80vw","50vw","25vw"]} justifyContent={["center","start" ]} alignItems="start" flexDirection="column" bg={status_map[status_idx].color} borderRadius="xl" boxShadow="xl" p="4">
                <Flex w="100%" justifyContent="space-between" alignItems="center" wrap="wrap" css={{gap: "2"}}>
                    <Text fontSize="xl" fontWeight="800" color="gray.700" mb="2">{status_map[status_idx].emoji} {course_select_schedule[schedule_idx].name} {status_map[status_idx].name}</Text>
                    <HStack ml="1"><FaClock/><Text fontSize="sm" fontWeight="600" color="gray.700" mb="2"> 尚餘 {elasped_days} 天 {elapsed_hours} 時</Text></HStack>
                </Flex>
                <Progress w="100%" mt="2" colorScheme={status_map[status_idx].color.slice(0,-4)} size='sm' value={process_percent} hasStripe isAnimated/>
                <Flex w="100%" justifyContent="space-between" alignItems="center">
                    {
                        course_select_schedule.map((item, idx) => {
                            return(
                                <Text key={idx} fontSize="xs" fontWeight="600" color="gray.700" mb="2">{item.label}</Text>
                            );
                        })
                    }
                </Flex>
                <Flex w="100%" mt="4" justifyContent="end" alignItems="center">
                    <Button variant="solid" mr="2" size="sm" onClick={()=>{window.open(ntu_course_select_url[0], "_blank")}} colorScheme={status_map[status_idx].color.slice(0,-4)}>選課系統 1</Button>
                    <Button variant="solid" size="sm" onClick={()=>{window.open(ntu_course_select_url[1], "_blank")}} colorScheme={status_map[status_idx].color.slice(0,-4)}>選課系統 2</Button>
                </Flex>
            </Flex>
        </>
    );
}

export default CourseDeadlineCountdown;