/* eslint-disable no-console */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Form, Button, Container } from 'react-bootstrap';
import logo from '../../../assets/logo-funepe.jpg';
import NavBar from '../../home/NavBar';
import { updateUserRequest } from '../../../store/modules/auth/actions';

export default function Perfil() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleSubmit = event => {
    event.preventDefault();
    const cpfusuario = event.target.elements.formBasicCPF.value;
    const fullname = event.target.elements.formBasicNome.value;
    const oldPassword = event.target.elements.formBasicSenha.value;
    const senha = event.target.elements.formBasicNovaSenha.value;
    const confirmPassword = event.target.elements.formBasicConfirmSenha.value;

    const payload = {
      cpfusuario,
      fullname,
      oldPassword,
      senha,
      confirmPassword,
    };

    dispatch(updateUserRequest(payload));
  };

  return (
    <Container>
      <NavBar />
      <div className="row justify-content-md-center p-5">
        <div className="col-lg-auto">
          <Card className="m-2" style={{ width: '25rem' }}>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <div className="p-3">
                  <div className="text-center">
                    <img
                      className="img-fluid rounded-circle center-block hoverable img-profile mx-2 mb-2"
                      src={logo}
                      alt="logo"
                      width={70}
                      height={100}
                    />
                  </div>
                  <Form.Group controlId="formBasicCPF">
                    <Form.Label>CPF do Usuário</Form.Label>
                    <Form.Control defaultValue={user.cpfusuario} readOnly />
                  </Form.Group>
                  <Form.Group controlId="formBasicNome">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      defaultValue={user.fullname}
                      required
                      type="text"
                      placeholder="Seu Nome Completo"
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicSenha">
                    <Form.Label>Senha Atual</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Sua senha secreta atual"
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicNovaSenha">
                    <Form.Label>Nova Senha</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Sua nova senha secreta"
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicConfirmSenha">
                    <Form.Label>Confirme sua Senha</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Confirme sua nova senha"
                    />
                  </Form.Group>
                  <div className="text-center p-1">
                    <Button variant="primary" block type="submit">
                      Atualizar Perfil
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
