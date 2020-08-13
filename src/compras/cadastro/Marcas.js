import React, { useState } from 'react';
import { Table, Container, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import AlertError from '../../pages/alerts/AlertError';
import NavBar from '../requisicao/NavBar';

import api from '../../services/api';
import { selectAllMarcas } from '../../redux/features/compras/comprasSlice';
import { showAlertErrorOpen } from '../../redux/features/context/contextSlice';

export default function Marcas() {
  const [descricaoMarca, setDescricaoMarca] = useState('');
  const [idmarca, setIdMarca] = useState();
  const { marcas } = useSelector(state => state.compras);
  const { showAlertError } = useSelector(state => state.contexto);
  const [show, setShow] = useState(false);
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();

  async function handleCadastrarMarca(e) {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      e.preventDefault();

      const novaMarca = {
        descricao: descricaoMarca,
      };

      await api
        .post('marca', novaMarca)
        .then(() => {
          toast.success('Marca cadastrada com sucesso!');
          dispatch(selectAllMarcas());

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

  async function handleShowDetalhes(marca, e) {
    e.preventDefault();
    setDescricaoMarca(marca.descricao);
    setIdMarca(marca.idmarca);
    setShowDetalhes(true);
  }

  function handleCloseDetalhes() {
    setShowDetalhes(false);
  }

  async function handleEdit(e) {
    e.preventDefault();
    const editMarca = {
      idmarca,
      descricao: descricaoMarca,
    };

    await api
      .put(`marca/${idmarca}`, editMarca)
      .then(() => {
        toast.success('Marca atualizada com sucesso!');
        dispatch(selectAllMarcas());
      })
      .catch(error => {
        dispatch(
          showAlertErrorOpen({
            showAlertError: true,
            alertError: `${error.response.data.error} Algo com a ${descricaoMarca}`,
          })
        );
      });
  }

  function handleShowEdit(marca) {
    setShowEdit(true);
    setDescricaoMarca(marca.descricao);
    setIdMarca(marca.idmarca);
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
          Cadastrar Marca
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
          {marcas.map(marca => (
            <tr key={marca.idmarca}>
              <td>{marca.descricao}</td>
              <td>
                <Button
                  className="btn-success"
                  onClick={e => handleShowDetalhes(marca, e)}
                >
                  Detalhes
                </Button>{' '}
                <Button
                  className="btn-primary"
                  onClick={e => handleShowEdit(marca, e)}
                >
                  Editar
                </Button>{' '}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar marca</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                type="input"
                value={descricaoMarca}
                onChange={e => setDescricaoMarca(e.target.value)}
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
                <td>{idmarca}</td>
                <td>{descricaoMarca}</td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <Modal show={show} onHide={handleCloseCadastrar}>
        <Modal.Header closeButton>
          <Modal.Title>Nova Marca</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleCadastrarMarca}
          >
            <Form.Group controlId="validationMara">
              <Form.Control
                type="text"
                placeholder="Digite o nome da marca"
                onChange={e => setDescricaoMarca(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Favor digitar a marca.
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
