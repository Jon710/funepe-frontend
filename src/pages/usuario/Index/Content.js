import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import Paciente from './Paciente';
import NavBar from './NavBar';

import '../../../styles/css/resume.min.css';

export default function Content() {
  return (
    <>
      <NavBar />
      <div className="container-fluid p-0">
        <Paciente />
      </div>
    </>
  );
}
