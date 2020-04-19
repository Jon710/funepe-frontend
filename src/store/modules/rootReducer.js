import { combineReducers } from 'redux';

import auth from './auth/reducer';
// import cadastro from './cadastro/reducer';
import protocolo from './protocolo/reducer';

export default combineReducers({
  auth,
  // cadastro,
  protocolo,
});
