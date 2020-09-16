/* eslint-disable no-return-assign */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Form,
  Container,
  Card,
  Table,
  Spinner,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import formatarHora from '../../services/formatarHora';
import { modalClose } from '../../redux/features/context/contextSlice';
import { selecionarHistorico } from '../../redux/features/compras/comprasSlice';

export default function Historico() {
  const dispatch = useDispatch();
  const { visualizaHistoricoModal } = useSelector(state => state.contexto);
  const { requisicao } = useSelector(state => state.compras);
  const [count, setCount] = useState(0);
  const [historicos, setHistoricos] = useState([]);
  const [loadingHistorico, setLoadingHistorico] = useState(true);

  useEffect(() => {
    let c = 0;
    async function loadRequisicoes() {
      if (requisicao.idrequisicao !== 0) {
        dispatch(selecionarHistorico(requisicao.idrequisicao)).then(
          response => {
            const { historicosrequisicao } = response;
            if (historicosrequisicao.length >= 0) {
              const listHistoricos = historicosrequisicao.map(historico => ({
                ...historico,
                dataFormatada: format(
                  parseISO(historico.datahistorico),
                  'dd/MM/yyyy',
                  { locale: pt }
                ),
                hora: formatarHora(historico.hora),
                counter: (c += 1),
              }));
              setHistoricos(listHistoricos);
              setCount(c);
              setLoadingHistorico(false);
            }
          }
        );
      } else {
        throw Error('Erro ao carregar histórico!');
      }
    }
    loadRequisicoes();
  }, [dispatch, requisicao.idrequisicao]);

  const handleClose = () => dispatch(modalClose());

  const SpinnerLineHistorico = () => (
    <>
      <Spinner animation="grow" variant="primary" />
      <Spinner animation="grow" variant="primary" />
      <Spinner animation="grow" variant="primary" />
      <Spinner animation="grow" variant="primary" />
      <Spinner animation="grow" variant="primary" />
    </>
  );

  return (
    <Container>
      <Form>
        <Modal
          variant="danger"
          dialogClassName="modal-danger"
          size="lg"
          animation
          show={visualizaHistoricoModal}
          onHide={handleClose}
        >
          <Modal.Body>
            <Card bg="success" text="light" key={1}>
              <Card.Body>
                <Card.Title>Requisições</Card.Title>
                <Container>
                  {loadingHistorico ? (
                    <>
                      <SpinnerLineHistorico />
                    </>
                  ) : (
                    <>
                      <Table striped bordered hover size="sm" variant="primary">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Despachante</th>
                            <th>Destinatário</th>
                            <th>Status</th>
                            <th>Observação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historicos.map(hist => (
                            <tr key={hist.counter} style={{ fontSize: 13 }}>
                              <td>{hist.counter}</td>
                              <td>{hist.dataFormatada}</td>
                              <td>{hist.hora}</td>
                              <td>{hist.despachante.username}</td>
                              <td>{hist.destinatario.username}</td>
                              <td>{hist.requisicao.status}</td>
                              <td>{hist.observacao}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td style={{ textAlign: 'right' }} colSpan="5">
                              TOTAL DE HISTÓRICOS
                            </td>
                            <td style={{ textAlign: 'left' }} colSpan="1">
                              {count}
                            </td>
                          </tr>
                        </tfoot>
                      </Table>
                    </>
                  )}
                </Container>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
    </Container>
  );
}
