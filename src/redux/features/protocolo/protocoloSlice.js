/* eslint-disable consistent-return */
/* eslint-disable no-console */
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import history from '../../../services/history';
import api from '../../../services/api';

// createSlice makes all action creators and reducers in the same file so no separation of logic is necessary

/** *************STATE SLICE************** */

export const sliceProtocolo = createSlice({
  name: 'protocolo',
  initialState: {
    loading: false,
    protocolo: {},
    documento: {},
  },
  reducers: {
    protocoloSuccess: (state, action) => {
      console.log('protocoloSuccess Reducer/Action', action.payload);
      const { caixaentradas } = action.payload;
      state.loading = false;
      state.protocolo = caixaentradas;
    },
    protocoloRequest: (state, action) => {
      console.log('protocoloRequest Reducer/Action', action.payload);
      const { caixaentradas } = action.payload;
      state.loading = true;
      state.protocolo = caixaentradas;
    },
    protocoloFailure: (state, action) => {
      console.log('FAILURE', action.payload);
      state.loading = false;
      state.protocolo = {};
    },
    updateProtocoloRequest: (state, action) => {
      console.log('updateProtocoloRequest Reducer/Action', action);
      const { caixaentradas } = action.payload;
      state.loading = false;
      state.protocolo = caixaentradas;
    },
    updateProtocoloSuccess: (state, action) => {
      console.log('updateProtocoloSuccess Reducer/Action', action);
      const { caixaentradas } = action.payload;
      state.loading = false;
      state.protocolo = caixaentradas;
    },
    updateFailure: (state, action) => {
      console.log('updateFAILURE', action.payload);
      state.loading = false;
      state.protocolo = {};
      state.documento = {};
    },
    addDocumentoSuccess(state, action) {
      console.log('addDocumentoSuccess Reducer/Action', action);
      const { documento } = action.payload;
      state.loading = false;
      state.documento = documento;
      // immer is running under the hood so we can write this without mutating state.
    },
  },
});

/** *************EXPORTED ACTIONS & REDUCERS************** */

export const {
  protocoloRequest,
  protocoloSuccess,
  protocoloUser,
  protocoloFailure,
  updateProtocoloRequest,
  updateProtocoloSuccess,
  updateFailure,
  addDocumentoSuccess,
} = sliceProtocolo.actions;

export default sliceProtocolo.reducer;

// API REQUEST ACTIONS HANDLED WITH REDUX-THUNK MIDDLEWARE BUILT INTO REDUX TOOLKIT -->

/** *************THUNKS************** */

export const getFirstRender = usuario => {
  console.log('Protocolo getFirstRender:', usuario);
  return async (dispatch, getState) => {
    dispatch(protocoloRequest({ usuario }));
    // redux-thunk
    try {
      console.log('Protocolo getFirstRender1:', usuario.idusuario);
      console.log('Protocolo getFirstRender2:', getState().usuario.token);

      if (!usuario.idusuario) {
        toast.error('ID do Usuário é inválido.');
        return;
      }
      if (getState().usuario.token) {
        api.defaults.headers.Authorization = `Bearer ${
          getState().usuario.token
        }`;
      } else {
        toast.error('Token é inválido. Logar no sistema novamente!');
        console.error('Token é inválido. Logar no sistema novamente!');
        await dispatch(updateFailure());
        history.push('/');
        return;
      }
      const response = await api.get(
        `usuarios/${usuario.idusuario}/caixaentrada/`
      );
      const { caixaentradas } = response.data;
      if (caixaentradas.length >= 0) {
        await dispatch(protocoloSuccess({ caixaentradas }));
        const { protocolo } = {
          ...getState().protocolo,
          ...caixaentradas,
        };
        return protocolo;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/home');
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Protocolos do Usuário. getFirstRender.  ${error.message}`
      );
      // history.push('/');
    }
  };
};

export const selectAllProtocolo = () => {
  return async (dispatch, getState) => {
    // redux-thunk
    try {
      const { usuario } = getState().usuario;
      const response = await api.get(
        `usuarios/${usuario.idusuario}/caixaentrada/`
      );
      const { caixaentradas } = response.data;
      if (caixaentradas.length >= 0) {
        await dispatch(protocoloSuccess({ caixaentradas }));
        history.push('/home');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/home');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Protocolos do Usuário. selectAllProtocolo  ${error.message}`
      );
      // history.push('/');
    }
  };
};

export const addProtocolo = payload => {
  console.log('addProtocolo: ', payload);
  return async (dispatch, getState) => {
    try {
      const { documento } = payload;
      const { usuario } = getState().usuario;
      const caixaentrada = {
        iddocumento: documento.iddocumento,
        iddestinatario: documento.idexpedidor,
        status: 'E',
        dataenvio: documento.dataexpedicao,
        statusprazo: 1,
      };
      console.log('addProtocoloCxEntrada', caixaentrada);
      const response = await api.post(
        `usuarios/${usuario.idusuario}/caixaentrada/`,
        caixaentrada
      );
      console.log('PROTOCOLADO: ', response.data);
      dispatch(selectAllProtocolo());
      toast.success('Protocolo atualizado com sucesso!');
      return response.data;
    } catch (error) {
      toast.error(
        `ERRO ao Protocolar Documento - addProtocolo ${error.message}`
      );
      console.log(
        'ERRO ao Protocolar Documento - addProtocolo: ',
        error.message
      );
      dispatch(updateFailure());
    }
  };
};

export const addDocumentoRequest = payload => {
  console.log('addDocumentoRequest: ', payload);
  return async (dispatch, getState) => {
    try {
      const { newDocumento } = payload;
      const { usuario } = getState().usuario;

      const response = await api.post(
        `usuarios/${usuario.idusuario}/documents/`,
        newDocumento
      );
      console.log('ADD DOCUMENTO: ', response.data);
      await dispatch(addDocumentoSuccess(response.data));
      toast.success('Documento inserido com sucesso!');
      await dispatch(addProtocolo(response.data));
      return response.data;
    } catch (error) {
      console.log('ERROR: ', error.response.data.error.message);
      toast.error(
        `ERRO ao adicionar Novo documento - addDocumentoRequest  ${error.response.data.error.message}`
      );
      dispatch(updateFailure());
    }
  };
};
