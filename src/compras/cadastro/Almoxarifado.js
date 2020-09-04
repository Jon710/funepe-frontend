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
import { showAlertErrorOpen } from '../../redux/features/context/contextSlice';

export default function Almoxarifado() {
  const [idproduto, setIdProduto] = useState();
  const [descricao, setDescricao] = useState('');
  const [inativar, setInativar] = useState();
  const [idcategoria, setIdCategoria] = useState();
  const [tipo, setTipo] = useState('');
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const { produtos } = useSelector(state => state.compras);
  const dispatch = useDispatch();

  async function handleShowDetalhes(prod, e) {
    e.preventDefault();
    setIdProduto(prod.idproduto);
    setDescricao(prod.descricao);
    setInativar(prod.inativar);
    setIdCategoria(prod.idcategoria);

    setShowDetalhes(true);
  }

  function handleCloseDetalhes() {
    setShowDetalhes(false);
  }

  async function handleEdit(e) {
    e.preventDefault();
    const editServico = {
      idproduto,
      descricao,
      inativar,
      idcategoria,
    };

    await api
      .put(`produto/${idproduto}`, editServico)
      .then(() => {
        toast.success('Serviço atualizado com sucesso!');
      })
      .catch(error => {
        dispatch(
          showAlertErrorOpen({
            showAlertError: true,
            alertError: `${error.response.data.error} Problema com a ${descricao}`,
          })
        );
      });
  }

  function handleCloseEdit() {
    setShowEdit(false);
  }

  console.log(produtos);

  return (
    <Container>
      <NavBar />
      <br />

      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Descrição</th>
            <th>Menu</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map(produto => (
            <tr key={produto.idproduto}>
              <td>{produto.idproduto}</td>
              <td>{produto.produto}</td>
              <td>
                <Button
                  className="btn-success"
                  onClick={e => handleShowDetalhes(produto, e)}
                >
                  Detalhes
                </Button>{' '}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                type="input"
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
              />
              <br />
              <Form.Control
                type="input"
                value={inativar}
                onChange={e => setInativar(e.target.value)}
              />
              <br />
              <Form.Control
                type="input"
                value={tipo}
                onChange={e => setTipo(e.target.value)}
              />
            </Form.Group>
          </Form>
          <Button type="submit" variant="primary" onClick={handleEdit}>
            Atualizar
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={showDetalhes} onHide={handleCloseDetalhes} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalhes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              ID
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={idproduto} />
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
        </Modal.Body>
      </Modal>
    </Container>
  );
}
