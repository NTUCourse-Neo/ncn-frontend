// write all function that generate actions here
import {FETCH_SEARCH_IDS_FAILURE,FETCH_SEARCH_IDS_REQUEST,FETCH_SEARCH_IDS_SUCCESS, SET_SEARCH_COLUMN,SET_SEARCH_SETTINGS, SET_FILTERS} from '../constants/action-types';
import instance from '../api/axios'

// normal actions
const setSearchColumn = (col_name) => ({ type: SET_SEARCH_COLUMN, payload: col_name });

const setSearchSettings = (setting_obj)=>({type: SET_SEARCH_SETTINGS, payload: setting_obj});

// data = 
// when filter_name == 'department', arr of dept_code (4-digits),
// when filter_name == 'time',
// when filter_name == 'category', arr of string (type of courses),
// when filter_name == 'enroll_method'
const setFilter = (filter_name, data)=>({type: SET_FILTERS, filter_name: filter_name, payload: data});

// async actions (used redux-thunk template)
const fetchSearchIDs = (searchString, paths) => async (dispatch)=>{
    dispatch({type: FETCH_SEARCH_IDS_REQUEST});

    try {
        const {data: {ids}} = await instance.post(`/courses/search`, {query: searchString, paths: paths});
        console.log(ids); // checking receive array of courses 
        dispatch({type: FETCH_SEARCH_IDS_SUCCESS, payload: ids});
        return ids
    } catch (error) {
        dispatch({type: FETCH_SEARCH_IDS_FAILURE, payload: error});
        return error
    }
}

export {setSearchColumn,setSearchSettings,fetchSearchIDs, setFilter}