// store initial states and reducers
import {FETCH_SEARCH_RESULTS_FAILURE,FETCH_SEARCH_RESULTS_REQUEST,FETCH_SEARCH_RESULTS_SUCCESS, SET_SEARCH_COLUMN,SET_SEARCH_SETTINGS} from '../constants/action-types'

const initState = {
    search_results:[], // array of course objects
    search_loading: false, // boolean
    search_error: null, // null(no error) or error_message
    search_columns: ['course_name', 'teacher', 'id', 'course_code', 'course_id'], // array of column names, default is all columns
    search_settings: {show_selected_courses: true, only_show_not_conflicted_courses: false, sync_add_to_nol: false, strict_search_mode: false}, // object of settings
}

const reducer = (state = initState, action) => {
    switch (action.type){
        case FETCH_SEARCH_RESULTS_REQUEST:
            return {...state, search_loading: true}
        case FETCH_SEARCH_RESULTS_SUCCESS:
            return {...state,search_results: action.payload, search_loading: false, search_error: null}
        case FETCH_SEARCH_RESULTS_FAILURE:
            return {...state, search_loading: false, search_error: action.payload}
        case SET_SEARCH_COLUMN:
            let col_name = action.payload;
            if (state.search_columns.includes(col_name)){
                // remove column_name from columns
                return {...state, search_columns: state.search_columns.filter(col => col !== col_name)}
            } else {
                // add column_name to columns
                return {...state, search_columns: [...state.search_columns, col_name]}
            }
        case SET_SEARCH_SETTINGS:
            let new_setting = action.payload;
            return {...state, search_settings: new_setting}
        default:
            return state 
    }
}

export default reducer