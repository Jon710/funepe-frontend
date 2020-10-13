/* eslint-disable no-return-assign */
import React, { useEffect, useState } from 'react';
import {
  Container,
  Jumbotron,
  Button,
  Table,
  Form,
  Alert,
} from 'react-bootstrap';
import logo from '../../assets/logo-funepe.jpg';
import api from '../../services/api';

export default function EmailParaFornecedor() {
  const [itens, setItens] = useState([]);
  const [count, setCount] = useState(0);
  const [alert, setAlert] = useState(false);
  const newItem = [];

  useEffect(() => {
    let c = 0;

    async function getToken() {
      const url_string = window.location.href;
      const url = new URL(url_string);
      const token = url.searchParams.get('token');

      await api
        .get(`orcamentotoken/${token}`)
        .then(response => {
          const { itemOrcamento } = response.data;

          const orcs = itemOrcamento.map(orcamento => ({
            ...orcamento,
            counter: (c += 1),
          }));
          setCount(c);
          setItens(orcs);
        })
        .catch(error => {
          console.log(error);
        });
    }

    getToken();
  }, [count]);

  function updateItem(e, item) {
    e.preventDefault();
    item.valorunitario = Number(e.target.value);

    newItem.push(item);
  }

  function finalizarOrcamento(e) {
    e.preventDefault();
    newItem.map(async item => {
      const objetoItem = {
        valorunitario: item.valorunitario,
      };

      await api
        .put(`/orcamento/${item.iditemorcamento}`, objetoItem)
        .then(response => {
          setAlert(true);
          return response.data;
        })
        .catch(error => {
          return error;
        });
    });
  }

  return (
    <Container>
      <br />
      <Jumbotron>
        {alert === true ? (
          <Alert variant="success">
            Orçamento de preços finalizado com sucesso!
          </Alert>
        ) : null}
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
            {itens &&
              itens.map(item => (
                <tr key={count}>
                  <td>{count}</td>
                  <td>{item.produto.descricao}</td>
                  <td>{item.quantidade}</td>
                  <td>
                    <Form.Control
                      onBlur={e => updateItem(e, item)}
                      type="number"
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        <p>
          <Button variant="primary" onClick={e => finalizarOrcamento(e)}>
            Finalizar
          </Button>
        </p>

        <img src={logo} alt="logo" width={100} height={40} />
      </Jumbotron>
    </Container>
  );
}
