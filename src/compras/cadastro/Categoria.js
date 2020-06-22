import React, { useState } from 'react';
import { Table, Container, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import AlertError from '../../pages/alerts/AlertError';

import NavBar from '../requisicao/NavBar';
import api from '../../services/api';
import { selectAllCategorias } from '../../redux/features/compras/comprasSlice';
import { showAlertErrorOpen } from '../../redux/features/context/contextSlice';

export default function Categoria() {
  const [categoria, setCategoria] = useState('');
  const [idcategoria, setIdCategoria] = useState();
  const { categorias } = useSelector(state => state.compras);
  const { showAlertError } = useSelector(state => state.contexto);
  const [show, setShow] = useState(false);
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();

  async function handleCadastrarCategoria(e) {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      e.preventDefault();

      const novaCategoria = {
        categoria,
      };

      await api
        .post('categoria', novaCategoria)
        .then(() => {
          toast.success('Categoria cadastrado com sucesso!');
          dispatch(selectAllCategorias());

          setShow(false);
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

    setValidated(true);
  }

  function handleShowCadastrar() {
    setShow(true);
  }

  function handleCloseCadastrar() {
    setShow(false);
  }

  async function handleDelete(e) {
    e.preventDefault();

    await api
      .delete(`categoria/${idcategoria}`)
      .then(() => {
        toast.success('Categoria deletada!');
        dispatch(selectAllCategorias());
        setShowDelete(false);
      })
      .catch(error => {
        dispatch(
          showAlertErrorOpen({
            showAlertError: true,
            alertError: `${error.response.data.error} ID ${idcategoria} está relacionado com outro Produto.`,
          })
        );
      });
  }

  function handleShowDelete(cat, e) {
    e.preventDefault();
    setCategoria(cat.categoria);
    setIdCategoria(cat.idcategoria);
    setShowDelete(true);
  }

  function handleCloseDelete() {
    setShowDelete(false);
  }

  async function handleShowDetalhes(cat, e) {
    e.preventDefault();
    setCategoria(cat);
    setShowDetalhes(true);
  }

  function handleCloseDetalhes() {
    setShowDetalhes(false);
  }

  async function handleEdit(e) {
    e.preventDefault();
    const editCategoria = {
      idcategoria,
      categoria,
    };

    await api
      .put(`categoria/${idcategoria}`, editCategoria)
      .then(() => {
        toast.success('Categoria atualizada com sucesso!');
        dispatch(selectAllCategorias());
      })
      .catch(error => {
        dispatch(
          showAlertErrorOpen({
            showAlertError: true,
            alertError: `${error.response.data.error} ID ${categoria} está relacionado com outro Produto.`,
          })
        );
      });
  }

  function handleShowEdit(cat) {
    setShowEdit(true);
    setCategoria(cat.categoria);
    setIdCategoria(cat.idcategoria);
  }

  function handleCloseEdit() {
    setShowEdit(false);
  }

  return (
    <Container>
      <NavBar />
      <br />
      <div>
        <Button className="btn-success" onClick={handleShowCadastrar}>
          Cadastrar Categoria
        </Button>
      </div>
      <br />
      {showAlertError ? <AlertError /> : null}
      <Table striped bordered>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Menu</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(c => (
            <tr key={c.idcategoria}>
              <td>{c.categoria}</td>
              <td>
                <Button
                  className="btn-success"
                  onClick={e => handleShowDetalhes(c, e)}
                >
                  Detalhes
                </Button>{' '}
                <Button
                  className="btn-primary"
                  onClick={e => handleShowEdit(c, e)}
                >
                  Editar
                </Button>{' '}
                <Button
                  className="btn-danger"
                  onClick={e => handleShowDelete(c, e)}
                >
                  Deletar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showDelete} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            Tem certeza que deseja deletar esta categoria?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control type="input" defaultValue={categoria} />
            </Form.Group>
          </Form>
          <Button type="submit" variant="danger" onClick={handleDelete}>
            Confirmar
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar categoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                type="input"
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
              />
            </Form.Group>
          </Form>
          <Button type="submit" variant="primary" onClick={handleEdit}>
            Atualizar
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={showDetalhes} onHide={handleCloseDetalhes}>
        <Modal.Header closeButton>
          <Modal.Title>Detalhes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{categoria.idcategoria}</td>
                <td>{categoria.categoria}</td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <Modal show={show} onHide={handleCloseCadastrar}>
        <Modal.Header closeButton>
          <Modal.Title>Nova Categoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleCadastrarCategoria}
          >
            <Form.Group controlId="validationCategoria">
              <Form.Control
                value={categoria}
                type="text"
                placeholder="Digite o nome da categoria"
                onChange={e => setCategoria(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Favor digitar a categoria.
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant="primary">
              Criar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
