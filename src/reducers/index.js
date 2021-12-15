// store initial states and reducers
import {FETCH_SEARCH_RESULTS_FAILURE, FETCH_SEARCH_RESULTS_SUCCESS,FETCH_SEARCH_RESULTS_REQUEST,FETCH_SEARCH_IDS_FAILURE,FETCH_SEARCH_IDS_REQUEST,FETCH_SEARCH_IDS_SUCCESS,SET_SEARCH_COLUMN, SET_SEARCH_SETTINGS, SET_FILTERS, INCREMENT_OFFSET} from '../constants/action-types'

const initState = {
    search_ids: [], // array of course_id
    search_results:[], // array of course objects
    search_loading: false, // boolean
    search_error: null, // null(no error) or error_message
    batch_size: 20,
    offset: 0,
    search_columns: ['course_name', 'teacher', 'id', 'course_code', 'course_id'], // array of column names, default is all columns
    search_settings: {show_selected_courses: true, only_show_not_conflicted_courses: false, sync_add_to_nol: false, strict_search_mode: false}, // object of settings
    search_filters: {time: null, department: null, category: null, enroll_method: null},
}

const reducer = (state = initState, action) => {
    switch (action.type){
        case FETCH_SEARCH_IDS_REQUEST:
            return {...state, search_loading: true}
        case FETCH_SEARCH_IDS_SUCCESS:
            return {...state,search_ids: action.payload, search_loading: false, search_error: null, offset: 0}
        case FETCH_SEARCH_IDS_FAILURE:
            return {...state, search_loading: false, search_error: action.payload}
        case FETCH_SEARCH_RESULTS_REQUEST:
            return {...state, search_loading: true}
        case FETCH_SEARCH_RESULTS_SUCCESS:
            return {...state, search_results: [...state.search_results, ...action.payload], search_loading: false, search_error: null}
        case FETCH_SEARCH_RESULTS_FAILURE:
            return {...state, search_loading: false, search_error: action.payload}
        case INCREMENT_OFFSET:
            return {...state, offset: state.offset + state.batch_size}
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
        case SET_FILTERS:
            let data = action.payload;
            let filter_name = action.filter_name;
            if (filter_name==='department'){
                return {...state, search_filters: {...state.search_filters, department: data}}
            }
            else if (filter_name==='time'){
                //todo
                return {...state}
            }
            else if (filter_name==='category'){
                return {...state, search_filters: {...state.search_filters, category: data}}
            }
            else if (filter_name==='enroll_method'){
                // todo
                return {...state}
            }
            else {
                //default
                return {...state}
            }
        default:
            return state 
    }
}

export default reducer