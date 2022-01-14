// write all function that generate actions here
import {FETCH_SEARCH_RESULTS_FAILURE, FETCH_SEARCH_RESULTS_SUCCESS,FETCH_SEARCH_RESULTS_REQUEST,FETCH_SEARCH_IDS_FAILURE,FETCH_SEARCH_IDS_REQUEST,FETCH_SEARCH_IDS_SUCCESS,SET_SEARCH_COLUMN, SET_SEARCH_SETTINGS, SET_FILTERS, INCREMENT_OFFSET, UPDATE_TOTAL_COUNT, SET_FILTERS_ENABLE, UPDATE_COURSE_TABLE, LOG_IN_SUCCESS, LOG_OUT_SUCCESS, UPDATE_USER} from '../constants/action-types';
import instance from '../api/axios'

// normal actions
const setSearchColumn = (col_name) => ({ type: SET_SEARCH_COLUMN, payload: col_name });
const setSearchSettings = (setting_obj)=>({type: SET_SEARCH_SETTINGS, payload: setting_obj});
const setFilterEnable = (filter_name, enable) => ({type: SET_FILTERS_ENABLE, filter_name: filter_name, payload: enable});
const updateCourseTable = (course_table) => ({type: UPDATE_COURSE_TABLE, payload: course_table});
const logOut = () => ({type: LOG_OUT_SUCCESS});
const logIn = (user_data) => ({type: LOG_IN_SUCCESS, payload: user_data});


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
            // console.log(Error("FETCH_SEARCH_RESULTS_FAILURE: "+error));
            throw error;
        }

        return ids
    } catch (error) {
        dispatch({type: FETCH_SEARCH_IDS_FAILURE, payload: error});
        // console.log(Error("FETCH_SEARCH_IDS_FAILURE: "+error))

        if (error.response) {
            // server did response, used for handle custom error msg
            throw error.response.status;
        } else if (error.request) {
            // The request was made but no response was received (server is downed)
            let status = 521; // Server is down
            throw status;
        } else {
            // Something happened in setting up the request that triggered an Error
            let status = 400; // Bad request
            throw status;
        }
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
        // console.log(Error("FETCH_SEARCH_RESULTS_FAILURE: "+error))

        if (error.response) {
            // server did response, used for handle custom error msg
            throw error.response.status;
        } else if (error.request) {
            // The request was made but no response was received (server is downed)
            let status = 521; // Server is down
            throw status;
        } else {
            // Something happened in setting up the request that triggered an Error
            let status = 400; // Bad request
            throw status;
        }
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
    catch (error){
        // console.log(Error("Error in fetchCoursesByIds: "+error));

        if (error.response) {
            // server did response, used for handle custom error msg
            throw error.response.status;
        } else if (error.request) {
            // The request was made but no response was received (server is downed)
            let status = 521; // Server is down
            throw status;
        } else {
            // Something happened in setting up the request that triggered an Error
            let status = 400; // Bad request
            throw status;
        }
    }
};

// used in userMyPage initialization, to fetch all favorite courses object by user's favorite courses ids
const fetchFavoriteCourses = (ids_arr) => async (dispatch) => {
    try {
        let search_filter = {strict_match:false, time: null, department: null, category: null, enroll_method: null};
        let batch_size = 15000;
        let offset = 0;
        const {data: {courses}} = await instance.post(`/courses/ids`, {ids: ids_arr, filter: search_filter, batch_size: batch_size, offset: offset});        
        return courses;
    }
    catch (err) {
        throw new Error("Error in fetchFavoriteCourses: " + err);
    }
}

const createCourseTable = (course_table_id, course_table_name, user_id, semester) => async (dispatch)=>{
    try {
        const {data: {course_table}} = await instance.post(`/course_tables/`, {id: course_table_id, name: course_table_name, user_id: user_id, semester: semester});
        dispatch({type: UPDATE_COURSE_TABLE, payload: course_table});
        return course_table
    }
    catch (error){
        // console.log(Error("Error in createCourseTable: "+error));

        if (error.response) {
            // server did response, used for handle custom error msg
            throw error.response.status;
        } else if (error.request) {
            // The request was made but no response was received (server is downed)
            let status = 521; // Server is down
            throw status;
        } else {
            // Something happened in setting up the request that triggered an Error
            let status = 400; // Bad request
            throw status;
        }
    }
}

const linkCoursetableToUser = (token, course_table_id, user_id) => async (dispatch)=>{
    try{
        const {data: { user }} = await instance.post(`/users/${user_id}/course_table`, {course_table_id: course_table_id}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        dispatch({type: UPDATE_USER, payload: user});
    }catch(error){
        // console.log(Error("Error in linkCoursetableToUser: "+error))

        if (error.response) {
            // server did response, used for handle custom error msg
            throw error.response.status;
        } else if (error.request) {
            // The request was made but no response was received (server is downed)
            let status = 521; // Server is down
            throw status;
        } else {
            // Something happened in setting up the request that triggered an Error
            let status = 400; // Bad request
            throw status;
        }
    }
};

const fetchCourseTable = (course_table_id) => async (dispatch)=>{
    try {
        const {data: {course_table}} = await instance.get(`/course_tables/${course_table_id}`);
        dispatch({type: UPDATE_COURSE_TABLE, payload: course_table});
        return course_table
    }
    catch (error){
        // console.log(Error("Error in fetchCourseTable: "+error));

        if (error.response) {
            if (error.response.status===403) {
                // expired course_table
                // if fetch expired course_table, return null and handle it by frontend logic
                dispatch({type: UPDATE_COURSE_TABLE, payload: null});
                return null
            }
        } 
        else {
            if (error.response) {
                // server did response, used for handle custom error msg
                throw error.response.status;
            } else if (error.request) {
                // The request was made but no response was received (server is downed)
                let status = 521; // Server is down
                throw status;
            } else {
                // Something happened in setting up the request that triggered an Error
                let status = 400; // Bad request
                throw status;
            }
        }
    }
}

const patchCourseTable = (course_table_id, course_table_name, user_id, expire_ts, courses) => async (dispatch)=>{
    // filter out "" in courses
    const new_courses = courses.filter(course=>course!=="");
    try {
        const {data: {course_table}} = await instance.patch(`/course_tables/${course_table_id}`, {name: course_table_name, user_id: user_id, expire_ts: expire_ts, courses: new_courses});
        dispatch({type: UPDATE_COURSE_TABLE, payload: course_table});
        return course_table
    }
    catch (error){
        // console.log(Error("Error in patchCourseTable: "+error));

        // need to let frontend handle error, so change to return null
        if (error.response) {
            if (error.response.status===403 && error.response.data.message==="Course table is expired") {
                // expired course_table
                // if fetch expired course_table, return null and handle it by frontend logic
                dispatch({type: UPDATE_COURSE_TABLE, payload: null});
                return null
            }
        } else {
            if (error.response) {
                // server did response, used for handle custom error msg
                throw error.response.status;
            } else if (error.request) {
                // The request was made but no response was received (server is downed)
                let status = 521; // Server is down
                throw status;
            } else {
                // Something happened in setting up the request that triggered an Error
                let status = 400; // Bad request
                throw status;
            }
        }
    }
}

const fetchUserById = (token, user_id) => async (dispatch)=>{
    try {
        const {data: {user}} = await instance.get(`/users/${user_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        // user contains user in db & auth0, either null (not found) or an object.
        return user
    } catch (error) {
        // console.log(Error("fetchUserById "+error));

        if (error.response) {
            // server did response, used for handle custom error msg
            throw error.response.status;
        } else if (error.request) {
            // The request was made but no response was received (server is downed)
            let status = 521; // Server is down
            throw status;
        } else {
            // Something happened in setting up the request that triggered an Error
            let status = 400; // Bad request
            throw status;
        }
    }
}

const registerNewUser = (token, email) => async (dispatch)=>{
    try {
        const {data: {user}} = await instance.post(`/users/`, {user: {email: email}}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        // either null (not found) or an object.
        return user
    } catch (error) {
        // console.log(Error("Error in registerNewUser: "+error))

        if (error.response) {
            // server did response, used for handle custom error msg
            throw error.response.status;
        } else if (error.request) {
            // The request was made but no response was received (server is downed)
            let status = 521; // Server is down
            throw status;
        } else {
            // Something happened in setting up the request that triggered an Error
            let status = 400; // Bad request
            throw status;
        }
    }
}

const addFavoriteCourse = (token, new_favorite_list) => async (dispatch)=>{
    try{
        const {data: { user }} = await instance.patch(`/users/`, {user: {favorites: new_favorite_list}},{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        dispatch({type: UPDATE_USER, payload: user});
    }catch(error){
        // console.log(Error("Error in addFavoriteCourse: "+error))

        if (error.response) {
            // server did response, used for handle custom error msg
            throw error.response.status;
        } else if (error.request) {
            // The request was made but no response was received (server is downed)
            let status = 521; // Server is down
            throw status;
        } else {
            // Something happened in setting up the request that triggered an Error
            let status = 400; // Bad request
            throw status;
        }
    }
};

const patchUserInfo = (token, updateObject) => async (dispatch)=>{
    try{
        const {data: { user }} = await instance.patch(`/users/`, {user: updateObject},{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        dispatch({type: UPDATE_USER, payload: user});
    }catch(error){
        // console.log(Error("Error in patchUserInfo: "+error))

        if (error.response) {
            // server did response, used for handle custom error msg
            throw error.response.status;
        } else if (error.request) {
            // The request was made but no response was received (server is downed)
            let status = 521; // Server is down
            throw status;
        } else {
            // Something happened in setting up the request that triggered an Error
            let status = 400; // Bad request
            throw status;
        }
    }
}

const deleteUserProfile = (token) => async (dispatch)=>{
    try {
        await instance.delete(`/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch(error) {
        // console.log(Error("Error in deleteUserProfile: "+error))

        if (error.response) {
            // server did response, used for handle custom error msg
            throw error.response.status;
        } else if (error.request) {
            // The request was made but no response was received (server is downed)
            let status = 521; // Server is down
            throw status;
        } else {
            // Something happened in setting up the request that triggered an Error
            let status = 400; // Bad request
            throw status;
        }
    }
}

const deleteUserAccount = (token) => async (dispatch)=>{
    try {
        await instance.delete(`/users/account`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        dispatch({type: LOG_OUT_SUCCESS});
    } catch(error) {
        // console.log(Error("Error in deleteUserAccount: "+error))

        if (error.response) {
            // server did response, used for handle custom error msg
            throw error.response.status;
        } else if (error.request) {
            // The request was made but no response was received (server is downed)
            let status = 521; // Server is down
            throw status;
        } else {
            // Something happened in setting up the request that triggered an Error
            let status = 400; // Bad request
            throw status;
        }
    }
}

const verify_recaptcha = (token, captcha_token) => async (dispatch)=>{
    const resp = await instance.post(`/recaptcha`, { captcha_token: captcha_token }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return resp.data;
}

const request_otp_code = (token, student_id) => async (dispatch)=>{
    const resp = await instance.post(`/users/student_id/link`, { student_id: student_id }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return resp.data;
}

const use_otp_link_student_id = (token, student_id, otp_code) => async (dispatch)=>{
    const resp = await instance.post(`/users/student_id/link`, { student_id: student_id, otp_code: otp_code }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return resp.data;
};

export {setSearchColumn,setSearchSettings,fetchSearchIDs, fetchSearchResults, setFilter, setFilterEnable, fetchCourseTableCoursesByIds, fetchFavoriteCourses, createCourseTable, linkCoursetableToUser, fetchCourseTable, patchCourseTable, fetchUserById, registerNewUser, logOut, logIn, updateCourseTable, addFavoriteCourse, deleteUserProfile, deleteUserAccount, patchUserInfo, verify_recaptcha, request_otp_code, use_otp_link_student_id };