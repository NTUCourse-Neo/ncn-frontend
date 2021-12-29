// write all function that generate actions here
import {FETCH_SEARCH_RESULTS_FAILURE, FETCH_SEARCH_RESULTS_SUCCESS,FETCH_SEARCH_RESULTS_REQUEST,FETCH_SEARCH_IDS_FAILURE,FETCH_SEARCH_IDS_REQUEST,FETCH_SEARCH_IDS_SUCCESS,SET_SEARCH_COLUMN, SET_SEARCH_SETTINGS, SET_FILTERS, INCREMENT_OFFSET, UPDATE_TOTAL_COUNT, SET_FILTERS_ENABLE, UPDATE_COURSE_TABLE} from '../constants/action-types';
import instance from '../api/axios'

// normal actions
const setSearchColumn = (col_name) => ({ type: SET_SEARCH_COLUMN, payload: col_name });
const setSearchSettings = (setting_obj)=>({type: SET_SEARCH_SETTINGS, payload: setting_obj});
const setFilterEnable = (filter_name, enable) => ({type: SET_FILTERS_ENABLE, filter_name: filter_name, payload: enable});

// data = 
// when filter_name == 'department', arr of dept_code (4-digits),
// when filter_name == 'time', 2D array, each subarray have length == 15
// when filter_name == 'category', arr of string (type of courses),
// when filter_name == 'enroll_method', arr of string (type of enroll method)
const setFilter = (filter_name, data)=>({type: SET_FILTERS, filter_name: filter_name, payload: data});

// async actions (used redux-thunk template)
const fetchSearchIDs = (searchString, paths, filters_enable, filter_obj, batch_size, strict_match_bool) => async (dispatch)=>{
    dispatch({type: FETCH_SEARCH_IDS_REQUEST});

    try {
        const {data: {ids}} = await instance.post(`/courses/search`, {query: searchString, paths: paths});
        // console.log(ids); // checking receive array of courses 
        dispatch({type: FETCH_SEARCH_IDS_SUCCESS, payload: ids});

        // fetch batch 0 first
        dispatch({type: FETCH_SEARCH_RESULTS_REQUEST});
        try {
            let search_filter={...filter_obj, strict_match: strict_match_bool};
            if (filters_enable.time===false){search_filter.time=null;}
            if (filters_enable.department===false){search_filter.department=null;}
            if (filters_enable.category===false){search_filter.category=null;}
            if (filters_enable.enroll_method===false){search_filter.enroll_method=null;}
            const {data: {courses, total_count}} = await instance.post(`/courses/ids`, {ids: ids, filter: search_filter, batch_size: batch_size, offset: 0});
            dispatch({type: FETCH_SEARCH_RESULTS_SUCCESS, payload: courses});
            // increment offset
            dispatch({type: INCREMENT_OFFSET});
            // update total_results count
            dispatch({type: UPDATE_TOTAL_COUNT, payload: total_count})
        } catch (error) {
            dispatch({type: FETCH_SEARCH_RESULTS_FAILURE, payload: error});
            throw new Error("FETCH_SEARCH_RESULTS_FAILURE: "+error)
        }

        return ids
    } catch (error) {
        dispatch({type: FETCH_SEARCH_IDS_FAILURE, payload: error});
        throw new Error("FETCH_SEARCH_IDS_FAILURE: "+error)
    }
}

const fetchSearchResults = (ids_arr, filters_enable, filter_obj, batch_size, offset, strict_match_bool) =>async (dispatch)=>{
    dispatch({type: FETCH_SEARCH_RESULTS_REQUEST});

    try {
        let search_filter={...filter_obj, strict_match: strict_match_bool};
        if (filters_enable.time===false){search_filter.time=null;}
        if (filters_enable.department===false){search_filter.department=null;}
        if (filters_enable.category===false){search_filter.category=null;}
        if (filters_enable.enroll_method===false){search_filter.enroll_method=null;}
        const {data: {courses}} = await instance.post(`/courses/ids`, {ids: ids_arr, filter: search_filter, batch_size: batch_size, offset: offset});
        // console.log(courses); // checking receive array of courses 
        dispatch({type: FETCH_SEARCH_RESULTS_SUCCESS, payload: courses});
        // increment offset
        dispatch({type: INCREMENT_OFFSET});
        return courses
    } catch (error) {
        dispatch({type: FETCH_SEARCH_RESULTS_FAILURE, payload: error});
        throw new Error("FETCH_SEARCH_RESULTS_FAILURE: "+error)
    }
}

// used in SideCourseTableContainer initialization, to fetch all course objects by ids
const fetchCourseTableCoursesByIds = (ids_arr) => async (dispatch)=>{
    try {
        let search_filter={strict_match:false, time: null, department: null, category: null, enroll_method: null};
        let batch_size=15000; // max batch size
        let offset=0;
        const {data: {courses}} = await instance.post(`/courses/ids`, {ids: ids_arr, filter: search_filter, batch_size: batch_size, offset: offset});
        return courses
    }
    catch (e){
        throw new Error("Error in fetchCoursesByIds: "+e);
    }
};

const createCourseTable = (course_table_id, course_table_name, user_id, semester) => async (dispatch)=>{
    try {
        const {data: {course_table}} = await instance.post(`/course_tables/`, {id: course_table_id, name: course_table_name, user_id: user_id, semester: semester});
        dispatch({type: UPDATE_COURSE_TABLE, payload: course_table});
        return course_table
    }
    catch (e){
        if (e.response){
            console.log('ERROR MESSAGE: ',e.response.data.message);
            console.log('ERROR STATUS CODE: ',e.response.status);
        }
        throw new Error("Error in createCourseTable: "+e);
    }
}

const fetchCourseTable = (course_table_id) => async (dispatch)=>{
    try {
        const {data: {course_table}} = await instance.get(`/course_tables/${course_table_id}`);
        dispatch({type: UPDATE_COURSE_TABLE, payload: course_table});
        return course_table
    }
    catch (e){
        if (e.response) {
            if (e.response.status===403) {
                // expired course_table
                // if fetch expired course_table, return null and handle it by frontend logic
                dispatch({type: UPDATE_COURSE_TABLE, payload: null});
                return null
            }
        } else {
            throw new Error("Error in fetchCourseTable: "+e);
        }
    }
}

const patchCourseTable = (course_table_id, course_table_name, user_id, expire_ts, courses) => async (dispatch)=>{
    try {
        const {data: {course_table}} = await instance.patch(`/course_tables/${course_table_id}`, {name: course_table_name, user_id: user_id, expire_ts: expire_ts, courses: courses});
        dispatch({type: UPDATE_COURSE_TABLE, payload: course_table});
        return course_table
    }
    catch (e){
        if (e.response) {
            let data = e.response.data;
            if (e.response.status===403 && data.message==='expire_ts is earlier than current time') {
                // expired course_table
                dispatch({type: UPDATE_COURSE_TABLE, payload: null});
                return null
            } else {
                throw new Error("Error in patchCourseTable: "+e);
            }
        } else {
            throw new Error("Error in patchCourseTable: "+e);
        }
    }
}

export {setSearchColumn,setSearchSettings,fetchSearchIDs, fetchSearchResults, setFilter, setFilterEnable, fetchCourseTableCoursesByIds, createCourseTable, fetchCourseTable, patchCourseTable}