/* eslint-disable no-return-assign */
/* eslint-disable no-console */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Col, Button } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import history from '../../../services/history';
import { addDocumentoRequest } from '../../../redux/features/protocolo/protocoloSlide';

export default function Documento(props) {
  const { idDoc } = props;
  console.log(`Entrando no DocumentoAdd`);
  const dispatch = useDispatch();
  const { usuario } = useSelector((state) => state.usuario);

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

  function handleDtExpedicao(dtDocumento) {
    setDtExped(dtDocumento);
  }

  function handleAlert() {
    console.log(`handleAlert`);
    // event.preventDefault();
    setAlert(true);
  }

  const handleCancel = () => {
    setAlert(false);
  };

  const handleSubmit = async () => {
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
      await dispatch(addDocumentoRequest({ newDocumento }));
      // clear form data
      history.push('/home');
      setValidated(true);
    } catch (error) {
      console.error('ERRO: ', error);
    }
  };

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
                        onChange={(e) => setOrigem(e.target.value)}
                      />
                      <Form.Check
                        type="radio"
                        inline
                        label="Externo"
                        name="rdDoc"
                        id="rd02"
                        value={2}
                        onChange={(e) => setOrigem(e.target.value)}
                      />
                    </Form.Group>
                  </Form.Group>

                  <Form.Group as={Col} controlId="editTipoDoc">
                    <Form.Label>Tipo de Documento</Form.Label>
                    <Form.Control
                      as="select"
                      value={idtipodocumento}
                      onChange={(e) => setIdTipoDoc(e.target.value)}
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
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="1">Enviado</option>
                      <option value="2">Recebido</option>
                    </Form.Control>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="editExpedidor">
                    <Form.Label>Expedidor</Form.Label>
                    <Form.Control
                      value={idexpedidor}
                      onChange={(e) => setIdExped(e.target.value)}
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="editDtExp">
                    <Form.Label>Dt Expedição</Form.Label>
                    <DatePicker
                      selected={dataexpedicao}
                      onChange={handleDtExpedicao}
                      dateFormat="dd/MM/yyyy"
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="editPrazo">
                    <Form.Label>Prazo(dias)</Form.Label>
                    <Form.Control
                      value={prazo}
                      onChange={(e) => setPrazo(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="editNrDoc">
                    <Form.Label>Nr Documento</Form.Label>
                    <Form.Control
                      value={nrdocumento}
                      onChange={(e) => setNrDocumento(e.target.value)}
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="editNrProtocolo">
                    <Form.Label>Nr de Protocolo</Form.Label>
                    <Form.Control
                      value={nrprotocolo}
                      onChange={(e) => setNrProtocolo(e.target.value)}
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="editNrProtocolo">
                    <Form.Label>Documento</Form.Label>
                    <Form.Control
                      value={documento}
                      onChange={(e) => setDocumento(e.target.value)}
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
                      onChange={(e) => setAssunto(e.target.value)}
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="editPrioridade">
                    <Form.Label>Proridade</Form.Label>
                    <Form.Control
                      type="text"
                      value={idprioridade}
                      onChange={(e) => setIdPrio(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="editSigilo">
                    <Form.Label>Sigilo</Form.Label>
                    <Form.Control
                      type="text"
                      value={sigilo}
                      onChange={(e) => setSigilo(e.target.value)}
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="editRfr">
                    <Form.Label>Referência</Form.Label>
                    <Form.Control
                      type="text"
                      value={referencia}
                      onChange={(e) => setReferencia(e.target.value)}
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
                      onChange={(e) => setObservacao(e.target.value)}
                    />
                  </Form.Group>
                </Form.Row>
                <Button size="sm" variant="secondary" onClick={handleAlert}>
                  Gravar
                </Button>

                {alert ? (
                  <>
                    <SweetAlert
                      custom
                      showCancel
                      showCloseButton
                      confirmBtnText="Sim"
                      cancelBtnText="Não"
                      confirmBtnBsStyle="primary"
                      cancelBtnBsStyle="default"
                      customIcon="https://raw.githubusercontent.com/djorg83/react-bootstrap-sweetalert/master/demo/assets/thumbs-up.jpg"
                      title="Deseja Protocolor Novo Documento?"
                      onConfirm={handleSubmit}
                      onCancel={handleCancel}
                    >
                      Protocolando...
                    </SweetAlert>
                  </>
                ) : (
                  ''
                )}

                {/* <Button type="submit">Submit form</Button> */}
              </Form>
            </div>
            <div className="modal-footer">
              {/* <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button> */}
            </div>
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
