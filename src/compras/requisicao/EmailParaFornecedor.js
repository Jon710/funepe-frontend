/* eslint-disable no-return-assign */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Jumbotron,
  Button,
  Table,
  Form,
  Alert,
  Card,
} from 'react-bootstrap';
import { formatPrice } from '../../services/formatPrice';
import logo from '../../assets/logo-funepe.jpg';
import api from '../../services/api';
import { createLogger } from '../../redux/features/historico/historicoSlice';

export default function EmailParaFornecedor() {
  const dispatch = useDispatch();
  const [itens, setItens] = useState([]);
  const [count, setCount] = useState(0);
  const [alert, setAlert] = useState(false);
  const [valorTotal, setValorTotal] = useState(0);
  const { fornecedor } = useSelector(state => state.compras);
  const [newItem, setNewItem] = useState([]);

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

    const valores = itens.map(valor => valor.valorunitario * valor.quantidade);
    const total = valores.reduce((acc, prod) => (acc += prod), 0);

    setValorTotal(total);

    setNewItem(itens);
  }

  function finalizarOrcamento() {
    newItem.map(async item => {
      const objetoItem = {
        valorunitario: item.valorunitario,
      };

      await api
        .put(`/orcamento/${item.iditemorcamento}`, objetoItem)
        .then(response => {
          setAlert(true);
          const payload = {
            conteudo: `Orçamento FINALIZADO com sucesso! ${fornecedor.nomefantasia}`,
            origem: 'FUNEPE',
          };
          dispatch(createLogger(payload));
          return response.data;
        })
        .catch(error => {
          console.log(error);
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
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {itens &&
              itens.map(item => (
                <tr key={item.idproduto}>
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
        <Card.Body align="center">
          <Card>
            <h3>
              VALOR TOTAL DE {count} PRODUTOS: {formatPrice(valorTotal)}
            </h3>
          </Card>
        </Card.Body>
        <p>
          <Button variant="primary" onClick={() => finalizarOrcamento()}>
            Finalizar
          </Button>
        </p>

        <img src={logo} alt="logo" width={100} height={40} />
      </Jumbotron>
    </Container>
  );
}
