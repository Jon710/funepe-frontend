/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import {
  Table,
  Container,
  Button,
  Col,
  Form,
  Card,
  Modal,
} from 'react-bootstrap';
import {
  requisicaoModalOpen,
  requisicaoModalClose,
} from '../../redux/features/context/contextSlice';
import {
  getMyOwnReq,
  selectAllItemRequisicao,
} from '../../redux/features/compras/comprasSlice';
import RequisicaoItem from './RequisicaoItem';

import NavBar from './NavBar';

export default function MinhaReq() {
  const CaptionElement = () => (
    <h3
      style={{
        borderRadius: '0.25em',
        textAlign: 'center',
        color: 'blue',
        border: '2px solid blue',
        padding: '0.2em',
        marginTop: '10px',
      }}
    >
      Minhas Requisições
    </h3>
  );
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { minhasRequisicoes } = useSelector(state => state.compras);
  const { requisicaoModal } = useSelector(state => state.contexto);
  const [idrequisicao, setIdRequisicao] = useState();
  const [data, setData] = useState(new Date());
  const [status, setStatus] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [finalidade, setFinalidade] = useState('');
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    function loadRequisicoes() {
      if (user.idusuario !== 0) {
        dispatch(getMyOwnReq(user));
      }
    }
    loadRequisicoes();
  }, [dispatch, user]);

  async function handleVisualizarRequisicao(req) {
    const dataFormatada = format(parseISO(req.datareq), 'dd/MM/yyyy', {
      locale: pt,
    });

    setIdRequisicao(req.idrequisicao);
    setData(dataFormatada);
    setStatus(req.status);
    setDepartamento(req.departamento.descricao);
    setFinalidade(req.finalidade);
    setObservacao(req.observacao);

    dispatch(requisicaoModalOpen());
    dispatch(selectAllItemRequisicao(req.idrequisicao));
  }

  const handleClose = () => {
    dispatch(requisicaoModalClose());
  };

  return (
    <Container>
      <NavBar />
      <CaptionElement />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>NrReq</th>
            <th>Status</th>
            <th>Destinatário</th>
            <th>Finalidade</th>
            <th>Data</th>
            <th>Menu</th>
          </tr>
        </thead>
        <tbody>
          {minhasRequisicoes.map(req => (
            <tr key={req.idrequisicao}>
              <td>{req.idrequisicao}</td>
              <td>{req.status}</td>
              <td>{req.destinatario.username}</td>
              <td>{req.finalidade}</td>
              <td>{req.dataFormatada}</td>
              <td>
                <Button onClick={() => handleVisualizarRequisicao(req)}>
                  Visualizar requisição
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        variant="danger"
        dialogClassName="modal-danger"
        size="lg"
        animation
        show={requisicaoModal}
        onHide={handleClose}
      >
        <Modal.Body>
          <Card>
            <Card.Header>
              <Card.Title>REQUISIÇÃO NÚMERO {idrequisicao}</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Data</Form.Label>
                    <Form.Control readOnly value={data} />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Status</Form.Label>
                    <Form.Control readOnly value={status} />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Departamento</Form.Label>
                    <Form.Control readOnly value={departamento} />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Finalidade/Justificativa</Form.Label>
                    <Form.Control
                      readOnly
                      as="textarea"
                      rows="3"
                      value={finalidade}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Observação</Form.Label>
                    <Form.Control
                      readOnly
                      as="textarea"
                      rows="3"
                      value={observacao}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Produtos/Serviços</Form.Label>
                    <RequisicaoItem />
                  </Form.Group>
                </Form.Row>
                <hr />
                <Form.Row>
                  <Form.Group as={Col}>
                    <Button
                      variant="danger"
                      size="lg"
                      block
                      p="2"
                      onClick={handleClose}
                    >
                      Fechar
                    </Button>
                  </Form.Group>
                </Form.Row>
              </Form>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
