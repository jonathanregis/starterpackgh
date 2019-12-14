import {
	LOGIN_FAILED,
	CLEAR_MESSAGES,
	REGISTRATION_FAILED
} from '../constants/Redux';

import update from 'immutability-helper';

const initialState = {
	loginError: false,
	errorMessage: ""
}

export default function(state = initialState, action){
	switch(action.type){

		case LOGIN_FAILED:
			return update(state, {
				loginError: {$set: true}
			});

		case CLEAR_MESSAGES:
			return update(state, {
				loginError: {$set: false},
				errorMessage: {$set: ""}
			});

		case REGISTRATION_FAILED:
			return update(state, {
				errorMessage: {$set: action.payload}
			});

		default:
			return state;
	}
}