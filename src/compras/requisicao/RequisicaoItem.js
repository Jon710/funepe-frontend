import React from 'react';
import { useSelector } from 'react-redux';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {
  Table,
  Col,
  Container,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ListIcon from '@material-ui/icons/List';
import { green } from '@material-ui/core/colors';

export default function RequisicaoItem() {
  const { requisicoesItem } = useSelector(state => state.compras);
  console.log('requisicoesItem: ', requisicoesItem);

  // datauso: "2020-07-01T00:00:00.000Z"
  // desconto: 0
  // iditemrequisicao: 25
  // idproduto: 2
  // idrequisicao: 42
  // indicacaouso: null
  // prioridade: 1
  // produto: {idproduto: 2, idunidade: 1, idmarca: 1, descricao: "Caneta", inativar: 50, …}
  // quantidade: 2
  // requisicao: {idrequisicao: 42, iddepartamento: 5, idsolicitante: 12, datareq: "2020-07-01T00:00:00.000Z", horareq: null, …}
  // unidade: "1"
  // valortotal: 6
  // valorunitario: 3

  function handleDeleteProduto(item) {
    console.log('ITEM: ', item);
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
              <th>UN</th>
              <th>Qtde</th>
              <th>V.Unit</th>
              <th>V.Total</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            {requisicoesItem.map(item => (
              <tr key={item.iditemrequisicao}>
                <td>{item.idproduto}</td>
                <td>{item.produto.descricao}</td>
                <td>{item.unidade}</td>
                <td>{item.quantidade}</td>
                <td>{item.vlrUnit}</td>
                <td>{item.vlrTotal}</td>
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
                      <Tooltip id={item.iditemrequisicao}>
                        Novo Atendimento
                      </Tooltip>
                    }
                  >
                    <EditIcon style={{ color: green[500] }} />
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 100 }}
                    overlay={<Tooltip id={item.iditemrequisicao}>Menu</Tooltip>}
                  >
                    <ListIcon />
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
