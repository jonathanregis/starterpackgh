import {
	LOGIN_FAILED,
	LOG_OUT,
	USER_DATA_RECEIVED,
	USER_DATA_UPDATE,
} from '../constants/Redux';

import update from 'immutability-helper';

const initialState = {
	user: {name: "", phone: "", email: "", address: "", id: ""},
	token: "",
	isNew: true
}

export default function(state = initialState, action){
	switch(action.type){
		case USER_DATA_RECEIVED:
			return update(state,{
				user: {
					name: {$set: action.payload.name},
					phone: {$set: action.payload.phone},
					email: {$set: action.payload.email},
					address: {$set: action.payload.address},
					id: {$set: action.payload.id}
				},
				token: {$set: action.payload.userToken},
			});

		case LOG_OUT:
			return update(state, {
				token: {$set: ""},
			});

		case USER_DATA_UPDATE:
			return update(state, {
				user: {$merge: action.payload}
			});

		case "PASS_WELCOME":
			return update(state,{
				isNew: {$set: false}
			})

		default:
			return state;
	}
}