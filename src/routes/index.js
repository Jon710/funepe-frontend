import React from 'react';
import { Switch, Route } from 'react-router-dom';

import CaixaEntrada from '../pages/usuario/Index/CaixaEntrada';
import SignUpMed from '../pages/usuario/SignUpMed';
// import Dashboard from '~/pages/usuario/Dashboard';
import PerfilMedico from '../pages/usuario/PerfilMedico';
import Content from '../pages/usuario/Index/Content';
import Home from '../pages/usuario/Index/Home';
import Paciente from '../pages/usuario/Index/Paciente';
import Medico from '../pages/usuario/Index/Medico';
import Agenda from '../pages/usuario/Index/Agenda';
import Atividade from '../pages/usuario/Index/Atividade';

import Auth from '../pages/usuario/Auth';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Auth} />
      {/* <Route path="/mlogin" component={Auth} isPrivate /> */}
      <Route path="/newmedico" component={SignUpMed} />

      <Route path="/home" component={CaixaEntrada} />
      <Route path="/agenda" component={Content} />
      {/* <Route path="/dashboard" component={Dashboard} /> */}
      <Route path="/perfilmedico" component={PerfilMedico} />
      <Route path="/frmhome" component={Home} />
      <Route path="/frmpac" component={Paciente} />
      <Route path="/frmagenda" component={Agenda} />
      <Route path="/frmatv" component={Atividade} />
      <Route path="/frmmed" component={Medico} />
    </Switch>
  );
}
