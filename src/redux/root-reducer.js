import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import usuario from './features/usuario/usuarioSlide';
import protocolo from './features/protocolo/protocoloSlide';

const persistConfig = {
  key: 'funepe-localDB',
  storage,
  whitelist: ['usuario'],
};

const rootReducer = combineReducers({
  usuario,
  protocolo,
});

export default persistReducer(persistConfig, rootReducer);
