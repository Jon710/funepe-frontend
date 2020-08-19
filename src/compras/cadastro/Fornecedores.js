import React, { useState, useEffect } from 'react';
import {
  Table,
  Container,
  Button,
  Modal,
  Form,
  Row,
  Col,
} from 'react-bootstrap';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import AlertError from '../../pages/alerts/AlertError';
import NavBar from '../requisicao/NavBar';

import api from '../../services/api';
import { selectAllFornecedores } from '../../redux/features/compras/comprasSlice';
import { showAlertErrorOpen } from '../../redux/features/context/contextSlice';

export default function Fornecedores() {
  const [idfornecedor, setIdFornecedor] = useState();
  const [idtipofornecedor, setIdTipoFornecedor] = useState();
  const [descricao, setDescricao] = useState('');
  const [descricaoTipoFornecedor, setDescricaoTipoFornecedor] = useState('');
  const [tipoFornece, setTipoFornece] = useState(1);
  const [ativo, setAtivo] = useState();
  const [razaosocial, setRazaoSocial] = useState('');
  const [nomefantasia, setNomeFantasia] = useState('');
  const [cpf_cnpj, setCpfCnpj] = useState();
  const [rg_ie, setRgIe] = useState();
  const [observacao, setObservacao] = useState('');
  const [prod_servicos, setProdServicos] = useState('');
  const [emailprincipal, setEmailPrincipal] = useState('');
  const [inscricaomunicipal, setInscricaoMunicipal] = useState('');
  const [endereco, setEndereco] = useState('');
  const [show, setShow] = useState(false);
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const { fornecedores, tipoFornecedores } = useSelector(
    state => state.compras
  );
  const { showAlertError } = useSelector(state => state.contexto);
  const dispatch = useDispatch();

  useEffect(() => {
    const arrayForn = [];

    async function loadSelectTipoForn() {
      if (tipoFornecedores.length > 0) {
        tipoFornecedores.forEach(tipo => {
          arrayForn.push({
            value: tipo.idtipofornecedor,
            label: tipo.descricao,
          });
        });
      }
      setDescricao(arrayForn);
    }

    loadSelectTipoForn();
  }, [tipoFornecedores]);

  const onChangeTipoForn = selectedOption =>
    setIdTipoFornecedor(selectedOption.value);
  const handleCloseEdit = () => setShowEdit(false);
  const handleCloseDetalhes = () => setShowDetalhes(false);
  const handleShowCadastrar = () => setShow(true);
  const handleCloseCadastrar = () => setShow(false);

  async function handleCadastrarFornecedor(e) {
    e.preventDefault();

    const novoFornecedor = {
      idtipofornecedor,
      ativo,
      tipofornecedor: tipoFornece,
      razaosocial,
      nomefantasia,
      cpf_cnpj,
      rg_ie,
      observacao,
      prod_servicos,
      inscricaomunicipal,
      emailprincipal,
      endereco,
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
        dispatch(
          showAlertErrorOpen({
            showAlertError: true,
            alertError: `${error.response.data.error}`,
          })
        );
      });
  }

  async function handleShowDetalhes(forn, e) {
    e.preventDefault();
    setDescricaoTipoFornecedor(forn.tipofornece.descricao);
    setIdFornecedor(forn.idfornecedor);
    setIdTipoFornecedor(forn.idtipofornecedor);
    setTipoFornece(forn.tipofornecedor);
    setInscricaoMunicipal(forn.inscricaomunicipal);
    setAtivo(forn.ativo);
    setRazaoSocial(forn.razaosocial);
    setNomeFantasia(forn.nomefantasia);
    setCpfCnpj(forn.cpf_cnpj);
    setRgIe(forn.rg_ie);
    setObservacao(forn.observacao);
    setProdServicos(forn.prod_servicos);

    setShowDetalhes(true);
  }

  async function handleEdit(e) {
    e.preventDefault();
    const editFornecedor = {
      idtipofornecedor,
      tipofornecedor: tipoFornece,
      ativo,
      inscricaomunicipal,
      razaosocial,
      nomefantasia,
      cpf_cnpj,
      rg_ie,
      endereco,
      observacao,
      prod_servicos,
      emailprincipal,
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
            alertError: `${error.response.data.error} Algo com o ${nomefantasia}`,
          })
        );
      });
  }

  function handleShowEdit(forn) {
    setShowEdit(true);
    setIdFornecedor(forn.idfornecedor);
    setTipoFornece(forn.tipofornecedor);
    setAtivo(forn.ativo);
    setRazaoSocial(forn.razaosocial);
    setInscricaoMunicipal(forn.inscricaomunicipal);
    setNomeFantasia(forn.nomefantasia);
    setCpfCnpj(forn.cpf_cnpj);
    setRgIe(forn.rg_ie);
    setObservacao(forn.observacao);
    setProdServicos(forn.prod_servicos);
    setEmailPrincipal(forn.emailprincipal);
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

      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>Tipo de Fornecedor</th>
            <th>Observação</th>
            <th>Nome Fantasia</th>
            <th>Menu</th>
          </tr>
        </thead>
        <tbody>
          {fornecedores.map(fornecedor => (
            <tr key={fornecedor.idfornecedor}>
              <td>{fornecedor.tipofornece.descricao}</td>
              <td>{fornecedor.observacao}</td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
                  : 'Nenhum fornecedor cadastrado.'}
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Email
            </Form.Label>
            <Col sm="10">
              <Form.Control
                value={emailprincipal}
                onChange={e => setEmailPrincipal(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Endereço
            </Form.Label>
            <Col sm="10">
              <Form.Control
                value={endereco}
                onChange={e => setEndereco(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Ativo
            </Form.Label>
            <Col sm="10">
              <Form.Control
                value={ativo}
                onChange={e => setAtivo(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              RG/IE
            </Form.Label>
            <Col sm="10">
              <Form.Control
                value={rg_ie}
                onChange={e => setRgIe(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Inscrição Municipal
            </Form.Label>
            <Col sm="10">
              <Form.Control
                value={rg_ie}
                onChange={e => setInscricaoMunicipal(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Nome Fantasia
            </Form.Label>
            <Col sm="10">
              <Form.Control
                value={nomefantasia}
                onChange={e => setNomeFantasia(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              CPF/CNPF
            </Form.Label>
            <Col sm="10">
              <Form.Control
                value={cpf_cnpj}
                onChange={e => setCpfCnpj(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Prod/Serviços
            </Form.Label>
            <Col sm="10">
              <Form.Control
                value={prod_servicos}
                onChange={e => setProdServicos(e.target.value)}
              />
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
                value={observacao}
                onChange={e => setObservacao(e.target.value)}
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
                value={razaosocial}
                onChange={e => setRazaoSocial(e.target.value)}
              />
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
              Email
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={emailprincipal} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Endereço
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={endereco} />
            </Col>
          </Form.Group>
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
              Inscrição Municipal
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={inscricaomunicipal} />
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

      <Modal show={show} onHide={handleCloseCadastrar} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Novo Fornecedor</Modal.Title>
        </Modal.Header>
        {showAlertError ? <AlertError /> : null}

        <Modal.Body>
          <Form
            // noValidate
            // validated={validated}
            onSubmit={handleCadastrarFornecedor}
          >
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Tipo de Fornecedor
              </Form.Label>
              <Col sm="10">
                <Select
                  isSearchable
                  options={descricao}
                  onChange={selectedOption => onChangeTipoForn(selectedOption)}
                  placeholder="Selecione o tipo de fornecedor"
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
                </Select>
              </Col>
            </Form.Group>
            <Form.Group>
              <fieldset>
                <Form.Group as={Row}>
                  <Form.Label as="legend" column sm={2}>
                    Ativo
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Check
                      inline
                      value="Sim"
                      type="checkbox"
                      label="SIM"
                      name="formCheckbox"
                      id="form1"
                      onChange={e => setAtivo(e.target.value)}
                    />
                    <Form.Check
                      inline
                      type="checkbox"
                      value="Não"
                      label="NÃO"
                      name="formCheckbox"
                      id="form2"
                      onChange={e => setAtivo(e.target.value)}
                    />
                  </Col>
                </Form.Group>
              </fieldset>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Razão Social
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setRazaoSocial(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Nome Fantasia
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setNomeFantasia(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Endereço
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setEndereco(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Email
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="email"
                  onChange={e => setEmailPrincipal(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                CPF/CNPJ
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setCpfCnpj(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                RG/IE
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setRgIe(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Inscrição Municipal
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setInscricaoMunicipal(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Observação
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setObservacao(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group>
              <fieldset>
                <Form.Group as={Row}>
                  <Form.Label as="legend" column sm={2}>
                    Selecione
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Check
                      inline
                      value="Produto"
                      type="checkbox"
                      label="Produto"
                      name="formHorizontalRadios"
                      id="form1"
                      onChange={e => setProdServicos(e.target.value)}
                    />
                    <Form.Check
                      inline
                      type="checkbox"
                      value="Serviço"
                      label="Serviço"
                      name="formHorizontalRadios"
                      id="form2"
                      onChange={e => setProdServicos(e.target.value)}
                    />
                    <Form.Check
                      inline
                      type="checkbox"
                      label="Ambos"
                      value="Ambos"
                      name="formHorizontalRadios"
                      id="form3"
                      onChange={e => setProdServicos(e.target.value)}
                    />
                  </Col>
                </Form.Group>
              </fieldset>
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
