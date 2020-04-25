import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.0.24:3333',
});
// api.defaults.headers.common.Authorization = `Bearer ${
//   store.getState().usuario.token
// }`;

export default api;
