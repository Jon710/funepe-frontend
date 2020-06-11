import React, { useState } from 'react';
import { Form, Button, Card, Modal } from 'react-bootstrap';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import api from '../../../services/api';

export default function DespachoPadrao() {
  const [descricaopadrao, setDescricaoPadrao] = useState('');
  const [listaDescricaoPadrao, setListaDescricaoPadrao] = useState([]);
  const [, setNewDescricaoPadrao] = useState();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    const novoDespachoPadrao = {
      descricaopadrao,
    };

    try {
      const response = await api.post('despachopadrao', novoDespachoPadrao);

      const { despachospadrao } = response.data;
      setNewDescricaoPadrao(despachospadrao);

      toast.success('Despacho padrão cadastrado com sucesso!');
      history.push('/cadastros');
    } catch (err) {
      toast.error('Erro ao cadastrar novo despacho padrão.');
    }
  }

  async function handleDescricaoCadastradas(e) {
    e.preventDefault();
    const response = await api.get('despachopadrao');
    const { despachospadrao } = response.data;
    setListaDescricaoPadrao(despachospadrao);
    setShow(true);
  }

  async function handleDelete(idpadrao, e) {
    try {
      await api.delete(`despachopadrao/${idpadrao}`);
      toast.success('Despacho padrão deletado com sucesso.');
      handleDescricaoCadastradas(e);
    } catch (err) {
      toast.error('Erro ao deletar despacho padrão.');
    }
  }

  return (
    <div className="row justify-content-md-center p-5">
      <div className="col-lg-auto">
        <Card className="m-2" style={{ width: '30rem' }}>
          <Card.Body>
            <Form>
              <Form.Group controlId="novoDespachoPadraoForm">
                <Form.Label>Novo despacho padrão</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Descrição do novo despacho"
                  value={descricaopadrao}
                  onChange={e => setDescricaoPadrao(e.target.value)}
                />
              </Form.Group>
              <div className="text-center p-1">
                <Button
                  variant="primary"
                  type="submit"
                  onClick={handleDescricaoCadastradas}
                  show={show}
                >
                  Despachos cadastrados
                </Button>
              </div>
              <div className="text-center p-1">
                <Button variant="success" type="submit" onClick={handleSubmit}>
                  Cadastrar novo despacho padrão
                </Button>
              </div>
              <Modal show={show} onHide={handleClose}>
                <Modal.Body>
                  {listaDescricaoPadrao.map(f => (
                    <li key={f.idpadrao}>
                      {f.descricaopadrao}
                      <DeleteForeverSharpIcon
                        onClick={e => handleDelete(f.idpadrao, e)}
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
