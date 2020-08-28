import React from 'react';
import { useSelector } from 'react-redux';

import { Container, Jumbotron, Button, Table, Form } from 'react-bootstrap';
import logo from '../../assets/logo-funepe.jpg';

export default function EmailParaFornecedor() {
  const { orcamentosItem } = useSelector(state => state.compras);

  return (
    <Container>
      <br />
      <Jumbotron>
        <h1>Orçamento de Preços</h1>

        <Table striped bordered hover>
          <thead>
            <tr style={{ color: 'black' }}>
              <th>#</th>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {/* {orcamentosItem.map(orcamento => ( */}
            <tr>
              <td>1</td>
              <td>Mesa</td>
              <td>R$ 5,00</td>
              <td>
                <Form.Control
                  // onChange={e => setObservacao(e.target.value)}
                  as="textarea"
                  rows="2"
                />
              </td>
            </tr>
            {/* ))} */}
          </tbody>
        </Table>
        <p>
          <Button variant="primary">Finalizar</Button>
        </p>

        <img src={logo} alt="logo" width={100} height={40} />
      </Jumbotron>
    </Container>
  );
}
