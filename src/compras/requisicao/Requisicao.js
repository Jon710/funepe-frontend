/* eslint-disable no-return-assign */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Form,
  Col,
  Button,
  Card,
  Row,
  Modal,
} from 'react-bootstrap';
import Select from 'react-select';
import SweetAlert from 'react-bootstrap-sweetalert';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';

import { inserirRequisicao } from '../../redux/features/compras/comprasSlice';
import Produto from '../modal/Produto';
import RequisicaoItem from './RequisicaoItem';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  produtoModalOpen,
  requisicaoModalClose,
} from '../../redux/features/context/contextSlice';
import history from '../../services/history';

export default function Requisicao() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { produtoModal, requisicaoModal } = useSelector(
    state => state.contexto
  );
  const { departamentos, requisicao } = useSelector(state => state.compras);
  console.log('REQUISICAO-REQ: ', requisicao);
  const colourStyles = {
    option: provided => ({
      ...provided,
      borderBottom: '1px dotted pink',
      color: 'blue',
    }),
    placeholder: defaultStyles => {
      return {
        ...defaultStyles,
        color: 'black',
      };
    },
    multiValueLabel: styles => ({
      ...styles,
      color: 'black',
    }),
  };

  const [datareq, setDtReq] = useState(new Date());
  const [iddepartamento, setIdDpto] = useState(1);
  const [dptos, setDptos] = useState(1);
  const [idsolicitante] = useState(user.idusuario);
  const [solicitante] = useState(user.username);
  const [iddestinatario, setIdDestin] = useState(user.idusuario);
  const [finalidade, setFinalidade] = useState('');
  const [idrequisicao, setIdReq] = useState();
  const [indicacaouso, setIndicacaoUso] = useState('Uso Contínuo');
  const [justificativa, setJustificativa] = useState('');
  const [observacao, setObservacao] = useState('');
  const [orcamentos, setOrcam] = useState(1);
  const [prioridade, setPrio] = useState(1);
  const [status, setStatus] = useState(0);
  const [validated, setValidated] = useState(false);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    const arrayDpto = [];
    async function loadDptos() {
      if (departamentos.length > 0) {
        departamentos.forEach(dpto => {
          arrayDpto.push({
            value: dpto.iddepartamento,
            label: dpto.descricao,
          });
        });
      }
      setDptos(arrayDpto);
    }
    loadDptos();
  }, [departamentos]);

  async function handleRequisicao() {
    setAlert(false);
    setIdDestin(user.idusuario);
    setJustificativa('');
    setOrcam('');
    const newRequisicao = {
      datareq,
      finalidade,
      iddepartamento,
      iddestinatario,
      idsolicitante,
      indicacaouso,
      justificativa,
      observacao,
      orcamentos,
      prioridade,
      status,
    };
    dispatch(inserirRequisicao(newRequisicao));
    toast.success('Requisição realizada! Agora, insira o produto.');
  }

  function handleDtRequisicao(dtReq) {
    setValidated(true);
    setDtReq(dtReq);
  }

  function onChangeDpto(selectedOption) {
    setIdDpto(selectedOption.value);
  }

  const handleClose = () => {
    dispatch(requisicaoModalClose());
    history.push('/requisicao');
  };

  const handleAlert = () => {
    setAlert(true);
  };

  return (
    <Container>
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
              <Card.Title>
                NOVA REQUISIÇÃO DE COMPRAS - Solicitante:{' '}
                {solicitante.toUpperCase()}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Form noValidate validated={validated}>
                <Form.Row>
                  <Form.Group as={Col} controlId="editPrazo">
                    <Form.Label>Nº Requisição</Form.Label>
                    <Form.Control
                      readOnly
                      value={idrequisicao}
                      onChange={e => setIdReq(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="editNrDoc">
                    <Form.Label>Data</Form.Label>
                    <div>
                      <DatePicker
                        selected={datareq}
                        onChange={handleDtRequisicao}
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                  </Form.Group>
                  <Form.Group as={Col} controlId="editNrProtocolo">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="editNrProtocolo">
                    <Form.Label>Prioridade</Form.Label>
                    <Form.Control
                      value={prioridade}
                      onChange={e => setPrio(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="editNrProtocolo">
                    <Form.Label>Indicação de Uso</Form.Label>
                    <Form.Control
                      value={indicacaouso}
                      onChange={e => setIndicacaoUso(e.target.value)}
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="editRfr">
                    <Form.Label>Departamento</Form.Label>
                    <Select
                      isSearchable
                      styles={colourStyles}
                      options={dptos}
                      onChange={selectedOption => onChangeDpto(selectedOption)}
                      placeholder="Selecione um Departamento"
                      theme={theme => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          neutral50: '#1A1A1A', // Placeholder color
                        },
                      })}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="editRfr">
                    <Form.Label>Solicitante</Form.Label>
                    <Form.Control
                      type="text"
                      value={solicitante}
                      onChange={e => setSolic(e.target.value)}
                      readOnly
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="editAssunto">
                    <Form.Label>Finalidade/Justificativa</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      value={finalidade}
                      onChange={e => setFinalidade(e.target.value)}
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="editAssunto">
                    <Form.Label>Observação</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      value={observacao}
                      onChange={e => setObservacao(e.target.value)}
                    />
                  </Form.Group>
                </Form.Row>
                <hr />
                <Form.Row>
                  {/* <Form.Group as={Col} controlId="editAssunto">
                    <Button
                      variant="primary"
                      size="lg"
                      block
                      p="2"
                      onClick={handleNova}
                    >
                      Novo
                    </Button>
                  </Form.Group> */}
                  <Form.Group as={Col} controlId="editAssunto">
                    <Button
                      variant="primary"
                      size="lg"
                      block
                      p="2"
                      onClick={handleRequisicao}
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
                      onClick={handleClose}
                    >
                      Fechar
                    </Button>
                  </Form.Group>
                </Form.Row>
                <hr />
                <Card className="text-center mb-2">
                  <Card.Header>
                    <Card.Title>Produtos/Serviços</Card.Title>
                    <Row>
                      <Col xs={12} md={8}>
                        {/* <Form.Control type="text" placeholder="Produto" /> */}
                      </Col>
                      <Col xs={6} md={4}>
                        <Button
                          block
                          variant="success"
                          onClick={() => {
                            console.log(typeof requisicao.idrequisicao);
                            if (
                              typeof requisicao.idrequisicao === 'undefined'
                            ) {
                              handleAlert();
                            } else {
                              dispatch(produtoModalOpen());
                            }
                          }}
                        >
                          Localizar
                        </Button>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body>
                    {produtoModal ? <Produto /> : <></>}
                    <RequisicaoItem />
                  </Card.Body>
                </Card>
                <hr />
                {/* <Produto /> */}
                {alert ? (
                  <>
                    <SweetAlert
                      custom
                      showCancel
                      showCloseButton
                      confirmBtnText="Sim"
                      cancelBtnText="Não"
                      confirmBtnBsStyle="primary"
                      cancelBtnBsStyle="warning"
                      customIcon="https://raw.githubusercontent.com/djorg83/react-bootstrap-sweetalert/master/demo/assets/thumbs-up.jpg"
                      title="Requisição Não Existe! Deseja Salvar uma Nova Requisição de Compras?"
                      onConfirm={handleRequisicao}
                      onCancel={handleClose}
                    >
                      {/* Uma Nova Requisição de Compras deve ser Salva antes de Inserir Produtos nas Lista! */}
                    </SweetAlert>
                  </>
                ) : (
                  ''
                )}
              </Form>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
