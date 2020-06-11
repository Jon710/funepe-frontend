/* eslint-disable no-return-assign */
/* eslint-disable func-names */
/* eslint-disable no-console */
import React, { useState } from 'react';
import { Modal, Button, Form, Container, Card, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addDays, parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { anotacaoModalClose } from '../../redux/features/context/contextSlice';
import { selecionarAnotacao } from '../../redux/features/protocolo/protocoloSlice';

export default function Anotacao() {
  const dispatch = useDispatch();
  const { anotacaoModal } = useSelector(state => state.contexto);
  const { documento } = useSelector(state => state.protocolo);
  const [count, setCount] = useState(0);
  const [anotacoes, setAnotacoes] = useState([]);

  React.useEffect(() => {
    let c = 0;
    async function loadAnotacoes() {
      if (documento.iddocumento !== 0) {
        dispatch(selecionarAnotacao(documento.iddocumento)).then(response => {
          const { despachos } = response;
          if (despachos.length >= 0) {
            const listAnotacao = despachos.map(anotacao => ({
              ...anotacao,
              dataFormatada: format(
                addDays(parseISO(anotacao.datahora), 1),
                'dd/MM/yyyy',
                { locale: pt }
              ),
              counter: (c += 1),
            }));
            setAnotacoes(listAnotacao);
            setCount(c);
          }
        });
      } else {
        console.log('Documento não identificado!');
      }
    }
    loadAnotacoes();
  }, [dispatch, documento.iddocumento]);

  const handleClose = () => dispatch(anotacaoModalClose());

  return (
    <Container>
      <Form>
        <Modal
          variant="danger"
          dialogClassName="modal-danger"
          size="lg"
          animation
          show={anotacaoModal}
          onHide={handleClose}
        >
          <Modal.Body>
            <Card bg="success" text="light" key={1}>
              <Card.Body>
                <Card.Title>Anotações</Card.Title>
                <Container>
                  <Table striped bordered hover size="sm" variant="primary">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Data</th>
                        <th>Usuario</th>
                        <th>Anotacão</th>
                        <th>#</th>
                      </tr>
                    </thead>
                    <tbody>
                      {anotacoes.map(a => (
                        <tr key={a.counter}>
                          <td>{a.counter}</td>
                          <td>{a.dataFormatada}</td>
                          <td>{a.usuario.username}</td>
                          <td>{a.descricao}</td>
                          <th />
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td style={{ textAlign: 'right' }} colSpan="4">
                          TOTAL DE ANOTAÇÕES
                        </td>
                        <td style={{ textAlign: 'left' }} colSpan="1">
                          {count}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </Container>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
    </Container>
  );
}
