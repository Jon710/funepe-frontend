/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';

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
  },
  reducers: {
    modalClose: (state, action) => {
      state.showModal = false;
      state.deleteRequisicaoModal = false;
      state.visualizaHistoricoModal = false;
    },
    modalOpen: (state, action) => {
      state.showModal = true;
    },
    editModalClose: (state, action) => {
      state.editModal = false;
    },
    editModalOpen: (state, action) => {
      state.editModal = true;
    },
    despachoModalClose: (state, action) => {
      state.despachoModal = false;
      state.despachaRequisicaoModal = false;
    },
    despachoModalOpen: (state, action) => {
      state.despachoModal = true;
    },
    anotacaoModalClose: (state, action) => {
      state.anotacaoModal = false;
    },
    anotacaoModalOpen: (state, action) => {
      state.anotacaoModal = true;
    },
    produtoModalClose: (state, action) => {
      state.produtoModal = false;
    },
    produtoModalOpen: (state, action) => {
      state.produtoModal = true;
    },
    requisicaoModalClose: state => {
      state.requisicaoModal = false;
      state.editRequisicaoModal = false;
      state.deleteRequisicaoModal = false;
    },
    requisicaoModalOpen: (state, action) => {
      state.requisicaoModal = true;
    },
    editRequisicaoModalOpen: state => {
      state.editRequisicaoModal = true;
    },
    deleteRequisicaoModalOpen: state => {
      state.deleteRequisicaoModal = true;
    },
    despachaRequisicaoModalOpen: state => {
      state.despachaRequisicaoModal = true;
    },
    visualizaHistoricoModalOpen: state => {
      state.visualizaHistoricoModal = true;
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

/** *************EXPORTED ACTIONS & REDUCERS************** */

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
  progressBar,
  showAlertErrorOpen,
  showAlertErrorClose,
} = sliceContext.actions;

export default sliceContext.reducer;

// API REQUEST ACTIONS HANDLED WITH REDUX-THUNK MIDDLEWARE BUILT INTO REDUX TOOLKIT -->

/** *************THUNKS************** */
