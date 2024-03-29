import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import IdleTimer from 'react-idle-timer';

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
import Almoxarifado from '../compras/cadastro/Almoxarifado';
import UnidadeMedida from '../compras/cadastro/UnidadeMedida';
import TipoTelefone from '../compras/cadastro/TipoTelefone';
import TipoEmpresa from '../compras/cadastro/TipoEmpresa';
import TipoFornecedor from '../compras/cadastro/TipoFornecedor';
import RequisicaoList from '../compras/requisicao/RequisicaoList';
import Orcamento from '../compras/requisicao/Orcamento';
import OrcamentoReq from '../compras/requisicao/OrcamentoReq';
import MinhaReq from '../compras/requisicao/MinhaReq';
import VisualizarPDF from '../compras/requisicao/VisualizarPDF';
import Perfil from '../pages/usuario/Perfil/index';
import EmailParaFornecedor from '../compras/requisicao/EmailParaFornecedor';
import PriceTable from '../compras/requisicao/PriceTable';

import { signOut } from '../store/modules/auth/actions';

export default function Routes() {
  const { signed } = useSelector(state => state.auth);

  const dispatch = useDispatch();
  // eslint-disable-next-line
  let idleTimer = null;
  function onActive() {
    console.log('onActive');
  }
  function onIdle() {
    console.log('onIdle');
    if (signed) {
      dispatch(signOut());
    }
  }
  function onAction() {
    console.log('onAction');
  }

  return (
    <>
      <IdleTimer
        ref={ref => {
          idleTimer = ref;
        }}
        element={document}
        onActive={onActive}
        onIdle={onIdle}
        onAction={onAction}
        debounce={250}
        timeout={1000 * 60 * 5}
      />
      <Switch>
        <Route path="/" exact component={Auth} />
        <Route path="/mailtoforn" component={EmailParaFornecedor} />

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
            <Route path="/almoxarifado" component={Almoxarifado} />
            <Route path="/formproduto" component={Produtos} />
            <Route path="/formtipotel" component={TipoTelefone} />
            <Route path="/formtipoforn" component={TipoFornecedor} />
            <Route path="/formtipoempresa" component={TipoEmpresa} />
            <Route path="/requisicao" component={RequisicaoList} />
            <Route path="/orcamento" component={Orcamento} />
            <Route path="/orcamentoreq" component={OrcamentoReq} />
            <Route path="/minhareq" component={MinhaReq} />
            <Route path="/pdf" component={VisualizarPDF} />
            <Route path="/meuperfil" component={Perfil} />
            <Route path="/usuario" component={Usuario} />
            <Route path="/menorpreco" component={PriceTable} />
          </>
        ) : (
          <Redirect to="/" />
        )}
      </Switch>
    </>
  );
}
