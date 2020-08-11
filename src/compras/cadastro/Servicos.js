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
// import AlertError from '../../pages/alerts/AlertError';
import NavBar from '../requisicao/NavBar';
import api from '../../services/api';
import { showAlertErrorOpen } from '../../redux/features/context/contextSlice';

export default function Servicos() {
  const [idproduto, setIdProduto] = useState();
  const [descricao, setDescricao] = useState('');
  const [inativar, setInativar] = useState();
  const [idcategoria, setIdCategoria] = useState();
  const [tipo, setTipo] = useState('');
  // const [show, setShow] = useState(false);
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  // const [validated, setValidated] = useState(false);

  const { produtos } = useSelector(state => state.compras);
  // const { showAlertError } = useSelector(state => state.contexto);
  const dispatch = useDispatch();

  // async function handleCadastrarServico(e) {
  //   const form = e.currentTarget;
  //   if (form.checkValidity() === false) {
  //     e.stopPropagation();
  //   } else {
  //     e.preventDefault();

  //     const novoServico = {
  //       idproduto: 1,
  //       descricao,
  //       inativar,
  //       idcategoria: 1,
  //     };

  //     await api
  //       .post('produto', novoServico)
  //       .then(() => {
  //         toast.success('Serviço cadastrado com sucesso!');

  //         setShow(false);
  //       })
  //       .catch(error => {
  //         console.log(error.response.data.error);
  //         //   dispatch(
  //         //     showAlertErrorOpen({
  //         //       showAlertError: true,
  //         //       alertError: `${error.response.data.error}`,
  //         //     })
  //         //   );
  //       });
  //   }

  //   setValidated(true);
  // }

  // function handleShowCadastrar() {
  //   setShow(true);
  // }

  // function handleCloseCadastrar() {
  //   setShow(false);
  // }

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

  // function handleShowEdit(prod) {
  //   setShowEdit(true);
  //   setIdProduto(prod.idproduto);
  //   setDescricao(prod.descricao);
  //   setInativar(prod.inativa);
  //   setIdCategoria(prod.idcategoria);
  // }

  function handleCloseEdit() {
    setShowEdit(false);
  }

  return (
    <Container>
      <NavBar />
      {/* <div>
        <Button className="btn-success" onClick={handleShowCadastrar}>
          Cadastrar Serviço
        </Button>
      </div> */}
      <br />
      {/* {showAlertError ? <AlertError /> : null} */}

      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Descrição</th>
            {/* <th>Inativa</th> */}
            <th>Menu</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map(produto => (
            <tr key={produto.idproduto}>
              <td>{produto.idproduto}</td>
              <td>{produto.descricao}</td>
              {/* <td>{produto.inativar}</td> */}
              <td>
                <Button
                  className="btn-success"
                  onClick={e => handleShowDetalhes(produto, e)}
                >
                  Detalhes
                </Button>{' '}
                {/* <Button
                  className="btn-primary"
                  onClick={e => handleShowEdit(produto, e)}
                >
                  Editar
                </Button>{' '} */}
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
          {/* <Form.Group as={Row}>
            <Form.Label column sm="2">
              Inativar
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={inativar} />
            </Col>
          </Form.Group> */}
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Descrição
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={descricao} />
            </Col>
          </Form.Group>
          {/* <Form.Group as={Row}>
            <Form.Label column sm="2">
              ID Categoria
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={idcategoria} />
            </Col>
          </Form.Group> */}
          {/* <Form.Group as={Row}>
            <Form.Label column sm="2">
              Tipo
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={tipo} />
            </Col>
          </Form.Group> */}
        </Modal.Body>
      </Modal>

      {/* <Modal show={show} onHide={handleCloseCadastrar}>
        <Modal.Header closeButton>
          <Modal.Title>Novo Serviço</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleCadastrarServico}
          >
            <Form.Group controlId="validationProd">
              <Form.Control
                type="text"
                placeholder="Descrição"
                onChange={e => setDescricao(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="Inativar"
                onChange={e => setInativar(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Favor preencher os campos.
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant="primary">
              Criar
            </Button>
          </Form>
        </Modal.Body>
      </Modal> */}
    </Container>
  );
}
