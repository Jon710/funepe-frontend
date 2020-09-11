import React, { useState } from 'react';
import {
  Table,
  Container,
  Button,
  Modal,
  Form,
  Row,
  Col,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import NavBar from '../requisicao/NavBar';
import api from '../../services/api';
import AlertError from '../../pages/alerts/AlertError';
import { showAlertErrorOpen } from '../../redux/features/context/contextSlice';
import { selectAllProdutos } from '../../redux/features/compras/comprasSlice';
import { formatPrice } from '../../services/formatPrice';

export default function Almoxarifado() {
  const [idproduto, setIdProduto] = useState();
  const [descricao, setDescricao] = useState('');
  const [unidade, setUnidade] = useState('');
  const [valor, setValor] = useState();
  const [quantidade, setQuantidade] = useState();
  const [showEdit, setShowEdit] = useState(false);
  const { produtos } = useSelector(state => state.compras);
  const { showAlertError } = useSelector(state => state.contexto);
  const dispatch = useDispatch();

  const handleCloseEdit = () => setShowEdit(false);

  async function handleEdit(e) {
    e.preventDefault();
    const editProduto = {
      valorunitario: valor,
      qtdestoque: quantidade,
    };

    await api
      .put(`produtos/${idproduto}`, editProduto)
      .then(() => {
        toast.success('Produto atualizado!');
        dispatch(selectAllProdutos());
      })
      .catch(error => {
        dispatch(
          showAlertErrorOpen({
            showAlertError: true,
            alertError: `${error.response.data.error}`,
          })
        );
      });
  }

  function handleShowEdit(prod, e) {
    e.preventDefault();
    setIdProduto(prod.idproduto);
    setDescricao(prod.produto);
    setUnidade(prod.unidade);
    setValor(prod.valor);
    setQuantidade(prod.quantidade);

    setShowEdit(true);
  }

  return (
    <Container>
      <NavBar />
      <br />
      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Descrição</th>
            <th>Unidade</th>
            <th>Valor</th>
            <th>Quantidade</th>
            <th>Menu</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map(produto => (
            <tr key={produto.idproduto}>
              <td>{produto.idproduto}</td>
              <td>{produto.produto}</td>
              <td>{produto.unidade}</td>
              <td>{formatPrice(Number(produto.valor))}</td>
              <td>{produto.quantidade}</td>
              <td>
                <Button
                  className="primary"
                  onClick={e => handleShowEdit(produto, e)}
                >
                  Editar
                </Button>{' '}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showEdit} onHide={handleCloseEdit} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar</Modal.Title>
        </Modal.Header>
        {showAlertError ? <AlertError /> : null}

        <Modal.Body>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              ID Produto
            </Form.Label>
            <Col sm="10">
              <Form.Control value={idproduto} readOnly />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Descrição
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={descricao} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Unidade
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={unidade} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Valor
            </Form.Label>
            <Col sm="10">
              <Form.Control
                value={valor}
                onChange={e => setValor(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Quantidade
            </Form.Label>
            <Col sm="10">
              <Form.Control
                value={quantidade}
                type="number"
                onChange={e => setQuantidade(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Button type="submit" variant="primary" onClick={handleEdit}>
            Atualizar
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
