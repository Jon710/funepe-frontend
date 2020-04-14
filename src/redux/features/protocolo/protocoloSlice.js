/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import history from '../../../services/history';
import api from '../../../services/api';

// createSlice makes all action creators and reducers in the same file so no separation of logic is necessary

export const sliceProtocolo = createSlice({
  name: 'protocolo',
  initialState: {
    loading: false,
    protocolo: {},
    documento: {},
    tipoDocumentos: {},
    prioridades: {},
  },
  reducers: {
    protocoloSuccess: (state, action) => {
      const { caixaentradas, prioridades, types } = action.payload;
      state.loading = false;
      if (caixaentradas !== undefined) {
        state.protocolo = caixaentradas;
      }
      if (prioridades !== undefined) {
        state.prioridades = prioridades;
      }
      if (types !== undefined) {
        state.tipoDocumentos = types;
      }
    },
    protocoloRequest: (state, action) => {
      const { caixaentradas } = action.payload;
      state.loading = true;
      state.protocolo = caixaentradas;
    },
    protocoloFailure: state => {
      state.loading = false;
      state.protocolo = {};
    },
    updateProtocoloRequest: (state, action) => {
      const { caixaentradas } = action.payload;
      state.loading = false;
      state.protocolo = caixaentradas;
    },
    updateProtocoloSuccess: (state, action) => {
      const { caixaentradas } = action.payload;
      state.loading = false;
      state.protocolo = caixaentradas;
    },
    updateFailure: state => {
      state.loading = false;
      state.protocolo = {};
      state.documento = {};
    },
    addDocumentoSuccess(state, action) {
      const { documento } = action.payload;
      state.loading = false;
      state.documento = documento;
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

/** *************THUNKS************** */

export const getFirstRender = usuario => {
  return async (dispatch, getState) => {
    dispatch(protocoloRequest({ usuario }));

    try {
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

        await dispatch(updateFailure());
        history.push('/');
        return;
      }
      const response = await api.get(
        `usuarios/${usuario.idusuario}/caixaentrada/`
      );
      const { caixaentradas } = response.data;
      if (caixaentradas.length >= 0) {
        dispatch(selectAllPrioridade());
        dispatch(selectAllTipoDocumentos());
        await dispatch(protocoloSuccess({ caixaentradas }));
        const { protocolo } = Object.assign(
          {},
          getState().protocolo,
          caixaentradas
        );
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
  return async (dispatch, getState) => {
    try {
      const { documento } = payload;
      const { usuario } = getState().usuario;
      const caixaentrada = {
        iddocumento: documento.iddocumento,
        iddestinatario: documento.idexpedidor,
        status: 'Despachado',
        dataenvio: documento.dataexpedicao,
        statusprazo: 1,
      };
      console.log('addProtocoloCxEntrada', caixaentrada);
      const response = await api.post(
        `usuarios/${usuario.idusuario}/caixaentrada/`,
        caixaentrada
      );

      dispatch(selectAllProtocolo());
      toast.success('Protocolo inserido com sucesso!');
      return response.data;
    } catch (error) {
      toast.error(
        `ERRO ao Protocolar Documento - addProtocolo ${error.message}`
      );

      dispatch(updateFailure());
    }
  };
};

export const addDocumentoRequest = payload => {
  return async (dispatch, getState) => {
    try {
      const { newDocumento } = payload;
      const { usuario } = getState().usuario;

      const response = await api.post(
        `usuarios/${usuario.idusuario}/documents/`,
        newDocumento
      );
      await dispatch(addDocumentoSuccess(response.data));
      // toast.success('Documento inserido com sucesso!');
      await dispatch(addProtocolo(response.data));
      return response.data;
    } catch (error) {
      toast.error(
        `ERRO ao adicionar Novo documento - addDocumentoRequest  ${error.response.data.error.message}`
      );
      dispatch(updateFailure());
    }
  };
};

export const selectAllPrioridade = () => {
  return async dispatch => {
    try {
      const response = await api.get(`prioridade/`);
      const { prioridades } = response.data;
      if (prioridades.length >= 0) {
        await dispatch(protocoloSuccess({ prioridades }));
        history.push('/home');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/home');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Prioridade (selectAllPrioridade)!  ${error.message}`
      );
    }
  };
};

export const selectAllTipoDocumentos = () => {
  return async dispatch => {
    try {
      const response = await api.get(`types/`);
      const { types } = response.data;
      if (types.length >= 0) {
        await dispatch(protocoloSuccess({ types }));
        history.push('/home');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/home');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Tipo de Documentos (selectAllTipoDocumentos)!  ${error.message}`
      );
    }
  };
};
