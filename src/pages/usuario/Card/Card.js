/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React from 'react';

import { Card } from 'react-bootstrap';

import logo from '~/assets/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/vendor/fontawesome-free/css/all.min.css';
import '../../styles/css/resume.min.css';

export default function NavBar() {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top"
      id="sideNav"
    >
      <a className="navbar-brand js-scroll-trigger my-1 mb-2" href="/">
        <h4 className="text-success d-block d-lg-none">ICM</h4>
        <span className="d-none d-lg-block">
          <h4>ICM</h4>
          <img
            className="img-fluid img-profile rounded-circle mx-1 mb-2"
            src={logo}
            alt="logo"
            width={60}
            height={60}
          />
        </span>
      </a>
      <Card className="d-none d-lg-block">
        <Card.Header>Quadro de Avisos</Card.Header>
        <Card.Body>
          <blockquote className="blockquote mb-0">
            <p>
              {' '}
              As doenças do coração são, na maioria das vezes, assintomáticas ou
              seja, não avisam. Assim é importante a prevenção, principalmente
              nas pessoas que tem familiares que já apresentaram problemas
              cardiológicos.{' '}
            </p>
            <footer className="blockquote-footer">
              Instituto do Coração de Marília{' '}
              <cite title="Source Title">ICM</cite>
            </footer>
          </blockquote>
        </Card.Body>
      </Card>
    </nav>
  );
}
