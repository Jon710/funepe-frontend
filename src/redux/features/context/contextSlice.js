/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../../../services/api';

// createSlice makes all action creators and reducers in the same file so no separation of logic is necessary
export const sliceContext = createSlice({
  name: 'contexto',
  initialState: {
    showModal: false,
    editModal: false,
    despachoModal: false,
    anotacaoModal: false,
    produtoModal: false,
    requisicaoModal: false,
    uploadPercentage: 0,
    showAlertError: false,
    alertError: '',
    editRequisicaoModal: false,
    deleteRequisicaoModal: false,
    despachaRequisicaoModal: false,
    visualizaHistoricoModal: false,
    visualizaRequisicaoModal: false,
    orcamentoModal: false,
    orcamentoPrecosModal: false,
    usuarios: {},
    grupos: {},
    usuariosgrupo: {},
    funcoes: {},
    updatedRequisicao: false,
    requisicaoDespachada: false,
  },
  reducers: {
    contextoSuccess: (state, action) => {
      const { users, roles, groups, usuariosgrupo } = action.payload;
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
    modalClose: state => {
      state.showModal = false;
      state.deleteRequisicaoModal = false;
      state.visualizaHistoricoModal = false;
      state.visualizaRequisicaoModal = false;
      state.orcamentoModal = false;
      state.orcamentoPrecosModal = false;
    },
    modalOpen: state => {
      state.showModal = true;
      state.orcamentoModal = true;
      state.orcamentoPrecosModal = true;
    },
    editModalClose: state => {
      state.editModal = false;
    },
    editModalOpen: state => {
      state.editModal = true;
    },
    despachoModalClose: state => {
      state.despachoModal = false;
      state.despachaRequisicaoModal = false;
      state.requisicaoDespachada = true;
    },
    despachoModalOpen: state => {
      state.despachoModal = true;
    },
    anotacaoModalClose: state => {
      state.anotacaoModal = false;
    },
    anotacaoModalOpen: state => {
      state.anotacaoModal = true;
    },
    produtoModalClose: state => {
      state.produtoModal = false;
    },
    produtoModalOpen: state => {
      state.produtoModal = true;
    },
    requisicaoModalClose: state => {
      state.requisicaoModal = false;
      state.editRequisicaoModal = false;
      state.deleteRequisicaoModal = false;
      state.updatedRequisicao = true;
    },
    requisicaoModalOpen: state => {
      state.requisicaoModal = true;
    },
    editRequisicaoModalOpen: state => {
      state.editRequisicaoModal = true;
      state.updatedRequisicao = false;
    },
    deleteRequisicaoModalOpen: state => {
      state.deleteRequisicaoModal = true;
    },
    despachaRequisicaoModalOpen: state => {
      state.despachaRequisicaoModal = true;
      state.requisicaoDespachada = false;
    },
    visualizaHistoricoModalOpen: state => {
      state.visualizaHistoricoModal = true;
    },
    visualizaRequisicaoModalOpen: state => {
      state.visualizaRequisicaoModal = true;
    },
    progressBar: (state, action) => {
      state.uploadPercentage = action.payload;
    },
    showAlertErrorOpen: (state, action) => {
      const { showAlertError, alertError } = action.payload;
      state.showAlertError = showAlertError;
      state.alertError = alertError;
    },
    showAlertErrorClose: (state, action) => {
      const { showAlertError, alertError } = action.payload;
      state.showAlertError = showAlertError;
      state.alertError = alertError;
    },
  },
});

export const {
  modalClose,
  modalOpen,
  editModalOpen,
  editModalClose,
  despachoModalOpen,
  despachoModalClose,
  anotacaoModalOpen,
  anotacaoModalClose,
  produtoModalOpen,
  produtoModalClose,
  requisicaoModalOpen,
  requisicaoModalClose,
  editRequisicaoModalOpen,
  deleteRequisicaoModalOpen,
  despachaRequisicaoModalOpen,
  visualizaHistoricoModalOpen,
  visualizaRequisicaoModalOpen,
  progressBar,
  showAlertErrorOpen,
  showAlertErrorClose,
  contextoSuccess,
} = sliceContext.actions;

export default sliceContext.reducer;

// API REQUEST ACTIONS HANDLED WITH REDUX-THUNK MIDDLEWARE BUILT INTO REDUX TOOLKIT -->
/** *************THUNKS************** */

export const getFirstRenderContext = () => {
  return async dispatch => {
    dispatch(selectAllUsuarios());
    dispatch(selectAllGrupos());
    dispatch(selectAllFuncoes());
  };
};

export const selectAllUsuarios = () => {
  return async dispatch => {
    try {
      const response = await api.get(`usuarios`);
      const { users } = response.data;
      if (users.length >= 0) {
        await dispatch(contextoSuccess({ users }));
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Tipo de Usuarios (selectAllUsuarios)!  ${error.message}`
      );
    }
  };
};

export const selectAllGrupos = () => {
  return async dispatch => {
    try {
      const response = await api.get(`groups`);
      const { groups } = response.data;
      if (groups.length >= 0) {
        await dispatch(contextoSuccess({ groups }));
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Grupos (selectAllGrupos)!  ${error.message}`
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
        await dispatch(contextoSuccess({ usuariosgrupo }));
        return usuariosgrupo;
      }
      toast.info('Nenhum Registro Localizado!');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de UsuarioGrupo (selectAllUsuariosGrupo)!  ${error.message}`
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
        await dispatch(contextoSuccess({ roles }));
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Funcoes (selectAllFuncoes)!  ${error.message}`
      );
    }
  };
};
