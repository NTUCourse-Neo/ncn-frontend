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
import { render } from "@testing-library/react";
import { useState } from "react";
import { college_map } from '../data/college';
import { dept_list } from '../data/department';

function FilterModal(props){
  const renderSelectedDepts = () => {
    if (props.type === "department"){
      return(
        <Flex flexDirection="column" justifyContent="start" alignItems="start" mx="8" mb="4">
        <Flex w="100%" flexWrap="wrap" flexDirection="row" justifyContent="start" alignItems="start">
          {dept_list.map(dept => renderButton(dept, true))} 
        </Flex>
      </Flex>
      );
    }
    return (<></>);
  };
  const handleSelectDept = (value) => {
    var index = props.selectedDept.indexOf(value);
        if (index === -1) {
          props.setSelectedDept([...props.selectedDept, value]);
        } else {
          props.selectedDept.splice(index, 1);
          props.setSelectedDept([...props.selectedDept]);
        }
  };
  const renderButton = (dept, renderSelected) => {
    var index = props.selectedDept.indexOf(dept.code);
    if((index === -1) === !renderSelected){
      return(
        <Button key={dept.code} 
                colorScheme="teal" 
                variant={index === -1 ? "outline":"solid"} 
                size="sm" 
                minW="100px" 
                m="1"
                onClick={()=>handleSelectDept(dept.code)}
                _hover={index === -1 ? { bg: "teal.100" }:{ bg: "red.700" }}>
          <Badge mx="2" colorScheme="blue">{dept.code}</Badge>
          {dept.full_name}
        </Button>
      );
    }else{
      return(<></>);
    }
  };
  const FilterModalContainer = (title, filterOn, type) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
    <>
    <Button isDisabled={!filterOn} onClick={onOpen}>{title}</Button>
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent >
        <ModalHeader>
          <Flex flexDirection="row" justifyContent="start" alignItems="center">
            {title}
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        {renderSelectedDepts()}
        <ModalBody overflow="auto" pt="0">
          {FilterModalBody(type)}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            套用
          </Button>
          <Button variant='ghost' onClick={()=> props.setSelectedDept([])}>重設</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
    );
  };

const FilterModalBody = (type) => {
    if (type === "department"){
      return(
        <>
          {dept_list.map((dept, index) => {
            if (index === 0 || dept.code.substr(1,3) === "000"){
              let college_code = dept.code.substr(0, 1);
              return(
                <>
                <Flex px="2" h="40px" flexDirection="column" justifyContent="center" position="sticky" top="0" mt={index === 0 ? "0":"6"} bgColor="white" zIndex="50">
                  <Heading fontSize="2xl" color="gray.600">{college_code+" "+college_map[college_code].name}</Heading>
                  <Divider/>
                </Flex>
                {renderButton(dept, false)}
                </>
              );
            }
            return(
              renderButton(dept, false)
            );
          })}
        </>
      );
    }
  };
  return FilterModalContainer(props.title, props.toggle, props.type);
}

export default FilterModal;