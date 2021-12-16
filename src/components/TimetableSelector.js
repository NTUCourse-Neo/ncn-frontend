import 
  { 
    Flex,
    Box,
    Button
  } from "@chakra-ui/react";

function TimetableSelector(props) {
  const days = ["7", "1", "2", "3", "4", "5", "6"];
  const intervals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "A", "B", "C", "D"];
  return(
    <Box px="12">
      <Flex flexDirection="row" justifyContent="center" alignItems="center">
        {days.map(day => {
          return(
            <Flex key={day} flexDirection="column" justifyContent="start" alignItems="center" mx="4px">
              {day}
              {intervals.map(interval => {
                return(
                    <Button key={interval} bg="gray.100" w="5vh" h="5vh" my="4px">
                      {interval}
                    </Button>
                );
              })}
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
}


export default TimetableSelector;