import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import protocolo from './features/protocolo/protocoloSlice';

const persistConfig = {
  key: 'funepe-localDB',
  storage,
  whitelist: ['usuario'],
};

const rootReducer = combineReducers({
  protocolo,
});

export default persistReducer(persistConfig, rootReducer);
