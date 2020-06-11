import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Nav, NavDropdown, Navbar } from 'react-bootstrap';

import { signOut } from '../../store/modules/auth/actions';
import logo from '../../assets/logo-funepe.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../styles/vendor/fontawesome-free/css/all.min.css';
// import '../../styles/css/resume.min.css';

export default function NavBar() {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const dataSistema = new Date().toDateString();

  function handleSignOut() {
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
          <Nav.Link href="/protocolo">Requisição</Nav.Link>
          <Nav.Link href="/requisicao">Orçamento</Nav.Link>
          <NavDropdown title="Configurações" id="basic-nav-dropdown">
            <NavDropdown.Item href="/formmedida">
              Unidades de Medida
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/formdepartamento">
              Departamentos
            </NavDropdown.Item>
            <NavDropdown.Item href="/formempresa">Empresas</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/formfavorecido">
              Favorecidos
            </NavDropdown.Item>
            <NavDropdown.Item href="/formfornecedor">
              Fornecedores
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/formproduto">Produtos</NavDropdown.Item>
            <NavDropdown.Item href="/formservico">Serviços</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/formgrupo">Grupos</NavDropdown.Item>
            <NavDropdown.Item href="/formmarca">Marcas</NavDropdown.Item>
            <NavDropdown.Item href="/formtipocompra">
              Tipos de Compras
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Link onClick={handleSignOut} href="/">
            Sair
          </Nav.Link>
        </Nav>
        <Navbar.Text>
          Logado:{' '}
          <a href="/login">
            {user.username !== undefined
              ? `${user.username.toUpperCase()}`
              : dataSistema}
          </a>
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
    // <nav className="navbar navbar-expand-lg bg-warning fixed-top" id="sideNav">
    //   <div className="nav-link js-scroll-trigger bg-warning font-weight-bold mt-5 d-none d-lg-block">
    //     <a href="/">
    //       <span>
    //         {user.username !== undefined
    //           ? `Usuário: ${user.username.toUpperCase()}`
    //           : dataSistema}
    //       </span>
    //     </a>
    //   </div>
    //   <div className="p-1 d-none d-lg-block">
    //     {/* {signed ? <Notifications /> : <h4>Notify</h4>} */}
    //   </div>

    //   <a className="navbar-brand js-scroll-trigger" href="/">
    //     <span className="d-block d-lg-none">FUNEPE - COMPRAS</span>
    //     <span className="d-none d-lg-block">
    //       <img
    //         className="img-fluid rounded mx-auto mb-1"
    //         src={logo}
    //         alt="logo"
    //         width={100}
    //         height={100}
    //       />
    //     </span>
    //   </a>
    //   <button
    //     className="navbar-toggler"
    //     type="button"
    //     data-toggle="collapse"
    //     data-target="#navbarSupportedContent"
    //     aria-controls="navbarSupportedContent"
    //     aria-expanded="false"
    //     aria-label="Toggle navigation"
    //   >
    //     <span className="navbar-toggler-icon" />
    //   </button>
    //   <div className="collapse navbar-collapse" id="navbarSupportedContent">
    //     <ul
    //       className="navbar-nav"
    //       style={{ color: 'green', fontWeight: 'bold', fontSize: '12px' }}
    //     >
    //       <li className="nav-item">
    //         <a className="nav-link js-scroll-trigger" href="/home">
    //           Home
    //         </a>
    //       </li>
    //       <li className="nav-item">
    //         <Nav.Link href="/protocolo">Requisição</Nav.Link>
    //       </li>
    //       <li className="nav-item">
    //         <Nav.Link href="/requisicao">Orçamento</Nav.Link>
    //       </li>
    //       <DropdownButton id="dropdown-basic-button" title="Orçamento">
    //         <Dropdown.Item href="/requisicao">Orçamento</Dropdown.Item>
    //       </DropdownButton>

    //       <li className="nav-item">
    //         <Nav.Link onClick={handleSignOut} href="/">
    //           Sair
    //         </Nav.Link>
    //       </li>
    //     </ul>
    //   </div>
    // </nav>
  );
}
