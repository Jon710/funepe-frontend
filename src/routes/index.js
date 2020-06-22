import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import { useSelector } from 'react-redux';

import Protocolo from '../protocolo/Index/Protocolo';
import Principal from '../pages/home/home';

import Auth from '../pages/usuario/Auth';
import Usuario from '../pages/usuario/Usuario';
import Requisicao from '../compras/requisicao/Requisicao';
import Departamento from '../compras/cadastro/Departamento';
import Empresas from '../compras/cadastro/Empresas';
import Fornecedores from '../compras/cadastro/Fornecedores';
import Categoria from '../compras/cadastro/Categoria';
import Marcas from '../compras/cadastro/Marcas';
import Produtos from '../compras/cadastro/Produtos';
import Servicos from '../compras/cadastro/Servicos';
import UnidadeMedida from '../compras/cadastro/UnidadeMedida';
import TipoTelefone from '../compras/cadastro/TipoTelefone';
import TipoEmpresa from '../compras/cadastro/TipoEmpresa';
import TipoFornecedor from '../compras/cadastro/TipoFornecedor';

export default function Routes() {
  const { signed } = useSelector(state => state.auth);

  return (
    <Switch>
      <Route path="/" exact component={Auth} />

      {signed ? (
        <>
          <Route path="/home" component={Principal} />
          <Route path="/protocolo" component={Protocolo} />
          <Route path="/requisicao" component={Requisicao} />
          <Route path="/formmedida" component={UnidadeMedida} />
          <Route path="/formdepartamento" component={Departamento} />
          <Route path="/formempresa" component={Empresas} />
          <Route path="/formfornecedor" component={Fornecedores} />
          <Route path="/formcategoria" component={Categoria} />
          <Route path="/formmarca" component={Marcas} />
          <Route path="/formservico" component={Servicos} />
          <Route path="/formproduto" component={Produtos} />
          <Route path="/formtipotel" component={TipoTelefone} />
          <Route path="/formtipoforn" component={TipoFornecedor} />
          <Route path="/formtipoempresa" component={TipoEmpresa} />

          <Route path="/usuario" component={Usuario} />
        </>
      ) : (
        <Redirect to="/" />
      )}
    </Switch>
  );
}
