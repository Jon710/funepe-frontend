/* eslint-disable no-console */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Form, Button, Container } from 'react-bootstrap';

import logo from '../../../assets/logo.png';
import NavBar from '../Index/NavBar';

// import {
//   signOutMed,
//   updateProfileRequest,
// } from '~/store/modules/auth/doctor/actions';

export default function PerfilMedico() {
  // const dispatch = useDispatch();
  const [validated, setValidated] = useState(false);

  const profile = useSelector(state => state.usuario.profile);

  const handleSubmit = event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      const cpf = event.target.elements.formBasicCPF.value;
      const nome = event.target.elements.formBasicNome.value;
      const celular = event.target.elements.formBasicCelular.value;
      const email = event.target.elements.formBasicEmail.value;
      const oldPassword = event.target.elements.formBasicSenha.value;
      const senha = event.target.elements.formBasicNovaSenha.value;
      const confirmPassword = event.target.elements.formBasicConfirmSenha.value;
      console.log('Usuario: ', cpf, nome, email, celular, senha);
      const payloadMed = {
        cpf,
        nome,
        email,
        celular,
        oldPassword,
        senha,
        confirmPassword,
      };
      console.log('Usuario: ', payloadMed);
      // dispatch(updateProfileRequest(payloadMed));
    }

    setValidated(true);
  };

  const handleClickMed = event => {
    event.preventDefault();
    window.location.href = '/mlogin';
  };

  function handleSignOut() {
    console.log('SIGNED OUT DOCTOR');
    // dispatch(signOutMed());
  }

  return (
    <Container>
      <NavBar />
      <div className="row justify-content-md-center p-5">
        <div className="col-lg-auto">
          <Card className="m-2" style={{ width: '25rem' }}>
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
                    <Form.Control
                      defaultValue={profile.cpf}
                      required
                      type="text"
                      placeholder="Seu CPF"
                    />
                    <Form.Control.Feedback type="invalid">
                      Digite seu CPF.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formBasicNome">
                    <Form.Label>Nome do Médico</Form.Label>
                    <Form.Control
                      defaultValue={profile.nome}
                      required
                      type="text"
                      placeholder="Seu Nome Completo"
                    />
                    <Form.Control.Feedback type="invalid">
                      Digite seu nome.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formBasicCelular">
                    <Form.Label>Celular do Médico</Form.Label>
                    <Form.Control
                      defaultValue={profile.celular}
                      required
                      type="text"
                      placeholder="Seu Celular"
                    />
                    <Form.Control.Feedback type="invalid">
                      Digite seu celular.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>E-mail do Médico</Form.Label>
                    <Form.Control
                      defaultValue={profile.email}
                      required
                      type="text"
                      placeholder="Seu E-mail"
                    />
                    <Form.Control.Feedback type="invalid">
                      Digite seu e-mail.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formBasicSenha">
                    <Form.Label>Senha Atual</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Sua senha secreta atual"
                    />
                    <Form.Control.Feedback type="invalid">
                      Digite sua senha.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formBasicNovaSenha">
                    <Form.Label>Nova Senha</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Sua nova senha secreta"
                    />
                    <Form.Control.Feedback type="invalid">
                      Digite sua nova senha.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formBasicConfirmSenha">
                    <Form.Label>Confirme sua Senha</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Confirme sua nova senha"
                    />
                    <Form.Control.Feedback type="invalid">
                      Confirme sua senha.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <div className="text-center p-1">
                    <Button variant="primary" block type="submit">
                      Atualizar Perfil
                    </Button>
                  </div>
                  <div className="text-center p-1">
                    <Button variant="warning" block onClick={handleClickMed}>
                      Já Possui Acesso?
                    </Button>
                  </div>
                  <div className="text-center p-1">
                    <Button variant="success" block onClick={handleSignOut}>
                      Sair?
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

// <Container>
//   <Form initialData={profile} onSubmit={handleSubmitPac}>
//     <AvatarInput />

//     <Input name="nome" placeholder="Nome completo" />
//     <Input name="cpf" disabled placeholder="Seu CPF" />
//     <Input name="celular" placeholder="Seu Celular" />
//     <NumberFormat
//       isNumericString
//       value={profile.celular}
//       displayType="input"
//       placeholder="Seu Celular"
//       format="+55 (##) #####-####"
//       mask="_"
//     />
//     <Input name="email" type="email" placeholder="Seu E-mail" />
//     <hr />
//     <Input
//       type="password"
//       name="oldPassword"
//       placeholder="Sua senha atual"
//     />
//     <Input type="password" name="senha" placeholder="Sua nova senha" />
//     <Input
//       type="password"
//       name="confirmPassword"
//       placeholder="Confirmação de senha"
//     />

//     <button type="submit">Atualizar perfil</button>
//   </Form>
//   <button onClick={handleSignOut} type="button">
//     Sair do ICM on Go
//   </button>
// </Container>
