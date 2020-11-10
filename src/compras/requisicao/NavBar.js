/* eslint-disable array-callback-return */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Nav,
  NavDropdown,
  Navbar,
  Modal,
  Button,
  ListGroup,
  Badge as BS,
} from 'react-bootstrap';
import Badge from '@material-ui/core/Badge';
import { MdNotifications } from 'react-icons/md';
import { Redirect } from 'react-router';
import { toast } from 'react-toastify';
import { signOut } from '../../store/modules/auth/actions';
import logo from '../../assets/logo-funepe.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  resetContext,
  requisicaoModalOpen,
} from '../../redux/features/context/contextSlice';
import { addRequisicaoRequest } from '../../redux/features/compras/comprasSlice';
import api from '../../services/api';

export default function NavBar() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { usuario } = useSelector(state => state.contexto);
  const [userRole] = useState(usuario[0]);
  const [count, setCount] = useState(0);
  const [showNotification, setShowNotifications] = useState(false);
  const [, setID] = useState();
  const [notificationList, setNotificationList] = useState([]);
  const dataSistema = new Date().toDateString();

  async function getNotifications() {
    await api
      .get('notification')
      .then(response => {
        const { notifications } = response.data;

        setNotificationList(notifications);

        let counter = 0;
        if (notifications.length > 0) {
          notifications.map(notification => {
            if (notification.read === false) {
              counter += 1;
              setCount(counter);
              setID({ notification });
            }
          });
        }
      })
      .catch(error => {
        toast.error(`Erro nas notificações. ${error.message}`);
      });
  }

  useEffect(() => {
    getNotifications();
  }, []);

  function handleSignOut() {
    dispatch(resetContext());
    dispatch(signOut());
  }

  const showNotifications = () => setShowNotifications(true);
  const closeNotifications = () => setShowNotifications(false);

  async function readNotification(n) {
    await api
      .put(`notification/${n.id}`)
      .then(() => {
        getNotifications();
      })
      .catch(error => {
        toast.error('Erro.', error);
      });
  }

  return (
    <>
      <Navbar bg="success" expand="lg">
        <Navbar.Brand href="/home">
          <img
            className="img-fluid rounded mx-auto mb-1"
            src={logo}
            alt="logo"
            width={100}
            height={100}
          />{' '}
          COMPRAS
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title="Requisições" id="basic-nav-dropdown">
              <NavDropdown.Item href="/requisicao">
                Caixa de Entrada
              </NavDropdown.Item>
              <NavDropdown.Item href="/minhareq">
                Minhas requisições
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  dispatch(addRequisicaoRequest());
                  dispatch(requisicaoModalOpen());
                }}
              >
                Solicitar compras
              </NavDropdown.Item>
            </NavDropdown>

            {userRole && userRole.role_id === 1 ? (
              <>
                {/* <Nav.Link href="/orcamento">Orçamento</Nav.Link> */}
                <NavDropdown title="Cadastros" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/formcategoria">
                    Categorias
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/formdepartamento">
                    Departamentos
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/formempresa">
                    Empresas
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/formfornecedor">
                    Fornecedores
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/formmarca">Marcas</NavDropdown.Item>
                  <NavDropdown.Item href="/formproduto">
                    Produtos
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/almoxarifado">
                    Controle de Almoxarifado
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/formmedida">
                    Unidades de Medida
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/formtipoempresa">
                    Tipo de Empresa
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/formtipoforn">
                    Tipo de Fornecedor
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/formtipotel">
                    Tipo de Telefone
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Redirect to="/requisicao" />
            )}

            <Nav.Link onClick={handleSignOut} href="/">
              Sair
            </Nav.Link>
          </Nav>

          <div>
            <Badge
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              badgeContent={count}
              color="secondary"
            >
              <MdNotifications
                color="#ffff"
                size={25}
                onClick={() => showNotifications()}
              />
            </Badge>
          </div>

          <Navbar.Text>
            USUÁRIO:{' '}
            <a href="/login">
              {user.username !== undefined
                ? `${user.username.toUpperCase()}`
                : dataSistema}
            </a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>

      <Modal show={showNotification} onHide={closeNotifications} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Notificações</Modal.Title>
        </Modal.Header>
        {notificationList.map(n =>
          n.read === false ? (
            <>
              <Modal.Body>
                <ListGroup>
                  <ListGroup.Item key={n.id} variant="success">
                    {n.content}
                    <BS
                      variant="primary"
                      style={{ marginLeft: 50 }}
                      onClick={() => readNotification(n)}
                    >
                      Marcar como lida
                    </BS>
                  </ListGroup.Item>
                </ListGroup>
              </Modal.Body>
            </>
          ) : null
        )}
        <Modal.Footer>
          <Button variant="secondary" onClick={closeNotifications}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
