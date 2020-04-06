import React, { useState } from 'react';

import { Form, Col, Row, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/css/resume.min.css';

// eslint-disable-next-line react/prop-types
export default function DocumentoEdit(props) {
  // eslint-disable-next-line react/prop-types
  const { documento } = props;
  // eslint-disable-next-line no-console
  console.log('Entrando no DocumentoEdit', documento);
  const [validated, setValidated] = useState(false);

  const handleSubmit = event => {
    console.log('handleSubmit DocumentoEdit');
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group as={Row} controlId="editCodDoc">
          <Form.Label column xs={2}>
            CodDoc
          </Form.Label>
          <Col xs={2}>
            <Form.Control
              plaintext
              readOnly
              defaultValue={documento.iddocumento}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="edtNrDoc">
          <Form.Label column xs={2}>
            Nr Doc
          </Form.Label>
          <Col xs={2}>
            <Form.Control type="text" defaultValue={documento.nrdocumento} />
          </Col>
          <Col xs={8}>
            <Form.Control type="text" defaultValue={documento.nrprotocolo} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="edtDocumento">
          <Form.Label column sm={2}>
            Documento
          </Form.Label>
          <Col sm={8}>
            <Form.Control type="text" defaultValue={documento.documento} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="edtAssunto">
          <Form.Label column sm={2}>
            Assunto
          </Form.Label>
          <Col sm={8}>
            <Form.Control type="text" defaultValue={documento.assunto} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="edtDtExp">
          <Form.Label column sm={2}>
            Dt Exp/Prazo
          </Form.Label>
          <Col sm={6}>
            <Form.Control type="text" defaultValue={documento.dataexpedicao} />
          </Col>
          <Col sm={4}>
            <Form.Control type="text" defaultValue={documento.prazo} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="edtSigilo">
          <Form.Label column sm={2}>
            Sigilo/Status
          </Form.Label>
          <Col sm={6}>
            <Form.Control type="text" defaultValue={documento.sigilo} />
          </Col>
          <Col sm={4}>
            <Form.Control type="text" defaultValue={documento.status} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="edtRfr">
          <Form.Label column sm={2}>
            Referência
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="text" defaultValue={documento.referencia} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="edtObs">
          <Form.Label column sm={2}>
            Observação
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="text" defaultValue={documento.observacao} />
          </Col>
        </Form.Group>
        <Button type="submit">Gravar</Button>
      </Form>
    </>
  );
}

DocumentoEdit.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  documento: PropTypes.any,
};
DocumentoEdit.defaultProps = {
  documento: null,
};
