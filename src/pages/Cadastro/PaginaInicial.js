import React from 'react';
import { Tabs, Tab, Figure } from 'react-bootstrap';
import Funcao from './Funcao/index';
import Grupo from './Grupo/index';
import TipoDocumento from './TipoDocumento/index';
import DespachoPadrao from './DespachoPadrao/index';
import Usuario from './Usuario/index';

import protocolo from '../../assets/protocolo.png';

export default function PaginaInicial() {
  return (
    <div className="container-fluid">
      <Tabs defaultActiveKey="inicio" id="uncontrolled-tab-example">
        <Tab eventKey="inicio">
          <div className="mt-100">
            <Figure>
              <Figure.Image
                fluid
                width={800}
                height={1000}
                alt="protocolo"
                src={protocolo}
              />
              <Figure.Caption>
                Selecione uma das opções acima para realizar um novo cadastro.
              </Figure.Caption>
            </Figure>
          </div>
        </Tab>
        <Tab eventKey="funcao" title="Função">
          <div style={{ marginTop: 25 }}>
            <Funcao />
          </div>
        </Tab>
        <Tab eventKey="despachopadrao" title="Despacho Padrão">
          <DespachoPadrao />
        </Tab>
        <Tab eventKey="grupo" title="Grupo">
          <Grupo />
        </Tab>
        <Tab eventKey="tipodocumento" title="Tipo de Documento">
          <TipoDocumento />
        </Tab>
        <Tab eventKey="usuario" title="Usuário">
          <Usuario />
        </Tab>
      </Tabs>
    </div>
  );
}
