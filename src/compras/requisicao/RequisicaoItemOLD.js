import React from 'react';
import { useSelector } from 'react-redux';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.css';

let setItemRequisicao = null;

const removeProduto = item => () => {
  console.log('setItemRequisicao: ', setItemRequisicao);
  // const newFiles = [...arquivos];
  // newFiles.splice(newFiles.indexOf(file), 1);
  // setArquivos(newFiles);
};

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
      return <DeleteForeverSharpIcon onClick={removeProduto()} />;
    },
  },
];

const selectRow = {
  mode: 'checkbox',
  clickToSelect: true,
  clickToExpand: true,
  onSelect: rowIndex => {
    setItemRequisicao = rowIndex;
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
        keyField="iditemrequisicao"
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
