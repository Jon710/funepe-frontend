import React, { useState } from 'react';

// import { Container, Content } from 'react-bootstrap';
// import logo from '~/assets/logo.png';
// import NavBar from './NavBar';
import api from '~/services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/css/resume.min.css';

export default function Paciente() {
  const [arq, setArq] = useState();

  async function uploadFile(file) {
    console.log('FILE: ', file);
    const formData = new FormData();

    formData.append('files', file);

    const response = await api.post(`documents/23/arquivoanexo`, formData);

    return response.data;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const res = await uploadFile(arq.file);
    console.log(res.data);
  }

  function onChange(e) {
    setArq({ files: e.target.files });
  }

  return (
    <>
      {/* <NavBar /> */}
      <form onSubmit={onSubmit} encType="multipart/form-data">
        <h1> React File Upload Example</h1>
        <input type="file" multiple onChange={onChange} />
        <button type="submit">Upload File</button>
        <hr/>
        <h3>React Multiple File Upload</h3>
        <div className="form-group">
          <input type="file" multiple />
        </div>
        <div className="form-group">
          <button className="btn btn-primary" type="submit">
            Upload
          </button>
        </div>
      </form>
    </>
  );
}
