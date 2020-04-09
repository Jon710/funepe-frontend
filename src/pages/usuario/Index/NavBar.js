/* eslint-disable no-console */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Nav } from 'react-bootstrap';

import Notifications from '~/pages/usuario/Notifications';
// import Paciente from '~/pages/usuario/Index/Paciente';
import { signOutUser } from '~/redux/features/usuario/usuarioSlice';

import logo from '~/assets/logo.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/vendor/fontawesome-free/css/all.min.css';
import '../../../styles/css/resume.min.css';

export default function NavBar() {
  const { usuario } = useSelector(state => state.usuario);
  const { signIn } = useSelector(state => state.usuario);
  console.log('Usuario NavBar');

  const dispatch = useDispatch();
  const dataICM = new Date().toDateString();

  function handleSignOut() {
    console.log('Usuario Saiu.');
    dispatch(signOutUser());
  }

  // function handleArquivados() {
  //   return (
  //     <>
  //       <Paciente />
  //     </>
  //   );
  // }

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top"
      id="sideNav"
    >
      <div className="nav-link js-scroll-trigger bg-light text-success font-weight-bold mt-5 d-none d-lg-block">
        <a href="/perfilmedico">
          <span>
            {usuario.username !== undefined
              ? `Usuário: ${usuario.username}`
              : dataICM}
          </span>
        </a>
      </div>
      <div className="p-1 d-none d-lg-block">
        {signIn ? <Notifications /> : <div>Notify</div>}
      </div>

      <a className="navbar-brand js-scroll-trigger" href="/">
        <span className="d-block d-lg-none">e-Protocolo</span>
        <span className="d-none d-lg-block">
          <img
            className="img-fluid rounded mx-auto mb-1"
            src={logo}
            alt="logo"
            width={100}
            height={100}
          />
        </span>
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav" style={{ fontSize: '12px' }}>
          <li className="nav-item">
            <a className="nav-link js-scroll-trigger" href="/home">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#a">
              Protocolar Documento
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#a">
              Pendentes
            </a>
          </li>
          <li className="nav-item">
            {/* <a className="nav-link" href="#a">
              Arquivados
            </a> */}
            <Nav.Link href="/frmpac">Arquivados</Nav.Link>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#a"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Configurações
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <a className="dropdown-item" href="#a">
                Usuários
              </a>
              <a className="dropdown-item" href="#a">
                Tipos de Arquivos
              </a>
              <a className="dropdown-item" href="#a">
                Tipos de Documentos
              </a>
            </div>
          </li>
          <li className="nav-item">
            <Nav.Link onClick={handleSignOut} href="/">
              Sair
            </Nav.Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
