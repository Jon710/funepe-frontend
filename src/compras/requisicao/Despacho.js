import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Container, Card, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { despachoModalClose } from '../../redux/features/context/contextSlice';
import {
  inserirHistorico,
  atualizarRequisicao,
} from '../../redux/features/compras/comprasSlice';
import { selectAllUsuariosGrupoReq } from '../../redux/features/protocolo/protocoloSlice';

export default function Despacho() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { despachaRequisicaoModal } = useSelector(state => state.contexto);
  const { requisicao } = useSelector(state => state.compras);
  const { grupos, usuarios } = useSelector(state => state.protocolo);
  const [selectGrupo, setSelectGrupo] = useState([]);
  const [idUsuario, setIdUsuario] = useState([]);
  const [observacao, setObservacao] = useState(
    'Tomar providências necessárias.'
  );
  const [valueUsuario, setValueUsuario] = useState([]);
  const [, setValueGrupo] = useState([]);

  const colourStyles = {
    option: provided => ({
      ...provided,
      color: 'blue',
    }),
    placeholder: defaultStyles => {
      return {
        ...defaultStyles,
        color: 'black',
      };
    },
    multiValueLabel: styles => ({
      ...styles,
      color: 'black',
    }),
  };

  useEffect(() => {
    const arrayUsuarios = [];
    const arrayGrupos = [];
    async function loadUsuarios() {
      if (usuarios.length > 0) {
        usuarios.forEach(usuario => {
          arrayUsuarios.push({
            value: usuario.idusuario,
            label: usuario.username,
          });
        });
      }
      setIdUsuario(arrayUsuarios);
    }

    async function loadGrupos() {
      if (grupos.length > 0) {
        grupos.forEach(grupo => {
          arrayGrupos.push({
            value: grupo.idgrupo,
            label: grupo.descricaogrupo,
          });
        });
      }
      setSelectGrupo(arrayGrupos);
    }
    loadUsuarios();
    loadGrupos();
  }, [usuarios, grupos]);

  function onChangeUsuarios(selectedOption) {
    setValueUsuario(selectedOption);
  }

  function onChangeGrupo(selectedOption) {
    setValueGrupo(selectedOption);
    dispatch(selectAllUsuariosGrupoReq(selectedOption.value)).then(response => {
      const arrayUsuarios = [];
      if (response.length > 0) {
        response.forEach(usuario => {
          if (usuario.idgrupo === selectedOption.value)
            arrayUsuarios.push({
              value: usuario.idusuario,
              label: usuario.usuario.username,
            });
        });
      }
      setIdUsuario(arrayUsuarios);
    });
  }

  async function handleDespachar() {
    if (valueUsuario.length > 0) {
      valueUsuario.forEach(usuario => {
        const historico = {
          idrequisicao: requisicao.idrequisicao,
          iddespachante: user.idusuario,
          iddestinatario: usuario.value,
          status: 'Despachado',
          datahistorico: new Date(),
          observacao,
        };
        dispatch(inserirHistorico(historico));

        const reqAtualizada = {
          idsolicitante: usuario.value,
          idrequisicao: requisicao.idrequisicao,
        };
        dispatch(atualizarRequisicao(reqAtualizada));
      });
      toast.success('Requisição despachada com sucesso!');
    }
  }

  const handleClose = () => dispatch(despachoModalClose());

  return (
    <Container>
      <Form>
        <Modal
          variant="danger"
          dialogClassName="modal-danger"
          size="lg"
          animation
          show={despachaRequisicaoModal}
          onHide={handleClose}
        >
          <Modal.Body>
            <Card bg="success" text="light" key={1}>
              <Card.Body>
                <Card.Title>Despachar Requisição</Card.Title>
                <Container>
                  <Form.Row>
                    <Form.Group as={Col} controlId="editPrazo">
                      <Form.Label>Grupos:</Form.Label>
                      <Select
                        isSearchable
                        styles={colourStyles}
                        options={selectGrupo}
                        onChange={selectedOption =>
                          onChangeGrupo(selectedOption)
                        }
                        defaultValue={{ label: 'Compras', value: 21 }}
                        theme={theme => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            neutral50: '#1A1A1A',
                          },
                        })}
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Usuários:</Form.Label>
                      <Select
                        isMulti
                        isSearchable
                        styles={colourStyles}
                        options={idUsuario}
                        onChange={selectedOption =>
                          onChangeUsuarios(selectedOption)
                        }
                        placeholder="Selecione Usuários"
                        theme={theme => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            neutral50: '#1A1A1A',
                          },
                        })}
                      />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} controlId="editDepacho">
                      <Form.Label>Despacho</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="3"
                        value={observacao}
                        onChange={e => setObservacao(e.target.value)}
                      />
                    </Form.Group>
                  </Form.Row>
                </Container>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Fechar
            </Button>
            <Button variant="primary" onClick={handleDespachar}>
              Salvar
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
    </Container>
  );
}
