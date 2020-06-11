/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import history from '../../services/history';
import api from '../../services/api';

export default function Upload(props) {
  const [arquivos, setArquivos] = useState([]);
  const { usuario } = useSelector(state => state.usuario);
  const { documento } = useSelector(state => state.protocolo);
  const formData = new FormData();
  console.log('Function Upload', usuario.idusuario, documento.iddocumento);

  const onDrop = useCallback(
    acceptedFiles => {
      console.log('acceptedFiles', acceptedFiles);
      console.log('arquivos', arquivos);
      setArquivos([...arquivos, ...acceptedFiles]);
      console.log('arquivos', arquivos);
    },
    [arquivos]
  );

  const sendBackData = files => {
    console.log('sendBackData Files: ', files);
    props.parentCallback(files);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const removeFile = file => () => {
    console.log('removeFile...');
    const newFiles = [...arquivos];
    newFiles.splice(newFiles.indexOf(file), 1);
    console.log(newFiles);
    setArquivos(newFiles);
  };

  const files = arquivos.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes{' '}
      <DeleteForeverSharpIcon onClick={removeFile(file)} />
    </li>
  ));

  const dropzoneStyle = {
    width: '100%',
    height: '20%',
    border: '1px dashed grey',
    background: 'lightGrey',
  };

  const handleSubmit = async () => {
    sendBackData(arquivos);
    try {
      for (let i = 0; i < arquivos.length; i++) {
        formData.append('arquivos', arquivos[i]);
      }

      const response = await api.post(`documents/23/arquivoanexo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const { arquivoanexo } = response.data;
      if (arquivoanexo.length >= 0) {
        history.push('/protocolo');
        return;
      }
      toast.info('Nenhum Registro Localizado!');
      history.push('/protocolo');
      return;
    } catch (error) {
      toast.error(
        `ERRO: Falha na busca de Protocolos do Usuário. selectAllProtocolo  ${error.message}`
      );
    }
  };

  return (
    <div>
      <Card>
        <section>
          <div
            {...getRootProps({ className: 'dropzone' })}
            style={dropzoneStyle}
          >
            <div align="center">
              <span>{files ? ' 📂 ' : ' 📁 '}</span>
              <i className="fa fa-cloud-upload" />
              <input {...getInputProps()} />
              <p>
                Arraste e solte arquivos aqui, ou clique para selecionar
                arquivos
              </p>
              <p />
            </div>
          </div>

          <div>
            {files.length > 0 ? (
              <div>
                <aside>
                  <h5>Arquivos</h5>
                  <ul>{files}</ul>
                </aside>
              </div>
            ) : (
              <div />
            )}
          </div>
        </section>
      </Card>
      <Button variant="success" size="lg" block onClick={handleSubmit} p="2">
        Anexar Arquivos
      </Button>
    </div>
  );
}
Upload.propTypes = {
  parentCallback: PropTypes.any,
};
Upload.defaultProps = {
  parentCallback: null,
};
