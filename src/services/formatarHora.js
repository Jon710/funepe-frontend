export default function formatarHora(hrAgenda) {
  let ao_hora = String(hrAgenda);
  if (ao_hora.length < 4) {
    ao_hora = `0${ao_hora}`;
  }
  ao_hora = ao_hora.replace(/(\d{2})(\d{2})$/, '$1:$2'); // Coloca um hífen entre o terceiro e o quarto dígitos
  return ao_hora;
}
