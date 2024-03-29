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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import AlertError from '../../pages/alerts/AlertError';
import NavBar from '../requisicao/NavBar';

import api from '../../services/api';
import { selectAllEmpresas } from '../../redux/features/compras/comprasSlice';
import { showAlertErrorOpen } from '../../redux/features/context/contextSlice';

export default function Empresas() {
  const [idempresa, setIdEmpresa] = useState();
  const [idtipoempresa, setIdTipoEmpresa] = useState();
  const [tipoempresa, setTipoEmpresa] = useState('');
  const [ativo, setAtivo] = useState();
  const [matriz, setMatriz] = useState();
  const [descricao, setDescricao] = useState('');
  const [razaosocial, setRazaoSocial] = useState('');
  const [nomefantasia, setNomeFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [inscricaoestadual, setInscricaoEstadual] = useState('');
  const [inscricaomunicipal, setInscricaoMunicipal] = useState('');
  const [dataabertura, setDataAbertura] = useState(new Date());
  const [observacao, setObservacao] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState();
  const [bairro, setBairro] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cep, setCep] = useState();
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [show, setShow] = useState(false);
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [validated, setValidated] = useState(false);
  const { empresas, tipoEmpresas } = useSelector(state => state.compras);
  const { showAlertError } = useSelector(state => state.contexto);
  const dispatch = useDispatch();

  function handleDate(date) {
    setDataAbertura(date);
  }

  async function handleCadastrarEmpresa(e) {
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      e.preventDefault();

      const novaEmpresa = {
        idtipoempresa,
        ativo,
        matriz,
        descricao,
        razaosocial,
        nomefantasia,
        cnpj,
        inscricaoestadual,
        inscricaomunicipal,
        dataabertura,
        observacao,
        logradouro,
        numero,
        bairro,
        complemento,
        cep,
        cidade,
        estado,
      };

      await api
        .post('empresa', novaEmpresa)
        .then(() => {
          toast.success('Empresa cadastrada com sucesso!');
          dispatch(selectAllEmpresas());
          setShow(false);
        })
        .catch(error => {
          console.log(error);
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

  async function handleShowDetalhes(empresa, e) {
    e.preventDefault();

    const parsedData = parseISO(empresa.dataabertura);
    const dataFormatada = format(parsedData, 'dd/MM/yyyy', {
      locale: pt,
    });

    setIdEmpresa(empresa.idempresa);
    setIdTipoEmpresa(empresa.idtipoempresa);
    setTipoEmpresa(empresa.tipoempresa.descricao);
    setAtivo(empresa.ativo);
    setMatriz(empresa.matriz);
    setDescricao(empresa.descricao);
    setRazaoSocial(empresa.razaosocial);
    setNomeFantasia(empresa.nomefantasia);
    setCnpj(empresa.cnpj);
    setInscricaoEstadual(empresa.inscricaoestadual);
    setInscricaoMunicipal(empresa.inscricaomunicipal);
    setDataAbertura(dataFormatada);
    setObservacao(empresa.observacao);
    setLogradouro(empresa.logradouro);
    setNumero(empresa.numero);
    setBairro(empresa.bairro);
    setComplemento(empresa.complemento);
    setCep(empresa.cep);
    setCidade(empresa.cidade);
    setEstado(empresa.estado);

    setShowDetalhes(true);
  }

  function handleCloseDetalhes() {
    setShowDetalhes(false);
  }

  async function handleEdit(e) {
    e.preventDefault();
    const editEmpresa = {
      idempresa,
      idtipoempresa,
      ativo,
      matriz,
      descricao,
      razaosocial,
      nomefantasia,
      cnpj,
      inscricaoestadual,
      inscricaomunicipal,
      dataabertura,
      observacao,
      logradouro,
      numero,
      bairro,
      complemento,
      cep,
      cidade,
      estado,
    };

    await api
      .put(`empresa/${idempresa}`, editEmpresa)
      .then(() => {
        toast.success('Empresa atualizada com sucesso!');
        dispatch(selectAllEmpresas());
      })
      .catch(error => {
        dispatch(
          showAlertErrorOpen({
            showAlertError: true,
            alertError: `${error.response.data.error} Algo com a ${descricao}`,
          })
        );
      });
  }

  function handleShowEdit(empresa) {
    setShowEdit(true);
    setIdEmpresa(empresa.idempresa);
    setIdTipoEmpresa(empresa.idtipoempresa);
    setAtivo(empresa.ativo);
    setMatriz(empresa.matriz);
    setDescricao(empresa.descricao);
    setRazaoSocial(empresa.razaosocial);
    setNomeFantasia(empresa.nomefantasia);
    setCnpj(empresa.cnpj);
    setInscricaoEstadual(empresa.inscricaoestadual);
    setInscricaoMunicipal(empresa.inscricaomunicipal);
    setDataAbertura(empresa.dataabertura);
    setObservacao(empresa.observacao);
    setLogradouro(empresa.logradouro);
    setNumero(empresa.numero);
    setBairro(empresa.bairro);
    setComplemento(empresa.complemento);
    setCep(empresa.cep);
    setCidade(empresa.cidade);
    setEstado(empresa.estado);
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
          Cadastrar Empresa
        </Button>
      </div>
      <br />
      {showAlertError ? <AlertError /> : null}

      <Table striped bordered>
        <thead>
          <tr>
            <th>ID Empresa</th>
            <th>Ativo</th>
            <th>Descrição</th>
            <th>Razão Social</th>
            <th>Nome Fantasia</th>
            <th>Menu</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map(empresa => (
            <tr key={empresa.idempresa}>
              <td>{empresa.idempresa}</td>
              <td>{empresa.ativo}</td>
              <td>{empresa.descricao}</td>
              <td>{empresa.razaosocial}</td>
              <td>{empresa.nomefantasia}</td>

              <td>
                <Button
                  className="btn-success"
                  onClick={e => handleShowDetalhes(empresa, e)}
                >
                  Detalhes
                </Button>{' '}
                <Button
                  className="btn-primary"
                  onClick={e => handleShowEdit(empresa, e)}
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
          <Modal.Title>Editar empresa</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Ativo
              </Form.Label>
              <Col sm="10">
                <Form.Control readOnly value={idempresa} />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Matriz
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="input"
                  value={matriz}
                  onChange={e => setMatriz(e.target.value)}
                />{' '}
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Matriz
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="input"
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Razão Social
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="input"
                  value={razaosocial}
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
                  type="input"
                  value={matriz}
                  onChange={e => setNomeFantasia(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                CNPJ
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="input"
                  value={cnpj}
                  onChange={e => setCnpj(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Inscrição Estuadl
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="input"
                  value={inscricaoestadual}
                  onChange={e => setInscricaoEstadual(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Inscricão Municipal
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="input"
                  value={inscricaomunicipal}
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
                  type="input"
                  value={observacao}
                  onChange={e => setObservacao(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Logradouro
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="input"
                  value={logradouro}
                  onChange={e => setLogradouro(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Número
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="input"
                  value={numero}
                  onChange={e => setNumero(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Bairro
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="input"
                  value={bairro}
                  onChange={e => setBairro(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Complemento
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="input"
                  value={complemento}
                  onChange={e => setComplemento(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                CEP
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="input"
                  value={cep}
                  onChange={e => setCep(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Cidade
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="input"
                  value={cidade}
                  onChange={e => setCidade(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Estado
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="input"
                  value={estado}
                  onChange={e => setEstado(e.target.value)}
                />
              </Col>
            </Form.Group>
          </Form>
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
              ID
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={idempresa} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Tipo Empresa
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={tipoempresa} />
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
              Matriz
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={matriz} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Descrição
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={descricao} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              CNPJ
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={cnpj} />
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
              Inscrição Estadual
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={inscricaoestadual} />
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
              Data de Abertura
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={dataabertura} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Logradouro
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={logradouro} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Número
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={numero} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Bairro
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={bairro} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Complemento
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={complemento} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              CEP
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={cep} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Cidade
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={cidade} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Estado
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={estado} />
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
          <Modal.Title>Nova Empresa</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleCadastrarEmpresa}
          >
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Tipo de Empresa
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  onChange={e => setIdTipoEmpresa(e.target.value)}
                >
                  {tipoEmpresas.length > 0
                    ? tipoEmpresas.map(tipo => (
                        <option
                          key={tipo.idtipoempresa}
                          value={tipo.idtipoempresa}
                        >
                          {tipo.descricao}
                        </option>
                      ))
                    : 'Nenhuma empresa cadastrada.'}
                </Form.Control>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Ativo
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setAtivo(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Matriz
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setMatriz(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Descrição
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setDescricao(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Razão Social
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setRazaoSocial(e.target.value)}
                  required
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
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                CNPJ
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setCnpj(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Inscrição Estadual
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setInscricaoEstadual(e.target.value)}
                  required
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
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Data de Abertura
              </Form.Label>
              <Col sm="10">
                <div>
                  <DatePicker
                    selected={dataabertura}
                    onChange={handleDate}
                    className="form-control"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
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
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Logradouro
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setLogradouro(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Número
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setNumero(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Bairro
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setBairro(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Complemento
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setComplemento(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                CEP
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setCep(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Cidade
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setCidade(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Estado
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setEstado(e.target.value)}
                  required
                />
              </Col>
              <Form.Control.Feedback type="invalid">
                Favor preencher todos os campos.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Button type="submit" variant="primary">
                Criar
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
