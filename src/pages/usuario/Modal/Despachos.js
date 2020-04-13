/* eslint-disable no-return-assign */
/* eslint-disable no-console */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { Modal, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import history from '../../../services/history';
import api from '../../../services/api';
import DocumentoEdit from './DocumentoEdit';

export default function Despachos(props) {
  const { usuario } = useSelector(state => state.usuario);
  const { caixa } = props;
  const [show, setShow] = useState(false);
  const [caixaDoc, setCaixaDoc] = useState(caixa);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function alterarStatus(situacao) {
    // <option value="1">Protocolado</option>
    // <option value="2">Despachado</option>
    // <option value="3">Lido</option>
    // <option value="4">Recebido</option>
    // <option value="5">Arquivado</option>
    // <option value="6">Pendente</option>
    const updateCaixa = {
      status: situacao,
      idcaixaentrada: caixa.idcaixaentrada,
    };
    if (updateCaixa) {
      api
        .put(
          `usuarios/${usuario.idusuario}/caixaentrada/${updateCaixa.idcaixaentrada}`,
          updateCaixa
        )
        .then(result => {
          const { caixaentrada } = result.data;
          setCaixaDoc(caixaentrada);
          toast.success('Status atualizado com sucesso!');
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
        <Dropdown.Item as="button" onClick={() => alterarStatus('Despachado')}>
          Despachar Documento
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={() => alterarStatus('Pendente')}>
          Pender Documento
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={() => alterarStatus('Arquivado')}>
          Arquivar Documento
        </Dropdown.Item>

        <Dropdown.Divider />
        <Dropdown.Item as="button" onClick={() => handleShow('Modal Paciente')}>
          Visualizar Documento
        </Dropdown.Item>
      </DropdownButton>
      {/* MODAL DOCUMENTO */}
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton size="sm">
          <Modal.Title>Documento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* DOCUMENTO EDIT */}
          <DocumentoEdit documento={caixaDoc.documento} />
          {/* DOCUMENTO EDIT */}
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button size="sm" variant="primary" onClick={handleClose}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

Despachos.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  caixa: PropTypes.any,
};
Despachos.defaultProps = {
  caixa: null,
};
