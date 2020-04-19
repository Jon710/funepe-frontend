// ISSO VAI NO CADASTRO DE PRIORIDADES!!!
export const selectAllPrioridade = () => {
  return async dispatch => {
    try {
      const response = await api.get(`prioridade/`);
      const { prioridades } = response.data;
      if (prioridades.length >= 0) {
        await dispatch(protocoloSuccess({ prioridades }));
        history.push('/home');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/home');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Prioridade (selectAllPrioridade)!  ${error.message}`
      );
    }
  };
};

export const selectAllTipoDocumentos = () => {
  return async dispatch => {
    try {
      const response = await api.get(`types/`);
      const { types } = response.data;
      if (types.length >= 0) {
        await dispatch(protocoloSuccess({ types }));
        history.push('/home');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/home');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Tipo de Documentos (selectAllTipoDocumentos)!  ${error.message}`
      );
      }
