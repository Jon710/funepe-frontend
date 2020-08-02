// /* eslint-disable react/prop-types */
// /* eslint-disable no-return-assign */
// /* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//   Card,
//   Container,
//   Form,
//   Col,
//   Spinner,
//   Table,
//   Dropdown,
//   DropdownButton,
// } from 'react-bootstrap';
// import BootstrapTable from 'react-bootstrap-table-next';
// import paginationFactory from 'react-bootstrap-table2-paginator';
// import ToolkitProvider from 'react-bootstrap-table2-toolkit';
// import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
// import { parseISO, format } from 'date-fns';
// import {
//   selectAllItemOrcamento,
//   orcamentoSuccess,
// } from '../../redux/features/compras/orcamentoSlice';
// import NavBar from './NavBar';

// const CaptionElement = () => (
//   <h3
//     style={{
//       borderRadius: '0.25em',
//       textAlign: 'center',
//       color: 'blue',
//       border: '2px solid blue',
//       padding: '0.2em',
//     }}
//   >
//     Orçamentos
//   </h3>
// );

// const SpinnerLine = () => (
//   <>
//     <Spinner animation="grow" variant="primary" />
//     <Spinner animation="grow" variant="secondary" />
//     <Spinner animation="grow" variant="success" />
//     <Spinner animation="grow" variant="danger" />
//     <Spinner animation="grow" variant="warning" />
//     <Spinner animation="grow" variant="info" />
//     <Spinner animation="grow" variant="dark" />
//     <Spinner animation="grow" variant="light" />
//   </>
// );

export default function Orcamento() {
  //   const dispatch = useDispatch();
  //   const { orcamentosItem, orcamentos } = useSelector(state => state.orcamentos);
  //   const [loading, setLoading] = useState(true);
  //   const [observacao, setObservacao] = useState();

  //   useEffect(() => {
  //     const arrayFornecedores = [];

  //     async function loadFornecedores() {
  //       if (fornecedores.length > 0) {
  //         fornecedores.forEach(fornecedor => {
  //           arrayFornecedores.push({
  //             value: fornecedor.idfornecedor,
  //             label: fornecedor.nomefantasia,
  //           });
  //         });
  //       }
  //       setDescricaoFornecedor(arrayFornecedores);
  //     }

  //     let c = 0;
  //     function loadOrcamentos() {
  //       setLoading(true);
  //       if (user.idusuario !== 0) {
  //         dispatch(getFirstRenderContext());
  //         dispatch(getFirstRender(user)).then(response => {
  //           if (response.length > 0) {
  //             const reqs = response.map(req => ({
  //               ...req,
  //               idreq: req.idrequisicao,
  //               dataFormatada: format(parseISO(req.datareq), 'dd/MM/yyyy'),
  //               nomeSolicitante: req.solicitante.username.toUpperCase(),
  //               departamento: req.departamento.descricao.toUpperCase(),
  //               nomeDestinatario:
  //                 req.destinatario !== null
  //                   ? req.destinatario.username.toUpperCase()
  //                   : '',
  //               counter: (c += 1),
  //             }));
  //             setSolicitacoes(reqs);
  //             setCount(c);
  //             setLoading(false);
  //           }
  //         });
  //       }
  //     }
  //     loadOrcamentos();
  //     // loadFornecedores();
  //   }, [dispatch, count]);

  //   const columns = [
  //     {
  //       dataField: 'counter',
  //       text: '#',
  //       align: 'center',
  //       headerAlign: 'center',
  //     },
  //     {
  //       dataField: 'dataFormatada',
  //       text: 'Data',
  //       align: 'center',
  //       sort: true,
  //       headerAlign: 'center',
  //     },
  //     {
  //       dataField: 'departamento',
  //       text: 'Dpto',
  //       align: 'center',
  //       headerAlign: 'center',
  //     },
  //     {
  //       dataField: 'idreq',
  //       text: 'NrReq',
  //       align: 'center',
  //       headerAlign: 'center',
  //     },
  //     {
  //       dataField: 'finalidade',
  //       text: 'Finalidade',
  //       align: 'center',
  //       sort: true,
  //       headerAlign: 'center',
  //     },
  //     {
  //       dataField: 'nomeDestinatario',
  //       text: 'Usuário',
  //       align: 'center',
  //       headerAlign: 'center',
  //     },
  //     {
  //       dataField: 'status',
  //       text: 'Status',
  //       align: 'center',
  //       headerAlign: 'center',
  //     },
  //     {
  //       isDummyField: true,
  //       text: 'Menu',
  //       dataField: 'idrequisicao',
  //       formatter: () => {
  //         return (
  //           <DropdownButton drop="left" size="sm" title="Menu">
  //             <Dropdown.Item as="button">Comparar preços</Dropdown.Item>
  //           </DropdownButton>
  //         );
  //       },
  //     },
  //   ];

  //   const selectRow = {
  //     mode: 'checkbox',
  //     clickToSelect: true,
  //     clickToExpand: true,
  //     onSelect: rowIndex => {
  //       const orcs = { rowIndex };
  //       dispatch(selectAllItemOrcamento(rowIndex.idorcamento));
  //       setObservacao(rowIndex.observacao);
  //       dispatch(orcamentoSuccess(orcs));
  //     },
  //     headerColumnStyle: status => {
  //       if (status === 'checked') {
  //         return {
  //           backgroundColor: 'blue',
  //         };
  //       }
  //       if (status === 'indeterminate') {
  //         return {
  //           backgroundColor: 'red',
  //         };
  //       }
  //       if (status === 'unchecked') {
  //         return {
  //           backgroundColor: 'grey',
  //         };
  //       }
  //       return {};
  //     },
  //   };

  //   const expandRow = {
  //     showExpandColumn: true,
  //     onlyOneExpanding: true,
  //     renderer: () => (
  //       <div>
  //         {orcamentosItem.length > 0 ? (
  //           <Card>
  //             <Card.Body>
  //               <Card.Title>Produtos:</Card.Title>
  //               <Table
  //                 responsive="sm"
  //                 striped
  //                 bordered
  //                 hover
  //                 size="sm"
  //                 variant="success"
  //               >
  //                 <thead>
  //                   <tr>
  //                     <th>ID</th>
  //                     <th>Produto</th>
  //                     <th>Qtde</th>
  //                     <th>V.Unit</th>
  //                     <th>V.Tot</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {orcamentosItem.map(item => (
  //                     <tr key={item.iditemrequisicao}>
  //                       <td>{item.idproduto}</td>
  //                       <td>{item.produto.descricao}</td>
  //                       <td>{item.quantidade}</td>
  //                       <td>{item.vlrUnit}</td>
  //                       <td>{item.vlrTotal}</td>
  //                     </tr>
  //                   ))}
  //                 </tbody>
  //               </Table>
  //               {observacao ? (
  //                 <Form.Group as={Col}>
  //                   <Form.Label>Observação</Form.Label>
  //                   <Form.Control
  //                     as="textarea"
  //                     rows="3"
  //                     value={observacao}
  //                     readOnly
  //                   />
  //                 </Form.Group>
  //               ) : (
  //                 ''
  //               )}
  //             </Card.Body>
  //           </Card>
  //         ) : (
  //           <Card.Header>***Requisição não possui produtos!***</Card.Header>
  //           // ja vem com o produto no Orcamento. Nunca estará vazio
  //         )}
  //       </div>
  //     ),
  //   };

  return <div>FILTRAR ORÇAMENTO POR DATA E FORNECEDOR</div>;
  // (
  //     <Container>
  //       <NavBar />
  //       <ToolkitProvider
  //         keyField="idorcamento"
  //         data={orcamentos}
  //         columns={columns}
  //       >
  //         {props => (
  //           <div style={{ fontSize: 13 }}>
  //             {loading ? (
  //               <>
  //                 <SpinnerLine />
  //               </>
  //             ) : (
  //               <></>
  //             )}

  //             <BootstrapTable
  //               {...props.baseProps}
  //               bootstrap4
  //               hover
  //               table-responsive-sm
  //               caption={<CaptionElement />}
  //               expandRow={expandRow}
  //               selectRow={selectRow}
  //               noDataIndication="Nenhum Registro Localizado!"
  //               headerClasses="header-class"
  //               pagination={paginationFactory()}
  //             />
  //           </div>
  //         )}
  //       </ToolkitProvider>
  //     </Container>
  //   );
}
