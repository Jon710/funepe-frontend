/* eslint-disable no-return-assign */
import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  Modal,
  Form,
  FormControl,
  Row,
  Col,
  Card,
  InputGroup,
} from 'react-bootstrap';
import { Grid, Table as TablerTable } from 'tabler-react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import AlertError from '../../pages/alerts/AlertError';
import NavBar from '../requisicao/NavBar';
import api from '../../services/api';
import { showAlertErrorOpen } from '../../redux/features/context/contextSlice';
import {
  selectProdutoByDescricao,
  requisicaoSuccess,
} from '../../redux/features/compras/comprasSlice';

export default function Produtos() {
  const [idproduto, setIdProduto] = useState();
  const [idunidade, setIdUnidade] = useState();
  const [unidadeDescricao, setUnidadeDescricao] = useState('');
  const [marcaDescricao, setMarcaDescricao] = useState('');
  const [idmarca, setIdMarca] = useState(3);
  const [descricao, setDescricao] = useState('');
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
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listaProdutos, setListaProdutos] = useState([]);
  const [pesquisaDescricao, setPesquisaDescricao] = useState('');
  const { marcas, unidadeMedidas } = useSelector(state => state.compras);
  const { showAlertError } = useSelector(state => state.contexto);
  const dispatch = useDispatch();

  useEffect(() => {
    // const arrayCategoria = [];
    const arrayUnidade = [];
    const arrayMarca = [];

    async function loadSelectUnidades() {
      if (unidadeMedidas.length > 0) {
        unidadeMedidas.forEach(unidade => {
          arrayUnidade.push({
            value: unidade.idunidade,
            label: unidade.descricao,
          });
        });
      }
      setUnidadeDescricao(arrayUnidade);
    }

    // async function loadSelectCategorias() {
    //   if (categorias.length > 0) {
    //     categorias.forEach(categoria => {
    //       arrayCategoria.push({
    //         value: categoria.idcategoria,
    //         label: categoria.categoria,
    //       });
    //     });
    //   }
    //   setCategoriaDescricao(arrayCategoria);
    // }

    async function loadSelectMarcas() {
      if (marcas.length > 0) {
        marcas.forEach(marca => {
          arrayMarca.push({
            value: marca.idmarca,
            label: marca.descricao,
          });
        });
      }
      setMarcaDescricao(arrayMarca);
    }
    loadSelectMarcas();
    // loadSelectCategorias();
    loadSelectUnidades();
  }, [unidadeMedidas, marcas]);

  const onChangeUnidade = selectedOption => setIdUnidade(selectedOption.value);
  const handleShowCadastrar = () => setShow(true);
  const handleCloseCadastrar = () => setShow(false);
  const handleCloseDetalhes = () => setShowDetalhes(false);
  const handleCloseEdit = () => setShowEdit(false);

  async function handleCadastrarProdutos(e) {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      e.preventDefault();

      const novoProduto = {
        idunidade,
        idmarca,
        descricao,
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
        .post('produtos', novoProduto)
        .then(() => {
          toast.success('Produto cadastrado com sucesso!');
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

  async function handleShowDetalhes(prod) {
    setIdProduto(prod.idproduto);
    setUnidadeDescricao(prod.unidade);
    setMarcaDescricao(prod.marca);
    setDescricao(prod.produto);
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

  async function handleEdit(e) {
    e.preventDefault();
    const editProduto = {
      idproduto,
      idunidade,
      idmarca,
      descricao,
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
      .put(`produtos/${idproduto}`, editProduto)
      .then(() => {
        toast.success('Produto atualizado com sucesso!');
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

  function handleShowEdit(prod) {
    setIdProduto(prod.idproduto);
    setIdUnidade(prod.idunidade);
    setUnidadeDescricao(unidadeDescricao);
    setIdMarca(prod.idmarca);
    setMarcaDescricao(prod.marca);
    setDescricao(prod.produto);
    setNumeroReferencia(prod.numeroreferencia);
    setLargura(prod.largura);
    setProfundidade(prod.profundidade);
    setAltura(prod.altura);
    setPeso(prod.peso);
    setFrete(prod.frete);
    setGarantia(prod.garantia);
    setPeso(prod.peso);
    setShowEdit(true);
  }

  function handlePesquisarProdutos() {
    dispatch(selectProdutoByDescricao(pesquisaDescricao)).then(response => {
      if (response.length > 0) {
        const prods = response.map(produto => ({
          ...produto,
        }));
        setListaProdutos(prods);
        setLoading(true);
      }
    });
  }

  function checkEnter(e) {
    if (e.key === 'Enter') handlePesquisarProdutos();
  }

  async function getProdutoByID(id) {
    try {
      const response = await api.get(`produtos/id/${id}`);

      const { produtoPorID } = response.data;

      setLoading(true);
      setListaProdutos(produtoPorID);
    } catch (error) {
      toast.error('Erro na busca!');
    }
  }

  return (
    <Container>
      <NavBar />
      <br />
      <Row>
        <Col>
          <Button className="btn-success" onClick={handleShowCadastrar}>
            Cadastrar Produto/Serviço
          </Button>
        </Col>
      </Row>
      <br />

      <Card>
        <Card.Header>
          <h4 className="mb-0">
            <span className="text-success">Pesquisar Produto/Serviço</span>
          </h4>
        </Card.Header>
        <Card.Body>
          <Grid.Row>
            <Grid.Col sm={8}>
              <InputGroup className="mb-3">
                <FormControl
                  style={{ textTransform: 'uppercase' }}
                  value={pesquisaDescricao}
                  required
                  type="text"
                  placeholder="Descrição"
                  onChange={e => setPesquisaDescricao(e.target.value)}
                  onKeyPress={e => checkEnter(e)}
                />
                <InputGroup.Append>
                  <Button
                    type="button"
                    color="success"
                    onClick={() => handlePesquisarProdutos()}
                  >
                    Buscar
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Grid.Col>

            <Grid.Col sm={4}>
              <InputGroup className="mb-3">
                <FormControl
                  value={idproduto}
                  type="number"
                  onChange={e => setIdProduto(e.target.value)}
                  placeholder="Buscar produto por ID"
                />
                <InputGroup.Append>
                  <Button
                    variant="primary"
                    onClick={() => getProdutoByID(idproduto)}
                  >
                    Buscar
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Grid.Col>
          </Grid.Row>
        </Card.Body>
      </Card>
      <br />

      {loading ? (
        <>
          <Card>
            <TablerTable responsive="sm" bordered="true" hover="true" size="sm">
              <TablerTable.Header>
                <TablerTable.Row>
                  <TablerTable.ColHeader>ID</TablerTable.ColHeader>
                  <TablerTable.ColHeader>Descrição</TablerTable.ColHeader>
                  <TablerTable.ColHeader>
                    Unidade de Medida
                  </TablerTable.ColHeader>
                  <TablerTable.ColHeader>Menu</TablerTable.ColHeader>
                </TablerTable.Row>
              </TablerTable.Header>
              <TablerTable.Body>
                {listaProdutos.map(produto => (
                  <TablerTable.Row key={produto.idproduto}>
                    <TablerTable.Col>{produto.idproduto}</TablerTable.Col>
                    <TablerTable.Col>{produto.produto}</TablerTable.Col>
                    <TablerTable.Col>{produto.unidade}</TablerTable.Col>
                    <TablerTable.Col>
                      <Button onClick={() => handleShowEdit(produto)}>
                        Editar
                      </Button>{' '}
                      <Button
                        variant="success"
                        onClick={() => handleShowDetalhes(produto)}
                      >
                        Detalhes
                      </Button>
                    </TablerTable.Col>
                  </TablerTable.Row>
                ))}
              </TablerTable.Body>
            </TablerTable>
          </Card>
        </>
      ) : (
        <div />
      )}

      <Modal show={showEdit} onHide={handleCloseEdit} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar produto</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleEdit}>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Unidade de Medida
              </Form.Label>
              <Col sm="10">
                <Select
                  singleOption
                  options={unidadeDescricao}
                  onChange={selectedOption => onChangeUnidade(selectedOption)}
                  placeholder="Selecione uma unidade"
                >
                  {unidadeMedidas.map(unidade => (
                    <option key={unidade.idunidade} value={unidade.descricao}>
                      {unidade.descricao}
                    </option>
                  ))}
                </Select>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Descrição
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Marca
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  value={marcaDescricao}
                  onChange={e => setMarcaDescricao(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Número Referencia
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  value={numeroreferencia}
                  onChange={e => setNumeroReferencia(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Largura
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  value={largura}
                  type="text"
                  onChange={e => setLargura(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Profundidade
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  value={profundidade}
                  onChange={e => setProfundidade(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Altura
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  value={altura}
                  onChange={e => setAltura(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Peso
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  value={peso}
                  onChange={e => setPeso(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Frete
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  value={frete}
                  onChange={e => setFrete(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Garantia
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  value={garantia}
                  onChange={e => setGarantia(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Tipo
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  value={tipo}
                  onChange={e => setTipo(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
            <Button type="submit" variant="primary">
              Atualizar
            </Button>
          </Form>
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
              Unidade de Medida
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={unidadeDescricao} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Marca
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={marcaDescricao} />
            </Col>
          </Form.Group>
          {/* <Form.Group as={Row}>
            <Form.Label column sm="2">
              Inativar
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={inativar} />
            </Col>
          </Form.Group> */}
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Descrição
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={descricao} />
            </Col>
          </Form.Group>
          {/* <Form.Group as={Row}>
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
          </Form.Group> */}
          {/* <Form.Group as={Row}>
            <Form.Label column sm="2">
              Categoria
            </Form.Label>
            <Col sm="10">
              <Form.Control readOnly value={idcategoria} />
            </Col>
          </Form.Group> */}
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

      <Modal show={show} onHide={handleCloseCadastrar} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Novo Produto</Modal.Title>
        </Modal.Header>
        {showAlertError ? <AlertError /> : null}

        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleCadastrarProdutos}
          >
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Unidade de Medida
              </Form.Label>
              <Col sm="10">
                <Select
                  isSearchable
                  options={unidadeDescricao}
                  onChange={selectedOption => onChangeUnidade(selectedOption)}
                  placeholder="Selecione uma unidade"
                >
                  {unidadeMedidas.length > 0
                    ? unidadeMedidas.map(unidade => (
                        <option
                          key={unidade.idunidade}
                          value={unidade.descricao}
                        >
                          {unidade.descricao}
                        </option>
                      ))
                    : 'Nenhuma unidade de medida cadastrada.'}
                </Select>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Marca
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  readOnly
                  defaultValue={marcas[0].descricao}
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
                <Form.Control.Feedback type="invalid">
                  Favor preencher os campos.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Número Referencia
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setNumeroReferencia(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Largura
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setLargura(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Profundidade
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setProfundidade(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Altura
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setAltura(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Peso
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setPeso(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Frete
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setFrete(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Garantia
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setGarantia(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Tipo
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  onChange={e => setTipo(e.target.value)}
                />
              </Col>
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
