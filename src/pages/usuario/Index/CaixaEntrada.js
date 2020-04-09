/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-return-assign */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Spinner, Container, Button } from 'react-bootstrap';
import { MdSupervisorAccount } from 'react-icons/md';
import { addDays, parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import { getFirstRender } from '~/redux/features/protocolo/protocoloSlice';
import Documento from '~/pages/usuario/Modal/Documento';
import Despachos from '~/pages/usuario/Modal/Despachos';

export default function CaixaEntrada() {
  // console.log('Function CaixaEntrada');
  const dispatch = useDispatch();
  const { usuario } = useSelector(state => state.usuario);
  const { documento } = useSelector(state => state.protocolo);
  // console.log('Function CaixaEntrada-documento', documento.iddocumento);
  const [cxEntrada, setCxEntrada] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);

  useEffect(() => {
    let c = 0;
    function loadDocumentos() {
      console.log('Usuario CaixaEntrada', usuario);
      setLoading(true);
      if (usuario.idusuario !== 0) {
        // const listProtocolo = dispatch(getFirstRender(usuario));
        dispatch(getFirstRender(usuario)).then(response => {
          console.log('Protocolo CaixaEntrada', response, lastUpdate);
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

            // console.log('Instance of Protocolos: ', typeof response);
            setCxEntrada(protocolos);
            setCount(c);
            setLoading(false);
            setLastUpdate(Date.now());
            setShow(false);
            // toast.warn('Protocolado!');
          }
        });
      } else {
        toast.warn('Usuário não identificado!');
      }
    }
    loadDocumentos();
  }, [documento.iddocumento, count]);

  return (
    <Container fluid>
      <div className="container-fluid">
        <div>
          <Button variant="primary" onClick={handleShow}>
            Protocolar Documento
          </Button>

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
            <>
              <MdSupervisorAccount size={50} variant="primary" />
              <Documento show={show} idDoc="idDocumento" />
            </>
          )}
        </div>

        <Table striped bordered hover size="sm" variant="primary">
          <thead>
            <tr>
              <th>#</th>
              <th>Documento</th>
              <th>Usuário</th>
              <th>Assunto</th>
              <th>Data</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            {cxEntrada !== undefined ? (
              cxEntrada.map(a => (
                <tr key={a.counter}>
                  <td>{a.counter}</td>
                  <td>{a.documento.nrdocumento}</td>
                  <td>{a.usuario.username}</td>
                  <td>{a.documento.assunto}</td>
                  <td>{a.dataFormatada}</td>
                  <td>
                    <Despachos documento={a} />
                  </td>
                </tr>
              ))
            ) : (
              <div>No documents</div>
            )}
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
      </div>
    </Container>
  );
}
