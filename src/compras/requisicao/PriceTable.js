import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from 'react-bootstrap';
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
      dataField: 'vlrUnit',
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
    showExpandColum: true,
    onlyOneExpanding: true,
    renderer: () => (
      <div>
        <Card>
          <Card.Body>
            <Card.Title>FORNECEDORES</Card.Title>
            {orcamentoItensProduto.map(item => (
              <p>
                {item.nomefantasia} - {item.vlrUnit}
              </p>
            ))}
          </Card.Body>
        </Card>
      </div>
    ),
  };

  return (
    <BootstrapTable
      keyField="idproduto"
      data={orcamentoItensReq}
      columns={columns}
      expandRow={expandRow}
      selectRow={selectRow}
    />
  );
}
