import axios from 'axios';
import {
  HOME_SUBMIT_BEGIN,
  HOME_SUBMIT_SUCCESS,
  HOME_SUBMIT_FAILURE,
  HOME_SUBMIT_DISMISS_ERROR,
} from './constants';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function submit(username, password, args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_SUBMIT_BEGIN,
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is a placeholder Promise. You should replace it with your own logic.
      // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
      // args.error here is only for test coverage purpose.
     var bodyFormData = new FormData();
     bodyFormData.set('username',username);
     bodyFormData.set('password',password);
      const doRequest = axios({
    		 method: 'post',
   	         url: 'http://127.0.0.1:3000/auth/ldap',
   		 data: {"username": username,"password": password},
   		 config: { headers: {'Content-Type': 'application/json'}}
    });
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_SUBMIT_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_SUBMIT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

// Async action saves request error by default, this method is used to dismiss the error info.
// If you don't want errors to be saved in Redux store, just ignore this method.
export function dismissSubmitError() {
  return {
    type: HOME_SUBMIT_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_SUBMIT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        submitPending: true,
        submitError: null,
      };

    case HOME_SUBMIT_SUCCESS:
      // The request is success
      alert("Submitted");
      return {
        ...state,
        submitPending: false,
        submitError: null,
        submitResponse: action.data,
      };

    case HOME_SUBMIT_FAILURE:
      // The request is failed
      return {
        ...state,
        submitPending: false,
        submitError: action.data.error,
      };

    case HOME_SUBMIT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        submitError: null,
      };

    default:
      return state;
  }
}
