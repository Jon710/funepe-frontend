import React from 'react';

import { Card, Button } from 'react-bootstrap';
// import logo from '~/assets/logo.png';
// import NavBar from './NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/css/resume.min.css';

export default function Agenda() {
  return (
    <>
      {/* <NavBar /> */}
      <section className="resume-section p-3 p-lg-5 d-flex" id="c_agenda">
        <Card className="text-center">
          <Card.Header>Featured</Card.Header>
          <Card.Body>
            <Card.Title>Special title treatment</Card.Title>
            <Card.Text>
              With supporting text below as a natural lead-in to additional
              content.
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
          <Card.Footer className="text-muted">2 days ago</Card.Footer>
        </Card>
      </section>
    </>
  );
}
