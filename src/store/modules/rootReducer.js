import { combineReducers } from 'redux';

import auth from './auth/reducer';
import protocolo from '../../redux/features/protocolo/protocoloSlice';
import contexto from '../../redux/features/context/contextSlice';
import compras from '../../redux/features/compras/comprasSlice';
import orcamentos from '../../redux/features/compras/orcamentoSlice';

export default combineReducers({
  auth,
  protocolo,
  contexto,
  compras,
  orcamentos,
});
