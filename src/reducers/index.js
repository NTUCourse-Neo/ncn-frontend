// store initial states and reducers
import {FETCH_SEARCH_RESULTS_FAILURE,FETCH_SEARCH_RESULTS_REQUEST,FETCH_SEARCH_RESULTS_SUCCESS} from '../constants/action-types'

const initState = {
    search_results:[], // array of course objects
    search_loading: false, // boolean
    search_error: null // null(no error) or error_message
}

const reducer = (state = initState, action) => {
    switch (action.type){
        case FETCH_SEARCH_RESULTS_REQUEST:
            return {...state, search_loading: true}
        case FETCH_SEARCH_RESULTS_SUCCESS:
            return {search_results: action.payload, search_loading: false, search_error: null}
        case FETCH_SEARCH_RESULTS_FAILURE:
            return {...state, search_loading: false, search_error: action.payload}
        default:
            return state 
    }
}

export default reducer