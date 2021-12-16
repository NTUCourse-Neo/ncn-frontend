// write all function that generate actions here
import {FETCH_SEARCH_RESULTS_FAILURE,FETCH_SEARCH_RESULTS_REQUEST,FETCH_SEARCH_RESULTS_SUCCESS, SET_SEARCH_COLUMN,SET_SEARCH_SETTINGS} from '../constants/action-types';
import instance from '../api/axios'

// normal actions
const setSearchColumn = (col_name) => ({ type: SET_SEARCH_COLUMN, payload: col_name });

const setSearchSettings = (setting_obj)=>({type: SET_SEARCH_SETTINGS, payload: setting_obj});

// async actions (used redux-thunk template)
const fetchSearchResults = (searchString, paths) => async (dispatch)=>{
    dispatch({type: FETCH_SEARCH_RESULTS_REQUEST});

    try {
        const {data: {courses}} = await instance.post(`/courses/search`, {query: searchString, paths: paths});
        console.log(courses); // checking receive array of courses 
        dispatch({type: FETCH_SEARCH_RESULTS_SUCCESS, payload: courses});
        return courses
    } catch (error) {
        dispatch({type: FETCH_SEARCH_RESULTS_FAILURE, payload: error});
        return error
    }
}

export {setSearchColumn,setSearchSettings,fetchSearchResults}