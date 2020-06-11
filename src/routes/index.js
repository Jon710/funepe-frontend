import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import { useSelector } from 'react-redux';

// import SignUpMed from '../pages/usuario/SignUpMed';
import Protocolo from '../protocolo/Index/Protocolo';
import PaginaInicial from '../protocolo/Cadastro/PaginaInicial';
import Principal from '../pages/home/home';

import Auth from '../pages/usuario/Auth';
import Usuario from '../pages/usuario/Usuario';
import Requisicao from '../compras/requisicao/Requisicao';

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

          <Route path="/cadastros" component={PaginaInicial} />
          <Route path="/usuario" component={Usuario} />
        </>
      ) : (
        <Redirect to="/" />
      )}
    </Switch>
  );
}
