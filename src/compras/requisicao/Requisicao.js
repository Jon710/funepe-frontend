/* eslint-disable no-plusplus */
/* eslint-disable no-return-assign */
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Form,
  Col,
  Button,
  Card,
  Modal,
  Accordion,
} from 'react-bootstrap';
import Select from 'react-select';
import SweetAlert from 'react-bootstrap-sweetalert';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import {
  inserirRequisicao,
  atualizarRequisicao,
  addRequisicaoRequest,
} from '../../redux/features/compras/comprasSlice';
import Produto from '../modal/Produto';
import RequisicaoItem from './RequisicaoItem';
import 'bootstrap/dist/css/bootstrap.min.css';
import { requisicaoModalClose } from '../../redux/features/context/contextSlice';
import history from '../../services/history';
import api from '../../services/api';

export default function Requisicao() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { requisicaoModal, editRequisicaoModal } = useSelector(
    state => state.contexto
  );
  const { departamentos, requisicao } = useSelector(state => state.compras);
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
  const [iddepartamento, setIdDpto] = useState(0);
  const [dptos, setDptos] = useState(1);
  const [editDepartamento, setEditDepartamento] = useState('');
  const [idsolicitante] = useState(user.idusuario);
  const [solicitante] = useState(user.username);
  const [iddestinatario, setIdDestin] = useState(user.idusuario);
  const [finalidade, setFinalidade] = useState('');
  const [idrequisicao, setIdReq] = useState();
  const [indicacaouso] = useState('Uso Contínuo');
  const [justificativa, setJustificativa] = useState('');
  const [observacao, setObservacao] = useState('');
  const [orcamentos, setOrcam] = useState(1);
  const [disableSalvar, setDisableSalvar] = useState(false);
  const [enableAtualizar, setEnableAtualizar] = useState(true);
  const [prioridade] = useState(1);
  const [status, setStatus] = useState('Aberto');
  const [validated, setValidated] = useState(false);
  const [alert, setAlert] = useState(false);
  const [arquivos, setArquivos] = useState([]);
  const [eventKey, setEventKey] = useState('0');
  const formData = new FormData();

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

    async function loadRequisicao() {
      setFinalidade(requisicao.finalidade);
      setObservacao(requisicao.observacao);
      setEditDepartamento('');
      setIdDpto(requisicao.iddepartamento);
    }

    loadRequisicao();
    loadDptos();
  }, [departamentos, requisicao]);

  async function handleRequisicao() {
    setAlert(false);
    setIdDestin(user.idusuario);
    setJustificativa('');
    setOrcam('');
    setEventKey('0');
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

    if (iddepartamento === 0 || finalidade === undefined) {
      toast.error('Preencha todos os campos!');
    } else {
      dispatch(inserirRequisicao(newRequisicao)).then(response => {
        setIdReq(response.requisicao.idrequisicao);
      });

      toast.success('Requisição realizada! Agora, insira o produto.');
      setDisableSalvar(true);
      setEnableAtualizar(false);
    }
  }

  async function updateRequisicao() {
    try {
      const newRequisicao = {
        idrequisicao: requisicao.idrequisicao,
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

      dispatch(atualizarRequisicao(newRequisicao)).then(() => {
        try {
          if (arquivos.length > 0) {
            for (let i = 0; i < arquivos.length; i++) {
              formData.append('arquivos', arquivos[i]);
            }

            api.post(
              `requisicao/${requisicao.idrequisicao}/arquivoanexo`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
            );
          } else {
            return;
          }
        } catch (error) {
          toast.error(`ERRO Upload Requisição ${error.message}`);
        }
      });

      toast.success('Requisição atualizada!');
    } catch (error) {
      console.error('ERRO: ', error);
    }
  }

  function handleDtRequisicao(dtReq) {
    setValidated(true);
    setDtReq(dtReq);
  }

  function onChangeDpto(selectedOption) {
    setIdDpto(selectedOption.value);
    setEditDepartamento(selectedOption.label);
  }

  const handleClose = () => {
    dispatch(addRequisicaoRequest());
    dispatch(requisicaoModalClose());

    setAlert(false);
    history.push('/requisicao');
  };

  const handleAlert = () => setAlert(true);

  /* BEGIN UPLOAD FILES SECTION */
  const onDrop = useCallback(
    acceptedFiles => {
      setArquivos([...arquivos, ...acceptedFiles]);
    },
    [arquivos]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const removeFile = file => () => {
    const newFiles = [...arquivos];
    newFiles.splice(newFiles.indexOf(file), 1);
    setArquivos(newFiles);
  };

  const files = arquivos.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes{' '}
      <DeleteForeverSharpIcon onClick={removeFile(file)} />
    </li>
  ));

  const dropzoneStyle = {
    width: '100%',
    height: '20%',
    border: '1px dashed grey',
    background: 'lightGrey',
  };

  return (
    <Container>
      {requisicaoModal ? (
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
                    <Form.Group as={Col}>
                      <Form.Label>Nº Requisição</Form.Label>
                      <Form.Control
                        readOnly
                        value={idrequisicao}
                        onChange={e => setIdReq(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
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
                        as="select"
                        readOnly
                        value="Aberta"
                        onChange={e => setStatus(e.target.value)}
                      >
                        <option value="Aberta">Aberta</option>
                      </Form.Control>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>Departamento</Form.Label>
                      <Select
                        isSearchable
                        required
                        styles={colourStyles}
                        options={dptos}
                        onChange={selectedOption =>
                          onChangeDpto(selectedOption)
                        }
                        placeholder="Selecione um Departamento"
                        theme={theme => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            neutral50: '#1A1A1A',
                          },
                        })}
                      />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} controlId="editAssunto">
                      <Form.Label>Finalidade/Justificativa</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="3"
                        required
                        value={finalidade}
                        onChange={e => setFinalidade(e.target.value)}
                      />
                    </Form.Group>
                  </Form.Row>

                  <hr />
                  <Form.Row>
                    <Form.Group as={Col} id="salvar">
                      <Button
                        disabled={disableSalvar}
                        variant="primary"
                        size="lg"
                        block
                        p="2"
                        onClick={handleRequisicao}
                      >
                        Salvar
                      </Button>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Button
                        disabled={enableAtualizar}
                        variant="success"
                        size="lg"
                        block
                        p="2"
                        onClick={updateRequisicao}
                      >
                        Finalizar
                      </Button>
                    </Form.Group>
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
                  <Accordion>
                    <Card>
                      <Card.Header>
                        <Accordion.Toggle
                          as={Button}
                          variant="link"
                          eventKey={eventKey}
                          onClick={() => {
                            if (
                              typeof requisicao.idrequisicao === 'undefined'
                            ) {
                              setEventKey('1');
                              handleAlert();
                            } else {
                              console.log('else accordion', eventKey);
                            }
                          }}
                        >
                          Localizar Produto/Serviço
                        </Accordion.Toggle>
                      </Card.Header>

                      <Accordion.Collapse eventKey={eventKey}>
                        <Card className="text-center mb-2">
                          <Card.Header>
                            <Produto />
                          </Card.Header>

                          <Card.Body>
                            <RequisicaoItem />
                          </Card.Body>
                        </Card>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>

                  <hr />
                  <Form.Group as={Col}>
                    <Form.Label>Observação</Form.Label>
                    <Form.Control
                      onBlur={updateRequisicao}
                      as="textarea"
                      rows="3"
                      value={observacao}
                      onChange={e => setObservacao(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Row>
                    <Form.Group as={Col} controlId="editArq">
                      <Form.Label>Anexar arquivo</Form.Label>
                      <div>
                        <Card>
                          <section>
                            <div
                              {...getRootProps({ className: 'dropzone' })}
                              style={dropzoneStyle}
                            >
                              <div align="center">
                                <span>{files ? ' 📂 ' : ' 📁 '}</span>
                                <i className="fa fa-cloud-upload" />
                                <input {...getInputProps()} />
                                <p>
                                  Arraste e solte arquivos aqui, ou clique para
                                  selecionar arquivos
                                </p>
                                <p />
                              </div>
                            </div>

                            <div>
                              {files.length > 0 ? (
                                <div>
                                  <aside>
                                    <h5>Arquivos</h5>
                                    <ul>{files}</ul>
                                  </aside>
                                </div>
                              ) : (
                                <div />
                              )}
                            </div>
                          </section>
                        </Card>
                      </div>
                    </Form.Group>
                  </Form.Row>

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
                      />
                    </>
                  ) : (
                    ''
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Modal.Body>
        </Modal>
      ) : null}

      {editRequisicaoModal ? (
        <Modal
          variant="danger"
          dialogClassName="modal-danger"
          size="lg"
          backdrop="static"
          animation
          show={editRequisicaoModal}
          onHide={handleClose}
        >
          <Modal.Body>
            <Card>
              <Card.Header>
                <Card.Title>EDITAR REQUISIÇÃO</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form noValidate validated={validated}>
                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>Nº Requisição</Form.Label>
                      <Form.Control readOnly value={requisicao.idrequisicao} />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Data</Form.Label>
                      <Form.Control
                        readOnly
                        value={requisicao.dataFormatada}
                        onChange={handleDtRequisicao}
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="editNrProtocolo">
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        as="select"
                        readOnly
                        value="Aberto"
                        onChange={e => setStatus(e.target.value)}
                      >
                        <option value="Aberto">Aberto</option>
                        <option value="Retirar no almoxarifado">
                          Retirar no almoxarifado
                        </option>
                        <option value="Em cotação">Em cotação</option>
                        <option value="Finalizado">Finalizado</option>
                      </Form.Control>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>Departamento</Form.Label>
                      <Form.Control readOnly value={editDepartamento} />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Alterar Departamento</Form.Label>
                      <Select
                        isSearchable
                        styles={colourStyles}
                        options={dptos}
                        onChange={selectedOption =>
                          onChangeDpto(selectedOption)
                        }
                        placeholder="Selecione outro dpto caso desejar"
                      />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>Finalidade/Justificativa</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="3"
                        value={finalidade}
                        onChange={e => setFinalidade(e.target.value)}
                      />
                    </Form.Group>
                  </Form.Row>
                  <hr />
                  <Form.Row>
                    <Form.Group as={Col} id="salvar">
                      <Button
                        variant="primary"
                        size="lg"
                        block
                        p="2"
                        onClick={updateRequisicao}
                      >
                        Salvar
                      </Button>
                    </Form.Group>
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
                  <Accordion>
                    <Card>
                      <Card.Header>
                        <Accordion.Toggle
                          as={Button}
                          variant="link"
                          eventKey="0"
                        >
                          Ver Produtos/Serviços
                        </Accordion.Toggle>
                      </Card.Header>

                      <Accordion.Collapse eventKey="0">
                        <div>
                          <Card className="text-center mb-2">
                            <Card.Header>
                              <Produto />
                            </Card.Header>
                            <Card.Body>
                              <RequisicaoItem />
                            </Card.Body>
                          </Card>
                        </div>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                  <hr />
                  <Form.Group as={Col}>
                    <Form.Label>Observação</Form.Label>
                    <Form.Control
                      onBlur={updateRequisicao}
                      as="textarea"
                      rows="3"
                      value={observacao}
                      onChange={e => setObservacao(e.target.value)}
                    />
                  </Form.Group>
                </Form>

                <Form.Row>
                  <Form.Group as={Col} controlId="editArq">
                    <Form.Label>Anexar arquivo</Form.Label>
                    <div>
                      <Card>
                        <section>
                          <div
                            {...getRootProps({ className: 'dropzone' })}
                            style={dropzoneStyle}
                          >
                            <div align="center">
                              <span>{files ? ' 📂 ' : ' 📁 '}</span>
                              <i className="fa fa-cloud-upload" />
                              <input {...getInputProps()} />
                              <p>
                                Arraste e solte arquivos aqui, ou clique para
                                selecionar arquivos
                              </p>
                              <p />
                            </div>
                          </div>

                          <div>
                            {files.length > 0 ? (
                              <div>
                                <aside>
                                  <h5>Arquivos</h5>
                                  <ul>{files}</ul>
                                </aside>
                              </div>
                            ) : (
                              <div />
                            )}
                          </div>
                        </section>
                      </Card>
                    </div>
                  </Form.Group>
                </Form.Row>
              </Card.Body>
            </Card>
          </Modal.Body>
        </Modal>
      ) : null}
    </Container>
  );
}
