/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { formatPrice } from '../../services/formatPrice';
import logo from '../../assets/funepe.jpeg';
import { getItensOrcamentoProduto } from '../../redux/features/compras/orcamentoSlice';

export default function PriceTable() {
  const [somaItens, setSomaItens] = useState('');
  const dispatch = useDispatch();
  const { orcamentoItensProduto, orcamentoItensReq } = useSelector(
    state => state.orcamentos
  );
  const { requisicao } = useSelector(state => state.compras);

  let somaTotal = 0;
  function somar(item) {
    somaTotal = item.valorunitario * item.quantidade + somaTotal;
  }

  useEffect(() => {
    orcamentoItensReq.forEach(somar);
    setSomaItens(somaTotal);
  });

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
      dataField: 'quantidade',
      text: 'Quantidade',
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

  function print() {
    window.print();
  }

  return (
    <Container>
      <Card size="lg" className="text-center">
        <Card.Header closeButton>
          <Card.Title>
            <Row>
              <Col>
                <h4>
                  Cotação Menor Preço Req. {requisicao.idrequisicao} -{' '}
                  {requisicao.finalidade}
                </h4>
              </Col>
              <Col>
                <img
                  src={logo}
                  alt="logo"
                  width={150}
                  height={40}
                  style={{ marginLeft: 300 }}
                />
              </Col>
            </Row>
          </Card.Title>
        </Card.Header>
        <Card.Body align="center">
          <BootstrapTable
            keyField="idproduto"
            data={orcamentoItensReq}
            columns={columns}
            expandRow={expandRow}
            selectRow={selectRow}
            pagination={false}
          />

          <Card>
            <h3>VALOR TOTAL: {formatPrice(somaItens)}</h3>
          </Card>
        </Card.Body>
        <Card.Footer>
          <Button variant="primary" onClick={() => print()}>
            Imprimir
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
}
