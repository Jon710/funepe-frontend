import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, Button, Card, Container } from 'react-bootstrap';
import { signInRequest } from '../../../store/modules/auth/actions';

import logo from '../../../assets/logo.jpg';

export default function Auth() {
  const dispatch = useDispatch();

  function handleSubmit(event) {
    event.preventDefault();
    const username = event.currentTarget.elements.formUsername.value;
    const senha = event.currentTarget.elements.formBasicSenha.value;

    dispatch(signInRequest(username, senha));
  }

  return (
    <Container>
      <div className="row justify-content-md-center p-5">
        <div className="col-lg-auto">
          <Card className="m-2">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <div className="p-3">
                  <div className="text-center">
                    <img
                      className="img-fluid rounded center-block hoverable mx-2 mb-2"
                      src={logo}
                      alt="logo"
                      width={100}
                      height={100}
                    />
                  </div>
                  <Form.Group controlId="formUsername">
                    <Form.Label>Nome de usuário</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Nome de Usuário"
                    />
                    <Form.Control.Feedback type="invalid">
                      Digite seu nome de usuário.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formBasicSenha">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Sua senha secreta"
                    />
                    <Form.Control.Feedback type="invalid">
                      Digite sua senha.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <div className="text-center p-1">
                    <Button variant="primary" type="submit" block>
                      Acessar
                    </Button>
                  </div>
                  <div className="text-center p-1">
                    <Button variant="warning" block>
                      Primeiro Acesso?
                    </Button>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}
