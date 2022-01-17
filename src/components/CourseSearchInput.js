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
    MenuOptionGroup,
    Badge,
    useMediaQuery,
    Spacer
} from '@chakra-ui/react';
import { Search2Icon, ChevronDownIcon } from "@chakra-ui/icons"
import { FaSearch } from 'react-icons/fa';

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
    const [isMobile] = useMediaQuery("(max-width: 760px)")

    const [search, setSearch]=useState('')
    

    const dispatch = useDispatch()

    const toggle_search_column = (e)=>{
        dispatch(setSearchColumn(e.currentTarget.value))
    }

    useEffect(() => {
        setSearch('')
    },[])

    const startSearch = () => {
        // console.log(search_columns);
        if (search_columns.length===0){
            toast({
                title: '搜尋失敗',
                description: '您必須指定至少一個搜尋欄位',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
            return;
        }
        try {
            dispatch(fetchSearchIDs(search, search_columns, search_filters_enable, search_filters, batch_size, strict_match))
        } catch (error) {
            if (error>=500){
                navigate(`/error/${error}`, { state: { valid: true }});
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

    return(
        <Flex flexDirection="column">
            <Flex flexDirection="row" alignItems="center" justifyContent={["start","start","center","center"]} flexWrap="wrap" css={{gap: "10px"}}>
                <Menu closeOnSelect={false} mx="2">
                    <MenuButton as={Button} size={isMobile? "sm":"md"} rightIcon={<ChevronDownIcon />}>搜尋欄位</MenuButton>
                    <MenuList>
                        <MenuOptionGroup defaultValue={['course_name', 'teacher']} type='checkbox'>
                            <MenuItemOption value='course_name'  onClick={(e)=>{toggle_search_column(e)}}>課程名稱 <Badge>預設</Badge></MenuItemOption>
                            <MenuItemOption value='teacher' onClick={(e)=>{toggle_search_column(e)}}>教師</MenuItemOption>
                            <MenuItemOption value='id' onClick={(e)=>{toggle_search_column(e)}} isDisabled>流水號 <Badge colorScheme="blue">即將推出</Badge></MenuItemOption>
                            <MenuItemOption value='course_code' onClick={(e)=>{toggle_search_column(e)}} isDisabled>課號 <Badge colorScheme="blue">即將推出</Badge></MenuItemOption>
                            <MenuItemOption value='course_id' onClick={(e)=>{toggle_search_column(e)}} isDisabled>課程識別碼 <Badge colorScheme="blue">即將推出</Badge></MenuItemOption>
                        </MenuOptionGroup>
                    </MenuList>
                </Menu>
                <InputGroup w={["70%", "60%", "60%","60%"]}>
                    <InputLeftElement children={<Search2Icon color="gray.500"/>} />
                    <Input variant="flushed" size="md" focusBorderColor="teal.500" placeholder="直接搜尋可顯示全部課程" value={search} 
                        onChange={(e)=>{setSearch(e.target.value)}} 
                        onKeyPress={(e)=>{if (e.key === 'Enter') {
                            startSearch();
                        }}}
                    />
                </InputGroup>
                {isMobile? <Spacer />:<></>}
                <Button colorScheme="blue" size={isMobile? "sm":"md"} variant="solid" leftIcon={<FaSearch/>} onClick={()=>{
                    startSearch();}}>
                      {isMobile? "":"搜尋"}
                </Button>
            </Flex>
        </Flex>
    );
};

export default CourseSearchInput;