import React from 'react';

// import { Container, Content } from 'react-bootstrap';
// import logo from '~/assets/logo.png';
import NavBar from './NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/css/resume.min.css';

export default function Atividade() {
  return (
    <>
      <NavBar />
      <section className="resume-section p-3 p-lg-5 d-flex" id="about">
        <div className="w-100">
          <h1 className="mb-0">
            <span className="text-success">Atividades do Paciente</span>
          </h1>
          <div className="subheading mb-5">Registros dos pacientes</div>
          <p className="lead mb-5">Em desenvolvimento</p>
          <div className="social-icons">
            <a href="#ww">
              <i className="fab fa-linkedin-in" />
            </a>
            <a href="#ww">
              <i className="fab fa-github" />
            </a>
            <a href="#ww">
              <i className="fab fa-twitter" />
            </a>
            <a href="#ww">
              <i className="fab fa-facebook-f" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
