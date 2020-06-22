import React, { useState } from 'react';
import {
  Table,
  Container,
  Button,
  Modal,
  Form,
  Row,
  Col,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import AlertError from '../../pages/alerts/AlertError';
import NavBar from '../requisicao/NavBar';

import api from '../../services/api';
import { selectAllFornecedores } from '../../redux/features/compras/comprasSlice';
import { showAlertErrorOpen } from '../../redux/features/context/contextSlice';

export default function Fornecedores() {
  const [idfornecedor, setIdFornecedor] = useState();
  const [codigoextra, setCodigoExtra] = useState();
  const [idtipofornecedor, setIdTipoFornecedor] = useState();
  const [descricaoTipoFornecedor, setDescricaoTipoFornecedor] = useState('');
  const [tipoFornece, setTipoFornece] = useState(1);
  const [ativo, setAtivo] = useState();
  const [razaosocial, setRazaoSocial] = useState('');
  const [nomefantasia, setNomeFantasia] = useState('');
  const [cpf_cnpj, setCpfCnpj] = useState();
  const [rg_ie, setRgIe] = useState();
  const [observacao, setObservacao] = useState('');
  const [prod_servicos, setProdServicos] = useState('');
  const [show, setShow] = useState(false);
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [validated, setValidated] = useState(false);

  const { fornecedores, tipoFornecedores } = useSelector(
    state => state.compras
  );
  const { showAlertError } = useSelector(state => state.contexto);
  const dispatch = useDispatch();

  async function handleCadastrarFornecedor(e) {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      e.preventDefault();

      const novoFornecedor = {
        idtipofornecedor,
        codigoextra,
        ativo,
        tipofornecedor: tipoFornece,
        razaosocial,
        nomefantasia,
        cpf_cnpj,
        rg_ie,
        observacao,
        prod_servicos,
      };

      await api
        .post('fornecedor', novoFornecedor)
        .then(() => {
          toast.success('Fornecedor cadastrado com sucesso!');
          dispatch(selectAllFornecedores());

          setShow(false);
        })
        .catch(error => {
          console.log(error.response.data.error);
          // dispatch(
          //   showAlertErrorOpen({
          //     showAlertError: true,
          //     alertError: `${error.response.data.error}`,
          //   })
          // );
        });
    }
    setValidated(true);
  }

  function handleShowCadastrar() {
    setShow(true);
  }

  function handleCloseCadastrar() {
    setShow(false);
  }

  async function handleShowDetalhes(forn, e) {
    e.preventDefault();
    setDescricaoTipoFornecedor(forn.tipofornece.descricao);
    setIdFornecedor(forn.idfornecedor);
    setCodigoExtra(forn.codigoextra);
    setIdTipoFornecedor(forn.idtipofornecedor);
    setTipoFornece(forn.tipofornecedor);
    setAtivo(forn.ativo);
    setRazaoSocial(forn.razaosocial);
    setNomeFantasia(forn.nomefantasia);
    setCpfCnpj(forn.cpf_cnpj);
    setRgIe(forn.rg_ie);
    setObservacao(forn.observacao);
    setProdServicos(forn.prod_servicos);

    setShowDetalhes(true);
  }

  function handleCloseDetalhes() {
    setShowDetalhes(false);
  }

  async function handleDelete(e) {
    e.preventDefault();

    await api
      .delete(`fornecedor/${idfornecedor}`)
      .then(() => {
        toast.success('Fornecedor deletado!');
        dispatch(selectAllFornecedores());
        setShowDelete(false);
      })
      .catch(error => {
        dispatch(
          showAlertErrorOpen({
            showAlertError: true,
            alertError: `${error.response.data.error} Algum erro com id.`,
          })
        );
      });
  }

  function handleShowDelete(forn, e) {
    e.preventDefault();
    setIdFornecedor(forn.idfornecedor);
    setCodigoExtra(forn.codigoextra);
    setIdTipoFornecedor(forn.idtipofornecedor);
    setTipoFornece(forn.tipofornecedor);
    setAtivo(forn.ativo);
    setRazaoSocial(forn.razaosocial);
    setNomeFantasia(forn.nomefantasia);
    setCpfCnpj(forn.cpf_cnpj);
    setRgIe(forn.rg_ie);
    setObservacao(forn.observacao);
    setProdServicos(forn.prod_servicos);

    setShowDelete(true);
  }

  function handleCloseDelete() {
    setShowDelete(false);
  }

  async function handleEdit(e) {
    e.preventDefault();
    const editFornecedor = {
      codigoextra,
      idtipofornecedor,
      tipofornecedor: tipoFornece,
      ativo,
      razaosocial,
      nomefantasia,
      cpf_cnpj,
      rg_ie,
      observacao,
      prod_servicos,
    };

    await api
      .put(`fornecedor/${idfornecedor}`, editFornecedor)
      .then(() => {
        toast.success('Fornecedor atualizado com sucesso!');
        dispatch(selectAllFornecedores());
      })
      .catch(error => {
        dispatch(
          showAlertErrorOpen({
            showAlertError: true,
            alertError: `${error.response.data.error} Algo com a ${nomefantasia}`,
          })
        );
      });
  }

  function handleShowEdit(forn) {
    setShowEdit(true);
    setCodigoExtra(forn.codigoextra);
    setTipoFornece(forn.tipofornecedor);
    setAtivo(forn.ativo);
    setRazaoSocial(forn.razaosocial);
    setNomeFantasia(forn.nomefantasia);
    setCpfCnpj(forn.cpf_cnpj);
    setRgIe(forn.rg_ie);
    setObservacao(forn.observacao);
    setProdServicos(forn.prod_servicos);
  }

  function handleCloseEdit() {
    setShowEdit(false);
  }

  return (
    <Container>
      <NavBar />
      <br />
      <div>
        <Button className="btn-success" onClick={handleShowCadastrar}>
          Cadastrar Fornecedor
        </Button>
      </div>
      <br />
      {showAlertError ? <AlertError /> : null}

      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>Tipo de Fornecedor</th>
            <th>Ativo</th>
            <th>Razão Social</th>
            <th>Nome Fantasia</th>
            <th>Menu</th>
          </tr>
        </thead>
        <tbody>
          {fornecedores.map(fornecedor => (
            <tr key={fornecedor.idfornecedor}>
              <td>{fornecedor.tipofornece.descricao}</td>
              <td>{fornecedor.ativo}</td>
              <td>{fornecedor.razaosocial}</td>
              <td>{fornecedor.nomefantasia}</td>

              <td>
                <Button
                  className="btn-success"
                  onClick={e => handleShowDetalhes(fornecedor, e)}
                >
                  Detalhes
                </Button>{' '}
                <Button
                  className="btn-primary"
                  onClick={e => handleShowEdit(fornecedor, e)}
                >
                  Editar
                </Button>{' '}
                <Button
                  className="btn-danger"
                  onClick={e => handleShowDelete(fornecedor, e)}
                >
                  Deletar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showDelete} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            Tem certeza que deseja deletar este fornecedor?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control type="input" defaultValue={idfornecedor} />
              <br />
              <Form.Control type="input" defaultValue={codigoextra} />
              <br />
              <Form.Control type="input" defaultValue={idtipofornecedor} />
              <br />
              <Form.Control type="input" defaultValue={tipoFornece} />
              <br />
              <Form.Control type="input" defaultValue={ativo} />
              <br />
              <Form.Control type="input" defaultValue={razaosocial} />
              <br />
              <Form.Control type="input" defaultValue={nomefantasia} />
              <br />
              <Form.Control type="input" defaultValue={cpf_cnpj} />
              <br />
              <Form.Control type="input" defaultValue={rg_ie} />
              <br />
              <Form.Control type="input" defaultValue={observacao} />
              <br />
              <Form.Control type="input" defaultValue={prod_servicos} />
            </Form.Group>
          </Form>
          <Button type="submit" variant="danger" onClick={handleDelete}>
            Confirmar
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={showEdit} onHide={handleCloseEdit} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar fornecedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Tipo de Fornecedor
            </Form.Label>
            <Col sm="10">
              <Form.Control
                as="select"
                onChange={e => setIdTipoFornecedor(e.target.value)}
              >
                {tipoFornecedores.length > 0
                  ? tipoFornecedores.map(tipo => (
                      <option
                        key={tipo.idtipofornecedor}
                        value={tipo.idtipofornecedor}
                      >
                        {tipo.descricao}
                      </option>
                    ))
                  : 'Nenhuma fornecedor cadastrado.'}
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Código Extra
            </Form.Label>
            <Col sm="10">
              <Form.Control
                value={codigoextra}
                onChange={e => setCodigoExtra(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Ativo
            </Form.Label>
            <Col sm="10">
              <Form.Control value={ativo} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              RG/IE
            </Form.Label>
            <Col sm="10">
              <Form.Control value={rg_ie} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Nome Fantasia
            </Form.Label>
            <Col sm="10">
              <Form.Control value={nomefantasia} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              CPF/CNPF
            </Form.Label>
            <Col sm="10">
              <Form.Control value={cpf_cnpj} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Prod/Serviços
            </Form.Label>
            <Col sm="10">
              <Form.Control value={prod_servicos} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Observação
            </Form.Label>
            <Col sm="10">
              <Form.Control as="textarea" rows="2" value={observacao} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Razão Social
            </Form.Label>
            <Col sm="10">
              <Form.Control as="textarea" rows="2" value={razaosocial} />
            </Col>
          </Form.Group>
          <Button type="submit" variant="primary" onClick={handleEdit}>
            Atualizar
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={showDetalhes} onHide={handleCloseDetalhes} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalhes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Tipo de Fornecedor
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={descricaoTipoFornecedor} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Código Extra
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={codigoextra} />
            </Col>
          </Form.Group>
          {/* <Form.Group as={Row}>
            <Form.Label column sm="2">
              ID Tipo Fornecedor
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={idtipofornecedor} />
            </Col>
          </Form.Group> */}
          {/* <Form.Group as={Row}>
            <Form.Label column sm="2">
              Tipo Fornecedor
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={tipoFornece} />
            </Col>
          </Form.Group>{' '} */}
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Ativo
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={ativo} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              RG/IE
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={rg_ie} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Nome Fantasia
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={nomefantasia} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              CPF/CNPF
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={cpf_cnpj} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Prod/Serviços
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={prod_servicos} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Observação
            </Form.Label>
            <Col sm="10">
              <Form.Control
                as="textarea"
                rows="2"
                readOnly
                value={observacao}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Razão Social
            </Form.Label>
            <Col sm="10">
              <Form.Control
                as="textarea"
                rows="2"
                readOnly
                value={razaosocial}
              />
            </Col>
          </Form.Group>
        </Modal.Body>
      </Modal>

      <Modal show={show} onHide={handleCloseCadastrar}>
        <Modal.Header closeButton>
          <Modal.Title>Novo Fornecedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleCadastrarFornecedor}
          >
            <Form.Group controlId="validationFORN">
              <Form.Label>Tipo de Fornecedor</Form.Label>
              <Form.Control
                as="select"
                onChange={e => setIdTipoFornecedor(e.target.value)}
              >
                {tipoFornecedores.length > 0
                  ? tipoFornecedores.map(tipo => (
                      <option
                        key={tipo.idtipofornecedor}
                        value={tipo.idtipofornecedor}
                      >
                        {tipo.descricao}
                      </option>
                    ))
                  : 'Nenhuma fornecedor cadastrado.'}
              </Form.Control>
              <br />
              <Form.Control
                type="text"
                placeholder="Código Extra"
                onChange={e => setCodigoExtra(e.target.value)}
                required
              />
              <br />
              {/* <Form.Control
                type="text"
                placeholder="Tipo de Fornecedor"
                onChange={e => setIdTipoFornecedor(e.target.value)}
                required
              />
              <br /> */}
              <Form.Control
                type="text"
                placeholder="Ativo"
                onChange={e => setAtivo(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="Razão Social"
                onChange={e => setRazaoSocial(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="Nome Fantasia"
                onChange={e => setNomeFantasia(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="CPF/CNPJ"
                onChange={e => setCpfCnpj(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="RG/IE"
                onChange={e => setRgIe(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="Observação"
                onChange={e => setObservacao(e.target.value)}
                required
              />
              <br />
              <Col>
                <Form.Check
                  inline
                  value="P"
                  type="radio"
                  label="Produto"
                  name="formHorizontalRadios"
                  id="form1"
                  onChange={e => setProdServicos(e.target.value)}
                />
                <Form.Check
                  inline
                  type="radio"
                  value="S"
                  label="Serviço"
                  name="formHorizontalRadios"
                  id="form2"
                  onChange={e => setProdServicos(e.target.value)}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Ambos"
                  value="A"
                  name="formHorizontalRadios"
                  id="form3"
                  onChange={e => setProdServicos(e.target.value)}
                />
              </Col>
              <Form.Control.Feedback type="invalid">
                Favor preencher os campos.
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant="primary">
              Criar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
