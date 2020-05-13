import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button, Card, Modal, Col } from 'react-bootstrap';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import api from '../../../services/api';

export default function Usuario() {
  const [idfuncao, setIdFuncao] = useState('');
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [listaUsuario, setListaUsuario] = useState([]);
  const [, setNewUsuario] = useState();
  const [show, setShow] = useState(false);

  const grupos = useSelector(state => state.protocolo.grupos);
  console.log(grupos);

  const handleClose = () => setShow(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    const novoUsuario = {
      username,
      senha,
    };

    try {
      const response = await api.post('usuarios', novoUsuario);

      const { usuarios } = response.data;
      setNewUsuario(usuarios);

      toast.success('Usuário cadastrado com sucesso!');
      history.push('/cadastros');
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

  return (
    <div className="row justify-content-md-center p-5">
      <div className="col-lg-auto">
        <Card className="m-2" style={{ width: '30rem' }}>
          <Card.Body>
            <Col>
              <Form>
                <Form.Group controlId="idNovoUser">
                  <Form.Label>ID Função</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="ex: 10"
                    value={idfuncao}
                    onChange={e => setIdFuncao(e.target.value)}
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
                <Form.Label>
                  Selecione o grupo a que o usuário pertence
                  <Form.Control as="select" value={1}>
                    {grupos.length > 0
                      ? grupos.map(grp => (
                          <option key={grp.idgrupo} value={grp.idgrupo}>
                            {grp.descricaogrupo}
                          </option>
                        ))
                      : ''}
                  </Form.Control>
                </Form.Label>

                <div className="text-center p-1">
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handleUsuariosCadastrados}
                    show={show}
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
