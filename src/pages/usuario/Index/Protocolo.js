/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-return-assign */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Card,
  Container,
  Form,
  Col,
  Spinner,
  ListGroupItem,
  ListGroup,
  Modal,
} from 'react-bootstrap';
import { MdSupervisorAccount, MdFileDownload } from 'react-icons/md';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { addDays, parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import {
  getFirstRender,
  getUploadedFiles,
  addDocumentoSuccess,
} from '../../../redux/features/protocolo/protocoloSlice';
import {
  modalOpen,
  despachoModalOpen,
} from '../../../redux/features/context/contextSlice';

import Documento from '../Modal/Documento';
import Despachos from '../Modal/Despachos';
import Despacho from '../Modal/Despacho';

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
    Caixa de Entrada
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

export default function Protocolo() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  // console.log(user);
  const { arquivos } = useSelector(state => state.protocolo);
  const { showModal, uploadPercentage, despachoModal } = useSelector(
    state => state.contexto
  );
  const [cxEntrada, setCxEntrada] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const columns = [
    {
      dataField: 'idcaixaentrada',
      text: '#',
      align: 'center',
      hidden: true,
    },
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
      dataField: 'documento.tipoDocumento.abreviacao',
      text: 'Tipo',
      align: 'center',
      headerAlign: 'center',
    },
    {
      dataField: 'documento.nrdocumento',
      text: 'NrDoc',
      align: 'center',
      headerAlign: 'center',
    },
    {
      dataField: 'documento.assunto',
      text: 'Assunto',
      align: 'center',
      sort: true,
      headerAlign: 'center',
    },
    {
      dataField: 'documento.usuario.username',
      text: 'Exped',
      align: 'center',
      headerAlign: 'center',
    },
    {
      dataField: 'usuario.username',
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
      dataField: 'idcaixaentrada',
      formatter: (rowContent, row, rowIndex) => {
        return (
          <div>
            <Despachos />
          </div>
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
        <Button
          className="btn btn-success"
          size="lg"
          block
          p="2"
          onClick={handleClick}
        >
          Exportar CSV
        </Button>
      </div>
    );
  };

  const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    clickToExpand: true,
    onSelect: (row, isSelect, rowIndex, e) => {
      // console.log('cxEntrada.onSelect', cxEntrada[rowIndex]);
      const documentoEdit = Object.assign(
        {},
        cxEntrada[rowIndex],
        cxEntrada[rowIndex].documento
      );
      dispatch(addDocumentoSuccess({ documentoEdit }));
    },
    onExpand: (row, isExpand, rowIndex, e) => {
      // console.log(row.id);
      // console.log(isExpand);
      // console.log(rowIndex);
      // console.log(e);
    },
    // style: { backgroundColor: '#80ced6' },
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
    // parentClassName: 'parent-expand-foo',
    renderer: row =>
      arquivos.length > 0 ? (
        <Card>
          <Card.Body>
            <p>Arquivos Anexos:</p>
            <ListGroup className="list-group-flush">
              {arquivos.map(file => (
                <ListGroupItem key={file.idarquivoanexo}>
                  <Card.Link
                    href={`http://10.0.0.24:3333/anexo/${file.patharquivo}`}
                  >
                    <MdFileDownload /> {file.tipo} - {file.patharquivo}
                  </Card.Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      ) : (
        <Card.Header>***Documento não possui anexos!***</Card.Header>
      ),
    onExpand: (row, isExpand, rowIndex, e) => {
      dispatch(getUploadedFiles(row.iddocumento));
    },
    // expandHeaderColumnRenderer:
  };

  useEffect(() => {
    let c = 0;
    function loadDocumentos() {
      setLoading(true);
      if (user.idusuario !== 0) {
        dispatch(getFirstRender(user)).then(response => {
          if (response.length > 0) {
            const protocolos = response.map(protocolo => ({
              ...protocolo,
              dataFormatada: format(
                addDays(parseISO(protocolo.dataenvio), 1),
                'dd/MM/yyyy',
                { locale: pt }
              ),

              counter: (c += 1),
            }));
            setCxEntrada(protocolos);
            setCount(c);
            setLoading(false);
          }
        });
      }
    }
    loadDocumentos();
  }, [count]);

  return (
    <Container>
      <ToolkitProvider
        keyField="id"
        data={cxEntrada}
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
                  onClick={() => dispatch(modalOpen())}
                >
                  Protocolar Documento
                </Button>
                {showModal ? (
                  <>
                    <Documento show={showModal} idDoc="idDocumento" />
                  </>
                ) : (
                  <></>
                )}
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

            {despachoModal ? (
              <>
                <Despacho />
              </>
            ) : (
              <></>
            )}

            <BootstrapTable
              {...props.baseProps}
              bootstrap4
              // striped
              // bordered
              hover
              responsive
              size="sm"
              keyField="idcaixaentrada"
              data={cxEntrada}
              caption={<CaptionElement />}
              columns={columns}
              // rowStyle={rowStyle}
              expandRow={expandRow}
              selectRow={selectRow}
              // rowEvents={rowEvents}
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
