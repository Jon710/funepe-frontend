import React from 'react';
import { Container, Form, Col, Nav, Card } from 'react-bootstrap';
import {
  IoMdAttach,
  IoIosBody,
  IoIosBuild,
  IoMdCash,
  IoMdPerson,
  IoIosCart,
  IoIosAperture,
  IoIosAppstore,
  IoIosCompass,
} from 'react-icons/io';
import NavBar from './NavBar';
import logo from '../../assets/logo-funepe.jpg';

export default function Home() {
  return (
    <Container>
      <NavBar />
      <div className="row justify-content-md-center p-3">
        <div className="col-lg-auto">
          <Card className="m-2" bg="white" text="light">
            <Card.Body>
              <Form>
                <div className="p-2">
                  <div className="text-center">
                    <img
                      className="img-fluid rounded center-block hoverable mx-2 mb-2"
                      src={logo}
                      alt="logo"
                      width={100}
                      height={100}
                    />
                  </div>

                  <div className="row text-center justify-content-md-center">
                    <Col xs={6} md={4}>
                      <Nav.Link href="/meuperfil">
                        <IoMdPerson size="48px" />
                        <p>Meu Perfil</p>
                      </Nav.Link>
                    </Col>
                    <Col xs={6} md={4}>
                      <div>
                        <Nav.Link href="/protocolo">
                          <IoIosAperture size="48px" />
                          <p>e-Protocolo</p>
                        </Nav.Link>
                      </div>
                    </Col>
                    <Col xs={6} md={4}>
                      <div>
                        <Nav.Link href="/requisicao">
                          <IoIosCart size="48px" />
                          <p>Compras</p>
                        </Nav.Link>
                      </div>
                    </Col>

                    <Col xs={6} md={4}>
                      <div>
                        <Nav.Link href="/juridico">
                          <IoMdAttach size="48px" />
                          <p>Jurídico</p>
                        </Nav.Link>
                      </div>
                    </Col>

                    <Col xs={6} md={4}>
                      <div>
                        <Nav.Link href="/financeiro">
                          <IoMdCash size="48px" />
                          <p>Financeiro</p>
                        </Nav.Link>
                      </div>
                    </Col>

                    <Col xs={6} md={4}>
                      <div className="card_home">
                        <Nav.Link href="/academico">
                          <IoIosBody size="48px" />
                          <p>Acadêmico</p>
                        </Nav.Link>
                      </div>
                    </Col>

                    <Col xs={6} md={4}>
                      <div>
                        <Nav.Link href="/aluno">
                          <IoIosCompass size="48px" />
                          <p>Aluno</p>
                        </Nav.Link>
                      </div>
                    </Col>
                    <Col xs={6} md={4}>
                      <div>
                        <Nav.Link href="/biblioteca">
                          <IoIosAppstore size="48px" />
                          <p>Biblioteca</p>
                        </Nav.Link>
                      </div>
                    </Col>
                    <Col xs={6} md={4}>
                      <div>
                        <Nav.Link href="/configuracoes">
                          <IoIosBuild size="48px" />
                          <p>Configurações</p>
                        </Nav.Link>
                      </div>
                    </Col>
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
