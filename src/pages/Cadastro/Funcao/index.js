import React, { useState } from 'react';
import { Form, Button, Card, Modal } from 'react-bootstrap';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import api from '../../../services/api';

export default function Funcao() {
  const [funcao, setFuncao] = useState('');
  const [abreviatura, setAbreviatura] = useState('');
  const [listaFuncao, setListaFuncao] = useState([]);
  const [, setNewFuncao] = useState();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    const novaFuncao = {
      funcao,
      abreviatura,
    };

    try {
      const response = await api.post('roles', novaFuncao);

      const { roles } = response.data;
      setNewFuncao(roles);

      toast.success('Função cadastrada com sucesso!');
      history.push('/cadastros');
    } catch (err) {
      toast.error('Erro ao cadastrar nova função.');
    }
  }

  async function handleFuncoesCadastradas(e) {
    e.preventDefault();
    const response = await api.get('roles');
    const { roles } = response.data;
    setListaFuncao(roles);
    setShow(true);
  }

  async function handleDelete(idfuncao, e) {
    try {
      await api.delete(`roles/${idfuncao}`);
      toast.success('Função deletada com sucesso.');
      handleFuncoesCadastradas(e);
    } catch (err) {
      toast.error('Erro ao deletar função.');
    }
  }

  return (
    <div className="row justify-content-md-center p-5">
      <div className="col-lg-auto">
        <Card className="m-2" style={{ width: '30rem' }}>
          <Card.Body>
            <Form>
              <Form.Group controlId="novaFuncaoForm">
                <Form.Label>Nova função</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Função"
                  value={funcao}
                  onChange={e => setFuncao(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="abreviaturaForm">
                <Form.Label>Abreviatura</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Abreviatura"
                  value={abreviatura}
                  onChange={e => setAbreviatura(e.target.value)}
                />
              </Form.Group>
              <div className="text-center p-1">
                <Button
                  variant="primary"
                  type="submit"
                  onClick={handleFuncoesCadastradas}
                  show={show}
                >
                  Funções cadastradas
                </Button>
              </div>
              <div className="text-center p-1">
                <Button variant="success" type="submit" onClick={handleSubmit}>
                  Cadastrar nova função
                </Button>
              </div>
              <Modal show={show} onHide={handleClose}>
                <Modal.Body>
                  {listaFuncao.map(f => (
                    <li key={f.idfuncao}>
                      {f.funcao}
                      <DeleteForeverSharpIcon
                        onClick={e => handleDelete(f.idfuncao, e)}
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
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
