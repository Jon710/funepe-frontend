/* eslint-disable no-alert */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button, Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import api from '../../../services/api';

export default function Funcao() {
  const [funcao, setFuncao] = useState('');
  const [abreviatura, setAbreviatura] = useState('');
  const { usuario, token } = useSelector(state => state.usuario);
  console.log(usuario, token);

  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    const data = {
      funcao,
      abreviatura,
    };

    try {
      // api.defaults.headers.Authorization = `Bearer ${token}`;

      const response = await api.post('roles', data);
      console.log(response);

      history.push('/cadastros');
    } catch (err) {
      alert('Erro ao cadastrar nova função.');
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
                  onChange={e => setFuncao(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="abreviaturaForm">
                <Form.Label>Abreviatura</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Abreviatura"
                  onChange={e => setAbreviatura(e.target.value)}
                />
              </Form.Group>
              <div className="text-center p-1">
                <Button variant="success" type="submit" onClick={handleSubmit}>
                  Cadastrar
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
