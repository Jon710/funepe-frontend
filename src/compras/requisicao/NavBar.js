/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { Redirect } from 'react-router';

import { signOut } from '../../store/modules/auth/actions';
import logo from '../../assets/logo-funepe.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { resetContext } from '../../redux/features/context/contextSlice';

export default function NavBar() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { usuario } = useSelector(state => state.contexto);
  const [userRole] = useState(usuario[0]);

  const dataSistema = new Date().toDateString();

  function handleSignOut() {
    dispatch(resetContext());
    dispatch(signOut());
  }

  return (
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
          </NavDropdown>

          {userRole && userRole.role_id === 1 ? (
            <>
              <Nav.Link href="/orcamento">Orçamento</Nav.Link>
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
  );
}
