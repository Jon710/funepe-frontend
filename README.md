# funepe-frontend

/* eslint-disable no-shadow */
/* eslint-disable no-return-assign */
import React, { useEffect } from 'react';
// import { storiesOf } from '@storybook/react';
import { useSelector, useDispatch } from 'react-redux';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Icon1 from '@material-ui/icons/ReplyAll';
import Icon2 from '@material-ui/icons/Markunread';
import Icon3 from '@material-ui/icons/CloudDownload';
import TextField from '@material-ui/core/TextField';
import DataTable from 'react-data-table-component';
import { addDays, parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { getFirstRender } from '../../../redux/features/protocolo/protocoloSlice';
// import data from '../constants/sampleMovieData';

const columns = [
  {
    name: '#',
    selector: 'counter',
    sortable: true,
  },
  {
    name: 'Data',
    selector: 'dataFormatada',
    sortable: true,
  },
  {
    name: 'Tipo',
    selector: 'documento.tipoDocumento.abreviacao',
    sortable: true,
  },
  {
    name: 'NrDoc',
    selector: 'documento.nrdocumento',
    sortable: true,
  },
  {
    name: 'Assunto',
    selector: 'documento.assunto',
    sortable: true,
  },
  {
    name: 'Expedidor',
    selector: 'documento.usuario.username',
    sortable: true,
  },
  {
    name: 'Destinatário',
    selector: 'usuario.username',
    sortable: true,
  },
  {
    name: 'Status',
    selector: 'status',
    sortable: true,
  },
  {
    cell: () => <button>Action</button>,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
];

export default function TableProtocolo() {
  const dispatch = useDispatch();
  const { usuario } = useSelector(state => state.usuario);
  // const { protocolo } = useSelector(state => state.protocolo);
  const [cxEntrada, setCxEntrada] = React.useState([]);
  // console.log('PROTOCOLOS: ', cxEntrada, protocolo);

  const [count, setCount] = React.useState(0);
  const [selectableRows, setSelectableRows] = React.useState(false);
  const [noSelectAll, setNoSelectAll] = React.useState(false);
  const [
    selectableRowsVisibleOnly,
    setSelectableRowsVisibleOnly,
  ] = React.useState(false);
  const [selectableRowsHighlight, setSelectableRowsHighlight] = React.useState(
    false
  );
  const [expandableRows, setExpandableRows] = React.useState(false);
  const [expandOnRowClick, setExpandOnRowClick] = React.useState(false);
  const [pagination, setPagination] = React.useState(true);
  const [highlight, setHighlight] = React.useState(false);
  const [striped, setStriped] = React.useState(false);
  const [pointer, setPointer] = React.useState(false);
  const [dense, setDense] = React.useState(false);
  const [persist, setPersist] = React.useState(false);
  const [tableHead, setNoHead] = React.useState(false);
  const [noContextMenu, setNoContextMenu] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [noHeader, setNoHeader] = React.useState(false);
  const [subHeader, setSubHeader] = React.useState(false);
  const [subHeaderAlign, setSubHeaderAlign] = React.useState('right');
  const [fixedHeader, setFixedheader] = React.useState(false);
  const [direction, setDirection] = React.useState(false);
  const [directionValue, setDirectionValue] = React.useState('auto');

  useEffect(() => {
    let c = 0;
    function loadDocumentos() {
      setLoading(true);
      if (usuario.idusuario !== 0) {
        dispatch(getFirstRender(usuario)).then(response => {
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
  }, [dispatch, usuario]);

  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={loading}
            onChange={() => setLoading(!loading)}
          />
        }
        label="Simulate Loading State"
      />
      <FormGroup row component="fieldset">
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={selectableRows}
              onChange={() => setSelectableRows(!selectableRows)}
            />
          }
          label="Selectable Rows"
        />
        {selectableRows && (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={noSelectAll}
                  onChange={() => setNoSelectAll(!noSelectAll)}
                />
              }
              label="Disable Select All Rows"
            />

            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={selectableRowsVisibleOnly}
                  onChange={() =>
                    setSelectableRowsVisibleOnly(!selectableRowsVisibleOnly)
                  }
                />
              }
              label="Allow Visible Rows Only"
            />

            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={selectableRowsHighlight}
                  onChange={() =>
                    setSelectableRowsHighlight(!selectableRowsHighlight)
                  }
                />
              }
              label="Highlight Selected Rows"
            />

            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={tableHead}
                  onChange={() => setNoHead(!tableHead)}
                />
              }
              label="No Table Head"
            />

            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={noContextMenu}
                  onChange={() => setNoContextMenu(!noContextMenu)}
                />
              }
              label="No Context Menu"
            />
          </>
        )}
      </FormGroup>

      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={expandableRows}
              onChange={() => setExpandableRows(!expandableRows)}
            />
          }
          label="Expandable Rows"
        />
        {expandableRows && (
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={expandOnRowClick}
                onChange={() => setExpandOnRowClick(!expandOnRowClick)}
              />
            }
            label="Expand on Row Click"
          />
        )}
      </FormGroup>

      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={pagination}
              onChange={() => setPagination(!pagination)}
            />
          }
          label="Pagination"
        />
      </FormGroup>

      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={highlight}
              onChange={() => setHighlight(!highlight)}
            />
          }
          label="Highlight on Hover"
        />
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={striped}
              onChange={() => setStriped(!striped)}
            />
          }
          label="Striped Rows"
        />
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={pointer}
              onChange={() => setPointer(!pointer)}
            />
          }
          label="Pointer on Hover"
        />
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={dense}
              onChange={() => setDense(!dense)}
            />
          }
          label="Dense"
        />
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={persist}
              onChange={() => setPersist(!persist)}
            />
          }
          label="Persist Table Head"
        />
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={tableHead}
              onChange={() => setNoHead(!tableHead)}
            />
          }
          label="No Table Head"
        />
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={noHeader}
              onChange={() => setNoHeader(!noHeader)}
            />
          }
          label="No Header"
        />
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={fixedHeader}
              onChange={() => setFixedheader(!fixedHeader)}
            />
          }
          label="Fixed Header"
        />
      </FormGroup>

      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={subHeader}
              onChange={() => setSubHeader(!subHeader)}
            />
          }
          label="Show Custom SubHeader"
        />
        {subHeader && (
          <>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="position"
                name="position"
                value={subHeaderAlign}
                onChange={e => setSubHeaderAlign(e.target.value)}
                row
              >
                <FormControlLabel
                  value="left"
                  control={<Radio color="primary" />}
                  label="Left"
                />
                <FormControlLabel
                  value="center"
                  control={<Radio color="primary" />}
                  label="Center"
                />
                <FormControlLabel
                  value="right"
                  control={<Radio color="primary" />}
                  label="Right"
                />
              </RadioGroup>
            </FormControl>
          </>
        )}
      </FormGroup>

      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={direction}
              onChange={() => setDirection(!direction)}
            />
          }
          label="Set Direction"
        />
        {direction && (
          <>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="position"
                name="position"
                value={directionValue}
                onChange={e => setDirectionValue(e.target.value)}
                row
              >
                <FormControlLabel
                  value="auto"
                  control={<Radio color="primary" />}
                  label="auto"
                />
                <FormControlLabel
                  value="rtl"
                  control={<Radio color="primary" />}
                  label="rtl"
                />
                <FormControlLabel
                  value="ltr"
                  control={<Radio color="primary" />}
                  label="ltr"
                />
              </RadioGroup>
            </FormControl>
          </>
        )}
      </FormGroup>

      <DataTable
        title="Caixa de Entrada"
        columns={columns}
        data={cxEntrada}
        defaultSortField="title"
        selectableRows={selectableRows}
        selectableRowsNoSelectAll={noSelectAll}
        selectableRowsHighlight={selectableRowsHighlight}
        selectableRowsVisibleOnly={selectableRowsVisibleOnly}
        expandableRows={expandableRows}
        expandOnRowClicked={expandOnRowClick}
        pagination={pagination}
        highlightOnHover={highlight}
        striped={striped}
        pointerOnHover={pointer}
        dense={dense}
        noTableHead={tableHead}
        persistTableHead={persist}
        progressPending={loading}
        noHeader={noHeader}
        subHeader={subHeader}
        subHeaderComponent={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              size="small"
              style={{ margin: '5px' }}
            />
            <Icon1 style={{ margin: '5px' }} color="action" />
            <Icon2 style={{ margin: '5px' }} color="action" />
            <Icon3 style={{ margin: '5px' }} color="action" />
          </div>
        }
        subHeaderAlign={subHeaderAlign}
        fixedHeader={fixedHeader}
        fixedHeaderScrollHeight="300px"
        direction={directionValue}
      />
    </div>
  );
}

// storiesOf('General', module).add('TableProtocolo', TableProtocolo);
