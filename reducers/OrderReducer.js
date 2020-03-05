import {
	ADD_CART,
	REMOVE_CART,
	UPDATE_ITEM_QUANTITY,
	CLEAR_CART,
	REMOVE_ADDON,
	RECEIVED_MENU
} from '../constants/Redux';

import update from 'immutability-helper';

const initialState = {
	cartItems: [],
	cartTotal: 0,
	currentOrder: null,
	orderStatus: null,
	debitCards: [],
	menuItems: []
}

export default function(state = initialState, action){
	switch(action.type){
		case ADD_CART:
			return update(state, {
            	cartItems: {$push: [action.payload]},
            	cartTotal: {$set: state.cartTotal + ((action.payload.price + action.payload.selectedAddon.price) * action.payload.quantity)}
            });

		case REMOVE_CART:
			return update(state, {
				cartItems: {$splice: [[action.payload,1]]},
				cartTotal: {$set: state.cartTotal - ((state.cartItems[action.payload].price + state.cartItems[action.payload].selectedAddon.price) * state.cartItems[action.payload].quantity)}
			});

		case UPDATE_ITEM_QUANTITY:
			let tempTotal = state.cartTotal - ((state.cartItems[action.payload.index].price + state.cartItems[action.payload.index].selectedAddon.price) * state.cartItems[action.payload.index].quantity)
			let newTotal = tempTotal + ((state.cartItems[action.payload.index].price + state.cartItems[action.payload.index].selectedAddon.price) * action.payload.quantity)
			return update(state, {
				cartTotal: {$set: newTotal},
				cartItems: {[action.payload.index]:{quantity: {$set: action.payload.quantity}}}
			});

		case REMOVE_ADDON:
			let addonActionTempTotal = state.cartTotal - ((state.cartItems[action.payload].price + state.cartItems[action.payload].selectedAddon.price) * state.cartItems[action.payload].quantity)
			let addonActionNewTotal = addonActionTempTotal + (state.cartItems[action.payload].price * state.cartItems[action.payload].quantity) + 0
			return update(state, {
				cartTotal: {$set: addonActionNewTotal},
				cartItems: {[action.payload]:{selectedAddon: {
					_id: {$set: ""},
					price: {$set: 0},
					title: {$set: ""}
				}}}
			});

		case CLEAR_CART:
			return update(state, {
				cartTotal: {$set: 0},
				cartItems: {$set: []}
			});

		case "TEST_CARDS":
			return update(state, {
				debitCards: {$push: [{number: "4807775698233290", expiry: "1020", name: "Jane Doe", cvv: "764", type: "mastercard"}]}
			});

		case RECEIVED_MENU:
			return update(state, {
				menuItems: {$set: action.payload}
			})

		default:
			return state;
	}
}