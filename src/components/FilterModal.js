import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Badge,
  Button,
  Heading,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { college_map } from '../data/college';
import { dept_list, dept_list_bachelor_only } from '../data/department';
import { type_list, code_map } from '../data/course_type';
import TimetableSelector from "./TimetableSelector";
import {useSelector, useDispatch} from 'react-redux';
import {setFilter} from '../actions';
import { mapStateToTimeTable } from "../utils/timeTableConverter";

function FilterModal(props){
  const dispatch = useDispatch();
  const time_state = useSelector(state => state.search_filters.time);
  const department_state = useSelector(state => state.search_filters.department);
  const category_state = useSelector(state => state.search_filters.category);

  const handleSet = (type) => {
    if (type==='department'){
      dispatch(setFilter('department', props.selectedDept));
    }
    else if (type==='time'){
      // turn 15x7 2D array (selectedTime) to 7x15 array
      let timeTable = [[],[],[],[],[],[],[]];
      const intervals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "A", "B", "C", "D"];
      for (let i=0;i<intervals.length;i++){
        let interval = intervals[i]
        for (let j=0;j<7;j++){
          if (props.selectedTime[i][j] === true){
            timeTable[j].push(interval)
          }
        }
      }
      dispatch(setFilter('time', timeTable));      
    }
    else if (type==='category'){
      dispatch(setFilter('category', props.selectedType));
    }
  }

  const renderSelectedHeader = () => {
    if (props.type === "department"){
      return(
        <Flex flexDirection="column" justifyContent="start" alignItems="start" mx="8" mb="4">
        <Flex w="100%" flexWrap="wrap" flexDirection="row" justifyContent="start" alignItems="start">
          {dept_list_bachelor_only.map(dept => renderButton("department", dept, props.selectedDept, props.setSelectedDept, true))} 
        </Flex>
      </Flex>
      );
    }
    if (props.type === "category"){
      return(
        <Flex flexDirection="column" justifyContent="start" alignItems="start" mx="8" mb="4">
        <Flex w="100%" flexWrap="wrap" flexDirection="row" justifyContent="start" alignItems="start">
          {type_list.map(category => renderButton("category", category, props.selectedType, props.setSelectedType, true))} 
        </Flex>
        </Flex>
      );
    }
    return (<></>);
  };

  // for dept and category
  const handleSelect = (value, selected, setSelected) => {
    let index = selected.indexOf(value);
        if (index === -1) {
          setSelected([...selected, value]);
        } else {
          selected.splice(index, 1);
          setSelected([...selected]);
        }
  };
  // for dept and category
  const renderButton = (type, data, selected, setSelected, renderSelected) => {
    let key;
    switch(type){
      case "department":
        key = data.code
        break;
      case "category":
        key = data.id
        break;
      default:
        key = data.code
    }
    let index = selected.indexOf(key);
    if((index === -1) === !renderSelected){
      return(
        <Button key={key} 
                colorScheme="teal" 
                variant={index === -1 ? "outline":"solid"} 
                size="sm" 
                minW="100px" 
                m="1"
                onClick={()=>handleSelect(key, selected, setSelected)}
                _hover={index === -1 ? { bg: "teal.100" }:{ bg: "red.700" }}>
          <Badge mx="2" colorScheme="blue" key={key}>{data.code}</Badge>
          {data.full_name}
        </Button>
      );
    }else{
      return(<></>);
    }
  };
  const FilterModalContainer = (title, filterOn, type) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    let setSelected;
    switch(type){
      case "department":
        setSelected = props.setSelectedDept;
        break;
      case "category":
        setSelected = props.setSelectedType;
        break;
      case "time":
        // used when reset
        setSelected = ()=>{props.setSelectedTime([
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
        ])};
        break;
      default:
        setSelected = ()=>{console.log('setSelected undefined!')};
        break;
    }
    return (
    <>
    <Button isDisabled={!filterOn} onClick={()=>{
      onOpen();
      // because this modal will not re-render, so manually reload from redux state 
      if (props.type==='time'){
        props.setSelectedTime(mapStateToTimeTable(time_state));
      }
    }}>{title}</Button>
    <Modal isOpen={isOpen} onClose={()=>{
      // when click "X", overwrite local state from redux state
      if (type==="department"){
        setSelected(department_state);
      }
      else if (type==="category"){
        setSelected(category_state);
      }
      onClose();
    }} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxW="50vw">
        <ModalHeader>
          <Flex flexDirection="row" justifyContent="start" alignItems="center">
            {title}
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        {renderSelectedHeader()}
        <ModalBody overflow="auto" pt="0">
          {FilterModalBody(type)}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={()=>{
            onClose();
            handleSet(props.type);
          }}>
            套用
          </Button>
          <Button variant='ghost' onClick={()=> setSelected([])}>重設</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
    );
  };

const FilterModalBody = (type) => {
    if (type === "time"){
      return (
        <TimetableSelector selectedTime={props.selectedTime} setSelectedTime={props.setSelectedTime}/>
      );
    }
    if (type === "department"){
      return(
        <>
          {dept_list_bachelor_only.map((dept, index) => {
            if (index === 0 || dept.code.substr(0,1) !== dept_list_bachelor_only[index-1].code.substr(0,1)){
              let college_code = dept.code.substr(0, 1);
              return(
                <>
                <Flex key={dept.code} px="2" h="40px" flexDirection="column" justifyContent="center" position="sticky" top="0" mt={index === 0 ? "0":"6"} bgColor="white" zIndex="50">
                  <Heading key={dept.code} fontSize="2xl" color="gray.600">{college_code+" "+college_map[college_code].name}</Heading>
                  <Divider key={dept.code}/>
                </Flex>
                {renderButton("department", dept, props.selectedDept, props.setSelectedDept, false)}
                </>
              );
            }
            return(
              renderButton("department", dept, props.selectedDept, props.setSelectedDept, false)
            );
          })}
        </>
      );
    }
    if (type === "category"){
      return(
        <>
          {type_list.map((type, index) => {
            if (index === 0 || type.code.substr(0,1) !== type_list[index-1].code.substr(0,1)){
              return(
                <>
                <Flex key={type.id} px="2" h="40px" flexDirection="column" justifyContent="center" position="sticky" top="0" mt={index === 0 ? "0":"6"} bgColor="white" zIndex="50">
                  <Heading key={type.id} fontSize="2xl" color="gray.600">{code_map[type.code.substr(0,1)].name}</Heading>
                  <Divider key={type.id}/>
                </Flex>
                {renderButton("category", type, props.selectedType, props.setSelectedType, false)}
                </>
              );
            }
            return(
              renderButton("category", type, props.selectedType, props.setSelectedType, false)
            );
          })}
        </>
      );
    }
  };
  return FilterModalContainer(props.title, props.toggle, props.type);
}

export default FilterModal;