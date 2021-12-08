// write all function that generate actions here

// template
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