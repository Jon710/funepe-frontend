import React, { useState } from 'react';
import { Form, Button, Card, Modal } from 'react-bootstrap';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';

export default function Grupo() {
  const [descricaogrupo, setDescricaoGrupo] = useState('');
  const [listaGrupo, setListaGrupo] = useState([]);
  const [, setNewGrupo] = useState();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    const novoGrupo = {
      descricaogrupo,
    };

    try {
      const response = await api.post('groups', novoGrupo);

      const { groups } = response.data;
      setNewGrupo(groups);

      toast.success('Grupo cadastrado com sucesso!');
      history.push('/cadastros');
    } catch (err) {
      toast.error('Erro ao cadastrar novo grupo.');
    }
  }

  async function handleGruposCadastrados(e) {
    e.preventDefault();
    const response = await api.get('groups');
    const { groups } = response.data;
    setListaGrupo(groups);
    setShow(true);
  }

  async function handleDelete(idgrupo, e) {
    try {
      await api.delete(`groups/${idgrupo}`);
      toast.success('Grupo deletado com sucesso.');
      handleGruposCadastrados(e);
    } catch (err) {
      toast.error('Erro ao deletar grupo.');
    }
  }

  return (
    <div className="row justify-content-md-center p-5">
      <div className="col-lg-auto">
        <Card className="m-2" style={{ width: '30rem' }}>
          <Card.Body>
            <Form>
              <Form.Group controlId="novoGrupoForm">
                <Form.Label>Novo grupo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Descrição do grupo"
                  value={descricaogrupo}
                  onChange={e => setDescricaoGrupo(e.target.value)}
                />
              </Form.Group>
              <div className="text-center p-1">
                <Button
                  variant="primary"
                  type="submit"
                  onClick={handleGruposCadastrados}
                  show={show}
                >
                  Grupos cadastrados
                </Button>
              </div>
              <div className="text-center p-1">
                <Button variant="success" type="submit" onClick={handleSubmit}>
                  Cadastrar novo grupo
                </Button>
              </div>
              <Modal show={show} onHide={handleClose}>
                <Modal.Body>
                  {listaGrupo.map(f => (
                    <li key={f.idgrupo}>
                      {f.descricaogrupo}
                      <DeleteForeverSharpIcon
                        onClick={e => handleDelete(f.idgrupo, e)}
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
