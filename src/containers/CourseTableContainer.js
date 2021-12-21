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

function CourseTableContainer() {
  const days = ["一", "二", "三", "四", "五", "六" ,"日"];
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