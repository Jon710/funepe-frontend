import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button, Card, Modal, Col } from 'react-bootstrap';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import { toast } from 'react-toastify';
import Select from 'react-select';

import api from '../../../services/api';

export default function Usuario() {
  // const { protocolo } = useSelector(state => state.protocolo);
  const { grupos, funcoes } = useSelector(state => state.protocolo);

  const [idGrupo, setIdGrupo] = useState([]);
  const [idFuncao, setIdFuncao] = useState([]);
  const [valueFuncao, setValueFuncao] = useState([]);
  const [valueGrupo, setValueGrupo] = useState([]);

  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [admin, setAdmin] = useState(false);
  const [cpf, setCPF] = useState('');
  const [listaUsuario, setListaUsuario] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const colourStyles = {
    option: provided => ({
      ...provided,
      borderBottom: '1px dotted pink',
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

  async function handleSubmit(e) {
    e.preventDefault();
    setAdmin(false);
    const novoUsuario = {
      idFuncao: valueFuncao.value,
      username,
      senha,
      md5: senha,
      fullname: nome,
      admin,
      tipouser: 1,
      status: 'A',
      sistema: 'S',
      cpfusuario: cpf,
    };

    try {
      const response = await api.post('usuarios', novoUsuario);
      const userID = response.data.user.idusuario;

      // add tabela usuariogrupo
      if (valueGrupo.length > 0) {
        valueGrupo.forEach(grupo => {
          const payload = {
            idusuario: userID,
          };
          api.post(`/grupo/${grupo.value}/usuariogrupo`, payload);
        });
      }

      toast.success('Usuário cadastrado com sucesso!');
    } catch (err) {
      toast.error('Erro ao cadastrar novo usuário.');
    }
  }

  async function handleUsuariosCadastrados(e) {
    e.preventDefault();
    const response = await api.get('usuarios');
    const { users } = response.data;
    setListaUsuario(users);
    setShow(true);
  }

  async function handleDelete(idusuario, e) {
    try {
      await api.delete(`usuarios/${idusuario}`);
      toast.success('Usuário deletado.');
      handleUsuariosCadastrados(e);
    } catch (err) {
      toast.error('Erro ao deletar usuário.');
    }
  }

  function onChangeGrupo(selectedOption) {
    setValueGrupo(selectedOption);
  }

  function onChangeFuncao(selectedOption) {
    setValueFuncao(selectedOption);
  }

  React.useEffect(() => {
    const arrayFuncoes = [];
    const arrayGrupos = [];
    async function loadUsuarios() {
      if (funcoes.length > 0) {
        funcoes.forEach(funcao => {
          arrayFuncoes.push({
            value: funcao.idfuncao,
            label: funcao.funcao,
          });
        });
      }
      setIdFuncao(arrayFuncoes);
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
      setIdGrupo(arrayGrupos);
    }
    loadUsuarios();
    loadGrupos();
  }, [funcoes, grupos]);

  return (
    <div className="row justify-content-md-center p-5">
      <div className="col-lg-auto">
        <Card className="m-2" style={{ width: '30rem' }}>
          <Card.Body>
            <Col>
              <Form>
                <Form.Group controlId="novoNomeForm">
                  <Form.Label>Nome Completo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nome Completo"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="novoCPFForm">
                  <Form.Label>CPF</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="CPF"
                    value={cpf}
                    onChange={e => setCPF(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="novoUserForm">
                  <Form.Label>Novo usuário</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nome"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="senhaForm">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Senha"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formFuncao">
                  <Form.Label>Função do Usuário:</Form.Label>
                  <Select
                    isSearchable
                    styles={colourStyles}
                    options={idFuncao}
                    onChange={selectedOption => onChangeFuncao(selectedOption)}
                    placeholder="Selecione uma Função"
                    theme={theme => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        neutral50: '#1A1A1A', // Placeholder color
                      },
                    })}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGrupo">
                  <Form.Label>Grupos do Usuário:</Form.Label>
                  <Select
                    isMulti
                    isSearchable
                    styles={colourStyles}
                    options={idGrupo}
                    onChange={selectedOption => onChangeGrupo(selectedOption)}
                    placeholder="Selecione os Grupos"
                    theme={theme => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        neutral50: '#1A1A1A', // Placeholder color
                      },
                    })}
                  />
                </Form.Group>

                <div className="text-center p-1">
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handleUsuariosCadastrados}
                    // show={show}
                  >
                    Usuários cadastrados
                  </Button>
                </div>
                <div className="text-center p-1">
                  <Button
                    variant="success"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Cadastrar novo usuário
                  </Button>
                </div>
                <Modal show={show} onHide={handleClose}>
                  <Modal.Body>
                    {listaUsuario.map(f => (
                      <li key={f.idusuario}>
                        {f.username}
                        <DeleteForeverSharpIcon
                          onClick={e => handleDelete(f.idusuario, e)}
                        />
                        <hr />
                      </li>
                    ))}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Fechar
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Form>
            </Col>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
