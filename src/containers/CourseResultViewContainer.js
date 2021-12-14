import { React, useEffect, useState } from 'react';
import {
    Box,
    Flex,
    Text,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Switch,
    FormControl,
    FormLabel,
    Collapse,
    IconButton,
    Button,
    useToast,
} from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight, } from 'react-icons/fa';
import CourseInfoRowContainer from './CourseInfoRowContainer';
import FilterModal from '../components/FilterModal';
import CourseSearchInput from '../components/CourseSearchInput';
import { setSearchSettings } from '../actions/index';
import {useSelector, useDispatch} from 'react-redux';


function CourseResultViewContainer() {
  const toast = useToast()
  const dispatch = useDispatch();
  const search_results = useSelector(state => state.search_results);
  const search_settings = useSelector(state => state.search_settings);
  const [selectedDept, setSelectedDept] = useState([]);

  const [ timeFilterOn, setTimeFilterOn ] = useState(false);
  const [ deptFilterOn, setDeptFilterOn ] = useState(false);
  const [ catFilterOn, setCatFilterOn ] = useState(false);

  const [ displayFilter, setDisplayFilter ] = useState(false);
  const [ displayTable, setDisplayTable ] = useState(true);

  // search_settings local states
  const [show_selected_courses, set_show_selected_courses] = useState(search_settings.show_selected_courses);
  const [only_show_not_conflicted_courses, set_only_show_not_conflicted_courses] = useState(search_settings.only_show_not_conflicted_courses);
  const [sync_add_to_nol, set_sync_add_to_nol] = useState(search_settings.sync_add_to_nol);
  const [strict_search_mode, set_strict_search_mode] = useState(search_settings.strict_search_mode);

  const renderSettingSwitch = (label, default_checked) => {

        const handleChangeSettings = (e)=>{
            // console.log(e.currentTarget.checked);
            if (label==='顯示已選課程'){
                set_show_selected_courses(e.currentTarget.checked);
            }
            else if (label==='只顯示未衝堂課程'){
                set_only_show_not_conflicted_courses(e.currentTarget.checked);
            }
            else if (label==='同步新增至課程網'){
                set_sync_add_to_nol(e.currentTarget.checked);
            } else if (label==='篩選條件嚴格搜尋'){
                set_strict_search_mode(e.currentTarget.checked);
            }
        }

        return(
            <FormControl display='flex' alignItems='center' my="2">
                <Switch id='add-nol' defaultChecked={default_checked} mr="2" onChange={(e)=>{handleChangeSettings(e)}}/>
                <FormLabel htmlFor='add-nol' mb='0' fontWeight="500" color="gray.600">
                    {label}
                </FormLabel>
            </FormControl>
        );
    };
    return (
        <Flex w="100vw" direction="row" justifyContent="center" alignItems="center" overflow="hidden">
            <Box display="flex" flexBasis="100vw" flexDirection="column" alignItems='center' h="95vh" overflow="auto" maxW="screen-md" mx="auto" pt="64px" pb="40px">
                <Flex w="100%" direction="column" position="sticky" top="0" bgColor="white" zIndex="100" boxShadow="md">
                    <Flex w="100%" px="10vw" py="4" direction="column" >
                        <CourseSearchInput />
                        <Collapse in={displayFilter} animateOpacity>
                            <Box w="100%" py="8px" mt="4">
                                <Tabs>
                                    <TabList>
                                        <Tab><Text color="gray.700" fontSize="xl" fontWeight="700">篩選</Text></Tab>
                                        <Tab><Text color="gray.700" fontSize="xl" fontWeight="700">設定</Text></Tab>
                                    </TabList>
                                    <TabPanels>
                                        <TabPanel>
                                            {/* Filters: time, department, type of courses */}
                                            <Flex flexDirection="row">
                                                <Flex flexDirection="column" w="30%" px="4">
                                                    <Flex flexDirection="row" alignItems="center" justifyContent="center">
                                                    <Switch size="lg" mr="2" onChange={ (e) => {
                                                      setTimeFilterOn(e.currentTarget.checked);
                                                    } }/>
                                                      <FilterModal title="選擇課程時間" toggle={timeFilterOn} type="time" selectedDept={selectedDept} setSelectedDept={setSelectedDept}/>
                                                    </Flex>
                                                </Flex>
                                                <Flex flexDirection="column" w="30%" px="4">
                                                    <Flex flexDirection="row" alignItems="center" justifyContent="center">
                                                      <Switch size="lg" mr="2" onChange={ (e) => {
                                                        setDeptFilterOn(e.currentTarget.checked);
                                                      } }/>
                                                      <FilterModal title={selectedDept.length===0 ? "選擇開課系所" : "已選擇 "+selectedDept.length+" 系所"} toggle={deptFilterOn} type="department" selectedDept={selectedDept} setSelectedDept={setSelectedDept}/>
                                                    </Flex>
                                                </Flex>
                                                <Flex flexDirection="column" w="30%" px="4">
                                                    <Flex flexDirection="row" alignItems="center" justifyContent="center">
                                                    <Switch size="lg" mr="2" onChange={ (e) => {
                                                      setCatFilterOn(e.currentTarget.checked);
                                                    } }/>
                                                    <FilterModal title="選擇課程類別" toggle={catFilterOn} type="category" selectedDept={selectedDept} setSelectedDept={setSelectedDept}/>
                                                    </Flex>
                                                </Flex>
                                                
                                                
                                            </Flex>
                                        </TabPanel>
                                        <TabPanel>
                                            {/* Settings */}
                                            <Flex flexDirection="column" alignItems="center">
                                                {renderSettingSwitch('顯示已選課程', show_selected_courses)}
                                                {renderSettingSwitch('只顯示未衝堂課程', only_show_not_conflicted_courses)}
                                                {renderSettingSwitch('同步新增至課程網', sync_add_to_nol)}
                                                {renderSettingSwitch('篩選條件嚴格搜尋', strict_search_mode)}
                                            </Flex>
                                            <Button mt={5} colorScheme='teal' size='md' onClick={()=>{
                                                dispatch(setSearchSettings({
                                                    show_selected_courses: show_selected_courses,
                                                    only_show_not_conflicted_courses: only_show_not_conflicted_courses,
                                                    sync_add_to_nol: sync_add_to_nol,
                                                    strict_search_mode: strict_search_mode}
                                                ));
                                                toast({
                                                    title: '設定已儲存',
                                                    description: '讚啦',
                                                    status: 'success',
                                                    duration: 1000,
                                                    isClosable: true
                                                })
                                              }
                                            }>套用</Button>
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </Box>
                        </Collapse>
                    </Flex>
                    <IconButton size="xs" variant='ghost' icon={displayFilter? <FaChevronUp />:<FaChevronDown />} onClick={() => setDisplayFilter(!displayFilter)} />
                </Flex>
                <CourseInfoRowContainer courseInfo={search_results} />
            </Box>
            <Button size="xs" h="95vh" variant="ghost" onClick={() => setDisplayTable(!displayTable)}>{displayTable? <FaChevronRight/>:<FaChevronLeft />}</Button>
            <Flex flexBasis={displayTable? "40vw" : "5vw"} h="95vh" bg="gray.100" alignItems="center" justifyContent="center" transition="flex-basis 500ms ease-in-out">
                Table
            </Flex>
        </Flex>
    );
};

export default CourseResultViewContainer;
