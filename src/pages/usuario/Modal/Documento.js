/* eslint-disable no-return-assign */
/* eslint-disable no-console */
import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Col, Button, Card } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import SweetAlert from 'react-bootstrap-sweetalert';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';

import history from '~/services/history';
import api from '~/services/api';
// import Upload from './Upload';
import { addDocumentoRequest } from '~/redux/features/protocolo/protocoloSlice';

export default function Documento(props) {
  const { idDoc } = props;
  console.log(`Entrando no DocumentoAdd`);
  const dispatch = useDispatch();
  const { usuario } = useSelector(state => state.usuario);
  const { protocolo } = useSelector(state => state.protocolo);
  console.log('PROTOCOLO SELECTOR: ', protocolo);
  const { iddocumento } = useSelector(state => state.protocolo.documento);
  console.log('DOCUMENTO SELECTOR: ', iddocumento);

  const [idtipodocumento, setIdTipoDoc] = useState('');
  const [idprioridade, setIdPrio] = useState('');
  const [idexpedidor, setIdExped] = useState(usuario.idusuario);
  const [nrprotocolo, setNrProtocolo] = useState('');
  const [nrdocumento, setNrDocumento] = useState('');
  const [documento, setDocumento] = useState('');
  const [assunto, setAssunto] = useState('');
  const [dataexpedicao, setDtExped] = useState(new Date());
  const [prazo, setPrazo] = useState('');
  const [referencia, setReferencia] = useState('');
  const [observacao, setObservacao] = useState('');
  const [origem, setOrigem] = useState('');
  const [sigilo, setSigilo] = useState('');
  const [status, setStatus] = useState('');

  const [validated, setValidated] = useState(false);
  const [alert, setAlert] = useState(false);
  const [arquivos, setArquivos] = useState([]);
  // const [idDocumento, setIdDocumento] = useState();
  const formData = new FormData();

  function handleDtExpedicao(dtDocumento) {
    setDtExped(dtDocumento);
  }

  function handleAlert() {
    console.log('handleAlert', arquivos);
    setAlert(true);
  }

  const handleCancelDocuments = () => {
    setAlert(false);
  };

  const handleSubmitDocuments = async () => {
    // event.preventDefault();
    // setAlert(true);
    try {
      const newDocumento = {
        idtipodocumento,
        idprioridade,
        idexpedidor,
        nrprotocolo,
        nrdocumento,
        documento,
        assunto,
        dataexpedicao,
        prazo,
        referencia,
        observacao,
        origem,
        sigilo,
        status,
      };
      const documentoAdded = await dispatch(
        addDocumentoRequest({ newDocumento })
      );
      // const { documento } = documentoAdded;
      console.log('ADDED: ', documentoAdded);
      console.log('ADDED: ', iddocumento);
      // setIdDocumento(iddocumento);
      await handleSubmitUpload(documentoAdded);
      // clear form data
      history.push('/home');
      setValidated(true);
      setAlert(false);
    } catch (error) {
      console.error('ERRO: ', error);
    }
  };

  /*  UPLOAD FILES SECTION */
  const onDrop = useCallback(
    acceptedFiles => {
      setArquivos([...arquivos, ...acceptedFiles]);
      console.log('arquivos', arquivos);
    },
    [arquivos]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const removeFile = file => () => {
    console.log('removeFile...');
    const newFiles = [...arquivos];
    newFiles.splice(newFiles.indexOf(file), 1);
    console.log(newFiles);
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

  const handleSubmitUpload = async documentoAdded => {
    console.log('handleSubmit Files documentoAdded', documentoAdded);
    const { documento } = documentoAdded;
    try {
      console.log('User/Doc: ', usuario, documento.iddocumento, arquivos);

      for (let i = 0; i < arquivos.length; i++) {
        formData.append('arquivos', arquivos[i]);
      }

      const response = await api.post(
        `documents/${documento.iddocumento}/arquivoanexo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const { arquivoanexo } = response.data;
      if (arquivoanexo.length >= 0) {
        // await dispatch(protocoloSuccess({ arquivoanexo }));
        history.push('/home');
        return;
      }
      // toast.info('Nenhum Registro Localizado!');
      history.push('/home');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Protocolos do Usuário. selectAllProtocolo  ${error.message}`
      );
      // history.push('/');
    }
  };
  /*  UPLOAD FILES */

  return (
    <>
      <div
        className="modal fade"
        id={idDoc}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title" id="exampleModalLabel">
                Protocolo de Documento
              </h3>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form noValidate validated={validated}>
                <Form.Row>
                  <Form.Group as={Col} controlId="editInterno">
                    <Form.Label>Protocolo</Form.Label>
                    <Form.Group controlId="editIntExt">
                      <Form.Check
                        type="radio"
                        inline
                        label="Interno"
                        name="rdDoc"
                        id="rd01"
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
                      value={idtipodocumento}
                      onChange={e => setIdTipoDoc(e.target.value)}
                    >
                      <option value="1">Ofício</option>
                      <option value="2">Portaria</option>
                      <option value="3">Requisição</option>
                      <option value="4">Projeto</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group as={Col} controlId="editStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      as="select"
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                    >
                      <option value="1">Enviado</option>
                      <option value="2">Recebido</option>
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
                      value={documento}
                      onChange={e => setDocumento(e.target.value)}
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
                  <Form.Group as={Col} controlId="editPrioridade">
                    <Form.Label>Proridade</Form.Label>
                    <Form.Control
                      type="text"
                      value={idprioridade}
                      onChange={e => setIdPrio(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="editSigilo">
                    <Form.Label>Sigilo</Form.Label>
                    <Form.Control
                      type="text"
                      value={sigilo}
                      onChange={e => setSigilo(e.target.value)}
                    />
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
                      Protocolando...
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
                      {/* <Button
                        variant="success"
                        // type="submit"
                        size="lg"
                        block
                        onClick={handleSubmitUpload}
                        p="2"
                      >
                        Anexar Arquivos
                      </Button> */}
                    </div>

                    {/* Upload Files */}
                  </Form.Group>
                </Form.Row>
                <Form.Row></Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="editArq">
                    <Form.Label></Form.Label>
                    <Button
                      variant="success"
                      size="lg"
                      block
                      onClick={handleAlert}
                      p="2"
                    >
                      Protocolar Documento
                    </Button>
                  </Form.Group>
                </Form.Row>
              </Form>
            </div>
            <div className="modal-footer" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    </>
  );
}
Documento.propTypes = {
  idDoc: PropTypes.any,
};
Documento.defaultProps = {
  idDoc: null,
};
