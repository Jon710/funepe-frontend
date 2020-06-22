/* eslint-disable react/prop-types */
import React from 'react';
// import styled from 'styled-components';
import { useTable, useBlockLayout, useRowSelect } from 'react-table';
import BTable from 'react-bootstrap/Table';
import { Container } from 'react-bootstrap';

const sourceGridData = [];

// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  // updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = e => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  // const onBlur = () => {
  //   updateMyData(index, id, value);
  // };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <input value={value} onChange={onChange} />;
};

// Set our editable cell renderer as the default Cell renderer
// const defaultColumn = {
//   Cell: EditableCell,
// };

function Table({ columns, data, skipPageReset }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    toggleAllRowsSelected,
    prepareRow,
    state,
  } = useTable(
    {
      autoResetSelectedRows: false,
      columns,
      data,
      skipPageReset,
    },
    useBlockLayout,
    useRowSelect
  );

  // Render the UI for your table
  return (
    <Container>
      <BTable striped bordered hover size="sm" {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {rows.slice(0, 10).map(row => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps({
                  style: {
                    backgroundColor: row.isSelected ? 'blue' : '',
                  },
                  onClick: e => {
                    toggleAllRowsSelected(false);
                    row.toggleRowSelected();
                  },
                })}
              >
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </BTable>
      <pre>
        <code>{JSON.stringify(state, null, 2)}</code>
      </pre>
    </Container>
  );
}

export default function Orcamento() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'age',
        accessor: 'age',
      },
      {
        Header: 'gender',
        accessor: 'gender',
      },
      {
        Header: 'height',
        accessor: 'height',
      },
      {
        Header: 'color',
        accessor: 'col',
      },
      {
        Header: 'dob',
        accessor: 'dob',
      },
    ],
    []
  );

  const [data, setData] = React.useState([]);
  const [originalData] = React.useState(data);
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  // const updateMyData = (rowIndex, columnId, value) => {
  //   // We also turn on the flag to not reset the page
  //   setSkipPageReset(true);
  //   setData(old =>
  //     old.map((row, index) => {
  //       if (index === rowIndex) {
  //         return {
  //           ...old[rowIndex],
  //           [columnId]: value,
  //         };
  //       }
  //       return row;
  //     })
  //   );
  // };

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    setSkipPageReset(false);
    sourceGridData.push(makeRow(sourceGridData.length));
    const newData = [...sourceGridData];

    setData(newData);
  }, []);

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const resetData = () => setData(originalData);

  return (
    <>
      <button type="button" onClick={resetData}>
        Reset Data
      </button>
      <Table
        columns={columns}
        data={data}
        // updateMyData={updateMyData}
        skipPageReset={skipPageReset}
      />
    </>
  );
}

function makeRow(id) {
  const r = Math.floor(Math.random() * 3) + 1;
  if (r === 0) {
    return {
      Id: id,
      name: 'Billy Bob',
      age: 12,
      gender: 'male',
      height: 95,
      col: 'red',
      dob: '14/05/2010',
    };
  }
  if (r === 1) {
    return {
      Id: id,
      name: 'Jenny Jane',
      age: 42,
      gender: 'female',
      height: 142,
      col: 'blue',
      dob: '30/07/1954',
    };
  }
  if (r === 2) {
    return {
      Id: id,
      name: 'Steve McAlistaire',
      age: 35,
      gender: 'male',
      height: 176,
      col: 'green',
      dob: '04/11/1982',
    };
  }
  if (r === 3) {
    return {
      Id: id,
      name: 'Jeff Joe',
      age: 35,
      gender: 'male',
      height: 176,
      col: 'green',
      dob: '04/11/1982',
    };
  }
}
