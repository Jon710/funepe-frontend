/* eslint-disable no-return-assign */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Spinner, Container } from 'react-bootstrap';
import { MdSupervisorAccount } from 'react-icons/md';
import { addDays, parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import { getFirstRender } from '~/redux/features/protocolo/protocoloSlide';
import Documento from '~/pages/usuario/Modal/Documento';
import Despachos from '~/pages/usuario/Modal/Despachos';

export default function CaixaEntrada() {
  console.log('Function CaixaEntrada');
  const dispatch = useDispatch();
  const { usuario } = useSelector(state => state.usuario);
  const { documento } = useSelector(state => state.protocolo);
  console.log('Function CaixaEntrada-documento', documento.iddocumento);
  const [cxEntrada, setCxEntrada] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let c = 0;
    async function loadDocumentos() {
      console.log('Usuario CaixaEntrada', usuario);
      setLoading(true);
      if (usuario.idusuario !== 0) {
        const listProtocolo = await dispatch(getFirstRender(usuario));
        console.log('Protocolo CaixaEntrada', listProtocolo);
        if (listProtocolo) {
          const protocolos = listProtocolo.map(protocolo => ({
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
      } else {
        toast.warn('Usuário não identificado!');
      }
    }
    loadDocumentos();
  }, [dispatch, usuario, documento.iddocumento]);

  return (
    <Container fluid>
      <div className="container-fluid">
        <div>
          <button
            type="button"
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#idDocumento"
            mt="2"
          >
            Protocolar Documento
          </button>
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
              <Documento idDoc="idDocumento" />
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
