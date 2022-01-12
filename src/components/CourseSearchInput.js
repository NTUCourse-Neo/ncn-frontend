import { React, useEffect, useState } from 'react';
import {
    Flex,
    InputGroup,
    InputLeftElement,
    Input,
    Button,
    Menu,
    MenuButton,
    MenuList,
    useToast,
    MenuItemOption,
    MenuOptionGroup
} from '@chakra-ui/react';
import { Search2Icon, ChevronDownIcon } from "@chakra-ui/icons"
import { FaArrowRight } from 'react-icons/fa';

import {setSearchColumn,fetchSearchIDs} from '../actions/index'
import {useDispatch, useSelector} from 'react-redux'
import { useNavigate } from "react-router-dom";

function CourseSearchInput() {
    const navigate = useNavigate();
    const toast = useToast();

    const search_columns = useSelector(state => state.search_columns)
    const search_filters = useSelector(state => state.search_filters)
    const batch_size = useSelector(state => state.batch_size)
    const strict_match = useSelector(state => state.search_settings.strict_search_mode)
    const search_filters_enable = useSelector(state => state.search_filters_enable)

    const [search, setSearch]=useState('')
    

    const dispatch = useDispatch()

    const toggle_search_column = (e)=>{
        dispatch(setSearchColumn(e.currentTarget.value))
    }

    useEffect(() => {
        setSearch('')
    },[])

    return(
        <Flex flexDirection="column">
            <Flex flexDirection="row" alignItems="center" justifyContent="center">
                <Menu closeOnSelect={false} mx="2">
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>搜尋欄位</MenuButton>
                    <MenuList>
                        <MenuOptionGroup defaultValue={['course_name', 'teacher', 'id', 'course_code', 'course_id']} type='checkbox'>
                            <MenuItemOption value='course_name'  onClick={(e)=>{toggle_search_column(e)}}>課程名稱</MenuItemOption>
                            <MenuItemOption value='teacher' onClick={(e)=>{toggle_search_column(e)}}>教師</MenuItemOption>
                            <MenuItemOption value='id' onClick={(e)=>{toggle_search_column(e)}}>流水號</MenuItemOption>
                            <MenuItemOption value='course_code' onClick={(e)=>{toggle_search_column(e)}}>課號</MenuItemOption>
                            <MenuItemOption value='course_id' onClick={(e)=>{toggle_search_column(e)}}>課程識別碼</MenuItemOption>
                        </MenuOptionGroup>
                    </MenuList>
                </Menu>
                <InputGroup w="80%">
                    <InputLeftElement children={<Search2Icon color="gray.500"/>} />
                    <Input variant="flushed" size="md" focusBorderColor="teal.500" placeholder="直接搜尋可顯示全部課程" value={search} 
                        onChange={(e)=>{setSearch(e.target.value)}} 
                        onKeyPress={(e)=>{if (e.key === 'Enter') {
                            try {
                                dispatch(fetchSearchIDs(search, search_columns, search_filters_enable, search_filters, batch_size, strict_match))
                            } catch (error) {
                                if (error>=500){
                                    navigate(`/error/${error}`);
                                } else {
                                    toast({
                                        title: '搜尋失敗',
                                        description: '請檢查網路連線，或聯絡系統管理員',
                                        status: 'error',
                                        duration: 3000,
                                        isClosable: true
                                    });
                                }
                            }
                        }}}
                    />
                </InputGroup>
                <Button colorScheme="blue" variant="solid" rightIcon={<FaArrowRight/>} onClick={()=>{
                    try {
                        dispatch(fetchSearchIDs(search, search_columns, search_filters_enable, search_filters, batch_size, strict_match))
                    } catch (error) {
                        if (error>=500){
                            navigate(`/error/${error}`);
                        } else {
                            toast({
                                title: '搜尋失敗',
                                description: '請檢查網路連線，或聯絡系統管理員',
                                status: 'error',
                                duration: 3000,
                                isClosable: true
                            });
                        }
                    }
                }
                }>搜尋</Button>
            </Flex>
        </Flex>
    );
};

export default CourseSearchInput;