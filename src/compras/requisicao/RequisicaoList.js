/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
/* eslint-disable no-return-assign */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  ListGroupItem,
  ListGroup,
  Row,
  Accordion,
  Modal,
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { parseISO, format } from 'date-fns';
import Select from 'react-select';
import { MdFileDownload } from 'react-icons/md';
import { toast } from 'react-toastify';
import AlertError from '../../pages/alerts/AlertError';
import {
  selectAllItemRequisicao,
  addRequisicaoRequest,
  addRequisicaoSuccess,
  getUploadedFiles,
  requisicaoSuccess,
} from '../../redux/features/compras/comprasSlice';
import {
  requisicaoModalOpen,
  editRequisicaoModalOpen,
  despachaRequisicaoModalOpen,
  visualizaRequisicaoModalOpen,
  visualizaHistoricoModalOpen,
  getFirstRenderContext,
  modalClose,
  modalOpen,
  showAlertErrorOpen,
} from '../../redux/features/context/contextSlice';
import {
  inserirOrcamento,
  inserirItemOrcamento,
  getItensOrcamento,
} from '../../redux/features/compras/orcamentoSlice';
import NavBar from './NavBar';
import Despacho from './Despacho';
import Historico from './Historico';
import VisualizarPDF from './VisualizarPDF';
import api from '../../services/api';

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
  const {
    requisicoesItem,
    arquivos,
    fornecedores,
    requisicao,
    requisicoes,
  } = useSelector(state => state.compras);
  const { orcamentoModal, showAlertError } = useSelector(
    state => state.contexto
  );
  const {
    despachaRequisicaoModal,
    visualizaHistoricoModal,
    visualizaRequisicaoModal,
    updatedRequisicao,
    requisicaoDespachada,
  } = useSelector(state => state.contexto);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [observacao, setObservacao] = useState();
  const [arraySelectedFornecedores, setArraySelectedFornecedores] = useState(
    []
  );
  const [descricaoFornecedor, setDescricaoFornecedor] = useState('');
  const [data, setData] = useState(new Date());

  useEffect(() => {
    const arrayFornecedores = [];

    async function loadFornecedores() {
      if (fornecedores.length > 0) {
        fornecedores.forEach(fornecedor => {
          arrayFornecedores.push({
            value: fornecedor.idfornecedor,
            label: fornecedor.nomefantasia,
          });
        });
      }
      setDescricaoFornecedor(arrayFornecedores);
    }

    async function loadRequisicoes() {
      setLoading(true);
      if (user.idusuario !== 0) {
        // eslint-disable-next-line no-use-before-define
        getReqByDate(new Date());
        setLoading(false);
      }
    }
    loadRequisicoes();
    loadFornecedores();
  }, [dispatch, count, updatedRequisicao, requisicaoDespachada]);

  const visualizarHistorico = () => dispatch(visualizaHistoricoModalOpen());
  const visualizarRequisicao = () => dispatch(visualizaRequisicaoModalOpen());
  const despachaRequisicao = () => dispatch(despachaRequisicaoModalOpen());
  const gerarOrcamento = () => dispatch(modalOpen());
  const handleClose = () => dispatch(modalClose());
  const editRequisicao = () => dispatch(editRequisicaoModalOpen());
  const visualizarOrcamento = () =>
    dispatch(getItensOrcamento(requisicao.idrequisicao));

  function onChangeFornecedor(selectedOption) {
    setArraySelectedFornecedores(selectedOption);
  }

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
      dataField: 'idrequisicao',
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
      dataField: 'solicitante.username',
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
      dataField: 'idreq',
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
            <Dropdown.Item as="button" onClick={e => gerarOrcamento(e)}>
              Gerar Orçamento
            </Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => editRequisicao()}>
              Editar
            </Dropdown.Item>
            <hr />
            <Dropdown.Item as="button" onClick={e => visualizarOrcamento(e)}>
              <Link to="/orcamentoreq">Visualizar Orçamentos</Link>
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
    renderer: () => (
      <div>
        {requisicoesItem.length > 0 ? (
          <Card>
            <Card.Body>
              <Card.Title>Produtos/Serviços:</Card.Title>
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
                    <th>Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {requisicoesItem.map(item => (
                    <tr key={item.iditemrequisicao}>
                      <td>{item.idproduto}</td>
                      <td>{item.produto.descricao}</td>
                      <td>{item.quantidade}</td>
                      <td>{item.observacao}</td>
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
        )}

        {arquivos.length > 0 ? (
          <Card>
            <Card.Body>
              <p>Arquivos Anexos:</p>
              <ListGroup>
                {arquivos.map(file => (
                  <ListGroupItem key={file.idarquivoanexo}>
                    <Card.Link href={`${file.patharquivo}`}>
                      <MdFileDownload /> {file.tipo} - {file.patharquivo}
                    </Card.Link>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        ) : (
          <Card.Header>***Requisição não possui anexo!***</Card.Header>
        )}
      </div>
    ),
    onExpand: row => {
      dispatch(getUploadedFiles(row.idrequisicao));
    },
  };

  function handleEnviarEmail() {
    arraySelectedFornecedores.map(async fornecedor => {
      const newOrcamento = {
        idfornecedor: fornecedor.value,
        idrequisicao: requisicao.idrequisicao,
        idsolicitante: requisicao.idsolicitante,
        dataorcamento: new Date(),
      };

      const forn = {
        idfornecedor: fornecedor.value,
      };

      await api
        .post('sendmail', forn)
        .then(() => {
          toast.success('E-mail enviado para o fornecedor!');
          dispatch(inserirOrcamento({ newOrcamento }));
          dispatch(inserirItemOrcamento());
        })
        .catch(error => {
          dispatch(
            showAlertErrorOpen({
              showAlertError: true,
              alertError: `${error.response.data.error} Deseja gerar orçamento assim mesmo?`,
            })
          );
        });
    });
  }

  function handleGerarOrcamento() {
    arraySelectedFornecedores.map(async fornecedor => {
      const newOrcamento = {
        idfornecedor: fornecedor.value,
        idrequisicao: requisicao.idrequisicao,
        idsolicitante: requisicao.idsolicitante,
        dataorcamento: new Date(),
      };

      dispatch(inserirOrcamento({ newOrcamento }));
      dispatch(inserirItemOrcamento());
    });
  }

  async function getReqByDate(date) {
    try {
      let c = 0;

      setData(date);

      const dataFormatada = format(date, 'yyyy-MM-dd');
      const response = await api.get(`requisicao?datareq=${dataFormatada}`);

      const { listaRequisicoes } = response.data;

      let lista;
      if (listaRequisicoes.length > 0) {
        lista = listaRequisicoes.map(req => ({
          ...req,
          dataFormatada: format(parseISO(req.datareq), 'dd/MM/yyyy'),
          counter: (c += 1),
        }));
        setCount(c);
      }

      Object.assign(listaRequisicoes, lista);

      dispatch(requisicaoSuccess({ listaRequisicoes }));
    } catch (error) {
      toast.error('Erro na busca!');
    }
  }

  return (
    <Container>
      <NavBar />
      <br />
      <CaptionElement />
      <ToolkitProvider
        keyField="idrequisicao"
        data={requisicoes}
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
              <Form.Group as={Col}>
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

            <Accordion>
              <Card className="text-center">
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Buscar por data
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <>
                    <DatePicker
                      inline
                      selected={data}
                      onChange={date => getReqByDate(date)}
                      className="form-control"
                      dateFormat="dd/MM/yyyy"
                    />
                  </>
                </Accordion.Collapse>
              </Card>
            </Accordion>

            <br />

            <BootstrapTable
              {...props.baseProps}
              bootstrap4
              hover
              table-responsive-sm
              expandRow={expandRow}
              selectRow={selectRow}
              noDataIndication="Nenhum registro nesse dia!"
              headerClasses="header-class"
              pagination={paginationFactory()}
            />
          </div>
        )}
      </ToolkitProvider>

      <Modal size="lg" show={orcamentoModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Gerar orçamento</Modal.Title>
        </Modal.Header>
        {showAlertError ? (
          <Card>
            <Card.Header>
              <AlertError />
              <Button block onClick={handleGerarOrcamento}>
                SIM
              </Button>
            </Card.Header>
          </Card>
        ) : null}

        <Modal.Body>
          <Form.Group as={Row}>
            <Col>
              <Form.Label sm="2">Selecionar fornecedor</Form.Label>
            </Col>
            <Col sm="10">
              <Select
                isSearchable
                isMulti
                options={descricaoFornecedor}
                onChange={selectedOption => onChangeFornecedor(selectedOption)}
                placeholder=""
              >
                {fornecedores.length > 0
                  ? fornecedores.map(forn => (
                      <option key={forn.idfornecedor} value={forn.nomefantasia}>
                        {forn.nomefantasia}
                      </option>
                    ))
                  : 'Nenhum fornecedor cadastrado.'}
              </Select>
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => handleEnviarEmail()}>
            Gerar
          </Button>
          <Button as={Link} className="Link" to="/formfornecedor">
            Fornecedor não existe?
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
