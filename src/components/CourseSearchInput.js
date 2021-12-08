import { React } from 'react';
import {
    Flex,
    InputGroup,
    InputLeftElement,
    Input,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuIcon,
    MenuCommand,
    MenuDivider,
    Select,
} from '@chakra-ui/react';
import { Search2Icon, ChevronDownIcon } from "@chakra-ui/icons"
import { FaArrowRight } from 'react-icons/fa';
function CourseSearchInput() {
    return(
        <Flex flexDirection="column">
            <Flex flexDirection="row" alignItems="center" justifyContent="center">
                <Menu closeOnSelect={false} mx="2">
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>搜尋欄位</MenuButton>
                    <MenuList>
                        <MenuOptionGroup type='checkbox'>
                            <MenuItemOption value='course_name'>課程名稱</MenuItemOption>
                            <MenuItemOption value='teacher'>教師</MenuItemOption>
                            <MenuItemOption value='id'>流水號</MenuItemOption>
                            <MenuItemOption value='course_code'>課號</MenuItemOption>
                            <MenuItemOption value='course_id'>課程識別碼</MenuItemOption>
                        </MenuOptionGroup>
                    </MenuList>
                </Menu>
                <InputGroup w="100%">
                    <InputLeftElement children={<Search2Icon color="gray.500"/>} />
                    <Input variant="flushed" size="md" focusBorderColor="teal.500" placeholder="直接搜尋可顯示全部課程"/>
                </InputGroup>
                <Button colorScheme="blue" variant="solid" rightIcon={<FaArrowRight/>}>搜尋</Button>
            </Flex>
        </Flex>
    );
};

export default CourseSearchInput;