import { combineReducers } from 'redux';

import auth from './auth/reducer';
// import cadastro from './cadastro/reducer';
import protocolo from '../../redux/root-reducer';

export default combineReducers({
  auth,
  // cadastro,
  protocolo,
});
