import { combineReducers } from 'redux';

import auth from './auth/reducer';
import protocolo from '../../redux/features/protocolo/protocoloSlice';
import contexto from '../../redux/features/context/contextSlice';

export default combineReducers({
  auth,
  protocolo,
  contexto,
});
