/* eslint-disable no-return-assign */
/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import history from '../../../services/history';
import api from '../../../services/api';
import { formatPrice } from '../../../services/formatPrice';

// createSlice makes all action creators and reducers in the same file so no separation of logic is necessary
export const sliceCompras = createSlice({
  name: 'compras',
  initialState: {
    loading: false,
    requisicao: {},
    requisicoes: [],
    requisicoesItem: [],
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
    minhasRequisicoes: [],
    arquivos: [],
  },
  reducers: {
    requisicaoSuccess: (state, action) => {
      const {
        requisicoes,
        produtos,
        empresas,
        fornecedores,
        departamentos,
        marcas,
        categorias,
        unidadesmedida,
        tiposfornecedor,
        tiposempresa,
        tipostelefone,
        users,
        itensReq,
        myReqs,
        arquivosanexo,
      } = action.payload;
      state.loading = false;
      if (requisicoes !== undefined) {
        state.requisicoes = requisicoes;
      }
      if (arquivosanexo !== undefined) {
        state.arquivos = arquivosanexo;
      }
      if (myReqs !== undefined) {
        state.minhasRequisicoes = myReqs;
      }
      if (itensReq !== undefined) {
        state.requisicoesItem = itensReq;
      }
      if (users !== undefined) {
        state.usuarios = users;
      }
      if (empresas !== undefined) {
        state.empresas = empresas;
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
    requisicaoItemRequest: state => {
      state.loading = true;
      state.requisicoesItem = [];
    },
    requisicaoFailure: state => {
      state.loading = false;
      state.requisicoes = {};
    },
    updateRequisicaoRequest: (state, action) => {
      const { requisicoes } = action.payload;
      state.loading = false;
      state.requisicoes = requisicoes;
    },
    updateRequisicaoSuccess: (state, action) => {
      const { requisicoes, requisicao } = action.payload;
      state.loading = false;
      state.requisicoes = requisicoes;
      state.requisicao = requisicao;
    },
    updateFailure: state => {
      state.loading = false;
      state.requisicoes = {};
    },
    addRequisicaoRequest(state) {
      state.loading = false;
      state.requisicao = {};
      state.requisicoesItem = [];
    },
    addRequisicaoSuccess(state, action) {
      const { requisicao, rowIndex } = action.payload;
      if (requisicao !== undefined) {
        state.loading = false;
        state.requisicao = requisicao;
      }
      if (rowIndex !== undefined) {
        state.loading = false;
        state.requisicao = rowIndex;
      }
    },
  },
});

export const {
  requisicaoRequest,
  requisicaoItemRequest,
  requisicaoSuccess,
  requisicaoUser,
  requisicaoFailure,
  updateRequisicaoRequest,
  updateRequisicaoSuccess,
  updateFailure,
  addRequisicaoRequest,
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
        dispatch(selectAllEmpresas());
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

export const getUploadedFiles = idrequisicao => {
  return async dispatch => {
    try {
      const response = await api.get(
        `requisicao/${idrequisicao}/arquivoanexo/`
      );

      const { arquivosanexo } = response.data;
      if (arquivosanexo) {
        if (arquivosanexo.length >= 0) {
          await dispatch(requisicaoSuccess({ arquivosanexo }));
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

export const getMyOwnReq = usuario => {
  return async dispatch => {
    dispatch(requisicaoRequest({ usuario }));
    try {
      if (!usuario.idusuario) {
        toast.error('ID do Usuário é inválido.');
        return;
      }
      const response = await api.get(
        `/solicitante/${usuario.idusuario}/requisicao`
      );
      let myReqs;
      if (response.data.myOwnReq.length > 0) {
        myReqs = response.data.myOwnReq.map(req => ({
          ...req,
          dataFormatada: format(parseISO(req.datareq), 'dd/MM/yyyy', {
            locale: pt,
          }),
        }));
      }
      dispatch(requisicaoSuccess({ myReqs }));
      return myReqs;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Minhas reqs. getMyOwnReq.  ${error.message}`
      );
    }
  };
};

export const selectAllProdutos = () => {
  return async dispatch => {
    try {
      const response = await api.get(`produto/`);
      const { produtos } = response.data;
      if (produtos.length >= 0) {
        await dispatch(requisicaoSuccess({ produtos }));
        return;
      }
      toast.info('Nenhum Registro Localizado!');
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
      const { listaProdutos } = response.data;
      if (listaProdutos.length >= 0) {
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
      const itensReq = itensrequisicao.map(item => ({
        ...item,
        vlrUnit: formatPrice(item.valorunitario),
        vlrTotal: formatPrice(item.valortotal),
      }));

      if (itensReq.length >= 0) {
        await dispatch(requisicaoSuccess({ itensReq }));
        return;
      }
      toast.info('Nenhum Registro Localizado!');
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
      history.push('/requisicao');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Requisicao do Usuário. selectAllRequisicao  ${error.message}`
      );
    }
  };
};

export const inserirRequisicao = payload => {
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
      dispatch(updateFailure());
    }
  };
};

export const atualizarRequisicao = payload => {
  return async dispatch => {
    try {
      const newRequisicao = payload;
      const response = await api.put(
        `usuario/${newRequisicao.iddestinatario}/requisicao/${newRequisicao.idrequisicao}`,
        newRequisicao
      );
      dispatch(updateRequisicaoSuccess(response.data));
      dispatch(selectAllRequisicao());

      return response.data;
    } catch (error) {
      toast.error(`ERRO ao atualizar requisição ${error.message}`);
      dispatch(updateFailure());
    }
  };
};

export const inserirItemRequisicao = payload => {
  return async dispatch => {
    try {
      const newRequisicao = payload;
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
      dispatch(updateFailure());
    }
  };
};

export const selectAllFornecedores = () => {
  return async dispatch => {
    try {
      const response = await api.get(`fornecedor/`);
      const { fornecedores } = response.data;
      if (fornecedores.length >= 0) {
        await dispatch(requisicaoSuccess({ fornecedores }));
        return;
      }
      toast.info('Nenhum Registro Localizado!');
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
      const { departamentos } = response.data;
      if (departamentos.length >= 0) {
        await dispatch(requisicaoSuccess({ departamentos }));
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Departamentos (selectAllDepartamentos)!  ${error.message}`
      );
    }
  };
};

export const selectAllEmpresas = () => {
  return async dispatch => {
    try {
      const response = await api.get(`empresa/`);
      const { empresas } = response.data;
      if (empresas.length >= 0) {
        await dispatch(requisicaoSuccess({ empresas }));
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Empresas (selectAllEmpresas)!  ${error.message}`
      );
    }
  };
};

export const selectAllMarcas = () => {
  return async dispatch => {
    try {
      const response = await api.get(`marca/`);
      const { marcas } = response.data;
      if (marcas.length >= 0) {
        await dispatch(requisicaoSuccess({ marcas }));
        return;
      }
      toast.info('Nenhum Registro Localizado!');
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
      const { categorias } = response.data;
      if (categorias.length >= 0) {
        await dispatch(requisicaoSuccess({ categorias }));
        return;
      }
      toast.info('Nenhum Registro Localizado!');
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
      const { unidadesmedida } = response.data;
      if (unidadesmedida.length >= 0) {
        await dispatch(requisicaoSuccess({ unidadesmedida }));
        return;
      }
      toast.info('Nenhum Registro Localizado!');
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
      const { tiposfornecedor } = response.data;
      if (tiposfornecedor.length >= 0) {
        await dispatch(requisicaoSuccess({ tiposfornecedor }));
        return;
      }
      toast.info('Nenhum Registro Localizado!');
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
      const { tiposempresa } = response.data;
      if (tiposempresa.length >= 0) {
        await dispatch(requisicaoSuccess({ tiposempresa }));
        return;
      }
      toast.info('Nenhum Registro Localizado!');
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
      const { tipostelefone } = response.data;
      if (tipostelefone.length >= 0) {
        await dispatch(requisicaoSuccess({ tipostelefone }));
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Tipos de Telefones (selectAllTipoTelefones)!  ${error.message}`
      );
    }
  };
};

export const inserirHistorico = payload => {
  return async dispatch => {
    try {
      const historico = payload;
      const response = await api.post(
        `requisicao/${historico.idrequisicao}/historicorequisicao/`,
        historico
      );
      dispatch(selectAllRequisicao());
      return response.data;
    } catch (error) {
      toast.error(
        `ERRO ao despachar Documento - despacharProtocolo ${error.message}`
      );

      dispatch(updateFailure());
    }
  };
};

export const selecionarHistorico = payload => {
  return async dispatch => {
    try {
      const idrequisicao = payload;
      const response = await api.get(
        `requisicao/${idrequisicao}/historicorequisicao/`
      );
      dispatch(selectAllRequisicao());
      return response.data;
    } catch (error) {
      toast.error(`ERRO ao Selecionar histórico ${error.message}`);

      dispatch(updateFailure());
    }
  };
};
