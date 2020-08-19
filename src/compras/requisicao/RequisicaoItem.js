import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {
  Table,
  Col,
  Container,
  OverlayTrigger,
  Tooltip,
  Form,
} from 'react-bootstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { green } from '@material-ui/core/colors';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function RequisicaoItem() {
  const [observacao, setObservacao] = useState('');
  const { requisicoesItem } = useSelector(state => state.compras);

  function handleDeleteProduto(item) {
    console.log('ITEM: ', item);
  }

  async function handleObservacaoProduto(item) {
    const observacaoDoProduto = {
      observacao,
    };

    await api
      .put(
        `requisicao/${item.idrequisicao}/itemrequisicao/${item.iditemrequisicao}`,
        observacaoDoProduto
      )
      .then(() => {
        toast.success('Observação salva!');
      })
      .catch(error => {
        console.log(error);
        // dispatch(
        //   showAlertErrorOpen({
        //     showAlertError: true,
        //     alertError: `${error.response.data.error}`,
        //   })
        // );
      });
  }

  return (
    <Container>
      <Col sm>
        <Table
          responsive="sm"
          striped
          bordered
          hover
          size="sm"
          variant="success"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Descrição</th>
              <th>Qtde</th>
              <th>Observação</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            {requisicoesItem.map(item => (
              <tr key={item.iditemrequisicao}>
                <td>{item.idproduto}</td>
                <td>{item.produto.descricao}</td>
                <td>{item.quantidade}</td>
                <td>
                  <Form.Control
                    defaultValue={item.observacao}
                    onChange={e => setObservacao(e.target.value)}
                    as="textarea"
                    rows="2"
                  />
                </td>
                <td align="center" style={{ whiteSpace: 'nowrap' }}>
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 100 }}
                    overlay={
                      <Tooltip id={item.iditemrequisicao}>Excluir</Tooltip>
                    }
                  >
                    <DeleteIcon
                      color="primary"
                      onClick={() => handleDeleteProduto(item)}
                    />
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 100 }}
                    overlay={
                      <Tooltip id={item.iditemrequisicao}>Salvar</Tooltip>
                    }
                  >
                    <EditIcon
                      style={{ color: green[500] }}
                      onClick={() => handleObservacaoProduto(item)}
                    />
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Container>
  );
}
