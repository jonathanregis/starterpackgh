import {
	USER_DATA_RECEIVED,
	LOGIN_FAILED,
	LOG_OUT,
	CLEAR_MESSAGES,
	USER_DATA_UPDATE,
	API_URL,
	REGISTRATION_FAILED,
} from '../constants/Redux';
import {ToastAndroid} from 'react-native';

export function login(credentials,callback,errorcallback = ()=>{return null}){
	return dispatch => {
		fetch(API_URL + "/buyers/login/",{
			method: "POST",
			body: JSON.stringify(credentials),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(res => res.json())
		.then(response => {
			if(response.success){
			
				dispatch({
					type: USER_DATA_RECEIVED,
					payload: {email: response.buyer.email, name: response.buyer.name, phone: response.buyer.phone, address: response.buyer.address, userToken: response.buyer.token,id:response.buyer.id}
				});
				callback();
			}
			else{
				console.log(response)
				dispatch({
					type: LOGIN_FAILED
				});
				errorcallback()
			}
		})
	}
}

export function register(data,callback,errorcallback = ()=>{return null}){
	return dispatch => {
		fetch(API_URL + "/buyers/",
			{
				method: "POST",
				body: JSON.stringify(data), 
				headers: {
		      		'Content-Type': 'application/json'
		    		}
    		}
		)
		.then(res => res.json())
		.then(response=>{
			
			if(response.success == true){
				dispatch({type: "REGISTER_SUCCESS"})
				callback();
			}
			else{
				console.log(response);
				console.log(data);
				dispatch({type: REGISTRATION_FAILED, payload: response.message});
				
				errorcallback();
			}
		})
	}
}

export function updateUserInfo(data){
	return dispatch => {
		fetch(API_URL + "/buyers/"+data.id,{
			method: "PATCH",
			body: JSON.stringify(data.data),
			headers:{
				'Content-Type': "application/json",
				'Authorization': "Bearer "+data.token
			}
		})
		.then(res=>res.json())
		.then(response=>{
			console.log(response);
			if(response.success){
				dispatch({
					type: USER_DATA_UPDATE,
					payload: data.data
				})
			}
			else {
				ToastAndroid.show("Could not update info",ToastAndroid.SHORT);
			}
		})
	}
}

export function logout(callback){
	return dispatch => {
		dispatch({
			type: LOG_OUT
		})
		setTimeout(()=>{callback()},2000)
	}
}

export function clearMessages(){
	return dispatch => {
		dispatch({
			type: CLEAR_MESSAGES
		})
	}
}