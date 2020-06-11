import React, { useState } from 'react';
import { Card, Form, Button, Container } from 'react-bootstrap';

import logo from '../../../assets/logo.png';
import NavBar from '../../../protocolo/Index/NavBar';

export default function SignUp() {
  // const dispatch = useDispatch();
  const [validated, setValidated] = useState(false);

  const handleSubmit = event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      const cpf = event.target.elements.formBasicCPF.value;
      const senha = event.target.elements.formBasicSenha.value;
      const confirmPassword = event.target.elements.formBasicConfirmSenha.value;
      // eslint-disable-next-line no-console
      console.log('Usuario: ', cpf, senha, confirmPassword);
      // dispatch(signUpRequest(cpf, senha, confirmPassword));
    }

    setValidated(true);
  };

  const handleClickMed = event => {
    event.preventDefault();
    window.location.href = '/mlogin';
  };

  return (
    <Container>
      <NavBar />
      <div className="row justify-content-md-center p-5">
        <div className="col-lg-auto">
          <Card className="m-2" style={{ width: '18rem' }}>
            <Card.Body>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <div className="p-3">
                  <div className="text-center">
                    <img
                      className="img-fluid rounded-circle center-block hoverable img-profile mx-2 mb-2"
                      src={logo}
                      alt="logo"
                      width={50}
                      height={50}
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
                  <Form.Group controlId="formBasicConfirmSenha">
                    <Form.Label>Confirme sua Senha</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Confirme sua senha"
                    />
                    <Form.Control.Feedback type="invalid">
                      Confirme sua senha.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <div className="text-center p-1">
                    <Button variant="primary" block type="submit">
                      Atualizar Senha
                    </Button>
                  </div>
                  <div className="text-center p-1">
                    <Button variant="warning" block onClick={handleClickMed}>
                      Já Possui Acesso?
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
