/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
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
    arquivos: [],
    tipoDocumentos: {},
    prioridades: {},
    usuarios: {},
    grupos: {},
    usuariosgrupo: {},
    funcoes: {},
  },
  reducers: {
    protocoloSuccess: (state, action) => {
      const {
        caixaentradas,
        prioridades,
        types,
        arquivosanexo,
        users,
        roles,
        groups,
        usuariosgrupo,
      } = action.payload;
      state.loading = false;
      // console.log(action.payload);
      if (caixaentradas !== undefined) {
        state.protocolo = caixaentradas;
      }
      if (prioridades !== undefined) {
        state.prioridades = prioridades;
      }
      if (types !== undefined) {
        state.tipoDocumentos = types;
      }
      if (arquivosanexo !== undefined) {
        state.arquivos = arquivosanexo;
      }
      if (users !== undefined) {
        state.usuarios = users;
      }
      if (groups !== undefined) {
        state.grupos = groups;
      }
      if (usuariosgrupo !== undefined) {
        state.usuariosgrupo = usuariosgrupo;
      }
      if (roles !== undefined) {
        state.funcoes = roles;
      }
    },
    protocoloRequest: (state, action) => {
      // console.log('protocoloRequest Reducer/Action', action.payload);
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
      const { documento, documentoEdit } = action.payload;
      if (documento !== undefined) {
        state.loading = false;
        state.documento = documento;
      }
      if (documentoEdit !== undefined) {
        state.loading = false;
        state.documento = documentoEdit;
      }
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
  // console.log('Protocolo getFirstRender:', usuario);
  return async (dispatch, getState) => {
    dispatch(protocoloRequest({ usuario }));
    try {
      if (!usuario.idusuario) {
        toast.error('ID do Usuário é inválido.');
        return;
      }
      const response = await api.get(
        `usuarios/${usuario.idusuario}/caixaentrada/`
      );
      // console.log(response.data);
      const { caixaentradas } = response.data;
      if (caixaentradas.length >= 0) {
        dispatch(selectAllPrioridade());
        dispatch(selectAllTipoDocumentos());
        dispatch(selectAllUsuarios());
        dispatch(selectAllGrupos());
        dispatch(selectAllFuncoes());
        await dispatch(protocoloSuccess({ caixaentradas }));
        const { protocolo } = Object.assign(
          {},
          getState().protocolo,
          caixaentradas
        );
        return protocolo;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/protocolo');
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Protocolos do Usuário. getFirstRender.  ${error.message}`
      );
    }
  };
};

export const getUploadedFiles = iddocumento => {
  return async dispatch => {
    try {
      const response = await api.get(`documents/${iddocumento}/arquivoanexo/`);
      const { arquivosanexo } = response.data;
      if (arquivosanexo) {
        if (arquivosanexo.length >= 0) {
          await dispatch(protocoloSuccess({ arquivosanexo }));
          history.push('/protocolo');
          return arquivosanexo;
        }
      }
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Anexos. getUploadedFiles()  ${error.message}`
      );
    }
  };
};

export const selectAllProtocolo = () => {
  return async (dispatch, getState) => {
    try {
      const { user } = getState().auth;
      const response = await api.get(
        `usuarios/${user.idusuario}/caixaentrada/`
      );
      const { caixaentradas } = response.data;
      if (caixaentradas.length >= 0) {
        await dispatch(protocoloSuccess({ caixaentradas }));
        history.push('/protocolo');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/protocolo');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Protocolos do Usuário. selectAllProtocolo  ${error.message}`
      );
    }
  };
};

export const selecionarAnotacao = payload => {
  return async dispatch => {
    try {
      const idDocumento = payload;
      const response = await api.get(`documents/${idDocumento}/despachos/`);
      dispatch(selectAllProtocolo());
      return response.data;
    } catch (error) {
      toast.error(
        `ERRO ao Selecionar Anotação - selecionarAnotacao ${error.message}`
      );

      dispatch(updateFailure());
    }
  };
};

export const inserirAnotacao = payload => {
  // console.log('inserirAnotacao-payload: ', payload);
  return async dispatch => {
    try {
      const anotacaoDespacho = payload;
      const response = await api.post(
        `documents/${anotacaoDespacho.iddocumento}/despachos/`,
        anotacaoDespacho
      );
      dispatch(selectAllProtocolo());
      return response.data;
    } catch (error) {
      toast.error(
        `ERRO ao despachar Documento - despacharProtocolo ${error.message}`
      );
      console.log(
        'ERRO ao despachar Documento - despacharProtocolo: ',
        error.message
      );
      dispatch(updateFailure());
    }
  };
};

export const encaminharDocumento = payload => {
  console.log('encaminharDocumento-payload: ', payload);
  return async dispatch => {
    try {
      const docDespachado = payload;
      console.log('encaminharDocumento-CxEntrada', docDespachado);
      const response = await api.post(
        `usuarios/${docDespachado.iddestinatario}/caixaentrada/`,
        docDespachado
      );
      dispatch(selectAllProtocolo());
      // toast.success('Documento despachado com sucesso!');
      return response.data;
    } catch (error) {
      toast.error(
        `ERRO ao despachar Documento - despacharProtocolo ${error.message}`
      );
      console.log(
        'ERRO ao despachar Documento - despacharProtocolo: ',
        error.message
      );
      dispatch(updateFailure());
    }
  };
};

export const addProtocolo = payload => {
  return async (dispatch, getState) => {
    try {
      const { documento } = payload;
      const { user } = getState().auth;
      const caixaentrada = {
        iddocumento: documento.iddocumento,
        idusuario: user.idusuario,
        iddestinatario: documento.idexpedidor,
        status: 'Despachado',
        dataenvio: documento.dataexpedicao,
        statusprazo: 1,
      };
      const response = await api.post(
        `usuarios/${user.idusuario}/caixaentrada/`,
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
  console.log('addDocumentoRequest: ', payload);
  return async (dispatch, getState) => {
    try {
      const { newDocumento } = payload;
      const { user } = getState().auth;

      const response = await api.post(
        `usuarios/${user.idusuario}/documents/`,
        newDocumento
      );
      await dispatch(addDocumentoSuccess(response.data));
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
        history.push('/protocolo');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/protocolo');
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
        history.push('/protocolo');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/protocolo');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Tipo de Documentos (selectAllTipoDocumentos)!  ${error.message}`
      );
    }
  };
};

export const selectAllUsuarios = () => {
  return async dispatch => {
    try {
      const response = await api.get(`usuarios/`);
      const { users } = response.data;
      if (users.length >= 0) {
        await dispatch(protocoloSuccess({ users }));
        history.push('/protocolo');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/protocolo');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Tipo de Usuarios (selectAllUsuarios)!  ${error.message}`
      );
    }
  };
};

export const selectAllUsuariosGrupo = payload => {
  return async dispatch => {
    try {
      const idGrupo = payload;
      const response = await api.get(`grupo/${idGrupo}/usuariogrupo/`);
      const { usuariosgrupo } = response.data;
      if (usuariosgrupo.length >= 0) {
        await dispatch(protocoloSuccess({ usuariosgrupo }));
        history.push('/protocolo');
        return usuariosgrupo;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/protocolo');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de UsuarioGrupo (selectAllUsuariosGrupo)!  ${error.message}`
      );
    }
  };
};

export const selectAllUsuariosGrupoReq = payload => {
  return async dispatch => {
    try {
      const idGrupo = payload;
      const response = await api.get(`grupo/${idGrupo}/usuariogrupo/`);
      const { usuariosgrupo } = response.data;
      if (usuariosgrupo.length >= 0) {
        await dispatch(protocoloSuccess({ usuariosgrupo }));
        history.push('/requisicao');
        return usuariosgrupo;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/requisicao');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de UsuarioGrupo (selectAllUsuariosGrupo)!  ${error.message}`
      );
    }
  };
};

export const selectAllGrupos = () => {
  return async dispatch => {
    try {
      const response = await api.get(`groups/`);
      const { groups } = response.data;
      if (groups.length >= 0) {
        await dispatch(protocoloSuccess({ groups }));
        history.push('/protocolo');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/protocolo');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Grupos (selectAllGrupos)!  ${error.message}`
      );
    }
  };
};

export const selectAllFuncoes = () => {
  return async dispatch => {
    try {
      const response = await api.get(`roles/`);
      const { roles } = response.data;
      if (roles.length >= 0) {
        await dispatch(protocoloSuccess({ roles }));
        history.push('protocolo');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/protocolo');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Funcoes (selectAllFuncoes)!  ${error.message}`
      );
    }
  };
};
