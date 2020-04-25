/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-return-assign */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import {
  Table,
  Spinner,
  Container,
  Button,
  Card,
  Accordion,
  ProgressBar,
} from 'react-bootstrap';

import { MdSupervisorAccount } from 'react-icons/md';
import { addDays, parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { getFirstRender } from '../../../redux/features/protocolo/protocoloSlice';
import { modalOpen } from '../../../redux/features/context/contextSlice';
// import ModalContext from '../../../redux/features/context/modal';
import Despachos from '../Modal/Despachos';
import Documento from '../Modal/Documento';
import TableProtocolo from './TableProtocolo';

export default function CaixaEntrada() {
  const dispatch = useDispatch();
  const { usuario } = useSelector(state => state.usuario);
  const { documento } = useSelector(state => state.protocolo);
  const { showModal, uploadPercentage } = useSelector(state => state.contexto);

  const [cxEntrada, setCxEntrada] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let c = 0;
    function loadDocumentos() {
      setLoading(true);
      if (usuario.idusuario !== 0) {
        dispatch(getFirstRender(usuario)).then(response => {
          if (response.length > 0) {
            const protocolos = response.map(protocolo => ({
              ...protocolo,
              dataFormatada: format(
                addDays(parseISO(protocolo.dataenvio), 1),
                'dd/MM/yyyy',
                { locale: pt }
              ),
              counter: (c += 1),
            }));
            setCxEntrada(protocolos);
            setCount(c);
            setLoading(false);
          }
        });
      } else {
        toast.warn('Usuário não identificado!');
      }
    }
    loadDocumentos();
  }, [documento.iddocumento, count]);

  return (
    <Container fluid>
      <div className="container-fluid">
        <div>
          <Button variant="primary" onClick={() => dispatch(modalOpen())}>
            Protocolar Documento
          </Button>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="grow"
                role="status"
                aria-hidden="true"
                variant="success"
              />
              <span className="sr-only">Loading...</span>
            </>
          ) : (
            <>
              <MdSupervisorAccount size={50} variant="primary" />
              <Documento show={showModal} idDoc="idDocumento" />
            </>
          )}
        </div>
        <div>
          <ProgressBar
            animated
            now={uploadPercentage}
            label={`${uploadPercentage}%`}
          />
        </div>

        <Table striped bordered hover size="sm" variant="primary">
          <thead>
            <tr>
              <th>#</th>
              <th>Data</th>
              <th>Tipo</th>
              <th>Nr Doc</th>
              <th>Assunto</th>
              <th>Expedidor</th>
              <th>Destinatário</th>
              <th>Status</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            {cxEntrada !== undefined ? (
              cxEntrada.map(caixa => (
                <tr key={caixa.counter}>
                  <td>{caixa.counter}</td>
                  <td>{caixa.dataFormatada}</td>
                  <td>{caixa.documento.tipoDocumento.abreviacao}</td>
                  <td>{caixa.documento.nrdocumento}</td>
                  <td>{caixa.documento.assunto}</td>
                  <td>{caixa.documento.usuario.username}</td>
                  <td>{caixa.usuario.username}</td>
                  <td>{caixa.status}</td>
                  <td>
                    <Despachos caixa={caixa} />
                  </td>
                </tr>
              ))
            ) : (
              <div>No documents</div>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td style={{ textAlign: 'right' }} colSpan="8">
                TOTAL DE DOCUMENTOS
              </td>
              <td style={{ textAlign: 'left' }} colSpan="1">
                {count}
              </td>
            </tr>
          </tfoot>
        </Table>
        <div>
          <Accordion defaultActiveKey="0">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                Despachos
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>Lista de Despachos</Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <TableProtocolo />
        </div>
      </div>
      {/*
      <Modal
        show={false}
        onHide={handleCloseModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Protocolo de Documento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated}>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Protocolo</Form.Label>
                <Form.Group>
                  <Form.Check
                    type="radio"
                    inline
                    label="Interno"
                    name="rdDoc"
                    id="rd01"
                    defaultChecked={1}
                    value={1}
                    onChange={e => setOrigem(e.target.value)}
                  />
                  <Form.Check
                    type="radio"
                    inline
                    label="Externo"
                    name="rdDoc"
                    id="rd02"
                    value={2}
                    onChange={e => setOrigem(e.target.value)}
                  />
                </Form.Group>
              </Form.Group>

              <Form.Group as={Col} controlId="editTipoDoc">
                <Form.Label>Tipo de Documento</Form.Label>
                <Form.Control
                  as="select"
                  value={1}
                  onChange={e => setIdTipoDoc(e.target.value)}
                >
                  {tipoDocumentos.length > 0
                    ? tipoDocumentos.map(tipo => (
                        <option key={tipo.idtipo} value={tipo.idtipo}>
                          {tipo.descricao}
                        </option>
                      ))
                    : ''}
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} controlId="editStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value="1"
                  onChange={e => setStatus(e.target.value)}
                >
                  <option value="1">Enviado</option>
                  <option value="2">Despachado</option>
                  <option value="3">Lido</option>
                  <option value="4">Recebido</option>
                  <option value="5">Arquivado</option>
                  <option value="6">Pendente</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="editDtExp">
                <Form.Label>Dt Expedição</Form.Label>
                <div>
                  <DatePicker
                    selected={dataexpedicao}
                    onChange={handleDtExpedicao}
                    // style={{ width: '100%' }}
                    className="form-control"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="editExpedidor">
                <Form.Label>Expedidor</Form.Label>
                <Form.Control
                  value={idexpedidor}
                  onChange={e => setIdExped(e.target.value)}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="editPrazo">
                <Form.Label>Prazo(dias)</Form.Label>
                <Form.Control
                  value={prazo}
                  onChange={e => setPrazo(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="editNrDoc">
                <Form.Label>Nr Documento</Form.Label>
                <Form.Control
                  value={nrdocumento}
                  onChange={e => setNrDocumento(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="editNrProtocolo">
                <Form.Label>Nr de Protocolo</Form.Label>
                <Form.Control
                  value={nrprotocolo}
                  onChange={e => setNrProtocolo(e.target.value)}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="editNrProtocolo">
                <Form.Label>Documento</Form.Label>
                <Form.Control
                  value={documentacao}
                  onChange={e => setDocumentacao(e.target.value)}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="editAssunto">
                <Form.Label>Assunto</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  value={assunto}
                  onChange={e => setAssunto(e.target.value)}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Proridade</Form.Label>
                <Form.Group controlId="editPrioridades">
                  {prioridades.length > 0
                    ? prioridades.map(prioridade =>
                        prioridade.idprioridade === 1 ? (
                          <Form.Check
                            type="radio"
                            inline
                            defaultChecked
                            value={prioridade.idprioridade}
                            label={prioridade.tipo}
                            key={prioridade.idprioridade}
                            name="rdPrio"
                            id={`rdPrio${prioridade.idprioridade}`}
                            onChange={e => setIdPrio(e.target.value)}
                          />
                        ) : (
                          <Form.Check
                            type="radio"
                            inline
                            value={prioridade.idprioridade}
                            label={prioridade.tipo}
                            key={prioridade.idprioridade}
                            name="rdPrio"
                            id={`rdPrio${prioridade.idprioridade}`}
                            onChange={e => setIdPrio(e.target.value)}
                          />
                        )
                      )
                    : 'PRIO'}
                </Form.Group>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Sigilo</Form.Label>
                <Form.Group controlId="editSigilo">
                  <Form.Check
                    type="radio"
                    inline
                    defaultChecked
                    label="Ostensivo"
                    name="rdSigilo"
                    id="rdSigilo01"
                    value={1}
                    onChange={e => setSigilo(e.target.value)}
                  />
                  <Form.Check
                    type="radio"
                    inline
                    label="Reservado"
                    name="rdSigilo"
                    id="rdSigilo02"
                    value={2}
                    onChange={e => setSigilo(e.target.value)}
                  />
                  <Form.Check
                    type="radio"
                    inline
                    label="Secreto"
                    name="rdSigilo"
                    id="rdSigilo03"
                    value={3}
                    onChange={e => setSigilo(e.target.value)}
                  />
                </Form.Group>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="editRfr">
                <Form.Label>Referência</Form.Label>
                <Form.Control
                  type="text"
                  value={referencia}
                  onChange={e => setReferencia(e.target.value)}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="editObs">
                <Form.Label>Observação</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  value={observacao}
                  onChange={e => setObservacao(e.target.value)}
                />
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
                  title="Deseja Protocolor Novo Documento com seus anexos?"
                  onConfirm={handleSubmitDocuments}
                  onCancel={handleCancelDocuments}
                >
                </SweetAlert>
              </>
            ) : (
              ''
            )}

            <hr />

            <Form.Row>
              <Form.Group as={Col} controlId="editArq">
                <Form.Label>Arquivos Anexos</Form.Label>
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
            <Form.Row></Form.Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Form.Row>
            <Form.Group as={Col} controlId="editArq">
              <Form.Label></Form.Label>
              <Button
                variant="success"
                size="lg"
                block
                onClick={handleProtocolar}
                p="2"
              >
                Protocolar Documento
              </Button>
            </Form.Group>
            <Form.Group as={Col} controlId="editArq">
              <Form.Label></Form.Label>
              <Button
                variant="warning"
                size="lg"
                block
                onClick={handleCloseModal}
                p="2"
              >
                Fechar
              </Button>
            </Form.Group>
          </Form.Row>
        </Modal.Footer>
                        </Modal>
                        */}
    </Container>
  );
}
