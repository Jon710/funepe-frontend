/* eslint-disable no-return-assign */
/* eslint-disable no-console */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { Modal, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import history from '~/services/history';
import api from '~/services/api';
import DocumentoEdit from '~/pages/usuario/Modal/DocumentoEdit';

export default function Despachos(props) {
  const { usuario } = useSelector(state => state.usuario);
  const { documento } = props;
  const [show, setShow] = useState(false);
  const [doc, setDoc] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function alterarStatus(situacao) {
    // <option value="1">Protocolado</option>
    // <option value="2">Despachado</option>
    // <option value="3">Lido</option>
    // <option value="4">Recebido</option>
    // <option value="5">Arquivado</option>
    // <option value="6">Pendente</option>
    const newdocumento = {
      status: situacao,
      iddocumento: documento.iddocumento,
    };
    // console.log('Documento STATUS', newdocumento, usuario);
    if (newdocumento) {
      api
        .put(
          `usuarios/${usuario.idusuario}/documents/${newdocumento.iddocumento}`,
          newdocumento
        )
        .then(result => {
          // console.log('success', result);
          const { document } = result.data;
          // console.log('success', document);
          setDoc(document);
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
        <Dropdown.Item as="button" onClick={() => alterarStatus('2')}>
          Despachar Documento
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={() => alterarStatus('6')}>
          Pender Documento
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={() => alterarStatus('5')}>
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
          <DocumentoEdit documento={doc} />
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
  documento: PropTypes.any,
};
Despachos.defaultProps = {
  documento: null,
};
