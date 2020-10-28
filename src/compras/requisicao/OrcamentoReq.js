/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  Container,
  Spinner,
  Table,
  Modal,
  Button,
  Dropdown,
  DropdownButton,
  Form,
  Col,
  Row,
} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import AlertError from '../../pages/alerts/AlertError';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import {
  orcamentoSuccess,
  selectAllOrcamentos,
  getItensOrcamento,
  selectAllItemOrcamento,
} from '../../redux/features/compras/orcamentoSlice';
import {
  modalClose,
  showAlertErrorOpen,
} from '../../redux/features/context/contextSlice';
import NavBar from './NavBar';
import api from '../../services/api';
import { formatPrice } from '../../services/formatPrice';

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

export default function OrcamentoReq() {
  const dispatch = useDispatch();
  const { orcamentos, orcamentosItem } = useSelector(state => state.orcamentos);
  const { showAlertError } = useSelector(state => state.contexto);
  const { requisicao } = useSelector(state => state.compras);
  const [loading, setLoading] = useState(true);
  const [valorunitario, setValorUnitario] = useState();
  const [show, setShow] = useState(false);
  const [somaItens, setSomaItens] = useState('');
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
      Orçamentos da Requisição N.º {requisicao.idrequisicao}
    </h3>
  );

  useEffect(() => {
    function loadOrcamentos() {
      setLoading(true);
      dispatch(selectAllOrcamentos(requisicao.idrequisicao));
      setLoading(false);
    }
    loadOrcamentos();
  }, [dispatch, requisicao.idrequisicao]);

  let somaTotal = 0;
  function somar(item) {
    somaTotal = item.valorunitario * item.quantidade + somaTotal;
  }

  useEffect(() => {
    orcamentosItem.forEach(somar);
    setSomaItens(somaTotal);
  });

  const handleClose = () => {
    dispatch(modalClose());
    setShow(false);
  };

  const handleShow = () => setShow(true);

  async function handleSalvarProduto(item) {
    const saveProduto = {
      valorunitario,
    };

    await api
      .put(
        `orcamento/${item.idorcamento}/itemorcamento/${item.iditemorcamento}`,
        saveProduto
      )
      .then(() => {
        toast.success('Produto atualizado!');
        dispatch(selectAllItemOrcamento(item.idorcamento));
      })
      .catch(error => {
        dispatch(
          showAlertErrorOpen({
            showAlertError: true,
            alertError: `${error.response.data.error}`,
          })
        );
      });
  }

  function print() {
    window.print();
  }

  const columns = [
    {
      dataField: 'idorcamento',
      text: 'ID',
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
      dataField: 'nomeFornecedor',
      text: 'Fornecedor',
      align: 'center',
      sort: true,
      headerAlign: 'center',
    },
    {
      dataField: 'nomeSolicitante',
      text: 'Usuário',
      align: 'center',
      headerAlign: 'center',
    },
    {
      isDummyField: true,
      text: 'Menu',
      dataField: 'idrequisicao',
      formatter: () => {
        return (
          <>
            <Row>
              <Col>
                <DropdownButton drop="left" size="sm" title="Opções">
                  <Dropdown.Item as="button" onClick={handleShow}>
                    Alterar preços
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    onClick={() => {
                      dispatch(getItensOrcamento(requisicao.idrequisicao));
                    }}
                  >
                    <Link to="/menorpreco">Obter preços</Link>
                  </Dropdown.Item>
                </DropdownButton>
              </Col>
              <Col>
                <Button
                  as="button"
                  variant="success"
                  size="sm"
                  onClick={() => print()}
                >
                  Imprimir
                </Button>
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    clickToExpand: true,
    onSelect: rowIndex => {
      const orcs = { rowIndex };
      dispatch(getItensOrcamento(requisicao.idrequisicao));
      dispatch(selectAllItemOrcamento(rowIndex.idorcamento));
      dispatch(orcamentoSuccess(orcs));
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
        {orcamentosItem.length > 0 ? (
          <Card>
            <Card.Body>
              <Card.Title>Produtos:</Card.Title>
              <Table
                responsive="sm"
                striped
                bordered
                size="sm"
                variant="success"
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Produto</th>
                    <th>Qtde</th>
                    <th>V.Unit</th>
                    <th>V.Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orcamentosItem.map(item => (
                    <tr key={item.iditemorcamento}>
                      <td>{item.idproduto}</td>
                      <td>{item.produto.descricao}</td>
                      <td>{item.quantidade}</td>
                      <td>{item.vlrUnit}</td>
                      <td>{item.vlrTotal}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td style={{ textAlign: 'right' }} colSpan="4">
                      SOMA
                    </td>
                    <td style={{ textAlign: 'left' }} colSpan="1">
                      {formatPrice(somaItens)}
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </Card.Body>
          </Card>
        ) : (
          ''
        )}
      </div>
    ),
  };

  return (
    <Container>
      <NavBar />
      <ToolkitProvider
        keyField="idorcamento"
        data={orcamentos}
        columns={columns}
      >
        {props => (
          <div style={{ fontSize: 13 }}>
            {loading ? (
              <>
                <SpinnerLine />
              </>
            ) : (
              <></>
            )}

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

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Alterar Preço</Modal.Title>
        </Modal.Header>
        {showAlertError ? <AlertError /> : null}
        <Modal.Body align="center">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Fornecedor</th>
                <th>Preço</th>
                <th>Alterar</th>
              </tr>
            </thead>
            <tbody>
              {orcamentosItem.map(item => (
                <tr key={item.idorcamento}>
                  <td>{item.idproduto}</td>
                  <td>{item.produto.descricao}</td>
                  <td>{item.quantidade}</td>
                  <td>{item.orcamento.fornecedor.nomefantasia}</td>
                  <td>{item.vlrUnit}</td>
                  <td>
                    <Form.Group as={Col}>
                      <Form.Control
                        onBlur={() => handleSalvarProduto(item)}
                        type="number"
                        style={{ width: 100 }}
                        onChange={e => setValorUnitario(e.target.value)}
                      />
                    </Form.Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
