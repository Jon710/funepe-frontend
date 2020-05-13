/* eslint-disable no-use-before-define */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-plusplus */
/* eslint-disable no-return-assign */
/* eslint-disable no-console */
import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Col, Button, Card, Modal, ProgressBar } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import SweetAlert from 'react-bootstrap-sweetalert';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';

import api from '../../../services/api';
import { addDocumentoRequest } from '../../../redux/features/protocolo/protocoloSlice';
import {
  modalClose,
  progressBar,
} from '../../../redux/features/context/contextSlice';

export default function Documento() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { documento, prioridades, tipoDocumentos } = useSelector(
    state => state.protocolo
  );
  const { showModal } = useSelector(state => state.contexto);
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

  const [validated, setValidated] = useState(false);
  const [alert, setAlert] = useState(false);
  const [arquivos, setArquivos] = useState([]);
  const formData = new FormData();

  const handleProtocolar = () => {
    setAlert(true);
  };
  const handleCloseModal = () => {
    setAlert(false);
    dispatch(modalClose());
  };

  function handleDtExpedicao(dtDocumento) {
    setDtExped(dtDocumento);
  }

  const handleCancelDocuments = () => {
    setAlert(false);
  };

  const handleSubmitDocuments = () => {
    try {
      console.log('documentoAdded');
      setAlert(true);
      const newDocumento = {
        idtipodocumento,
        idprioridade,
        idexpedidor,
        nrprotocolo,
        nrdocumento,
        assunto,
        dataexpedicao,
        prazo,
        referencia,
        observacao,
        origem,
        sigilo,
        status,
      };
      const documentoAdded = dispatch(
        addDocumentoRequest({ newDocumento })
      ).then(response => {
        try {
          console.log('arquivos', arquivos);
          if (arquivos.length > 0) {
            const { iddocumento } = response.documento;
            for (let i = 0; i < arquivos.length; i++) {
              formData.append('arquivos', arquivos[i]);
            }

            api.post(`documents/${iddocumento}/arquivoanexo`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              onUploadProgress: progressEvent => {
                // console.log('onUlpoadingggggggggg');
                dispatch(
                  progressBar(
                    // eslint-disable-next-line radix
                    parseInt(
                      Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total,
                        10
                      )
                    )
                  )
                );

                // Clear percentage
                // setTimeout(() => dispatch(progressBar(0), 1000));
              },
            });
            handleCloseModal();
          } else {
            handleCloseModal();
          }
        } catch (error) {
          toast.error(
            `ERRO: Documento.js - handleSubmitUpload()  ${error.message}`
          );
        }
      });
      console.log('documentoAddeddocumentoAdded: ', documentoAdded, documento);
      // handleSubmitUpload(documentoAdded);
      // clear form data
      setValidated(true);
    } catch (error) {
      console.error('ERRO: ', error);
    }
  };

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
    <>
      <Modal
        show={showModal}
        onHide={() => dispatch(modalClose())}
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
                    selected
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
                  {/* Protocolando... */}
                </SweetAlert>
              </>
            ) : (
              ''
            )}

            <hr />

            <Form.Row>
              <Form.Group as={Col} controlId="editArq">
                <Form.Label>Arquivos Anexos</Form.Label>
                {/* Upload Files */}
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

                {/* Upload Files */}
              </Form.Group>
            </Form.Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Form.Row>
            <Form.Label />
            <Form.Group as={Col} controlId="editArq">
              <ProgressBar animated now={45} />
            </Form.Group>
            <Form.Group as={Col} controlId="editArq">
              <Form.Label />
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
              <Form.Label />
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
    </>
  );
}
