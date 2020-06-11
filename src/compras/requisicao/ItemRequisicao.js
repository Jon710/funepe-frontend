import React from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.css';
// import cellEditFactory from 'react-bootstrap-table2-editor';

const columns = [
  {
    dataField: 'iditemrequisicao',
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
    dataField: 'idproduto',
    text: 'ID',
    align: 'center',
    // sort: true,
    headerAlign: 'center',
  },
  {
    dataField: 'requisicao.produto.descricao',
    text: 'Descrição',
    align: 'center',
    // sort: true,
    headerAlign: 'center',
  },
  {
    dataField: 'documento.assunto',
    text: 'UN',
    align: 'center',
    // sort: true,
    headerAlign: 'center',
  },
  {
    dataField: 'nomeExpedidor',
    text: 'V.Unit',
    align: 'center',
    headerAlign: 'center',
  },
  {
    dataField: 'requisicao.quantidade',
    text: 'Qtde',
    align: 'center',
    headerAlign: 'center',
  },
  {
    dataField: 'nomeDestinatario',
    text: 'V.Total',
    align: 'center',
    headerAlign: 'center',
  },
  {
    isDummyField: true,
    text: 'Menu',
    dataField: 'iditemrequisicao',
    formatter: () => {
      return <div />;
    },
  },
];

const produtos = [];

const selectRow = {
  mode: 'checkbox',
  clickToSelect: true,
  clickToExpand: true,
  onSelect: rowIndex => {
    // const { documento } = rowIndex;
    // dispatch(addDocumentoSuccess({ documento }));
  },
  onExpand: () => {},
  // style: { backgroundColor: '#80ced6' },
  headerColumnStyle: status => {
    if (status === 'unchecked') {
      return {
        backgroundColor: 'grey',
      };
    }
    return {};
  },
};

// const expandRow = {
//   showExpandColumn: true,
//   onlyOneExpanding: true,
//   renderer: () =>
//     arquivos.length > 0 ? (
//       <Card>
//         <Card.Body>
//           <p>Arquivos Anexos:</p>
//           <ListGroup className="list-group-flush">
//             {arquivos.map(file => (
//               <ListGroupItem key={file.idarquivoanexo}>
//                 <Card.Link href={`${file.patharquivo}`}>
//                   <MdFileDownload /> {file.tipo} - {file.patharquivo}
//                 </Card.Link>
//               </ListGroupItem>
//             ))}
//           </ListGroup>
//         </Card.Body>
//       </Card>
//     ) : (
//       <Card.Header>***Documento não possui anexos!***</Card.Header>
//     ),
//   onExpand: row => {
//     console.log(row);
//   },
// };

export default function ItemRequisicao() {
  return (
    <div>
      <BootstrapTable
        keyField="id"
        data={produtos}
        columns={columns}
        // {...props.baseProps}
        bootstrap4
        hover
        table-responsive-sm
        // expandRow={expandRow}
        selectRow={selectRow}
        // rowEvents={rowEvents}
        noDataIndication="Nenhum Registro Localizado!"
        headerClasses="header-class"
        // pagination={paginationFactory()}
      />
    </div>
  );
}
