import React from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.css';

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

export default function RequisicaoItem() {
  return (
    <div>
      <BootstrapTable
        keyField="id"
        data={produtos}
        columns={columns}
        bootstrap4
        hover
        table-responsive-sm
        selectRow={selectRow}
        noDataIndication="Nenhum Registro Localizado!"
        headerClasses="header-class"
      />
    </div>
  );
}
