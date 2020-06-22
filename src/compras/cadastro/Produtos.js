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
import { selectAllProdutos } from '../../redux/features/compras/comprasSlice';
import { showAlertErrorOpen } from '../../redux/features/context/contextSlice';

export default function Produtos() {
  const [idproduto, setIdProduto] = useState();
  const [idunidade, setIdUnidade] = useState();
  const [idmarca, setIdMarca] = useState();
  const [descricao, setDescricao] = useState('');
  const [inativar, setInativar] = useState();
  const [codigoextra, setCodigoExtra] = useState();
  const [codigobarra, setCodigoBarra] = useState('');
  const [idcategoria, setIdCategoria] = useState();
  const [numeroreferencia, setNumeroReferencia] = useState();
  const [largura, setLargura] = useState();
  const [profundidade, setProfundidade] = useState();
  const [altura, setAltura] = useState();
  const [peso, setPeso] = useState();
  const [frete, setFrete] = useState(false);
  const [garantia, setGarantia] = useState('');
  const [tipo, setTipo] = useState('');
  const [show, setShow] = useState(false);
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [validated, setValidated] = useState(false);

  const { produtos } = useSelector(state => state.compras);
  const { showAlertError } = useSelector(state => state.contexto);
  const dispatch = useDispatch();

  async function handleCadastrarProdutos(e) {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      e.preventDefault();

      const novoProduto = {
        idproduto,
        idunidade,
        idmarca,
        descricao,
        inativar,
        codigoextra,
        codigobarra,
        idcategoria,
        numeroreferencia,
        largura,
        profundidade,
        altura,
        peso,
        frete,
        garantia,
        tipo,
      };

      await api
        .post('produto', novoProduto)
        .then(() => {
          toast.success('Produto cadastrado com sucesso!');
          dispatch(selectAllProdutos());

          setShow(false);
        })
        .catch(error => {
          dispatch(
            showAlertErrorOpen({
              showAlertError: true,
              alertError: `${error.response.data.error}`,
            })
          );
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

  async function handleShowDetalhes(prod, e) {
    e.preventDefault();
    setIdProduto(prod.idproduto);
    setIdUnidade(prod.idunidade);
    setIdMarca(prod.idmarca);
    setDescricao(prod.descricao);
    setInativar(prod.inativar);
    setCodigoExtra(prod.codigoextra);
    setCodigoBarra(prod.codigobarra);
    setIdCategoria(prod.idcategoria);
    setNumeroReferencia(prod.numeroreferencia);
    setLargura(prod.largura);
    setProfundidade(prod.profundidade);
    setAltura(prod.altura);
    setPeso(prod.peso);
    setFrete(prod.frete);
    setGarantia(prod.garantia);
    setPeso(prod.peso);

    setShowDetalhes(true);
  }

  function handleCloseDetalhes() {
    setShowDetalhes(false);
  }

  async function handleDelete(e) {
    e.preventDefault();

    await api
      .delete(`produto/${idproduto}`)
      .then(() => {
        toast.success('Produto deletado!');
        dispatch(selectAllProdutos());
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

  function handleShowDelete(prod, e) {
    e.preventDefault();
    setIdProduto(prod.idproduto);
    setIdUnidade(prod.idunidade);
    setIdMarca(prod.idmarca);
    setDescricao(prod.descricao);
    setInativar(prod.inativa);
    setCodigoExtra(prod.codigoextra);
    setCodigoBarra(prod.codigobarra);
    setIdCategoria(prod.idcategoria);
    setNumeroReferencia(prod.numeroreferencia);
    setLargura(prod.largura);
    setProfundidade(prod.profundidade);
    setAltura(prod.altura);
    setPeso(prod.peso);
    setFrete(prod.frete);
    setGarantia(prod.garantia);
    setPeso(prod.peso);

    setShowDelete(true);
  }

  function handleCloseDelete() {
    setShowDelete(false);
  }

  async function handleEdit(e) {
    e.preventDefault();
    const editProduto = {
      idproduto,
      idunidade,
      idmarca,
      descricao,
      inativar,
      codigoextra,
      codigobarra,
      idcategoria,
      numeroreferencia,
      largura,
      profundidade,
      altura,
      peso,
      frete,
      garantia,
      tipo,
    };

    await api
      .put(`produto/${idproduto}`, editProduto)
      .then(() => {
        toast.success('Produto atualizado com sucesso!');
        dispatch(selectAllProdutos());
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

  function handleShowEdit(prod) {
    setShowEdit(true);
    setIdProduto(prod.idproduto);
    setIdUnidade(prod.idunidade);
    setIdMarca(prod.idmarca);
    setDescricao(prod.descricao);
    setInativar(prod.inativa);
    setCodigoExtra(prod.codigoextra);
    setCodigoBarra(prod.codigobarra);
    setIdCategoria(prod.idcategoria);
    setNumeroReferencia(prod.numeroreferencia);
    setLargura(prod.largura);
    setProfundidade(prod.profundidade);
    setAltura(prod.altura);
    setPeso(prod.peso);
    setFrete(prod.frete);
    setGarantia(prod.garantia);
    setPeso(prod.peso);
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
          Cadastrar Produto
        </Button>
      </div>
      <br />
      {showAlertError ? <AlertError /> : null}

      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>ID Produto</th>
            <th>Descrição</th>
            <th>Inativa</th>
            <th>Menu</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map(produto => (
            <tr key={produto.idproduto}>
              <td>{produto.idproduto}</td>
              <td>{produto.descricao}</td>
              <td>{produto.inativar}</td>
              <td>
                <Button
                  className="btn-success"
                  onClick={e => handleShowDetalhes(produto, e)}
                >
                  Detalhes
                </Button>{' '}
                <Button
                  className="btn-primary"
                  onClick={e => handleShowEdit(produto, e)}
                >
                  Editar
                </Button>{' '}
                <Button
                  className="btn-danger"
                  onClick={e => handleShowDelete(produto, e)}
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
            Tem certeza que deseja deletar este produto?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control type="input" defaultValue={idproduto} />
              <br />
              <Form.Control type="input" defaultValue={idunidade} />
              <br />
              <Form.Control type="input" defaultValue={idmarca} />
              <br />
              <Form.Control type="input" defaultValue={descricao} />
              <br />
              <Form.Control type="input" defaultValue={inativar} />
              <br />
              <Form.Control type="input" defaultValue={codigoextra} />
              <br />
              <Form.Control type="input" defaultValue={codigobarra} />
              <br />
              <Form.Control type="input" defaultValue={idcategoria} />
              <br />
              <Form.Control type="input" defaultValue={numeroreferencia} />
              <br />
              <Form.Control type="input" defaultValue={largura} />
              <br />
              <Form.Control type="input" defaultValue={profundidade} />
              <br />
              <Form.Control type="input" defaultValue={altura} />
              <br />
              <Form.Control type="input" defaultValue={peso} />
              <br />
              <Form.Control type="input" defaultValue={frete} />
              <br />
              <Form.Control type="input" defaultValue={garantia} />
              <br />
              <Form.Control type="input" defaultValue={tipo} />
            </Form.Group>
          </Form>
          <Button type="submit" variant="danger" onClick={handleDelete}>
            Confirmar
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                type="input"
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
              />
              <br />
              <Form.Control
                type="input"
                value={inativar}
                onChange={e => setInativar(e.target.value)}
              />
              <br />
              <Form.Control
                type="input"
                value={codigoextra}
                onChange={e => setCodigoExtra(e.target.value)}
              />
              <br />
              <Form.Control
                type="input"
                value={codigobarra}
                onChange={e => setCodigoBarra(e.target.value)}
              />
              <br />
              <Form.Control
                type="input"
                value={numeroreferencia}
                onChange={e => setNumeroReferencia(e.target.value)}
              />
              <br />
              <Form.Control
                type="input"
                value={largura}
                onChange={e => setLargura(e.target.value)}
              />
              <br />
              <Form.Control
                type="input"
                value={profundidade}
                onChange={e => setProfundidade(e.target.value)}
              />
              <br />
              <Form.Control
                type="input"
                value={altura}
                onChange={e => setAltura(e.target.value)}
              />
              <br />
              <Form.Control
                type="input"
                value={peso}
                onChange={e => setPeso(e.target.value)}
              />
              <br />
              <Form.Control
                type="input"
                value={frete}
                onChange={e => setFrete(e.target.value)}
              />
              <br />
              <Form.Control
                type="input"
                value={garantia}
                onChange={e => setGarantia(e.target.value)}
              />
              <br />
              <Form.Control
                type="input"
                value={tipo}
                onChange={e => setTipo(e.target.value)}
              />
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
              <Form.Control readOnly value={idproduto} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              ID Unidade
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={idunidade} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              ID Marca
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={idmarca} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Inativar
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={inativar} />
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
              Código Extra
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={codigoextra} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Código Barra
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={codigobarra} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              ID Categoria
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={idcategoria} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Número Referencia
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={numeroreferencia} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Largura
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={largura} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Peso
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={peso} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Altura
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={altura} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Profundidade
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={profundidade} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Frete
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={frete} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Garantia
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={garantia} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Tipo
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={tipo} />
            </Col>
          </Form.Group>
        </Modal.Body>
      </Modal>

      <Modal show={show} onHide={handleCloseCadastrar}>
        <Modal.Header closeButton>
          <Modal.Title>Novo Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleCadastrarProdutos}
          >
            <Form.Group controlId="validationProd">
              <Form.Control
                type="text"
                placeholder="ID Unidade"
                onChange={e => setIdUnidade(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="ID Marca"
                onChange={e => setIdMarca(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="Descrição"
                onChange={e => setDescricao(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="Inativar"
                onChange={e => setInativar(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="Código Extra"
                onChange={e => setCodigoExtra(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="Código Barra"
                onChange={e => setCodigoBarra(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="ID Categoria"
                onChange={e => setIdCategoria(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="Número Referencia"
                onChange={e => setNumeroReferencia(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="Largura"
                onChange={e => setLargura(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="Profundidade"
                onChange={e => setProfundidade(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="Altura"
                onChange={e => setAltura(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="Peso"
                onChange={e => setPeso(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="Frete"
                onChange={e => setFrete(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="Garantia"
                onChange={e => setGarantia(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="Tipo"
                onChange={e => setTipo(e.target.value)}
                required
              />
              <br />
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
