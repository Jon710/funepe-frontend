/* eslint-disable no-return-assign */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Form,
  Col,
  Button,
  Card,
  Accordion,
  // Modal,
  // ProgressBar,
} from 'react-bootstrap';
// import { useDropzone } from 'react-dropzone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format } from 'date-fns';
// import pt from 'date-fns/locale/pt';

import { getFirstRender } from '../../redux/features/compras/comprasSlice';
import NavBar from './NavBar';
import ItemRequisicao from './ItemRequisicao';
import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../styles/css/resume.min.css';

export default function Requisicao() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  // const { requisicoes } = useSelector(state => state.compras);
  // const { showModal } = useSelector(state => state.contexto);
  // console.log(`Entrando no DocumentoAdd`, documento);

  const [idtipodocumento, setIdTipoDoc] = useState(1);
  const [idprioridade, setIdPrio] = useState(1);
  const [idexpedidor, setIdExped] = useState(user.idusuario);
  const [nrprotocolo, setNrProtocolo] = useState(1234);
  const [nrdocumento, setNrDocumento] = useState(1234);
  const [assunto, setAssunto] = useState('Oficio Alerta COVID');
  const [dataexpedicao, setDtExped] = useState(new Date());
  const [prazo, setPrazo] = useState('10');
  const [referencia, setReferencia] = useState('SN');
  const [observacao, setObservacao] = useState('Teste envio arquivo');
  const [origem, setOrigem] = useState('1');
  const [sigilo, setSigilo] = useState('1');
  const [status, setStatus] = useState('1');

  const [requisicoes, setRequisicoes] = useState([]);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let c = 0;
    function loadRequisicoes() {
      setLoading(true);
      if (user.idusuario !== 0) {
        dispatch(getFirstRender(user)).then(response => {
          if (response.length > 0) {
            const reqs = response.map(requisicao => ({
              ...requisicao,
              dataFormatada: format(parseISO(requisicao.datareq), 'dd/MM/yyyy'),
              nomeSolicitante: user.username.toUpperCase(),
              counter: (c += 1),
            }));
            setRequisicoes(reqs);
            setCount(c);
            setLoading(false);
          }
        });
      }
      console.log('REQ: ', requisicoes);
    }
    loadRequisicoes();
  }, [count]);

  function handleDtRequisicao(dtDocumento) {
    setDtExped(dtDocumento);
  }

  function handleNova() {}

  function handleSalvar() {}

  function handleFechar() {}

  return (
    <Container>
      <NavBar />
      <Card>
        <Card.Header>REQUISIÇÃO DE COMPRAS</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated}>
            <Form.Row>
              <Form.Group as={Col} controlId="editPrazo">
                <Form.Label>Nº Requisição</Form.Label>
                <Form.Control
                  value={prazo}
                  onChange={e => setPrazo(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="editNrDoc">
                <Form.Label>Data</Form.Label>
                <div>
                  <DatePicker
                    selected={dataexpedicao}
                    onChange={handleDtRequisicao}
                    className="form-control"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="editNrProtocolo">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  value={nrprotocolo}
                  onChange={e => setNrProtocolo(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="editNrProtocolo">
                <Form.Label>Prioridade</Form.Label>
                <Form.Control
                  value={nrprotocolo}
                  onChange={e => setNrProtocolo(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="editNrProtocolo">
                <Form.Label>Indicação de Uso</Form.Label>
                <Form.Control
                  value={nrprotocolo}
                  onChange={e => setNrProtocolo(e.target.value)}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="editRfr">
                <Form.Label>Departamento</Form.Label>
                <Form.Control
                  type="text"
                  value={referencia}
                  onChange={e => setReferencia(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="editRfr">
                <Form.Label>Solicitante</Form.Label>
                <Form.Control
                  type="text"
                  value={referencia}
                  onChange={e => setReferencia(e.target.value)}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="editAssunto">
                <Form.Label>Finalidade/Justificativa</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  value={assunto}
                  onChange={e => setAssunto(e.target.value)}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="editAssunto">
                <Form.Label>Observação</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  value={assunto}
                  onChange={e => setAssunto(e.target.value)}
                />
              </Form.Group>
            </Form.Row>
            <hr />
            <Accordion defaultActiveKey="0">
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                  Produtos/Serviços
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <ItemRequisicao />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              {/* <Card>
                <Accordion.Toggle as={Card.Header} eventKey="1">
                  Serviços
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>Hello! I'm another body</Card.Body>
                </Accordion.Collapse>
              </Card> */}
            </Accordion>
            <hr />
            <Form.Row>
              <Form.Group as={Col} controlId="editAssunto">
                <Button
                  variant="primary"
                  size="lg"
                  block
                  p="2"
                  onClick={handleNova}
                >
                  Novo
                </Button>
              </Form.Group>
              <Form.Group as={Col} controlId="editAssunto">
                <Button
                  variant="primary"
                  size="lg"
                  block
                  p="2"
                  onClick={handleSalvar}
                >
                  Salvar
                </Button>
              </Form.Group>
              <Form.Group as={Col} controlId="editAssunto">
                <Button
                  variant="primary"
                  size="lg"
                  block
                  p="2"
                  onClick={handleFechar}
                >
                  Fechar
                </Button>
              </Form.Group>
            </Form.Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
