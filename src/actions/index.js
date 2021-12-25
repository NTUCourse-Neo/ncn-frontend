// write all function that generate actions here
import {FETCH_SEARCH_RESULTS_FAILURE, FETCH_SEARCH_RESULTS_SUCCESS,FETCH_SEARCH_RESULTS_REQUEST,FETCH_SEARCH_IDS_FAILURE,FETCH_SEARCH_IDS_REQUEST,FETCH_SEARCH_IDS_SUCCESS,SET_SEARCH_COLUMN, SET_SEARCH_SETTINGS, SET_FILTERS, INCREMENT_OFFSET, UPDATE_TOTAL_COUNT, SET_FILTERS_ENABLE} from '../constants/action-types';
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

// ============================================================
// async actions (used redux-thunk template)
const fetchSearchIDs = (searchString, paths, filters_enable, filter_obj, batch_size, strict_match) => async (dispatch)=>{
    dispatch({type: FETCH_SEARCH_IDS_REQUEST});

    try {
        const {data: {ids}} = await instance.post(`/courses/search`, {query: searchString, paths: paths});
        // console.log(ids); // checking receive array of courses 
        dispatch({type: FETCH_SEARCH_IDS_SUCCESS, payload: ids});

        // fetch batch 0 first
        dispatch({type: FETCH_SEARCH_RESULTS_REQUEST});
        try {
            let search_filter={...filter_obj};
            if (filters_enable.time===false){search_filter.time=null;}
            if (filters_enable.department===false){search_filter.department=null;}
            if (filters_enable.category===false){search_filter.category=null;}
            if (filters_enable.enroll_method===false){search_filter.enroll_method=null;}
            const {data: {courses, total_count}} = await instance.post(`/courses/ids`, {ids: ids, filter: search_filter, batch_size: batch_size, offset: 0, strict_match: strict_match});
            dispatch({type: FETCH_SEARCH_RESULTS_SUCCESS, payload: courses});
            // increment offset
            dispatch({type: INCREMENT_OFFSET});
            // update total_results count
            dispatch({type: UPDATE_TOTAL_COUNT, payload: total_count})
        } catch (error) {
            dispatch({type: FETCH_SEARCH_RESULTS_FAILURE, payload: error});
            // throw error?
        }

        return ids
    } catch (error) {
        dispatch({type: FETCH_SEARCH_IDS_FAILURE, payload: error});
        return error
    }
}

const fetchSearchResults = (ids_arr, filters_enable, filter_obj, batch_size, offset) =>async (dispatch)=>{
    dispatch({type: FETCH_SEARCH_RESULTS_REQUEST});

    try {
        let search_filter={...filter_obj};
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
        return error
    }
}

export {setSearchColumn,setSearchSettings,fetchSearchIDs, fetchSearchResults, setFilter, setFilterEnable}