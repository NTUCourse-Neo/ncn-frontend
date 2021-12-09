// write all function that generate actions here
import {FETCH_SEARCH_RESULTS_FAILURE,FETCH_SEARCH_RESULTS_REQUEST,FETCH_SEARCH_RESULTS_SUCCESS} from '../constants/action-types';
import instance from '../api/axios'

// normal actions
// const template = (type, payload) => ({ type: type, payload: payload });

// async actions (used redux-thunk template)
const fetchSearchResults = (searchString) => async (dispatch)=>{
    dispatch({type: FETCH_SEARCH_RESULTS_REQUEST});

    try {
        const {data: {courses}} = await instance.get(`/search?query=${searchString}`);
        console.log(courses); // checking receive array of courses 
        dispatch({type: FETCH_SEARCH_RESULTS_SUCCESS, payload: courses});
        return courses
    } catch (error) {
        dispatch({type: FETCH_SEARCH_RESULTS_FAILURE, payload: error});
        return error
    }
}

export {fetchSearchResults}