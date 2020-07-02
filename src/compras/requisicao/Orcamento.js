import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';

import NavBar from './NavBar';

export default function Orcamento() {
  return (
    <Container>
      <NavBar />
    </Container>
  );
}
