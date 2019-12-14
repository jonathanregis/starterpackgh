import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { persistStore, persistReducer } from 'redux-persist';
import {AsyncStorage} from 'react-native';


const initialState = {};
const middlewares = [thunk];

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['message'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = createStore(
  persistedReducer,
  initialState,
  applyMiddleware(...middlewares)
);

export const persistor = persistStore(store);

export default store;
