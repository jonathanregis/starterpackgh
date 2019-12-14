import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import MessageReducer from './MessageReducer';
import OrderReducer from './OrderReducer';

export default combineReducers({
  auth: AuthReducer,
  message: MessageReducer,
  order: OrderReducer,
});
