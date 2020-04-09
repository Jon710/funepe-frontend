/* eslint-disable no-return-assign */
/* eslint-disable no-console */
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { Modal, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import history from '../../../services/history';
import api from '../../../services/api';
import DocumentoEdit from './DocumentoEdit';

export default function Despachos(props) {
  const { documento } = props;
  // console.log('Despachos');
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function alteraStatusAgenda(situacao) {
    documento.SITUACAO = situacao;
    console.log('Agenda STATUS', documento.CODAGENDA, situacao);
    if (documento) {
      api
        .put('/agenda/situacao', documento)
        .then(result => {
          console.log('success', result);
          history.push('/home');
        })
        .catch(err => {
          console.log('ERRO: ', err);
          toast.error(err.response.data.error);
        });
    } else {
      toast.warn('Documento não identificado!');
    }
  }

  return (
    <>
      <DropdownButton
        drop="left"
        size="sm"
        id="dropdown-item-button"
        title="Menu"
      >
        <Dropdown.Item
          as="button"
          onClick={() => alteraStatusAgenda('Reservada')}
        >
          Agenda Reservada
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => alteraStatusAgenda('Cancelado')}
        >
          Agenda Cancelada
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => alteraStatusAgenda('Fechada')}
        >
          Agenda Fechada
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => alteraStatusAgenda('Feriado')}
        >
          Agenda Feriado
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => alteraStatusAgenda('Marcada')}
        >
          Agenda Marcada
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={() => alteraStatusAgenda('Aberta')}>
          Agenda Aberta
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item
          as="button"
          onClick={() => alteraStatusAgenda('Em atendimento')}
        >
          Paciente Em Atendimento
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => alteraStatusAgenda('Atendido')}
        >
          Paciente Atendido
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={() => alteraStatusAgenda('Faltou')}>
          Paciente Faltou
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item as="button" onClick={() => handleShow('Modal Paciente')}>
          Editar Agenda
        </Dropdown.Item>
      </DropdownButton>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton size="sm">
          <Modal.Title>Agenda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DocumentoEdit documento={documento.documento} />
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button size="sm" variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

Despachos.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  documento: PropTypes.any,
};
Despachos.defaultProps = {
  documento: null,
};
