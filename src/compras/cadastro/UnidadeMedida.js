import React, { useState } from 'react';
import { Table, Container, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import AlertError from '../../pages/alerts/AlertError';

import NavBar from '../requisicao/NavBar';
import api from '../../services/api';
import { selectAllUnidadeMedidas } from '../../redux/features/compras/comprasSlice';
import { showAlertErrorOpen } from '../../redux/features/context/contextSlice';

export default function UnidadeMedida() {
  const [descricaoUnidade, setDescricaoUnidade] = useState('');
  const [idunidade, setIdUnidade] = useState();
  const { unidadeMedidas } = useSelector(state => state.compras);
  const { showAlertError } = useSelector(state => state.contexto);
  const [show, setShow] = useState(false);
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();

  async function handleCadastrarUnidade(e) {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      e.preventDefault();

      const novaUnidade = {
        descricao: descricaoUnidade,
      };

      await api
        .post('unidademedida', novaUnidade)
        .then(() => {
          toast.success('Unidade de Medida cadastrada com sucesso!');
          dispatch(selectAllUnidadeMedidas());

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
      .delete(`unidademedida/${idunidade}`)
      .then(() => {
        toast.success('Categoria deletada!');
        dispatch(selectAllUnidadeMedidas());
        setShowDelete(false);
      })
      .catch(error => {
        dispatch(
          showAlertErrorOpen({
            showAlertError: true,
            alertError: `${error.response.data.error} ID ${idunidade} está relacionado com outro Produto.`,
          })
        );
      });
  }

  function handleShowDelete(unidade, e) {
    e.preventDefault();
    setDescricaoUnidade(unidade.descricaoUnidade);
    setIdUnidade(unidade.idunidade);
    setShowDelete(true);
  }

  function handleCloseDelete() {
    setShowDelete(false);
  }

  async function handleShowDetalhes(unidade, e) {
    e.preventDefault();
    setDescricaoUnidade(unidade);
    setShowDetalhes(true);
  }

  function handleCloseDetalhes() {
    setShowDetalhes(false);
  }

  async function handleEdit(e) {
    e.preventDefault();
    const editUnidade = {
      idunidade,
      descricao: descricaoUnidade,
    };

    await api
      .put(`unidademedida/${idunidade}`, editUnidade)
      .then(() => {
        toast.success('Categoria atualizada com sucesso!');
        dispatch(selectAllUnidadeMedidas());
      })
      .catch(error => {
        dispatch(
          showAlertErrorOpen({
            showAlertError: true,
            alertError: `${error.response.data.error} Algo com a ${descricaoUnidade}`,
          })
        );
      });
  }

  function handleShowEdit(unidade) {
    setShowEdit(true);
    setDescricaoUnidade(unidade.descricao);
    setIdUnidade(unidade.idunidade);
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
          Cadastrar Unidade de Medida
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
          {unidadeMedidas.map(unidade => (
            <tr key={unidade.idunidade}>
              <td>{unidade.descricao}</td>
              <td>
                <Button
                  className="btn-success"
                  onClick={e => handleShowDetalhes(unidade, e)}
                >
                  Detalhes
                </Button>{' '}
                <Button
                  className="btn-primary"
                  onClick={e => handleShowEdit(unidade, e)}
                >
                  Editar
                </Button>{' '}
                <Button
                  className="btn-danger"
                  onClick={e => handleShowDelete(unidade, e)}
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
            Tem certeza que deseja deletar esta unidade de medida?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control type="input" defaultValue={descricaoUnidade} />
            </Form.Group>
          </Form>
          <Button type="submit" variant="danger" onClick={handleDelete}>
            Confirmar
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar unidade de medida</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                type="input"
                value={descricaoUnidade}
                onChange={e => setDescricaoUnidade(e.target.value)}
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
                <td>{idunidade}</td>
                <td>{descricaoUnidade}</td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <Modal show={show} onHide={handleCloseCadastrar}>
        <Modal.Header closeButton>
          <Modal.Title>Nova Unidade de Medida</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleCadastrarUnidade}
          >
            <Form.Group controlId="validationUnidade">
              <Form.Control
                value={descricaoUnidade}
                type="text"
                placeholder="Digite o nome da unidade de medida."
                onChange={e => setDescricaoUnidade(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Favor digitar a unidade de medida..
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
