import React, { useState } from 'react';
import { Table, Container, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import AlertError from '../../pages/alerts/AlertError';
import NavBar from '../requisicao/NavBar';

import api from '../../services/api';
import { selectAllTipoEmpresas } from '../../redux/features/compras/comprasSlice';
import { showAlertErrorOpen } from '../../redux/features/context/contextSlice';

export default function TipoEmpresa() {
  const [descricao, setDescricao] = useState('');
  const [idtipoempresa, setIdTipoEmpresa] = useState();
  const { tipoEmpresas } = useSelector(state => state.compras);
  const { showAlertError } = useSelector(state => state.contexto);
  const [show, setShow] = useState(false);
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();

  async function handleCadastrarEmpresa(e) {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      e.preventDefault();

      const novoTipoEmpresa = {
        descricao,
      };

      await api
        .post('tipoempresa', novoTipoEmpresa)
        .then(() => {
          toast.success('Tipo de Empresa cadastrado com sucesso!');
          dispatch(selectAllTipoEmpresas());

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

  async function handleShowDetalhes(tipoemp, e) {
    e.preventDefault();
    setDescricao(tipoemp.descricao);
    setIdTipoEmpresa(tipoemp.idtipoempresa);
    setShowDetalhes(true);
  }

  function handleCloseDetalhes() {
    setShowDetalhes(false);
  }

  async function handleDelete(e) {
    e.preventDefault();

    await api
      .delete(`tipoempresa/${idtipoempresa}`)
      .then(() => {
        toast.success('Tipo de Empresa deletado!');
        dispatch(selectAllTipoEmpresas());
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

  function handleShowDelete(tipoemp, e) {
    e.preventDefault();
    setDescricao(tipoemp.descricao);
    setIdTipoEmpresa(tipoemp.idtipoempresa);
    setShowDelete(true);
  }

  function handleCloseDelete() {
    setShowDelete(false);
  }

  async function handleEdit(e) {
    e.preventDefault();
    const editTipo = {
      idtipoempresa,
      descricao,
    };

    await api
      .put(`tipoempresa/${idtipoempresa}`, editTipo)
      .then(() => {
        toast.success('Tipo de Empresa atualizado com sucesso!');
        dispatch(selectAllTipoEmpresas());
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

  function handleShowEdit(tipoemp) {
    setShowEdit(true);
    setDescricao(tipoemp.descricao);
    setIdTipoEmpresa(tipoemp.idtipoempresa);
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
          Cadastrar Tipo de Empresa
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
          {tipoEmpresas.map(tipoemp => (
            <tr key={tipoemp.idtipoempresa}>
              <td>{tipoemp.descricao}</td>
              <td>
                <Button
                  className="btn-success"
                  onClick={e => handleShowDetalhes(tipoemp, e)}
                >
                  Detalhes
                </Button>{' '}
                <Button
                  className="btn-primary"
                  onClick={e => handleShowEdit(tipoemp, e)}
                >
                  Editar
                </Button>{' '}
                <Button
                  className="btn-danger"
                  onClick={e => handleShowDelete(tipoemp, e)}
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
            Tem certeza que deseja deletar este tipo de empresa?
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
          <Modal.Title>Editar tipo de empresa</Modal.Title>
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
                <td>{idtipoempresa}</td>
                <td>{descricao}</td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <Modal show={show} onHide={handleCloseCadastrar}>
        <Modal.Header closeButton>
          <Modal.Title>Novo Tipo de Empresa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleCadastrarEmpresa}
          >
            <Form.Group controlId="validationTipoEmp">
              <Form.Control
                type="text"
                placeholder="Digite o tipo de empresa"
                onChange={e => setDescricao(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Favor preencher todos os campos.
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
