import {
	ADD_CART,
	REMOVE_CART,
	UPDATE_ITEM_QUANTITY,
	REMOVE_ADDON,
	RECEIVED_MENU
} from '../constants/Redux';

export function add_to_cart(item,quantity,addons){
	if(undefined == item.foodID){
		item.mealID = item._id;
	}
	const cartAdditionalMeta = {quantity: quantity,selectedAddon: addons}
	return dispatch => {
		dispatch({
			type: ADD_CART,
			payload: { ...item, ...cartAdditionalMeta}
		});
	}
}

export function remove_from_cart(itemIndex){
	return dispatch => {
		dispatch({
			type: REMOVE_CART,
			payload: itemIndex
		})
	}
}

export function updateQuantity(index,quantity){
	return dispatch => {
		dispatch({
			type: UPDATE_ITEM_QUANTITY,
			payload: {quantity: quantity, index: index}
		})
	}
}

export function updateMenu(menu){
	return dispatch => {
		dispatch({
			type: RECEIVED_MENU,
			payload: menu
		})
	}
}

export function removeItemAddon(index){
	return dispatch => {
		dispatch({
			type: REMOVE_ADDON,
			payload: index
		})
	}
}