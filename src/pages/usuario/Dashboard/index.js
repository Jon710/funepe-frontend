/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { MdSupervisorAccount } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
// import { subHours, addDays, parseISO, format } from 'date-fns';
// import pt from 'date-fns/locale/pt';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';

import {
  Modal,
  Button,
  DropdownButton,
  Dropdown,
  Table,
  Container,
  Spinner,
} from 'react-bootstrap';

import history from '~/services/history';
import api from '~/services/api';
import FormEditAgenda from '~/pages/usuario/Index/FormEditAgenda';
import { getFirstRender } from '~/redux/features/protocolo/protocoloSlide';

function Popup(props) {
  const { documento } = props;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function alteraStatusAgenda(situacao) {
    documento.SITUACAO = situacao;
    console.log('Agenda STATUS', documento.CODAGENDA, situacao);
    if (documento) {
      api
        .put('/agenda/situacao', documento)
        .then((result) => {
          console.log('success', result);
          history.push('/home');
        })
        .catch((err) => {
          console.log('ERRO: ', err);
          toast.error(err.response.data.error);
        });
    } else {
      toast.warn('Documento não identificado!');
    }
  }

  return (
    <>
      <DropdownButton
        drop="left"
        size="sm"
        id="dropdown-item-button"
        title="Menu"
      >
        <Dropdown.Item
          as="button"
          onClick={() => alteraStatusAgenda('Reservada')}
        >
          Agenda Reservada
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => alteraStatusAgenda('Cancelado')}
        >
          Agenda Cancelada
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => alteraStatusAgenda('Fechada')}
        >
          Agenda Fechada
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => alteraStatusAgenda('Feriado')}
        >
          Agenda Feriado
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => alteraStatusAgenda('Marcada')}
        >
          Agenda Marcada
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={() => alteraStatusAgenda('Aberta')}>
          Agenda Aberta
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item
          as="button"
          onClick={() => alteraStatusAgenda('Em atendimento')}
        >
          Paciente Em Atendimento
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => alteraStatusAgenda('Atendido')}
        >
          Paciente Atendido
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={() => alteraStatusAgenda('Faltou')}>
          Paciente Faltou
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item as="button" onClick={() => handleShow('Modal Paciente')}>
          Editar Agenda
        </Dropdown.Item>
      </DropdownButton>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton size="sm">
          <Modal.Title>Agenda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormEditAgenda documento={documento} />
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button size="sm" variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

Popup.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  documento: PropTypes.any,
};
Popup.defaultProps = {
  documento: null,
};

export default function Dashboard() {
  console.log('Usuario Dashboard');
  const dispatch = useDispatch();
  const { usuario } = useSelector((state) => state.usuario);
  const { protocolo } = useSelector((state) => state.protocolo);
  console.log('Usuario Dashboard', protocolo);

  const [cxEntrada, setCxEntrada] = useState([]);
  const [dateDocumento, setDateDocumento] = useState(new Date());
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // const dateAgendaFormatted = useMemo(() => dateAgenda.toISOString(), [
  //   dateAgenda,
  // ]);
  // const dateDocumentoFormatted = useMemo(
  //   () => subHours(dateDocumento, 3).toISOString(),
  //   [dateDocumento]
  // );

  useEffect(() => {
    // let c = 0;
    async function loadDocumentos() {
      setLoading(true);
      if (usuario.idusuario !== 0) {
        dispatch(getFirstRender(usuario.idusuario));
        setCxEntrada(protocolo);
        setCount(1);
      } else {
        toast.warn('Usuário não identificado!');
      }
    }
    loadDocumentos();
  }, [protocolo, dispatch, usuario.idusuario]);

  function handleChangeDtDocumento(dtDocumento) {
    console.log('dtDocumentoSelecionada', dtDocumento);
    setDateDocumento(dtDocumento);
  }

  function changeColor(documento) {
    // console.log('Situacao: ', agenda.SITUACAO);
    if (documento.SITUACAO === 'Marcada') {
      return {
        color: 'black',
        fontWeight: 'bold',
        backgroundColor: 'white',
      };
    }
    if (documento.SITUACAO === 'Aberta') {
      return {
        color: 'black',
        backgroundColor: 'white',
      };
    }
    if (documento.SITUACAO === 'Atendido') {
      return {
        color: 'blue',
        fontWeight: 'bold',
        backgroundColor: 'white',
      };
    }
    if (documento.SITUACAO === 'Faltou') {
      return {
        textDecoration: 'line-through',
        color: 'green',
        fontWeight: 'bold',
        backgroundColor: 'white',
      };
    }
    if (documento.SITUACAO === 'Cancelado') {
      return {
        textDecoration: 'line-through',
        color: 'red',
        fontWeight: 'bold',
        backgroundColor: 'white',
      };
    }
    if (documento.SITUACAO === 'Em Atendimento') {
      return {
        color: 'purple',
        fontWeight: 'bold',
        backgroundColor: 'white',
      };
    }
    if (documento.SITUACAO === 'Feriado') {
      return {
        color: 'red',
        fontWeight: 'bold',
        backgroundColor: 'white',
      };
    }
    if (documento.SITUACAO === 'Reservada') {
      return {
        color: 'brown',
        fontWeight: 'bold',
        backgroundColor: 'white',
      };
    }
    if (documento.SITUACAO === 'Fechada') {
      return {
        color: 'yellow',
        fontWeight: 'bold',
        backgroundColor: 'white',
      };
    }
    if (documento.SITUACAO === 'Agendada') {
      return {
        color: 'black',
        fontWeight: 'bold',
        backgroundColor: '#4dff4d',
      };
    }
    return {
      color: 'black',
      fontWeight: 'bold',
      backgroundColor: 'white',
    };
  }

  function formatarHora(hrAgenda) {
    let ao_hora = String(hrAgenda);
    if (ao_hora.length < 4) {
      ao_hora = `0${ao_hora}`;
    }
    ao_hora = ao_hora.replace(/(\d{2})(\d{2})$/, '$1:$2'); // Coloca um hífen entre o terceiro e o quarto dígitos
    return ao_hora;
  }

  return (
    <Container>
      <div className="row justify-content-center">
        <div className="col-lg-auto col-auto p-2">
          <div style={{ textAlign: 'center' }}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="grow"
                  role="status"
                  aria-hidden="true"
                  variant="success"
                />
                <span className="sr-only">Loading...</span>
              </>
            ) : (
              <MdSupervisorAccount size={50} variant="primary" />
            )}
          </div>
          <DatePicker
            selected={dateDocumento}
            onChange={handleChangeDtDocumento}
            inline
            showDisabledMonthNavigation
          />
        </div>
      </div>
      <Table striped bordered hover size="sm" variant="primary">
        <thead>
          <tr>
            <th>#</th>
            <th>Horário</th>
            <th>Paciente</th>
            <th>Atividade</th>
            <th>Situação</th>
            <th>#</th>
          </tr>
        </thead>
        <tbody>
          {cxEntrada.map((a) => (
            <tr key={a.counter} style={changeColor(a)}>
              <td>{a.counter}</td>
              <td>{formatarHora(a.HORARIO)}</td>
              <td>{a.NOME}</td>
              <td>{a.ATIVIDADE}</td>
              <td>{a.SITUACAO}</td>
              <td>
                <Popup documento={a} />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td style={{ textAlign: 'right' }} colSpan="4">
              TOTAL DE DOCUMENTOS
            </td>
            <td style={{ textAlign: 'left' }} colSpan="2">
              {count}
            </td>
          </tr>
        </tfoot>
      </Table>
    </Container>
  );
}
