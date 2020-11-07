/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-return-assign */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { parseISO, format } from 'date-fns';
import api from '../../../services/api';
import { formatPrice } from '../../../services/formatPrice';

export const sliceOrcamentos = createSlice({
  name: 'orcamentos',
  initialState: {
    loading: false,
    orcamentosItem: [],
    orcamentos: [],
    orcamento: {},
    orcamentoItensReq: [],
    orcamentoItensProduto: [],
    fornecedor: {},
  },
  reducers: {
    orcamentoSuccess: (state, action) => {
      // console.log(action.payload);
      const {
        itemOrcamento,
        orcamento,
        orcamentoReq,
        itensOrcamentoReq,
        itensOrcamentoReqProduto,
        fornecedor,
      } = action.payload;
      state.loading = false;
      if (itemOrcamento !== undefined) state.orcamentosItem = itemOrcamento;
      if (itensOrcamentoReq !== undefined)
        state.orcamentoItensReq = itensOrcamentoReq;
      if (itensOrcamentoReqProduto !== undefined)
        state.orcamentoItensProduto = itensOrcamentoReqProduto;
      if (orcamentoReq !== undefined) state.orcamentos = orcamentoReq;
      if (orcamento !== undefined) state.orcamento = orcamento;
      if (fornecedor !== undefined) state.fornecedor = fornecedor;
    },
    orcamentoFailure: state => {
      state.loading = false;
      state.orcamentos = [];
    },
  },
});

export const { orcamentoSuccess, orcamentoFailure } = sliceOrcamentos.actions;

export default sliceOrcamentos.reducer;

// API REQUEST ACTIONS HANDLED WITH REDUX-THUNK MIDDLEWARE BUILT INTO REDUX TOOLKIT -->
/** *************THUNKS************** */
export const selectAllItemOrcamento = orcamento_id => {
  return async dispatch => {
    try {
      const response = await api.get(`orcamento/${orcamento_id}/itemorcamento`);
      const { itensorcamento } = response.data;

      const itemOrcamento = itensorcamento.map(item => ({
        ...item,
        vlrUnit: formatPrice(item.valorunitario),
        vlrTotal: formatPrice(item.valorunitario * item.quantidade),
      }));

      if (itemOrcamento.length >= 0) {
        await dispatch(orcamentoSuccess({ itemOrcamento }));
        return;
      }
      toast.info('Nenhum orçamento localizado!');
      return;
    } catch (error) {
      toast.error(`ERRO: Falha ao buscar item orçamento.   ${error.message}`);
    }
  };
};

export const getItensOrcamento = requisicao_id => {
  return async dispatch => {
    try {
      const response = await api.get(
        `/orcamento/${requisicao_id}/itensorcamentoreq`
      );
      const { itensOrcamento } = response.data;

      const arrayIDProdutos = itensOrcamento.map(produto => {
        return produto.idproduto;
      });

      const unique = [...new Set(arrayIDProdutos)];

      const arrayMenorPreco = [];
      unique.map(iditem => {
        const lookupArray = [];
        itensOrcamento.filter(item => {
          if (item.idproduto === iditem) {
            lookupArray.push(item);
          }
        });

        let menor = Infinity;
        let tempItem = {};
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < lookupArray.length; i++) {
          if (lookupArray[i].valorunitario > 0) {
            if (lookupArray[i].valorunitario < menor) {
              menor = lookupArray[i].valorunitario;
              tempItem = lookupArray[i];
            }
          }
        }

        arrayMenorPreco.push(tempItem);
      });

      const itensOrcamentoReq = arrayMenorPreco.map(item => ({
        ...item,
        vlrUnit: formatPrice(item.valorunitario),
        vlrTotal: formatPrice(item.valortotal),
      }));

      await dispatch(orcamentoSuccess({ itensOrcamentoReq }));
    } catch (error) {
      toast.error(`ERRO: Falha ao buscar item orçamento.   ${error.message}`);
    }
  };
};

export const getItensOrcamentoProduto = (requisicao_id, produto_id) => {
  return async dispatch => {
    try {
      const response = await api.get(
        `/orcamento/${requisicao_id}/itensorcamentoreq/${produto_id}`
      );

      const { itensOrcamentoProduto } = response.data;
      const itensOrcamentoReqProduto = itensOrcamentoProduto.map(item => ({
        ...item,
        vlrUnit: formatPrice(item.valorunitario),
        vlrTotal: formatPrice(item.valortotal),
      }));

      if (itensOrcamentoReqProduto.length >= 0) {
        await dispatch(orcamentoSuccess({ itensOrcamentoReqProduto }));
        return;
      }
    } catch (error) {
      toast.error(
        `ERRO: Falha ao buscar item orçamento relacionado ao produto.   ${error.message}`
      );
    }
  };
};

export const selectAllOrcamentos = idrequisicao => {
  return async dispatch => {
    try {
      const response = await api.get(`requisicao/${idrequisicao}/orcamento`);
      const { orcamentos } = response.data;

      let c = 0;
      if (orcamentos.length >= 0) {
        const orcamentoReq = orcamentos.map(orc => ({
          ...orc,
          dataFormatada: format(parseISO(orc.dataorcamento), 'dd/MM/yyyy'),
          nomeFornecedor: orc.fornecedor.nomefantasia.toUpperCase(),
          nomeSolicitante: orc.solicitante.username.toUpperCase(),
          counter: (c += 1),
        }));

        await dispatch(orcamentoSuccess({ orcamentoReq }));
      }

      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de orçamento do Usuário.  ${error.message}`
      );
    }
  };
};

export const inserirItemOrcamento = payload => {
  return async dispatch => {
    try {
      if (payload !== undefined) {
        const { newItemOrcamento } = payload;
        const { idorcamento } = newItemOrcamento.idorcamento;

        const response = await api.post(
          `orcamento/${idorcamento}/itemorcamento`,
          newItemOrcamento
        );
        await dispatch(orcamentoSuccess(response.data));
        return response.data;
      }
    } catch (error) {
      toast.error(`ERRO ao inserir Item orcamento ${error.message}`);
      dispatch(orcamentoFailure());
    }
  };
};

export const inserirOrcamento = payload => {
  return async (dispatch, getState) => {
    try {
      const { requisicoesItem } = getState().compras;

      const { newOrcamento } = payload;
      const response = await api.post(
        `requisicao/${newOrcamento.idrequisicao}/orcamento`,
        newOrcamento
      );
      const { orcamento } = response.data;
      await dispatch(orcamentoSuccess({ orcamento }));

      requisicoesItem.map(async item => {
        const newItemOrcamento = {
          idorcamento: orcamento.idorcamento,
          idproduto: item.idproduto,
          quantidade: item.quantidade,
          unidade: item.unidade,
          valorunitario: item.valorunitario,
          desconto: item.desconto,
          valortotal: item.valortotal,
          idrequisicao: item.idrequisicao,
          iditemrequisicao: item.iditemrequisicao,
        };

        await dispatch(inserirItemOrcamento({ newItemOrcamento }));
        dispatch(selectAllOrcamentos(newOrcamento.idrequisicao));
      });
      toast.success('Orçamento gerado com sucesso!');
      return response.data;
    } catch (error) {
      toast.error(`ERRO ao inserir orçamento ${error.message}`);
      dispatch(orcamentoFailure());
    }
  };
};

export const getFornecedorByID = payload => {
  return async dispatch => {
    try {
      const response = await api.get(`fornecedor/${payload.idfornecedor}`);
      const fornecedor = response.data;

      await dispatch(orcamentoSuccess(fornecedor));
    } catch (error) {
      toast.error(`Fornecedor não encontrado. ${error.message}`);
    }
  };
};

// /requisicao/:requisicao_id/orcamento/:id
export const getOrcamentoByID = idrequisicao => {
  return async dispatch => {
    try {
      const response = await api.get(
        `/requisicao/${idrequisicao}/orcamento/${idrequisicao}`
      );
      const orcamento = response.data;

      await dispatch(orcamentoSuccess(orcamento));
      return orcamento;
    } catch (error) {
      toast.error(`Orçamento não encontrado. ${error.message}`);
    }
  };
};
