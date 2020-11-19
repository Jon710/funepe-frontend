/* eslint-disable array-callback-return */
/* eslint-disable new-cap */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import funepe from '../../assets/funepe.jpeg';
import { formatPrice } from '../../services/formatPrice';
import { modalClose } from '../../redux/features/context/contextSlice';
import 'jspdf-autotable';

export default function VisualizarPDF() {
  const { requisicoesItem, requisicao } = useSelector(state => state.compras);
  const dispatch = useDispatch();

  const myImage = new Image(100, 200);
  myImage.src = funepe;

  const doc = new jsPDF();
  doc.setFontStyle('bold');
  doc.text(`REQUISIÇÃO DE COMPRA Nº ${requisicao.idrequisicao}`, 20, 20);

  doc.setFontStyle('normal');
  doc.setFontSize(10);
  doc.text(
    `Data: ${format(new Date(), 'dd/MM/yyyy', {
      locale: pt,
    })}`,
    193.5,
    20,
    'right'
  );
  doc.line(20, 27, 195, 27);

  doc.addImage(myImage, 'JPEG', 150, 28, 45, 15);
  doc.setFontStyle('bold');
  doc.text('FUNDAÇÃO EDUCACIONAL DE PENAPÓLIS', 20, 31, 'left');
  doc.setFontStyle('normal');
  doc.text('AVENIDA SÃO JOSÉ, 400, CENTRO', 20, 36, 'left');
  doc.text('CEP: 16300000 - PENAPÓLIS - SP', 20, 41, 'left');
  doc.line(20, 43, 195, 43);

  doc.text(`Status: ${requisicao.status}`, 20, 47, 'left');
  doc.text(`Prioridade: ${requisicao.prioridade}`, 80, 47);
  doc.text(`Indicação de uso: ${requisicao.indicacaouso}`, 142, 47);

  doc.text(`DPTO: ${requisicao.departamento.descricao}`, 20, 52, 'left');
  // doc.text(`Data indicação: ${requisicao.dataFormatada}`, 80, 52);
  doc.text(`Solicitante: ${requisicao.solicitante.username}`, 142, 52);
  doc.line(20, 53, 195, 53);

  doc.setFontStyle('bold');
  doc.text('PRODUTOS', 20, 57, 'left');

  let total = 0;
  let vAfterTable = 60;

  requisicoesItem.map(item => {
    doc.autoTable({
      head: [
        [
          'Código',
          'Descrição',
          'Unid.',
          'Qtde',
          'Valor Unit.',
          'Desconto',
          'TOTAL',
        ],
      ],
      columnStyles: { 0: { halign: 'left' } },
      margin: { top: 60, left: 20 },
      body: [
        [
          `${item.idproduto}`,
          `${item.produto.descricao}`,
          `${item.produto.unidademedida.descricao}`,
          `${item.quantidade}`,
          `${item.vlrUnit}`,
          '0,00',
          `${item.vlrTotal}`,
        ],
      ],
      foot: [[`OBS: ${item.observacao === null ? '' : item.observacao}`]],
    });
    total += item.valortotal;
    vAfterTable += 30;
  });

  doc.line(20, vAfterTable - 5, 195, vAfterTable - 5);
  doc.text(`TOTAL PRODUTOS:  ${formatPrice(total)}`, 195, vAfterTable, 'right');
  doc.line(20, vAfterTable + 5, 195, vAfterTable + 5);

  doc.setFontStyle('bold');
  doc.text('Finalidade/Justificativa', 20, vAfterTable + 10, 'left');
  doc.setFontStyle('normal');
  doc.text(`${requisicao.finalidade}`, 20, vAfterTable + 15, 'left');
  doc.line(20, vAfterTable + 20, 195, vAfterTable + 20);

  doc.setFontStyle('bold');
  doc.text('Observação', 20, vAfterTable + 25, 'left');

  doc.setFontStyle('normal');
  doc.line(20, vAfterTable + 50, 100, vAfterTable + 50);
  doc.text('Solicitante', 20, vAfterTable + 55, 'left');
  doc.setFontStyle('bold');
  doc.text(`${requisicao.solicitante.username}`, 20, vAfterTable + 58, 'left');

  // doc.text('Análise e parecer do orgão responsável', 20, 135, 'left');
  // doc.setFontStyle('normal');
  // doc.text(
  //   '( ) Autorizado/Deferido   ( ) Indeferido   ( ) Refazer   ( ) Adiado por      dias',
  //   20,
  //   140,
  //   'left'
  // );
  // doc.setFontStyle('bold');
  // doc.text('Observação', 20, 145, 'left');

  doc.setFontStyle('normal');
  doc.line(20, vAfterTable + 80, 100, vAfterTable + 80);
  doc.text('Responsável', 20, vAfterTable + 85, 'left');
  doc.setFontStyle('bold');
  doc.text('MÁRCIO VIEIRA BORGES', 20, vAfterTable + 90, 'left');

  doc.output('dataurlnewwindow');
  dispatch(modalClose());

  return <></>;
}
