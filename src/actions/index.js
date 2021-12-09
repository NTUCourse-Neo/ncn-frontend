// write all function that generate actions here
import {FETCH_SEARCH_RESULTS_FAILURE,FETCH_SEARCH_RESULTS_REQUEST,FETCH_SEARCH_RESULTS_SUCCESS} from '../constants/action-types';
import instance from '../api/axios'

// normal actions template
// const template = (type, payload) => ({ type: type, payload: payload });

// redux-thunk template (w/ async/await)
// const createUser = (params) =>{  
//     return async dispatch => {
//       function onSuccess(success) {
//         dispatch({ type: CREATE_USER, payload: success });
//         return success;
//       }
//       function onError(error) {
//         dispatch({ type: ERROR_GENERATED, error });
//         return error;
//       }
//       try {
//         const success = await axios.post('http://www...', params);
//         return onSuccess(success);
//       } catch (error) {
//         return onError(error);
//       }
//     }
// }

const fetchSearchResults = () => async (dispatch)=>{
    dispatch({type: FETCH_SEARCH_RESULTS_REQUEST});

    try {
        const {data: {courses}} = await instance.get('/search');
        console.log(courses); // checking receive array of courses 
        dispatch({type: FETCH_SEARCH_RESULTS_SUCCESS, payload: courses});
        return courses
    } catch (error) {
        dispatch({type: FETCH_SEARCH_RESULTS_FAILURE, payload: error});
        return error
    }
}

export {fetchSearchResults}