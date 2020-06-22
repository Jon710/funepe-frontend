import React, { useState } from 'react';
import { Table, Container, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import AlertError from '../../pages/alerts/AlertError';
import NavBar from '../requisicao/NavBar';

import api from '../../services/api';
import { selectAllTipoTelefones } from '../../redux/features/compras/comprasSlice';
import { showAlertErrorOpen } from '../../redux/features/context/contextSlice';

export default function TipoTelefone() {
  const [descricao, setDescricao] = useState('');
  const [idtipotelefone, setIdTipoTelefone] = useState();
  const { tipoTelefones } = useSelector(state => state.compras);
  const { showAlertError } = useSelector(state => state.contexto);
  const [show, setShow] = useState(false);
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();

  async function handleCadastrarTipoTel(e) {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      e.preventDefault();

      const novoTipo = {
        descricao,
      };

      await api
        .post('tipotelefone', novoTipo)
        .then(() => {
          toast.success('Tipo de telefone cadastrado com sucesso!');
          dispatch(selectAllTipoTelefones());

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

  async function handleShowDetalhes(tipotel, e) {
    e.preventDefault();
    setDescricao(tipotel.descricao);
    setIdTipoTelefone(tipotel.idtipotelefone);
    setShowDetalhes(true);
  }

  function handleCloseDetalhes() {
    setShowDetalhes(false);
  }

  async function handleDelete(e) {
    e.preventDefault();

    await api
      .delete(`tipotelefone/${idtipotelefone}`)
      .then(() => {
        toast.success('Tipo de Telefone deletado!');
        dispatch(selectAllTipoTelefones());
        setShowDelete(false);
      })
      .catch(error => {
        dispatch(
          showAlertErrorOpen({
            showAlertError: true,
            alertError: `${error.response.data.error} Algum erro com id.`,
          })
        );
      });
  }

  function handleShowDelete(tipotel, e) {
    e.preventDefault();
    setDescricao(tipotel.descricao);
    setIdTipoTelefone(tipotel.idtipotelefone);
    setShowDelete(true);
  }

  function handleCloseDelete() {
    setShowDelete(false);
  }

  async function handleEdit(e) {
    e.preventDefault();
    const editTipo = {
      idtipotelefone,
      descricao,
    };

    await api
      .put(`tipotelefone/${idtipotelefone}`, editTipo)
      .then(() => {
        toast.success('Tipo de telefone cadastrado com sucesso!');
        dispatch(selectAllTipoTelefones());
      })
      .catch(error => {
        dispatch(
          showAlertErrorOpen({
            showAlertError: true,
            alertError: `${error.response.data.error} Algo com a ${descricao}`,
          })
        );
      });
  }

  function handleShowEdit(tipotel) {
    setShowEdit(true);
    setDescricao(tipotel.descricao);
    setIdTipoTelefone(tipotel.idtipotelefone);
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
          Cadastrar Tipo de Telefone
        </Button>
      </div>
      <br />
      {showAlertError ? <AlertError /> : null}

      <Table striped bordered>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Menu</th>
          </tr>
        </thead>
        <tbody>
          {tipoTelefones.map(tipotel => (
            <tr key={tipotel.idtipotelefone}>
              <td>{tipotel.descricao}</td>
              <td>
                <Button
                  className="btn-success"
                  onClick={e => handleShowDetalhes(tipotel, e)}
                >
                  Detalhes
                </Button>{' '}
                <Button
                  className="btn-primary"
                  onClick={e => handleShowEdit(tipotel, e)}
                >
                  Editar
                </Button>{' '}
                <Button
                  className="btn-danger"
                  onClick={e => handleShowDelete(tipotel, e)}
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
            Tem certeza que deseja deletar este tipo de telefone?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control type="input" defaultValue={descricao} />
            </Form.Group>
          </Form>
          <Button type="submit" variant="danger" onClick={handleDelete}>
            Confirmar
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar tipo de telefone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                type="input"
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
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
                <th>Descrição</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{idtipotelefone}</td>
                <td>{descricao}</td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <Modal show={show} onHide={handleCloseCadastrar}>
        <Modal.Header closeButton>
          <Modal.Title>Novo Tipo de Telefone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleCadastrarTipoTel}
          >
            <Form.Group controlId="validationTipoTel">
              <Form.Control
                type="text"
                placeholder="Digite o tipo de telefone"
                onChange={e => setDescricao(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Favor digitar o tipo de telefone.
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
