import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import { getItensOrcamentoProduto } from '../../redux/features/compras/orcamentoSlice';

export default function PriceTable() {
  const dispatch = useDispatch();
  const { orcamentoItensProduto, orcamentoItensReq } = useSelector(
    state => state.orcamentos
  );
  const { requisicao } = useSelector(state => state.compras);

  const columns = [
    {
      dataField: 'idproduto',
      text: 'ID Produto',
    },
    {
      dataField: 'descricao',
      text: 'Produto',
    },
    {
      dataField: 'nomefantasia',
      text: 'Fornecedor',
    },
    {
      dataField: 'vlrTotal',
      text: 'Menor Preço',
    },
  ];

  const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    clickToExpand: true,
    onSelect: rowIndex => {
      dispatch(
        getItensOrcamentoProduto(requisicao.idrequisicao, rowIndex.idproduto)
      );
    },
  };

  const expandRow = {
    renderer: () => (
      <div>
        <b>FORNECEDORES</b>
        {orcamentoItensProduto.map(item => (
          <p>
            {item.nomefantasia} - {item.vlrTotal}
          </p>
        ))}
      </div>
    ),
    showExpandColumn: true,
  };

  return (
    <BootstrapTable
      keyField="id"
      data={orcamentoItensReq}
      columns={columns}
      expandRow={expandRow}
      selectRow={selectRow}
    />
  );
}
