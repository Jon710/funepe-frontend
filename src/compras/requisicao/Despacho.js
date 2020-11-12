import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Container, Card, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { getHours, getMinutes } from 'date-fns';
import { createLogger } from '../../redux/features/historico/historicoSlice';
import {
  despachoModalClose,
  showAlertErrorOpen,
  selectAllUsuariosGrupo,
} from '../../redux/features/context/contextSlice';
import {
  inserirHistorico,
  atualizarRequisicao,
} from '../../redux/features/compras/comprasSlice';
import AlertError from '../../pages/alerts/AlertError';

export default function Despacho() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { despachaRequisicaoModal, showAlertError } = useSelector(
    state => state.contexto
  );
  const { requisicao } = useSelector(state => state.compras);
  const { grupos, usuarios } = useSelector(state => state.contexto);
  const [selectGrupo, setSelectGrupo] = useState([]);
  const [idUsuario, setIdUsuario] = useState([]);
  const [observacao, setObservacao] = useState(
    'Tomar providências necessárias.'
  );
  const [valueUsuario, setValueUsuario] = useState([]);
  const [, setValueGrupo] = useState([]);
  const [status, setStatus] = useState('');

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
          if (grupo.idgrupo === 21 || grupo.idgrupo === 3) {
            arrayGrupos.push({
              value: grupo.idgrupo,
              label: grupo.descricaogrupo,
            });
          }
        });
      }
      setSelectGrupo(arrayGrupos);
    }
    loadUsuarios();
    loadGrupos();
  }, [grupos, usuarios]);

  function onChangeUsuarios(selectedOption) {
    setValueUsuario(selectedOption);
  }

  function onChangeGrupo(selectedOption) {
    setValueGrupo(selectedOption);
    dispatch(selectAllUsuariosGrupo(selectedOption.value)).then(response => {
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
    try {
      const historico = {
        idrequisicao: requisicao.idrequisicao,
        iddespachante: user.idusuario,
        iddestinatario: valueUsuario.value,
        status,
        datahistorico: new Date(),
        hora: getHours(new Date()) * 100 + getMinutes(new Date()),
        observacao,
      };
      dispatch(inserirHistorico(historico));

      const reqAtualizada = {
        iddestinatario: valueUsuario.value,
        idrequisicao: requisicao.idrequisicao,
        status,
      };
      dispatch(atualizarRequisicao(reqAtualizada));

      const payload = {
        conteudo: `Requisicão Despachada!!! ${user.username}`,
        codUsuario: user.cpfusuario,
      };
      dispatch(createLogger(payload));
      toast.success('Requisição despachada com sucesso!');

      dispatch(
        showAlertErrorOpen({
          showAlertError: false,
          alertError: '',
        })
      );
    } catch (error) {
      dispatch(
        showAlertErrorOpen({
          showAlertError: true,
          alertError: 'Selecione um usuário!',
        })
      );
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
          {showAlertError ? <AlertError /> : null}

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
                        placeholder="Selecione..."
                        onChange={selectedOption =>
                          onChangeGrupo(selectedOption)
                        }
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
                        isSearchable
                        styles={colourStyles}
                        options={idUsuario}
                        onChange={selectedOption =>
                          onChangeUsuarios(selectedOption)
                        }
                        placeholder="Selecione Usuário"
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
                    <Form.Group as={Col}>
                      <Form.Check
                        inline
                        value="Aberta"
                        type="radio"
                        label="Aberta"
                        name="formHorizontalRadios"
                        id="form1"
                        onChange={e => setStatus(e.target.value)}
                      />
                      <Form.Check
                        type="radio"
                        value="Em cotação"
                        label="Em cotação"
                        name="formHorizontalRadios"
                        id="form2"
                        onChange={e => setStatus(e.target.value)}
                      />
                      <Form.Check
                        inline
                        type="radio"
                        label="Aguardando autorização"
                        value="Aguardando autorização"
                        name="formHorizontalRadios"
                        id="form3"
                        onChange={e => setStatus(e.target.value)}
                      />
                      <Form.Check
                        type="radio"
                        label="Finalizada"
                        value="Finalizada"
                        name="formHorizontalRadios"
                        id="form4"
                        onChange={e => setStatus(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Check
                        type="radio"
                        label="Retirar no almoxarifado"
                        value="Retirar no almoxarifado"
                        name="formHorizontalRadios"
                        id="form5"
                        onChange={e => setStatus(e.target.value)}
                      />
                      <Form.Check
                        inline
                        type="radio"
                        label="Cancelada"
                        value="Cancelada"
                        name="formHorizontalRadios"
                        id="form6"
                        onChange={e => setStatus(e.target.value)}
                      />
                      <Form.Check
                        type="radio"
                        label="Negada"
                        value="Negada"
                        name="formHorizontalRadios"
                        id="form7"
                        onChange={e => setStatus(e.target.value)}
                      />
                      <Form.Check
                        type="radio"
                        label="Autorizada"
                        value="Autorizada"
                        name="formHorizontalRadios"
                        id="form8"
                        onChange={e => setStatus(e.target.value)}
                      />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col}>
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
