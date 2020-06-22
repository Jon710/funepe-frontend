import React, { useState } from 'react';
import { Form, Button, Card, Modal } from 'react-bootstrap';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';

export default function TipoDocumento() {
  const [descricao, setDescricao] = useState('');
  const [abreviacao, setAbreviacao] = useState('');
  const [listaTipo, setListaTipo] = useState([]);
  const [, setNewTipo] = useState();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    const novoTipo = {
      descricao,
      abreviacao,
    };

    try {
      const response = await api.post('types', novoTipo);

      const { types } = response.data;
      setNewTipo(types);

      toast.success('Tipo de documento cadastrada com sucesso!');
      history.push('/cadastros');
    } catch (err) {
      toast.error('Erro ao cadastrar novo tipo de documento.');
    }
  }

  async function handleTiposCadastrados(e) {
    e.preventDefault();
    const response = await api.get('types');
    const { types } = response.data;
    setListaTipo(types);
    setShow(true);
  }

  async function handleDelete(idtipo, e) {
    try {
      await api.delete(`types/${idtipo}`);
      toast.success('Tipo de documento deletado com sucesso.');
      handleTiposCadastrados(e);
    } catch (err) {
      toast.error('Erro ao deletar tipo de documento.');
    }
  }

  return (
    <div className="row justify-content-md-center p-5">
      <div className="col-lg-auto">
        <Card className="m-2" style={{ width: '30rem' }}>
          <Card.Body>
            <Form>
              <Form.Group controlId="novoTipoForm">
                <Form.Label>Novo tipo de documento</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Descrição"
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="abreviacaoForm">
                <Form.Label>Abreviação</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Abreviação"
                  value={abreviacao}
                  onChange={e => setAbreviacao(e.target.value)}
                />
              </Form.Group>
              <div className="text-center p-1">
                <Button
                  variant="primary"
                  type="submit"
                  onClick={handleTiposCadastrados}
                  show={show}
                >
                  Tipos de documento cadastrados
                </Button>
              </div>
              <div className="text-center p-1">
                <Button variant="success" type="submit" onClick={handleSubmit}>
                  Cadastrar novo tipo de documento
                </Button>
              </div>
              <Modal show={show} onHide={handleClose}>
                <Modal.Body>
                  {listaTipo.map(f => (
                    <li key={f.idtipo}>
                      {f.descricao}
                      <DeleteForeverSharpIcon
                        onClick={e => handleDelete(f.idtipo, e)}
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
