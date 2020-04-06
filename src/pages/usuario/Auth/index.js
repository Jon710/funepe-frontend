/* eslint-disable no-console */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Card, Container } from 'react-bootstrap';

import { getFirstRender } from '../../../redux/features/usuario/usuarioSlide';
// import NavBar from '~/pages/usuario/Index/NavBar';

import logo from '~/assets/logo.jpg';

export default function Auth() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.usuario.token);
  console.log('token', token);
  const [validated, setValidated] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      const username = event.target.elements.formBasicCPF.value;
      const senha = event.target.elements.formBasicSenha.value;
      const payload = { username, senha };
      dispatch(getFirstRender({ payload }));
    }

    setValidated(true);
  };

  const handleClickNew = event => {
    event.preventDefault();
    const form = event.currentTarget;
    console.log('RhandleClickNew', form);
    window.location.href = '/newmedico';
  };

  const handleClickAgenda = event => {
    event.preventDefault();
    const form = event.currentTarget;
    console.log('RhandleClickNew', form);
    window.location.href = '/agenda';
  };

  return (
    <Container>
      {/* {validated ? (
        <div className="p-3">Validated Doctor</div>
      ) : (
        <div className="p-3">No Validated Doctor</div>
      )} */}
      <div className="row justify-content-md-center p-5">
        <div className="col-lg-auto">
          <Card className="m-2">
            <Card.Body>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
                  <Form.Group controlId="formBasicCPF">
                    <Form.Label>CPF do Médico</Form.Label>
                    <Form.Control required type="text" placeholder="Seu CPF" />
                    <Form.Control.Feedback type="invalid">
                      Digite seu CPF.
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
                    <Button variant="primary" block type="submit">
                      Acessar
                    </Button>
                  </div>
                  <div className="text-center p-1">
                    <Button variant="warning" block onClick={handleClickNew}>
                      Primeiro Acesso?
                    </Button>
                  </div>
                  <div className="text-center p-1">
                    <Button variant="success" block onClick={handleClickAgenda}>
                      Agenda
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
