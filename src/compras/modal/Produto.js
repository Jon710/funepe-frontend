/* eslint-disable no-return-assign */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  Form,
  Card,
  Button,
  Col,
  Container,
  Modal,
} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import {
  selectProdutoByDescricao,
  inserirItemRequisicao,
} from '../../redux/features/compras/comprasSlice';
import { produtoModalClose } from '../../redux/features/context/contextSlice';
import history from '../../services/history';

export default function Produto() {
  const { produtoModal } = useSelector(state => state.contexto);
  const { requisicao } = useSelector(state => state.compras);
  const dispatch = useDispatch();

  const [listaProdutos, setListaProdutos] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState(false);

  async function handleProduto() {
    let c = 0;

    dispatch(selectProdutoByDescricao(descricao)).then(response => {
      console.log(response);
      if (response.length > 0) {
        const prods = response.map(produto => ({
          ...produto,
          counter: (c += 1),
        }));
        console.log('PRODUTOS: ', prods);
        setListaProdutos(prods);
        setCount(c);
        setSearch(true);
      }
    });
  }

  async function handleAddItemProduto(produto) {
    dispatch(produtoModalClose());
    const newItemProduto = {
      datauso: new Date(),
      desconto: 0.0,
      idproduto: produto.idproduto,
      idrequisicao: requisicao.idrequisicao,
      indicacaouso: '',
      prioridade: 1,
      quantidade: 5,
      unidade: produto.idunidade,
      valortotal: produto.valorunitario * 5,
      valorunitario: produto.valorunitario,
    };

    dispatch(inserirItemRequisicao(newItemProduto));
  }

  function checkEnter(e) {
    console.log(descricao);
    if (e.key === 'Enter') handleProduto();
  }

  const handleClose = () => {
    dispatch(produtoModalClose());
    history.push('/requisicao');
  };

  return (
    <Container>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        variant="danger"
        dialogClassName="modal-danger"
        animation
        show={produtoModal}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Localizar Produtos
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <Form.Row>
                <Col sm={10}>
                  <Form.Control
                    style={{ textTransform: 'uppercase' }}
                    value={descricao}
                    required
                    type="text"
                    placeholder="Descrição do Produto"
                    onChange={e => setDescricao(e.target.value)}
                    onKeyPress={e => checkEnter(e)}
                  />
                </Col>
                <Col sm={2}>
                  <Button
                    type="button"
                    onClick={() => handleProduto(descricao)}
                  >
                    Localizar
                  </Button>
                </Col>
              </Form.Row>
            </Card.Body>
          </Card>

          {search ? (
            <>
              <Col sm>
                <Table
                  responsive="sm"
                  striped
                  bordered
                  hover
                  size="sm"
                  variant="success"
                >
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
                        <td>{p.descricao}</td>
                        <td>
                          <Button
                            variant="success"
                            onClick={() => handleAddItemProduto(p)}
                          >
                            Add
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td style={{ textAlign: 'right' }} colSpan="2">
                        TOTAL DE PRODUTOS
                      </td>
                      <td style={{ textAlign: 'left' }} colSpan="1">
                        {count}
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </Col>
            </>
          ) : (
            <div />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Fechar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
