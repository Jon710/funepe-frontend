import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import { useSelector } from 'react-redux';

import SignUpMed from '../pages/usuario/SignUpMed';
import Protocolo from '../pages/usuario/Index/Protocolo';
import PerfilMedico from '../pages/usuario/PerfilMedico';
import Content from '../pages/usuario/Index/Content';
import Home from '../pages/usuario/Index/Home';
import Paciente from '../pages/usuario/Index/Paciente';
import Medico from '../pages/usuario/Index/Medico';
import Agenda from '../pages/usuario/Index/Agenda';
import Atividade from '../pages/usuario/Index/Atividade';
import PaginaInicial from '../pages/Cadastro/PaginaInicial';

import Auth from '../pages/usuario/Auth';
import Usuario from '../pages/Cadastro/Usuario';

export default function Routes() {
  const { signed } = useSelector(state => state.auth);

  return (
    <Switch>
      <Route path="/" exact component={Auth} />
      <Route path="/newmedico" component={SignUpMed} />

      {signed ? (
        <>
          <Route path="/home" component={Protocolo} />
          <Route path="/agenda" component={Content} />
          <Route path="/perfilmedico" component={PerfilMedico} />
          <Route path="/frmhome" component={Home} />
          <Route path="/frmpac" component={Paciente} />
          <Route path="/frmagenda" component={Agenda} />
          <Route path="/frmatv" component={Atividade} />
          <Route path="/frmmed" component={Medico} />

          <Route path="/cadastros" component={PaginaInicial} />
          <Route path="/usuario" component={Usuario} />
        </>
      ) : (
        <Redirect to="/" />
      )}
    </Switch>
  );
}
