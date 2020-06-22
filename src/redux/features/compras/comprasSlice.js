/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import history from '../../../services/history';
import api from '../../../services/api';

// createSlice makes all action creators and reducers in the same file so no separation of logic is necessary

/** *************STATE SLICE************** */
export const sliceCompras = createSlice({
  name: 'compras',
  initialState: {
    loading: false,
    requisicao: {},
    requisicoes: {},
    requisicoesItem: [],
    orcamentos: {},
    produtos: {},
    fornecedores: {},
    departamentos: {},
    marcas: {},
    categorias: {},
    unidadeMedidas: {},
    tipoFornecedores: {},
    tipoEmpresas: {},
    tipoTelefones: {},
    usuarios: {},
  },
  reducers: {
    requisicaoSuccess: (state, action) => {
      const {
        requisicoes,
        orcamentos,
        produtos,
        fornecedores,
        departamentos,
        marcas,
        categorias,
        unidadesmedida,
        tiposfornecedor,
        tiposempresa,
        tipostelefone,
        users,
        itensrequisicao,
      } = action.payload;
      state.loading = false;
      // console.log('requisicaoSuccess', action.payload);
      if (requisicoes !== undefined) {
        state.requisicoes = requisicoes;
      }
      if (itensrequisicao !== undefined) {
        state.requisicoesItem = itensrequisicao;
      }
      if (orcamentos !== undefined) {
        state.orcamentos = orcamentos;
      }
      if (users !== undefined) {
        state.usuarios = users;
      }
      if (produtos !== undefined) {
        state.produtos = produtos;
      }
      if (fornecedores !== undefined) {
        state.fornecedores = fornecedores;
      }
      if (departamentos !== undefined) {
        state.departamentos = departamentos;
      }
      if (marcas !== undefined) {
        state.marcas = marcas;
      }
      if (categorias !== undefined) {
        state.categorias = categorias;
      }
      if (unidadesmedida !== undefined) {
        state.unidadeMedidas = unidadesmedida;
      }
      if (tiposfornecedor !== undefined) {
        state.tipoFornecedores = tiposfornecedor;
      }
      if (tiposempresa !== undefined) {
        state.tipoEmpresas = tiposempresa;
      }
      if (tipostelefone !== undefined) {
        state.tipoTelefones = tipostelefone;
      }
    },
    requisicaoRequest: (state, action) => {
      const { requisicoes } = action.payload;
      state.loading = true;
      state.requisicoes = requisicoes;
    },
    requisicaoFailure: (state, action) => {
      console.log('requisicaoFailure', action.payload);
      state.loading = false;
      state.requisicoes = {};
    },
    updateRequisicaoRequest: (state, action) => {
      console.log('updateRequisicaoRequest Reducer/Action', action);
      const { requisicoes } = action.payload;
      state.loading = false;
      state.requisicoes = requisicoes;
    },
    updateRequisicaoSuccess: (state, action) => {
      console.log('updateRequisicaoSuccess Reducer/Action', action);
      const { requisicoes } = action.payload;
      state.loading = false;
      state.requisicoes = requisicoes;
    },
    updateFailure: (state, action) => {
      console.log('updateFAILURE', action.payload);
      state.loading = false;
      state.requisicoes = {};
      state.orcamentos = {};
    },
    addRequisicaoSuccess(state, action) {
      console.log('addRequisicaoSuccess Reducer/Action', action.payload);
      const { requisicao } = action.payload;
      if (requisicao !== undefined) {
        state.loading = false;
        state.requisicao = requisicao;
      }
    },
  },
});

/** *************EXPORTED ACTIONS & REDUCERS************** */

export const {
  requisicaoRequest,
  requisicaoSuccess,
  requisicaoUser,
  requisicaoFailure,
  updateRequisicaoRequest,
  updateRequisicaoSuccess,
  updateFailure,
  addRequisicaoSuccess,
} = sliceCompras.actions;

export default sliceCompras.reducer;

// API REQUEST ACTIONS HANDLED WITH REDUX-THUNK MIDDLEWARE BUILT INTO REDUX TOOLKIT -->

/** *************THUNKS************** */
export const getFirstRender = usuario => {
  console.log('Compras getFirstRender:', usuario);
  return async dispatch => {
    dispatch(requisicaoRequest({ usuario }));
    try {
      if (!usuario.idusuario) {
        toast.error('ID do Usuário é inválido.');
        return;
      }
      const response = await api.get(
        `usuario/${usuario.idusuario}/requisicao/`
      );
      const { requisicoes } = response.data;
      if (requisicoes.length >= 0) {
        dispatch(selectAllProdutos());
        dispatch(selectAllFornecedores());
        dispatch(selectAllDepartamentos());
        dispatch(selectAllMarcas());
        dispatch(selectAllCategorias());
        dispatch(selectAllUnidadeMedidas());
        dispatch(selectAllTipoEmpresas());
        dispatch(selectAllTipoFornecedores());
        dispatch(selectAllTipoTelefones());
        return requisicoes;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/requisicao');
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Requisicao do Usuário. getFirstRender.  ${error.message}`
      );
    }
  };
};

export const selectAllProdutos = () => {
  return async dispatch => {
    try {
      const response = await api.get(`produto/`);
      console.log(response.data);
      const { produtos } = response.data;
      if (produtos.length >= 0) {
        await dispatch(requisicaoSuccess({ produtos }));
        history.push('/requisicao');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/requisicao');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Produto (selectAllProduto)!  ${error.message}`
      );
    }
  };
};

export const selectProdutoByDescricao = descricao => {
  return async () => {
    try {
      const response = await api.get(`produtos/${descricao}`);
      console.log(response.data);
      const { listaProdutos } = response.data;
      if (listaProdutos.length >= 0) {
        // await dispatch(requisicaoSuccess({ produtos }));
        history.push('/requisicao');
        return listaProdutos;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/requisicao');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Produto (selectProdutoByDescricao)!  ${error.message}`
      );
    }
  };
};

export const selectAllItemRequisicao = requisicao_id => {
  return async dispatch => {
    try {
      const response = await api.get(
        `requisicao/${requisicao_id}/itemrequisicao/`
      );
      const { itensrequisicao } = response.data;
      console.log(itensrequisicao);
      if (itensrequisicao.length >= 0) {
        await dispatch(requisicaoSuccess({ itensrequisicao }));
        history.push('/requisicao');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/protocolo');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Item Requisicao. selectAllItemRequisicao  ${error.message}`
      );
    }
  };
};

export const selectAllRequisicao = () => {
  return async (dispatch, getState) => {
    try {
      const { user } = getState().auth;
      const response = await api.get(`usuario/${user.idusuario}/requisicao/`);
      const { requisicoes } = response.data;
      if (requisicoes.length >= 0) {
        await dispatch(requisicaoSuccess({ requisicoes }));
        history.push('/requisicao');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/protocolo');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Requisicao do Usuário. selectAllRequisicao  ${error.message}`
      );
    }
  };
};

export const inserirRequisicao = payload => {
  console.log('inserirRequisicao-payload: ', payload);
  return async dispatch => {
    try {
      const newRequisicao = payload;
      const response = await api.post(
        `usuario/${newRequisicao.idsolicitante}/requisicao/`,
        newRequisicao
      );
      dispatch(addRequisicaoSuccess(response.data));
      dispatch(selectAllRequisicao());
      return response.data;
    } catch (error) {
      toast.error(
        `ERRO ao inserir Requisicao - inserirRequisicao ${error.message}`
      );
      console.log(
        'ERRO ao despachar Documento - despacharProtocolo: ',
        error.message
      );
      dispatch(updateFailure());
    }
  };
};

export const inserirItemRequisicao = payload => {
  console.log('inserirRequisicao-payload: ', payload);
  return async dispatch => {
    try {
      const newRequisicao = payload;
        // /requisicao/:requisicao_id/itemrequisicao

      const response = await api.post(
        `requisicao/${newRequisicao.idrequisicao}/itemrequisicao/`,
        newRequisicao
      );
      dispatch(addRequisicaoSuccess(response.data));
      dispatch(selectAllRequisicao());
      return response.data;
    } catch (error) {
      toast.error(
        `ERRO ao inserir Item de Requisicao - inserirRequisicao ${error.message}`
      );
      console.log(
        'ERRO ao inserir Item de Requisicao - inserirRequisicao: ',
        error.message
      );
      dispatch(updateFailure());
    }
  };
};

export const selectAllFornecedores = () => {
  return async dispatch => {
    try {
      const response = await api.get(`fornecedor/`);
      console.log(response.data);
      const { fornecedores } = response.data;
      if (fornecedores.length >= 0) {
        await dispatch(requisicaoSuccess({ fornecedores }));
        history.push('/requisicao');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/requisicao');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Fornecedores (selectAllFornecedores)!  ${error.message}`
      );
    }
  };
};

export const selectAllDepartamentos = () => {
  return async dispatch => {
    try {
      const response = await api.get(`departamento/`);
      console.log(response.data);
      const { departamentos } = response.data;
      if (departamentos.length >= 0) {
        await dispatch(requisicaoSuccess({ departamentos }));
        history.push('/requisicao');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/requisicao');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Departamentos (selectAllDepartamentos)!  ${error.message}`
      );
    }
  };
};

export const selectAllMarcas = () => {
  return async dispatch => {
    try {
      const response = await api.get(`marca/`);
      console.log(response.data);
      const { marcas } = response.data;
      if (marcas.length >= 0) {
        await dispatch(requisicaoSuccess({ marcas }));
        history.push('/requisicao');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/requisicao');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Marcas (selectAllMarcas)!  ${error.message}`
      );
    }
  };
};

export const selectAllCategorias = () => {
  return async dispatch => {
    try {
      const response = await api.get(`categoria/`);
      console.log(response.data);
      const { categorias } = response.data;
      if (categorias.length >= 0) {
        await dispatch(requisicaoSuccess({ categorias }));
        history.push('/requisicao');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/requisicao');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Categorias (selectAllCategorias)!  ${error.message}`
      );
    }
  };
};

export const selectAllUnidadeMedidas = () => {
  return async dispatch => {
    try {
      const response = await api.get(`unidademedida/`);
      console.log(response.data);
      const { unidadesmedida } = response.data;
      if (unidadesmedida.length >= 0) {
        await dispatch(requisicaoSuccess({ unidadesmedida }));
        history.push('/requisicao');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/requisicao');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Unidades de Medida (selectAllUnidadesMedida)!  ${error.message}`
      );
    }
  };
};

export const selectAllTipoFornecedores = () => {
  return async dispatch => {
    try {
      const response = await api.get(`tipofornecedor/`);
      console.log(response.data);
      const { tiposfornecedor } = response.data;
      if (tiposfornecedor.length >= 0) {
        await dispatch(requisicaoSuccess({ tiposfornecedor }));
        history.push('/requisicao');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/requisicao');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Tipos de Fornecedores (selectAllTipoFornecedores)!  ${error.message}`
      );
    }
  };
};

export const selectAllTipoEmpresas = () => {
  return async dispatch => {
    try {
      const response = await api.get(`tipoempresa/`);
      console.log(response.data);
      const { tiposempresa } = response.data;
      if (tiposempresa.length >= 0) {
        await dispatch(requisicaoSuccess({ tiposempresa }));
        history.push('/requisicao');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/requisicao');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Tipos de Empresa (selectAllTipoEmpresas)!  ${error.message}`
      );
    }
  };
};

export const selectAllTipoTelefones = () => {
  return async dispatch => {
    try {
      const response = await api.get(`tipotelefone/`);
      console.log(response.data);
      const { tipostelefone } = response.data;
      if (tipostelefone.length >= 0) {
        await dispatch(requisicaoSuccess({ tipostelefone }));
        history.push('/requisicao');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/requisicao');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Tipos de Telefones (selectAllTipoTelefones)!  ${error.message}`
      );
    }
  };
};
