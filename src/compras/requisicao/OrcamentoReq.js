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
} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import PriceTable from './PriceTable';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import {
  orcamentoSuccess,
  selectAllOrcamentos,
  getItensOrcamento,
} from '../../redux/features/compras/orcamentoSlice';
import {
  modalOpen,
  modalClose,
} from '../../redux/features/context/contextSlice';
import NavBar from './NavBar';

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
  const { orcamentosItem, orcamentos } = useSelector(state => state.orcamentos);
  const { orcamentoPrecosModal } = useSelector(state => state.contexto);
  const { requisicao } = useSelector(state => state.compras);
  const [loading, setLoading] = useState(true);
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
    //   // const arrayFornecedores = [];

    //   // async function loadFornecedores() {
    //   //   if (fornecedores.length > 0) {
    //   //     fornecedores.forEach(fornecedor => {
    //   //       arrayFornecedores.push({
    //   //         value: fornecedor.idfornecedor,
    //   //         label: fornecedor.nomefantasia,
    //   //       });
    //   //     });
    //   //   }
    //   //   setDescricaoFornecedor(arrayFornecedores);
    //   // }

    function loadOrcamentos() {
      setLoading(true);
      dispatch(selectAllOrcamentos(requisicao.idrequisicao));
      setLoading(false);
    }
    loadOrcamentos();
    // loadFornecedores();
  }, [dispatch, requisicao.idrequisicao]);

  function handleCompararPrecos() {
    dispatch(modalOpen());
  }

  const handleClose = () => dispatch(modalClose());

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
        return <Button onClick={handleCompararPrecos}>Obter preços</Button>;
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

      <Modal size="lg" show={orcamentoPrecosModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Menor Preço</Modal.Title>
        </Modal.Header>
        <Modal.Body align="center">
          <PriceTable />
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