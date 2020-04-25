/* eslint-disable no-console */
import React from 'react';
import { Modal, Button, Form, Container, Card, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { despachoModalClose } from '../../../redux/features/context/contextSlice';

export default function Despacho() {
  const dispatch = useDispatch();
  const { despachoModal } = useSelector(state => state.contexto);
  const { grupos, usuarios } = useSelector(state => state.protocolo);
  const [idGrupo, setIdGrupo] = React.useState([]);
  const [idUsuario, setIdUsuario] = React.useState([]);
  const [anotacao, setAnotacao] = React.useState(
    'Tomar providências necessárias.'
  );
  console.log(idGrupo, idUsuario, anotacao);

  function onChangeUsuario(e) {
    const val = e.target.value;
    console.log('val: ', val);
    const usuarios1 = idUsuario.concat(val);
    console.log('users: ', usuarios1);
    setIdUsuario(usuarios1);
    const combined = [...idUsuario, ...val];
    console.log('combined: ', combined);
    const merged = combined.filter(
      (item, index) => combined.indexOf(item) === index
    );
    console.log('merged: ', merged);
    setIdUsuario(merged);
  }

  function onChangeGrupo(e) {
    const val = e.target.value;
    setIdGrupo([...idGrupo, val]);
  }

  const handleClose = () => dispatch(despachoModalClose());
  return (
    <Container>
      <Form>
        <Modal
          variant="danger"
          dialogClassName="modal-danger"
          size="lg"
          animation
          show={despachoModal}
          onHide={handleClose}
        >
          <Modal.Body>
            <Card bg="success" text="light" key={1}>
              <Card.Body>
                <Card.Title>Remeter Documento</Card.Title>
                <Container>
                  <Form.Row>
                    <Form.Group as={Col} controlId="editPrazo">
                      <Form.Label>Grupos:</Form.Label>
                      <Form.Control
                        as="select"
                        multiple
                        value={idGrupo}
                        onChange={onChangeGrupo}
                      >
                        {grupos.length > 0
                          ? grupos.map(grupo => (
                              <option key={grupo.idgrupo} value={grupo.idgrupo}>
                                {grupo.descricaogrupo}
                              </option>
                            ))
                          : ''}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} controlId="editNrProtocolo">
                      <Form.Label>Usuários:</Form.Label>
                      <Form.Control
                        as="select"
                        multiple
                        value={idUsuario}
                        onChange={onChangeUsuario}
                      >
                        {usuarios.length > 0
                          ? usuarios.map(usuario => (
                              <option
                                key={usuario.idusuario}
                                value={usuario.idusuario}
                              >
                                {usuario.username}
                              </option>
                            ))
                          : ''}
                      </Form.Control>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} controlId="editDepacho">
                      <Form.Label>Despacho</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="3"
                        // placeholder="Tomar providências necessárias."
                        value={anotacao}
                        onChange={e => setAnotacao(e.target.value)}
                      />
                    </Form.Group>
                  </Form.Row>
                </Container>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
    </Container>
  );
}
