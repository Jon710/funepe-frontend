/* eslint-disable react/prop-types */
/* eslint-disable no-return-assign */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Card,
  Container,
  Form,
  Col,
  Spinner,
  Table,
  Dropdown,
  DropdownButton,
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
  addRequisicaoSuccess,
} from '../../redux/features/compras/comprasSlice';
import {
  requisicaoModalOpen,
  editRequisicaoModalOpen,
  deleteRequisicaoModalOpen,
  despachaRequisicaoModalOpen,
  visualizaRequisicaoModalOpen,
  visualizaHistoricoModalOpen,
  getFirstRenderContext,
} from '../../redux/features/context/contextSlice';
import NavBar from './NavBar';
import Despacho from './Despacho';
import Historico from './Historico';
import VisualizarPDF from './VisualizarPDF';

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
  const {
    despachaRequisicaoModal,
    visualizaHistoricoModal,
    visualizaRequisicaoModal,
    updatedRequisicao,
    requisicaoDespachada,
  } = useSelector(state => state.contexto);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [observacao, setObservacao] = useState();

  useEffect(() => {
    let c = 0;
    function loadRequisicoes() {
      setLoading(true);
      if (user.idusuario !== 0) {
        dispatch(getFirstRenderContext());
        dispatch(getFirstRender(user)).then(response => {
          if (response.length > 0) {
            const reqs = response.map(req => ({
              ...req,
              idreq: req.idrequisicao,
              dataFormatada: format(parseISO(req.datareq), 'dd/MM/yyyy'),
              nomeSolicitante: req.solicitante.username.toUpperCase(),
              departamento: req.departamento.descricao.toUpperCase(),
              nomeDestinatario:
                req.destinatario !== null
                  ? req.destinatario.username.toUpperCase()
                  : '',
              counter: (c += 1),
            }));
            setSolicitacoes(reqs);
            setCount(c);
            setLoading(false);
          }
        });
      }
    }
    loadRequisicoes();
  }, [dispatch, count, updatedRequisicao, requisicaoDespachada]);

  async function editRequisicao() {
    dispatch(editRequisicaoModalOpen());
  }

  async function deleteRequisicao() {
    dispatch(deleteRequisicaoModalOpen());
  }

  async function despachaRequisicao() {
    dispatch(despachaRequisicaoModalOpen());
  }

  async function visualizarHistorico() {
    dispatch(visualizaHistoricoModalOpen());
  }

  async function visualizarRequisicao(e) {
    e.preventDefault();
    dispatch(visualizaRequisicaoModalOpen());
  }

  async function handleAlterarStatus() {}

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
      dataField: 'departamento',
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
      dataField: 'nomeDestinatario',
      text: 'Usuário',
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
        return (
          <DropdownButton drop="left" size="sm" title="Menu">
            <Dropdown.Item as="button" onClick={e => visualizarRequisicao(e)}>
              Visualizar Requisição
            </Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => despachaRequisicao()}>
              Despachar Requisição
            </Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => visualizarHistorico()}>
              Visualizar Histórico
            </Dropdown.Item>
            <Dropdown.Item as="button" onClick={handleAlterarStatus}>
              Alterar Status
            </Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => deleteRequisicao()}>
              Excluir
            </Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => editRequisicao()}>
              Editar
            </Dropdown.Item>
          </DropdownButton>
        );
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
      const req = { rowIndex };
      dispatch(selectAllItemRequisicao(rowIndex.idrequisicao));
      setObservacao(rowIndex.observacao);
      dispatch(addRequisicaoSuccess(req));
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
                  <tr key={item.iditemrequisicao}>
                    <td>{item.idproduto}</td>
                    <td>{item.produto.descricao}</td>
                    <td>{item.quantidade}</td>
                    <td>{item.vlrUnit}</td>
                    <td>{item.vlrTotal}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {observacao ? (
              <Form.Group as={Col}>
                <Form.Label>Observação</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  value={observacao}
                  readOnly
                />
              </Form.Group>
            ) : (
              ''
            )}
          </Card.Body>
        </Card>
      ) : (
        <Card.Header>***Requisição não possui produtos!***</Card.Header>
      ),
  };

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
          <div style={{ fontSize: 13 }}>
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
                  Export CSV!
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

            {despachaRequisicaoModal ? <Despacho /> : null}
            {visualizaHistoricoModal ? <Historico /> : null}
            {visualizaRequisicaoModal ? <VisualizarPDF /> : null}

            <BootstrapTable
              {...props.baseProps}
              bootstrap4
              hover
              table-responsive-sm
              caption={<CaptionElement />}
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
