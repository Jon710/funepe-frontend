import React from 'react';
import { useSelector } from 'react-redux';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.css';

// datauso: "2020-06-25T03:00:00.000Z"
// desconto: 0
// iditemrequisicao: 16
// idproduto: 1
// idrequisicao: 31
// indicacaouso: null
// prioridade: 1
// produto: {idproduto: 1, idunidade: 1, idmarca: 1, descricao: "Mesa de Madeira", inativar: 2, …}
// quantidade: 2
// requisicao: {idrequisicao: 31, iddepartamento: 1, idsolicitante: 12, datareq: "2020-06-25T03:00:00.000Z", horareq: null, …}
// unidade: "1"
// valortotal: 300
// valorunitario: 150

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
    dataField: 'produto.descricao',
    text: 'Descrição',
    align: 'center',
    // sort: true,
    headerAlign: 'center',
  },
  {
    dataField: 'unidade',
    text: 'UN',
    align: 'center',
    // sort: true,
    headerAlign: 'center',
  },
  {
    dataField: 'valorunitario',
    text: 'V.Unit',
    align: 'center',
    headerAlign: 'center',
  },
  {
    dataField: 'quantidade',
    text: 'Qtde',
    align: 'center',
    headerAlign: 'center',
  },
  {
    dataField: 'valortotal',
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
  const { requisicoesItem } = useSelector(state => state.compras);
  console.log('requisicoesItem: ', requisicoesItem);
  return (
    <div>
      <BootstrapTable
        keyField="id"
        data={requisicoesItem}
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
