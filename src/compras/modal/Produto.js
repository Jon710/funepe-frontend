/* eslint-disable no-return-assign */
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Form, Button, Col, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  selectProdutoByDescricao,
  inserirItemRequisicao,
} from '../../redux/features/compras/comprasSlice';

export default function Produto() {
  const dispatch = useDispatch();
  const { requisicao } = useSelector(state => state.compras);
  const [listaProdutos, setListaProdutos] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState(false);
  const [qtde, setQtde] = useState(1);
  const textInput = useRef(null);

  async function handleProduto() {
    let c = 0;

    dispatch(selectProdutoByDescricao(descricao)).then(response => {
      if (response.length > 0) {
        const prods = response.map(produto => ({
          ...produto,
          counter: (c += 1),
        }));
        setListaProdutos(prods);
        setCount(c);
        setSearch(true);
      }
    });
  }

  function handleAddItemProduto(produto) {
    const newItemProduto = {
      datauso: new Date(),
      desconto: 0.0,
      idproduto: produto.idproduto,
      idrequisicao: requisicao.idrequisicao,
      indicacaouso: '',
      prioridade: 1,
      quantidade: qtde,
      unidade: produto.idunidade,
      valortotal: produto.valorunitario * qtde,
      valorunitario: produto.valorunitario,
    };

    dispatch(inserirItemRequisicao(newItemProduto));
  }

  function checkEnter(e) {
    if (e.key === 'Enter') handleProduto();
  }

  return (
    <Container>
      <Form.Row>
        <Col sm={10}>
          <Form.Control
            style={{ textTransform: 'uppercase' }}
            value={descricao}
            required
            ref={textInput}
            type="text"
            placeholder="Descrição"
            onChange={e => setDescricao(e.target.value)}
            onKeyPress={e => checkEnter(e)}
          />
        </Col>
        <Col sm={2}>
          <Button
            type="button"
            variant="primary"
            onClick={() => handleProduto(descricao)}
          >
            Buscar
          </Button>
        </Col>
      </Form.Row>
      <br />
      {search ? (
        <Table responsive="md" size="md" bordered hover variant="success">
          <thead>
            <tr>
              <th>ID</th>
              <th>Produto</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {listaProdutos.map(p => (
              <tr key={p.idproduto}>
                <td>{p.idproduto}</td>
                <td>{p.produto}</td>
                <td>
                  <Form inline>
                    <Col xs="auto" className="my-1">
                      <Form.Control
                        type="number"
                        className="mr-sm-2"
                        value={qtde}
                        onChange={e => setQtde(e.target.value)}
                      />
                    </Col>

                    <Col xs="auto" className="my-1">
                      <Button
                        variant="success"
                        onClick={() => handleAddItemProduto(p)}
                      >
                        Add
                      </Button>
                    </Col>
                  </Form>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td style={{ textAlign: 'right' }} colSpan="2">
                PRODUTOS ENCONTRADOS
              </td>
              <td style={{ textAlign: 'left' }} colSpan="1">
                {count}
              </td>
            </tr>
          </tfoot>
        </Table>
      ) : (
        <div />
      )}
    </Container>
  );
}
