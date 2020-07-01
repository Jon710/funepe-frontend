/* eslint-disable no-return-assign */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Card,
  Container,
  Form,
  Col,
  Spinner,
  Table,
} from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { parseISO, format } from 'date-fns';
import {
  getFirstRender,
  selectAllItemRequisicao,
  addRequisicaoRequest,
} from '../../redux/features/compras/comprasSlice';
import { requisicaoModalOpen } from '../../redux/features/context/contextSlice';

// import Requisicao from './Requisicao';
import NavBar from './NavBar';

const CaptionElement = () => (
  <h3
    style={{
      borderRadius: '0.25em',
      textAlign: 'center',
      color: 'blue',
      border: '2px solid blue',
      padding: '0.2em',
    }}
  >
    Requisições de Compras
  </h3>
);

const SpinnerLine = () => (
  <>
    <Spinner animation="grow" variant="primary" />
    <Spinner animation="grow" variant="secondary" />
    <Spinner animation="grow" variant="success" />
    <Spinner animation="grow" variant="danger" />
    <Spinner animation="grow" variant="warning" />
    <Spinner animation="grow" variant="info" />
    <Spinner animation="grow" variant="dark" />
    <Spinner animation="grow" variant="light" />
  </>
);

export default function RequisicaoList() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { requisicoesItem } = useSelector(state => state.compras);
  // const { requisicaoModal } = useSelector(state => state.contexto);
  const [solicitacoes, setSolicitacoes] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const columns = [
    {
      dataField: 'counter',
      text: '#',
      align: 'center',
      headerAlign: 'center',
    },
    {
      dataField: 'dataFormatada',
      text: 'Data',
      align: 'center',
      sort: true,
      headerAlign: 'center',
    },
    {
      dataField: 'departamento.descricao',
      text: 'Dpto',
      align: 'center',
      headerAlign: 'center',
    },
    {
      dataField: 'idreq',
      text: 'NrReq',
      align: 'center',
      headerAlign: 'center',
    },
    {
      dataField: 'finalidade',
      text: 'Finalidade',
      align: 'center',
      sort: true,
      headerAlign: 'center',
    },
    {
      dataField: 'nomeSolicitante',
      text: 'Solic',
      align: 'center',
      headerAlign: 'center',
    },
    {
      dataField: 'nomeDestinatario',
      text: 'Destin',
      align: 'center',
      headerAlign: 'center',
    },
    {
      dataField: 'status',
      text: 'Status',
      align: 'center',
      headerAlign: 'center',
    },
    {
      isDummyField: true,
      text: 'Menu',
      dataField: 'idrequisicao',
      formatter: () => {
        return <div>ADD</div>;
      },
    },
  ];

  const ExportCSVButton = props => {
    const handleClick = () => {
      props.onExport();
    };
    return (
      <div>
        <Button variant="primary" size="lg" block p="2" onClick={handleClick}>
          Exportar CSV
        </Button>
      </div>
    );
  };

  const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    clickToExpand: true,
    onSelect: rowIndex => {
      const requisicao = rowIndex;
      dispatch(selectAllItemRequisicao(requisicao.idrequisicao));
    },
    onExpand: () => {
      // row, isExpand, rowIndex, e
      // console.log(row.id);
      // console.log(isExpand);
      // console.log(rowIndex);
      // console.log(e);
    },
    headerColumnStyle: status => {
      if (status === 'checked') {
        return {
          backgroundColor: 'blue',
        };
      }
      if (status === 'indeterminate') {
        return {
          backgroundColor: 'red',
        };
      }
      if (status === 'unchecked') {
        return {
          backgroundColor: 'grey',
        };
      }
      return {};
    },
  };

  const expandRow = {
    showExpandColumn: true,
    onlyOneExpanding: true,
    renderer: () =>
      requisicoesItem.length > 0 ? (
        <Card>
          <Card.Body>
            <Card.Title>Produtos:</Card.Title>
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
                  <th>Produto</th>
                  <th>Qtde</th>
                  <th>V.Unit</th>
                  <th>V.Tot</th>
                </tr>
              </thead>
              <tbody>
                {requisicoesItem.map(item => (
                  <tr key={item.idproduto}>
                    <td>{item.idproduto}</td>
                    <td>{item.produto.descricao}</td>
                    <td>{item.quantidade}</td>
                    <td>{item.valorunitario}</td>
                    <td>{item.valortotal}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ) : (
        <Card.Header>***Requisição não possui produtos!***</Card.Header>
      ),
    onExpand: row => {
      // dispatch(getUploadedFiles(row.iddocumento));
    },
  };

  useEffect(() => {
    let c = 0;
    function loadRequisicoes() {
      setLoading(true);
      if (user.idusuario !== 0) {
        dispatch(getFirstRender(user)).then(response => {
          if (response.length > 0) {
            const reqs = response.map(requisicao => ({
              ...requisicao,
              idreq: requisicao.idrequisicao,
              dataFormatada: format(parseISO(requisicao.datareq), 'dd/MM/yyyy'),
              nomeSolicitante: requisicao.solicitante.username.toUpperCase(),
              nomeDestinatario:
                requisicao.destinatario !== null
                  ? requisicao.destinatario.username.toUpperCase()
                  : '',
              counter: (c += 1),
            }));
            setSolicitacoes(reqs);
            setCount(c);
            setLoading(false);
          }
        });
      }
      console.log('REQ: ', solicitacoes);
    }
    loadRequisicoes();
  }, [dispatch, count]);

  return (
    <Container>
      <NavBar />
      <ToolkitProvider
        keyField="idrequisicao"
        data={solicitacoes}
        columns={columns}
        exportCSV
      >
        {props => (
          <div>
            <Form.Row>
              <Form.Group as={Col} controlId="editArq">
                <Form.Label />
                <Button
                  variant="primary"
                  size="lg"
                  block
                  p="2"
                  onClick={() => {
                    dispatch(addRequisicaoRequest());
                    dispatch(requisicaoModalOpen());
                  }}
                >
                  Solicitar Compras
                </Button>
              </Form.Group>
              <Form.Group as={Col} controlId="editArq">
                <Form.Label />
                <ExportCSVButton {...props.csvProps} size="lg" block p="2">
                  Export CSV!!
                </ExportCSVButton>
              </Form.Group>
            </Form.Row>
            {loading ? (
              <>
                <SpinnerLine />
                <span className="sr-only">Loading...</span>
              </>
            ) : (
              <></>
            )}

            <BootstrapTable
              {...props.baseProps}
              bootstrap4
              hover
              table-responsive-sm
              // keyField="idrequisicao"
              // data={solicitacoes}
              caption={<CaptionElement />}
              // columns={columns}
              expandRow={expandRow}
              selectRow={selectRow}
              noDataIndication="Nenhum Registro Localizado!"
              headerClasses="header-class"
              pagination={paginationFactory()}
            />
          </div>
        )}
      </ToolkitProvider>
    </Container>
  );
}
