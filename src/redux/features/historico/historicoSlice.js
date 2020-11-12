/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import history from '../../../services/history';
import api from '../../../services/api';

// createSlice makes all action creators and reducers in the same file so no separation of logic is necessary

/** *************STATE SLICE************** */
export const sliceHistorico = createSlice({
  name: 'historico',
  initialState: {
    loading: false,
    historico: {},
    profissoes: [],
  },
  reducers: {
    historicoSuccess: (state, action) => {
      const { historicos, profissoes } = action.payload;
      state.loading = false;
      if (historicos !== undefined) state.historico = historicos;
      if (profissoes !== undefined) state.profissoes = profissoes;
    },
    historicoRequest: (state, action) => {
      const { historicos } = action.payload;
      state.loading = true;
      state.historico = historicos;
    },
    historicoFailure: state => {
      state.loading = false;
      state.historico = {};
    },
    historicoReset: state => {
      state.loading = false;
      state.historico = {};
      state.profissoes = [];
    },
  },
});

/** *************EXPORTED ACTIONS & REDUCERS************** */

export const {
  historicoRequest,
  historicoSuccess,
  historicoFailure,
  historicoReset,
} = sliceHistorico.actions;

export default sliceHistorico.reducer;

// API REQUEST ACTIONS HANDLED WITH REDUX-THUNK MIDDLEWARE BUILT INTO REDUX TOOLKIT -->

/** *************THUNKS************** */
export const getFirstRender = usuario => {
  // console.log('Protocolo getFirstRender:', usuario);
  return async (dispatch, getState) => {
    dispatch(historicoRequest({ usuario }));
    try {
      if (!usuario.cpf) {
        toast.error('CPF do Usuário é inválido.');
        return;
      }
      const response = await api.get(`historico/${usuario.cpf}`);
      const { historicos } = response.data;
      if (historicos.length >= 0) {
        await dispatch(historicoSuccess({ historicos }));
        const { historico } = Object.assign(
          {},
          getState().historicos,
          historicos
        );
        return historico;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/home');
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de historico do Usuário. getFirstRender.  ${error.message}`
      );
    }
  };
};

export const selectAllProfissoes = () => {
  return async dispatch => {
    try {
      const response = await api.get(`profissoes`);
      const { profissoes } = response.data;
      dispatch(historicoSuccess({ profissoes }));
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Profissões. selectAllProfissoes  ${error.message}`
      );
    }
  };
};

export const selectAllHistorico = cpf => {
  return async () => {
    try {
      const response = await api.get(`historico/${cpf}`);
      return response.data;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Histórico do Usuário. selectAllHistorico  ${error.message}`
      );
    }
  };
};

export const createLogger = payload => {
  return async dispatch => {
    try {
      const { conteudo, codUsuario } = payload;
      const historico = {
        conteudo,
        codUsuario,
        origem: 'FUNEPE',
      };
      const response = await api.post(`historico/`, historico);
      return response.data;
    } catch (error) {
      toast.error(`ERRO ao Inserir Histórico - createLogger ${error.message}`);
      dispatch(historicoFailure());
    }
  };
};
