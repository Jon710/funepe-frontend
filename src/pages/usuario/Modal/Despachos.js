import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { DropdownButton, Dropdown } from 'react-bootstrap';

import history from '../../../services/history';
import api from '../../../services/api';
import {
  modalOpen,
  despachoModalOpen,
} from '../../../redux/features/context/contextSlice';

export default function Despachos() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { documento } = useSelector(state => state.protocolo);
  // const [loading, setLoading] = React.useState(true);
  // console.log('Despachos-caixaDoc: ', loading);

  function alterarStatus(situacao) {
    const updateCaixa = {
      status: situacao,
      idcaixaentrada: documento.idcaixaentrada,
    };
    if (updateCaixa) {
      api
        .put(
          `usuarios/${user.idusuario}/caixaentrada/${updateCaixa.idcaixaentrada}`,
          updateCaixa
        )
        .then(() => {
          // setLoading(false);
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
          onClick={() => dispatch(despachoModalOpen())}
        >
          Despachar Documento
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={() => alterarStatus('Pendente')}>
          Pender Documento
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={() => alterarStatus('Arquivado')}>
          Arquivar Documento
        </Dropdown.Item>

        <Dropdown.Divider />
        <Dropdown.Item as="button" onClick={() => dispatch(modalOpen())}>
          Visualizar Documento
        </Dropdown.Item>
      </DropdownButton>
    </>
  );
}
