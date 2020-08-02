import React from 'react';
import { useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';

export default function PriceTable() {
  const { orcamentoItensReq } = useSelector(state => state.orcamentos);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Descrição Produto</th>
          <th>Fornecedor</th>
          <th>Quantidade</th>
          <th>Valor Unitário</th>
          <th>Valor Total</th>
        </tr>
      </thead>
      <tbody>
        {orcamentoItensReq.map(item => (
          <tr key={item.idorcamento}>
            <td>{item.descricao}</td>
            <td>{item.nomefantasia}</td>
            <td>{item.quantidade}</td>
            <td>{item.vlrUnit}</td>
            <td>{item.vlrTotal}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
